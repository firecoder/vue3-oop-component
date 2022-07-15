// inspired by and much taken from here:
// https://github.com/vuejs/vue-class-component/blob/16433462b40aefecc030919623f17b0ec9afe61c/src/component.ts#L24

// handle directives
// see: https://github.com/vuejs/core/blob/25f7a16a6eccbfa8d857977dcf1f23fb36b830b5/packages/runtime-core/src/component.ts#L613

import type {
    Component,
    ComponentInternalInstance,
    SetupContext,
} from "vue";
import type {
    CompatibleComponentOptions,
    DefaultMethods,
    DefaultProps,
    PropsDefinition,
    RecordPropsDefinition,
    Vue,
} from "../vue";
import type { DecoratedClass } from "./decorator";
import type {
    ComponentWithCustomSetup,
    VueClassComponent,
    VueComponentSetupFunction,
} from "./component-decorator-types";

import { CompositionApi } from "../vue";
import { getInstanceMethodsFromClass, getPropertyFromParentClassDefinition } from "../utilities/traverse-prototype";
import { createProxyRedirectReads, defineNewLinkedProperties } from "../utilities/properties";
import { generateMultiFunctionWrapper } from "../utilities/wrappers";
import { $internalHookNames } from "./life-cycle-hooks";
import { ComponentBuilderImpl } from "./ComponentBuilderImpl";
import { clearCurrentSetupContext, setCurrentSetupContext } from "../vue/setup-context-global-storage";


/**
 * Creates a Vue3 compatible component.
 *
 * <p>
 *     The passed-in component/class is returned in order to allow inheritance for subclasses. However, the class
 *     constructor function will be enhanced with the properties "setup" and "render". The former is used
 *     by Vue3 to create an instance of the class and the latter is applied to the component by the SFC compiler.
 * </p>
 * <p>
 *     If "setup" is called without any "this" context, then a new instance has to be created and then all the "_setup"
 *     functions from the parent prototype chain are to be applied with the newly created instance set to "this".
 *     This initialising function is responsible for registering the class with Vue3, its lifecycle hooks and so on.
 * </p>
 * <p>
 *     In order to initialise the newly created instance properly, all the parent prototype chain is traversed and the
 *     "setup" functions are called, starting from the top most parent.
 * </p>
 *
 * @param component
 * @param options
 */
export function componentFactory<V extends Vue = Vue>(
    component: ComponentWithCustomSetup<V>,
    options: CompatibleComponentOptions<V> = {},
): VueClassComponent<V> {
    options = options || {};

    const computedProperties = getComputedValuesDefinitionFromComponentPrototype(component);
    options.computed = Object.assign({}, computedProperties, options.computed);

    // read all the options from the decorators
    const decorators = (component as DecoratedClass).__decorators__;
    if (decorators && decorators.length > 0) {
        // some decorators, like vue-debounce-decorator need access to the component methods, to replace them.
        const originalMethods = options.methods || {};
        const classMethods = getInstanceMethodsFromClass(component);
        options.methods = createProxyRedirectReads(originalMethods, classMethods) as DefaultMethods<V>;

        // call all decorators now
        decorators.forEach((decoratorFunction) => decoratorFunction(options));

        options.methods = originalMethods;
    }

    // applying methods to the class itself makes them inheritable to child classes.
    applyMethodsFromOptions(component, options);

    const classComponent = (component as VueClassComponent<V>);
    if (typeof options.beforeCreate === "function") {
        // maybe an additional static function exists on the class
        if (typeof classComponent.beforeCreate === "function") {
            classComponent.beforeCreate = generateMultiFunctionWrapper(
                classComponent.beforeCreate,
                options.beforeCreate,
            );
        } else {
            classComponent.beforeCreate = options.beforeCreate;
        }
    }

    // store the options into the component instance for later use by the "setup" function
    (function storeOptions(clazz, componentOptions: CompatibleComponentOptions<V>) {
        clazz.prototype._getVueClassComponentOptions = function _getVueClassComponentOptions() {
            // parent returns an array, too
            const parentFunc = getPropertyFromParentClassDefinition<(() => CompatibleComponentOptions<V>[])>(
                this, "_getVueClassComponentOptions",
            );

            // append own options at the end, because some option data might lead to overwriting properties.
            // Properties of parent have lower priority, so current class options must be later consumed.
            const parentOptions = (typeof parentFunc === "function") ? parentFunc() || [] : [];
            return parentOptions.concat([componentOptions]);
        };
    })(component, options);

    const vccOptions = createVccOptions(classComponent, options);
    if (!vccOptions) {
        throw new Error("Failed to create Vue class component options!");
    } else {
        classComponent.__vccOpts = vccOptions;
    }

    return classComponent;
}


/**
 * Create the Vue class component options onto the provided component and returns the patched one.
 *
 * @param component
 * @param options
 */
export function createVccOptions<V extends Vue = Vue>(
    component: VueClassComponent<V>,
    options: CompatibleComponentOptions<V> = {},
): VueClassComponent<V>["__vccOpts"] | undefined {

    if (!component || !options) {
        return undefined;
    }

    // get component name if some has been defined
    const name = options.name
        || (component as unknown as Record<string, unknown>)._componentTag
        || (component as unknown as Record<string, unknown>).name
    ;

    // add the options and "setup" function for Vue 3
    const vccOpts = {
        name,
        setup: generateSetupFunction(component),
        __component_decorator_original_options: options,
    } as VueClassComponent<V>["__vccOpts"];

    Object.defineProperty(vccOpts, "props", {
        get: generateGetterForProperties(component),
        configurable: true,
        enumerable: true,
    });

    Object.defineProperty(vccOpts, "components", {
        get: generateGetterForComponents(component),
        configurable: true,
        enumerable: true,
    });

    // render function is assigned later via SFC to this options. For non-SFC, link to "render" hook instead.
    vccOpts.render = function customRenderHook(publicInstance: Vue) {
        if (publicInstance && typeof publicInstance.render === "function") {
            return publicInstance.render(CompositionApi.h, publicInstance._setupContext);
        }
    };

    return vccOpts;
}

/**
 * Read the component prototype and detect and get all its computed values.
 *
 * <p>
 *     Basically, computed values in Vue are wrappers to getters in order to cache the value and to record all
 *     dependencies of this value. This will speed up the rendering and enable reactivity. Especially if a getter
 *     performs heavy lifting or has a lot of side effects, this becomes very helpful in avoiding these calls if
 *     the value has not changed.
 * </p>
 * <p>
 *     Computed properties are detected from property descriptors. They need at least a getter and may have an optional
 *     setter. Value-only properties are ignored.
 * </p>
 * <p>
 *     Only the direct prototype is checked, no parent class.
 * </p>
 *
 * @param component
 */
export function getComputedValuesDefinitionFromComponentPrototype(
    component: ComponentWithCustomSetup,
): CompatibleComponentOptions<Vue>["computed"] {
    const allComputedValues = {} as CompatibleComponentOptions<Vue>["computed"];

    // get all prototype props to retrieve computed values
    // see: https://github.com/vuejs/vue-class-component/blob/16433462b40aefecc030919623f17b0ec9afe61c/src/component.ts#L41
    const proto = component.prototype;
    const allPropertyKeys = ([] as (string | symbol)[])
        .concat(Object.getOwnPropertyNames(proto))
        .concat(Object.getOwnPropertySymbols(proto))
    ;

    for (const key of allPropertyKeys) {
        if (key === "constructor" || key === "prototype") {
            return;
        }

        // ignore all hooks
        if (typeof key === "string" && (
            $internalHookNames.indexOf(key) > -1
            || key.startsWith("$") // this is Vue prefix - ignore
        )) {
            return;
        }

        // detect the computed properties.
        // Ignore properties with only setters as Vue requires "computed" values to have a getter. There is no use in
        // a computed value without a getter as the main purpose is, to cache the value.
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (allComputedValues !== undefined && descriptor?.get && descriptor?.set) {
            allComputedValues[key] = {
                get: descriptor.get,
                set: descriptor.set,
            };

        } else if (allComputedValues !== undefined && descriptor?.get) {
            allComputedValues[key] = descriptor.get;
        }
    }

    return allComputedValues;
}


/**
 * Creates the defined methods from the options and applies them to the prototype of the component.
 *
 * <p>
 *     By creating the defined functions on the component prototype, the functions become part of the component's
 *     class hierarchy and are available to all children, too.
 * </p>
 *
 * @param component
 * @param options the decorator options passed-in
 */
export function applyMethodsFromOptions(
    component: ComponentWithCustomSetup,
    options: CompatibleComponentOptions<Vue>,
): ComponentWithCustomSetup {
    // add the additional methods to the component class
    const proto = component.prototype;
    Object.getOwnPropertyNames(options?.methods || {})
        .filter((methodName) => typeof (options?.methods || {})[methodName] === "function")
        .forEach(function (methodName) { // no arrow to avoid mem-leak
            if (!options?.methods || typeof options.methods[methodName] !== "function") {
                return;
            }

            const newFunction = options.methods[methodName];
            if (typeof proto[methodName] === "function") {
                const originalFunction = proto[methodName];

                proto[methodName] = function (...args: unknown[]) {
                    originalFunction.apply(this, args);
                    return newFunction.apply(this, args);
                };
            } else if (proto[methodName] === undefined) {
                // If the property already exists but is undefined, it will be overwritten intentionally
                proto[methodName] = newFunction;

            } else {
                throw new Error("A new function must not overwrite a non-function value");
            }
        })
    ;

    return component;
}

/**
 * Generate getter function to fetch definition of Vue properties from the options stored in the component instance.
 *
 * @param component the component to instantiate and read its options.
 */
export function generateGetterForProperties<V extends Vue = Vue>(
    component: ComponentWithCustomSetup<V>,
): (() => RecordPropsDefinition<DefaultProps>) {
    // TODO: make this work with mixins
    const propertiesDefinition: RecordPropsDefinition<DefaultProps> = {};
    let isInitialised = false;

    return function readPropertiesDefinition(): RecordPropsDefinition<DefaultProps> {
        if (!isInitialised) {
            isInitialised = true;

            const allPropDefinitions = (new ComponentBuilderImpl(component).getOptionsForComponent() || [])
                .map((options) => options["props"] as PropsDefinition<DefaultProps>)
                .filter((value) => value !== undefined && value !== null)
            ;

            // convert string[] definition to record like definition
            for (const propDef of allPropDefinitions) {
                if (Array.isArray(propDef)) {
                    (propDef as string[]).forEach((propertyName) => {
                        propertiesDefinition[propertyName] = {};
                    });
                } else if (typeof propDef === "object") {
                    Object.assign(propertiesDefinition, propDef);
                }
            }
        }

        return propertiesDefinition;
    };
}

/**
 * Generate getter function to fetch definition of imported components from the options stored in the instance.
 *
 * @param component the component to instantiate and read its options.
 */
export function generateGetterForComponents<V extends Vue = Vue>(
    component: ComponentWithCustomSetup<V>,
): (() => Record<string, Component>) {
    // TODO: make this work with mixins
    const importedComponents: Record<string, Component> = {};
    let isInitialised = false;

    return function readComponentsDefinition(): Record<string, Component> {
        if (!isInitialised) {
            isInitialised = true;

            const allComponentsDefinitions = (new ComponentBuilderImpl(component).getOptionsForComponent() || [])
                .map((options) => options["components"] as Record<string, Component>)
                .filter((value) => value !== undefined && value !== null)
            ;

            for (const componentsDef of allComponentsDefinitions) {
                if (typeof componentsDef === "object") {
                    Object.assign(importedComponents, componentsDef);
                }
            }
        }

        return importedComponents;
    };
}


/**
 * Generates a setup function for the class component.
 *
 * <p>
 *     The class component instance is created and the class component options fetched from this instance.
 *     Then the options are used to dynamically patch the instance according to the provided options.
 * </p>
 * @param component
 */
export function generateSetupFunction<V extends Vue>(component: VueClassComponent<V>): VueComponentSetupFunction {
    return function setupClassComponent(
        this: void, properties: Record<string, unknown>, context: SetupContext,
    ): Vue {
        // provide the context to the instance that will be created.
        setCurrentSetupContext(context);

        // get Vue 3 internal instance via global hook
        const vueComponentInternalInstance = CompositionApi.getCurrentInstance() || {

        } as ComponentInternalInstance;

        // use a builder to help set up the instance
        const builder = new ComponentBuilderImpl<V>()
            .setComponentClass(component)
            .createAndUseNewInstance()
        ;

        // read all the options from the instance - these are still there after any mixin
        const allOptions = builder.getOptionsForComponent();

        // call all "beforeCreate" functions
        allOptions.forEach((options) => {
            if (typeof options?.beforeCreate === "function") {
                options.beforeCreate.call(vueComponentInternalInstance);
            }
        });

        // assign the current Vue component instance in case the base constructor has not been called properly!
        if (!builder.rawInstance.$) {
            builder.rawInstance.$ = vueComponentInternalInstance;
            defineNewLinkedProperties(builder.rawInstance, vueComponentInternalInstance?.props || properties);
        }

        builder.registerLifeCycleHooks();

        // set up the instance with options from this decorator.
        // this is after all the other setup has been called as this might want to overwrite props defined by parents.
        allOptions.forEach((options) => builder
            .applyDataValues(options.data)
            .createComputedValues(options.computed)
            .injectData(options.inject)
            .provideData(options.provide)
            .registerAdditionalLifeCycleHooks(options)
            .watcherForPropertyChange(options.watch),
        );

        // call custom setup function of instance
        if (typeof builder.rawInstance.setup === "function") {
            builder.rawInstance.setup.call(builder.instance, builder, properties, context);
        }

        // call setup functions from the options
        allOptions
            .forEach((options) => {
                if (typeof options.setup === "function") {
                    options.setup.call(builder.instance, builder, properties, context);
                }
            })
        ;

        // call the life-cycle hook at the end of the setup
        if (typeof builder.instance.created === "function") {
            builder.instance.created();
        }

        clearCurrentSetupContext();
        return builder.build();
    };
}
