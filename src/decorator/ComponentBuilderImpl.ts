import type { Ref, UnwrapNestedRefs, WatchCallback, WatchOptions } from "vue";
import type { CompatibleComponentOptions, DefaultData, ObjectProvideOptions, Vue, VueComponentBaseImpl } from "../vue";
import type { IComponentBuilder } from "./IComponentBuilder";
import type { VueClassComponent } from "./component-decorator-types";
import type { AnyClass } from "../utilities/traverse-prototype";

import { reactive, toRaw } from "vue";
import { CompositionApi, isReservedPrefix } from "../vue";
import { $lifeCycleHookRegisterFunctions, isNotInternalHookName } from "./life-cycle-hooks";
import {
    collectStaticPropertyFromPrototypeChain,
    getAllInheritedPropertiesFromPrototypeChain,
} from "../utilities/traverse-prototype";

/*
 * The getter and setter created here do not hold any memory context to the builder. Hence, the builder can be subject
 * to the garbage collector.
 */
function createReferenceGetterFunc(reference: Ref) {
    return function getValueFromReference() {
        return reference.value;
    };
}

function createReferenceSetterFunc(reference: Ref) {
    return function setValueToReference(newValue: unknown) {
        reference.value = newValue;
    };
}


/** @inheritdoc */
export class ComponentBuilderImpl<T extends Vue> implements IComponentBuilder<T> {
    private _component?: VueClassComponent<T>;
    private _hasBeenFinalised = false;
    private _rawInstance?: T & Vue;
    private _reactiveWrapper?: UnwrapNestedRefs<T & Vue>;
    private _watchersToCreate: CompatibleComponentOptions<Vue>["watch"][] = [];

    public constructor(instanceOrClass?: ((T & Vue) | VueClassComponent<T>)) {
        if (typeof instanceOrClass === "function") {
            this.setComponentClass(instanceOrClass);

        } else if (typeof instanceOrClass === "object") {
            this.setComponentClass(instanceOrClass.constructor);
            this.instance = instanceOrClass;
        }
    }

    public createAndUseNewInstance(): ComponentBuilderImpl<T> {
        if (typeof this._component !== "function") {
            throw new Error("Failed to create new component! No class for the component has been provided.");
        }

        this.instance = new this._component();
        return this;
    }

    /** @inheritdoc */
    public get componentClass(): VueClassComponent<T> {
        return this._component || this.rawInstance?.constructor;
    }

    /** @inheritdoc */
    public get instance(): T & Vue {
        return this.reactiveWrapper;
    }

    public set instance(newInstance: T & Vue) {
        if (typeof newInstance === "object") {
            this._rawInstance = toRaw(newInstance);
            this._reactiveWrapper = reactive(this._rawInstance);
        } else {
            this._rawInstance = undefined;
            this._reactiveWrapper = undefined;
        }
    }

    /** @inheritdoc */
    public get rawInstance(): T & Vue {
        return this._rawInstance;
    }

    /** @inheritdoc */
    public get reactiveWrapper(): UnwrapNestedRefs<T & Vue> {
        return this._reactiveWrapper;
    }

    /** @inheritdoc */
    public build(): T {
        this._checkValidInstanceAndThrowError();

        if (this._hasBeenFinalised) {
            CompositionApi.warn(
                `ComponentBuilder's "build()" function has already been called!
                Calling a second time risks errors with watchers!`,
            );
        }
        this._hasBeenFinalised = true;

        this._createAllWatchers();

        // because Vue checks only for "own properties" in the return value, an intermediate class is needed to contain
        // all properties and all inherited functions as "own properties".
        // see: https://github.com/vuejs/core/blob/8dcb6c7bbdd2905469e2bb11dfff27b58cc784b2/packages/runtime-core/src/componentPublicInstance.ts#L265
        return createVueRenderContext(this.rawInstance, this.reactiveWrapper);
    }

    /** @inheritdoc */
    public applyDataValues(dataValues?: DefaultData<T>): ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        if (dataValues) {
            // -- add additional data class properties
            let data: Record<string, unknown> = {};
            if (typeof dataValues === "function") {
                data = (dataValues as (() => Record<string, unknown>)).call(this.reactiveWrapper);

            } else if (typeof dataValues === "object") {
                data = dataValues as Record<string, unknown>;
            }

            if (data && typeof data === "object") {
                Object.getOwnPropertyNames(data)
                    .forEach((key) => Object.defineProperty(this.rawInstance, key, { value: data[key]}))
                ;
            }
        }

        return this;
    }

    /** @inheritdoc */
    public createComputedValues(computedValues?: CompatibleComponentOptions<T>["computed"]):  ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        if (!computedValues) {
            return this;
        }

        // add computed properties but assign "this" context to instance
        Object.getOwnPropertyNames(computedValues || {})
            .filter(isNotInternalHookName)
            .forEach((key) => {

                const computedSpec = computedValues[key];
                if (typeof computedSpec === "function") {
                    this._defineReactiveProperty(
                        key,
                        CompositionApi.computed(computedSpec.bind(this.reactiveWrapper)),
                        false,
                    );

                } else if (
                    computedSpec && typeof computedSpec === "object" &&
                    typeof computedSpec.get === "function" &&
                    typeof computedSpec.set === "function"
                ) {
                    // Vue 3 requires every setter to have a companion getter. A computed value without a getter
                    // is invalid!
                    this._defineReactiveProperty(
                        key,
                        CompositionApi.computed({
                            get: computedSpec.get.bind(this.reactiveWrapper),
                            set: computedSpec.set.bind(this.reactiveWrapper),
                        }),
                        true,
                    );

                } else {
                    const jsonDebug = JSON.stringify(computedSpec, undefined, 4);
                    CompositionApi.warn(`Invalid "computed" specification for property ${key}: ${jsonDebug}`);
                }
            })
        ;

        return this;
    }

    /**
     * Retrieves the options for the component from its static storage or from an instance in case this is a mixin.
     *
     * <p>
     *     All Vue component classes prepared by the component decorator store the decorator options as static property.
     *     However, if this class is used as a mixin, then its static options property is not copied to the mixin
     *     result. Therefore, an instance is created to fetch the options from this instance instead.
     * </p>
     *
     * @return a list of available options from all parent classes with no {@code undefined} items. The list may be empty.
     */
    public getOptionsForComponent(): CompatibleComponentOptions<T>[] {
        type VueComponent = typeof VueComponentBaseImpl & {
            _getVueClassComponentOptions(): CompatibleComponentOptions<T>[];
        };

        // first try to read the options from all parent classes. With mixins this will fail. Then use an instance
        // of the component.
        let allOptions = (
            this._component && collectStaticPropertyFromPrototypeChain<VueClassComponent<T>["__vccOpts"]>(
                this._component, "__vccOpts",
            ) || [])
            .map((vccOptions) => vccOptions.__component_decorator_original_options)
            .filter((options) => !!options)
        ;


        // no options have been found, create an instance and try this way
        if (!allOptions?.length && typeof this._component === "function") {
            const instance = new this._component();
            if (typeof (instance as VueComponent)._getVueClassComponentOptions === "function") {
                allOptions = ((instance as VueComponent)._getVueClassComponentOptions() || [])
                    .filter((options) => !!options);
            }
        }

        return (allOptions || []);
    }

    /** @inheritdoc */
    public injectData(injectDefinitions?: CompatibleComponentOptions<T>["inject"]): ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        const instance = this.reactiveWrapper;

        if (Array.isArray(injectDefinitions)) {
            injectDefinitions
                .filter(isNotInternalHookName)
                .forEach((propName) => instance[propName] = CompositionApi.inject(propName));

        } else if (typeof injectDefinitions === "object") {
            const injectPropertyIndexes = [
                ...Object.getOwnPropertyNames(injectDefinitions),
                ...Object.getOwnPropertySymbols(injectDefinitions),
            ].filter(isNotInternalHookName);

            for (let i=0; i < injectPropertyIndexes.length; i++) {
                const propName = injectPropertyIndexes[i];
                const injectSpec = injectDefinitions[propName];

                let defaultValue = undefined;
                let fromProvidedKey = propName;
                if (typeof injectSpec === "symbol") {
                    fromProvidedKey = injectSpec;

                } else if (typeof injectSpec === "object") {
                    fromProvidedKey = injectSpec.from || fromProvidedKey;
                    defaultValue = injectSpec.default;

                } else if (injectSpec) {
                    fromProvidedKey = String(injectSpec);
                }

                if (typeof defaultValue === "function") {
                    instance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, true);
                } else {
                    instance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, false);
                }
            }
        }

        return this;
    }

    /** @inheritdoc */
    public provideData(providedValuesSpec?: CompatibleComponentOptions<T>["provide"]): ComponentBuilderImpl<T> {
        let providedValues = providedValuesSpec as ObjectProvideOptions;
        if (typeof providedValuesSpec === "function") {
            providedValues = providedValuesSpec.apply(this.reactiveWrapper);
        }

        if (typeof providedValues === "object") {
            [
                ...Object.getOwnPropertyNames(providedValues),
                ...Object.getOwnPropertySymbols(providedValues),
            ]
                .filter(isNotInternalHookName)
                .forEach((propName) => CompositionApi.provide(propName, providedValues[propName]))
            ;
        }

        return this;
    }

    /** @inheritdoc */
    public registerLifeCycleHooks(): IComponentBuilder<T> {
        return this.registerAdditionalLifeCycleHooks(this.rawInstance as unknown as CompatibleComponentOptions<Vue>);
    }

    /** @inheritdoc */
    public registerAdditionalLifeCycleHooks(hookFunctions?: CompatibleComponentOptions<T>): ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        const rawHookFunctions = hookFunctions && toRaw(hookFunctions) || undefined;
        if (rawHookFunctions) {
            Object.getOwnPropertyNames($lifeCycleHookRegisterFunctions)
                .filter((hookName) =>  typeof rawHookFunctions[hookName] === "function")
                .forEach((hookName) => $lifeCycleHookRegisterFunctions[hookName](
                    rawHookFunctions[hookName].bind(this.reactiveWrapper),
                    this.rawInstance.$,
                ))
            ;
        }

        return this;
    }

    public setComponentClass(component: VueClassComponent<T>): ComponentBuilderImpl<T> {
        this._component = component;
        return this;
    }

    /** @inheritdoc */
    public watcherForPropertyChange(watchers?: CompatibleComponentOptions<Vue>["watch"]): ComponentBuilderImpl<T> {
        if (watchers) {
            this._watchersToCreate.push(watchers);
        }

        return this;
    }

    private _createAllWatchers(): IComponentBuilder<T> {
        while (Array.isArray(this._watchersToCreate) && this._watchersToCreate.length > 0) {
            try {
                this._performWatcherCreation(this._watchersToCreate.shift());
            } catch(error) {
                console.error("Failed to create watcher!", error);
            }
        }

        return this;
    }

    private _performWatcherCreation(watchers?: CompatibleComponentOptions<Vue>["watch"]): ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        const reactiveInstance = this.reactiveWrapper;
        if (reactiveInstance && typeof watchers === "object") {
            const watchNames = Object.getOwnPropertyNames(watchers)
                .filter(isNotInternalHookName)
                .filter((watchName) => watchers && watchers[watchName])
            ;

            for (const watchName of watchNames) {
                let watchSpecs = watchers[watchName];
                if (!Array.isArray(watchSpecs)) {
                    watchSpecs = [watchSpecs];
                }

                // watch target can be a getter function. So, define one to read from the reactive instance.
                const watchTarget = (function (instance, propertyName) {
                    return function getPropertyValueForWatcher() { return instance[propertyName]; };
                })(this.reactiveWrapper, watchName);

                for (let i=0; i < watchSpecs.length; i++) {
                    const currentWatchSpec = watchSpecs[i];

                    if (typeof currentWatchSpec === "function") {
                        CompositionApi.watch(watchTarget, currentWatchSpec.bind(reactiveInstance));

                    } else {
                        let handler: WatchCallback | undefined = undefined;
                        let handlerName: string | undefined = undefined;
                        let watchOptions: WatchOptions = {};

                        if (typeof currentWatchSpec === "object") {
                            watchOptions = currentWatchSpec;

                            if (typeof currentWatchSpec.handler === "string") {
                                handlerName = currentWatchSpec.handler;
                            } else {
                                handler = currentWatchSpec.handler;
                            }
                        }

                        // decode handler name
                        else if (typeof currentWatchSpec === "string") {
                            handlerName = currentWatchSpec;
                        }

                        if (!handler && handlerName) {
                            if (handlerName === watchName) {
                                throw new Error(
                                    `Invalid watcher defined!
                                    Can not watch on property ${watchName} and call same property on change!`,
                                );
                            }

                            else if (typeof this.rawInstance[handlerName] !== "function") {
                                throw new Error(
                                    `Invalid watcher defined!
                                    The named handler '${handlerName}' for watched property '${watchName}'
                                    is no member function of the component instance!`,
                                );
                            }

                            handler = (function createWatchHandler(propToCall): WatchCallback {
                                return function watchHandlerAsName(this: Vue, ...args: unknown[]) {
                                    return this[propToCall].call(this, ...args);
                                };
                            })(handlerName).bind(reactiveInstance);
                        }

                        if (handler) {
                            try {
                                CompositionApi.watch(watchTarget, handler, watchOptions);
                            } catch(error) {
                                console.error(
                                    `Failed to create watcher on property ${watchName}`,
                                    currentWatchSpec,
                                    error,
                                );
                            }
                        } else {
                            CompositionApi.warn(
                                `No valid watch handler for property "${watchName}" has been provided.`,
                            );
                        }
                    }
                } // for all watchers
            } // for all names
        }

        return this;
    }

    private _defineReactiveProperty(
        property: PropertyKey, vueReference: Ref, hasSetter?: boolean,
    ): ComponentBuilderImpl<T> {
        this._checkValidInstanceAndThrowError();

        if (property) {
            // TODO what to do with previous reactive definitions?
            // The only case is: A watcher creates a reactive property but this is replaced by a computed value
            // later. The watcher still holds a reference to the previous reactive property.

            Object.defineProperty(this.rawInstance, property, {
                get: createReferenceGetterFunc(vueReference).bind(this.reactiveWrapper),
                set: hasSetter ? createReferenceSetterFunc(vueReference).bind(this.reactiveWrapper) : undefined,
            });
        }

        return this;
    }

    private _checkValidInstanceAndThrowError(): void {
        if (this._rawInstance === undefined) {
            throw new Error(
                "Failed to build component! No instance has been created yet. " +
                "Please call 'createAndUseNewInstance()' first!",
            );
        }
    }
}

// the function is defined outside the builder to ensure, the scope of the builder instance is not
// kept alive by any memory ties from the function's internal scope to the builder.
function createVueRenderContext<T extends Vue>(instance: T, reactiveProxy: UnwrapNestedRefs<Vue>): T {
    if (typeof instance === "object") {
        const inheritedProperties = getAllInheritedPropertiesFromPrototypeChain(instance as AnyClass<T>);

        return new Proxy(reactiveProxy, {
            get(target: Record<string | symbol, unknown>, key: string | symbol): any {
                const value = target[key];
                // if the value is a function, bind "this" context to the target. Vue does not do this on the
                // render context created from this proxy.
                if (typeof value === "function") {
                    return value.bind(target);
                } else {
                    return value;
                }
            },

            getOwnPropertyDescriptor(target: object, key: string | symbol): PropertyDescriptor | undefined {
                // ignore reserved Vue properties
                if (isReservedPrefix(key)) {
                    return undefined;
                }

                return Object.getOwnPropertyDescriptor(target, key) ??
                    Object.getOwnPropertyDescriptor(inheritedProperties, key)
                ;
            },

            has(target: object, key: string | symbol): boolean {
                return !isReservedPrefix(key) && (key in target || key in inheritedProperties);
            },

            ownKeys(target: object): ArrayLike<string | symbol> {
                return ([] as (string | symbol)[])
                    .concat(Object.getOwnPropertyNames(target))
                    .concat(Object.getOwnPropertySymbols(target))
                    .concat(Object.getOwnPropertyNames(inheritedProperties))
                    .concat(Object.getOwnPropertySymbols(inheritedProperties))
                    .filter((key) => !isReservedPrefix(key))
                ;
            },
        }) as T;

    } else {
        throw new Error("Cannot create a proxy of a non-object instance!");
    }
}
