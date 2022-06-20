import type { Ref } from "vue";
import type { CompatibleComponentOptions, Vue } from "../vue";

import { reactive, toRaw } from "vue";
import { CompositionApi } from "../vue";
import {
    $internalHookNames,
    $lifeCycleHookRegisterFunctions,
} from "./life-cycle-hooks";

export function isNotInternalHookName(name: string | symbol): boolean {
    return name && (
        typeof name === "symbol" ||
        (typeof name === "string" && ($internalHookNames.indexOf(name) < 0))
    ) && true || false;
}

export function applyInjectsOnInstance(
    instance: Vue,
    injectDefinitions: CompatibleComponentOptions<Vue>["inject"],
): void {
    if (!instance) {
        return instance;
    }
    const rawInstance = toRaw(instance);

    if (Array.isArray(injectDefinitions)) {
        injectDefinitions
            .filter(isNotInternalHookName)
            .forEach((propName) => rawInstance[propName] = CompositionApi.inject(propName));

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
                rawInstance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, true);
            } else {
                rawInstance[propName] = CompositionApi.inject(fromProvidedKey, defaultValue, false);
            }
        }
    }
}

/**
 * Defines a property that is a Vue reactive reference.
 *
 * <p>
 *     This project is about best supporting TypeScript classes. Computed properties on instances usually are defined
 *     in the class but are not expected to have an accessor property of {@code .value}. So, the reference property
 *     applied where will be unwrapped automatically.
 * </p>
 *
 * @param instance the instance to define the new property.
 * @param propertyName the name of the new property
 * @param vueReference the Vue reactive reference to use for reading and setting values
 * @param hasSetter set to {@code true} to apply a setter as well. Otherwise, no setter will be created.
 * @throws Error if the new property is already defined on the instance with type function.
 * @see https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-reactive-objects
 */
export function definePropertyFromRef(
    instance: Vue,
    propertyName: string,
    vueReference: Ref,
    hasSetter?: boolean,
): void {
    if (
        vueReference && instance && typeof instance === "object" &&
        propertyName && typeof propertyName === "string"
    ) {
        if (typeof instance[propertyName] === "function") {
            throw new Error(`The property ${propertyName} is already defined as a member function.`);
        }

        Object.defineProperty(instance, propertyName, {
            get: () => vueReference.value,
            set: (hasSetter ? (newValue) => {
                vueReference.value = newValue;
            } : undefined),
        });
    }
}


export function registerComputedValues(
    instance: Vue,
    computedValues: CompatibleComponentOptions<Vue>["computed"],
): void {
    if (instance && typeof computedValues === "object") {
        // wrap the instance inside a reactive to enable propagation of value changes.
        // see: https://github.com/vuejs/core/issues/6130
        //
        // In order to make the computed values reactive, the whole instance is wrapped
        // with a reactive Proxy wrapper. If a (computed) property is set via this
        // wrapper, all dependent other properties will be updated. This way,
        // the value based properties do not need to be made reactive explicitly.
        // In previous vue-class-component, all value properties are added as
        // mixins of `data`. Since mixins are not supported by Vue anymore, a
        // different mechanism is used now.
        const reactiveInstance = reactive(instance);
        const rawInstance = toRaw(instance);

        // add computed properties but assign "this" context to instance
        Object.getOwnPropertyNames(computedValues || {})
            .filter(isNotInternalHookName)
            .forEach((key) => {

                const computedSpec = computedValues[key];
                if (typeof computedSpec === "function") {
                    definePropertyFromRef(
                        rawInstance,
                        key,
                        CompositionApi.computed(computedSpec.bind(reactiveInstance)),
                        false,
                    );

                } else if (
                    computedSpec && typeof computedSpec === "object" &&
                    typeof computedSpec.get === "function" &&
                    typeof computedSpec.set === "function"
                ) {
                    // Vue 3 requires every setter to have a companion getter. A computed value without a getter
                    // is invalid!
                    definePropertyFromRef(
                        rawInstance,
                        key,
                        CompositionApi.computed({
                            get: computedSpec.get.bind(reactiveInstance),
                            set: computedSpec.set.bind(reactiveInstance),
                        }),
                        true,
                    );

                } else {
                    const jsonDebug = JSON.stringify(computedSpec, undefined, 4);
                    CompositionApi.warn(`Invalid "computed" specification for property ${key}: ${jsonDebug}`);
                }
            })
        ;
    }
}

/**
 * Registers the life-cycle hooks.
 *
 * <p>
 *     In Vue 2 and Vue 3, `this` context for the hook functions are set to the Vue internal component. Vue 2 reused
 *     the "external" class component internally. Hence, it contained all defined methods and properties as defined
 *     for the component. In Vue 3, the internal component is disassociated from the external class component.
 *     Because this library defines a base class to mimic the Vue 2 internal component and all class component
 *     inherit from this base class, the `this` context is bound to the created class component instance.
 * </p>
 *
 * <p>
 *     There is one exception to this rule: the hook `beforeCreate` does not have any class component instance
 *     available. Hence, its `this` context is set to the Vue 3 internal instance.
 * </p>
 *
 * <p>
 *     The hooks {@code beforeCreate} and {@code created} are ignored because these are not supported by the
 *     Composition API and thus handled internally by the component decorator function.
 * </p>
 * @param instance
 * @param hookFunctions
 */
export function registerLifeCycleHooks(
    instance: Vue,
    hookFunctions: Vue | CompatibleComponentOptions<Vue>,
): void {
    if (instance && hookFunctions) {
        Object.getOwnPropertyNames($lifeCycleHookRegisterFunctions)
            .filter((hookName) => typeof hookFunctions[hookName] === "function")
            .forEach((hookName) => $lifeCycleHookRegisterFunctions[hookName](
                hookFunctions[hookName].bind(instance),
                instance.$,
            ))
        ;
    }
}


export function registerProvidedValues(
    instance: Vue,
    providedValuesSpec: CompatibleComponentOptions<Vue>["provide"],
): void {
    const providedValues = (typeof providedValuesSpec === "function") ?
        providedValuesSpec.apply(instance) : providedValuesSpec;

    if (typeof providedValues === "object") {
        [
            ...Object.getOwnPropertyNames(providedValues),
            ...Object.getOwnPropertySymbols(providedValues),
        ]
            .filter(isNotInternalHookName)
            .forEach((propName) => CompositionApi.provide(propName, providedValues[propName]))
        ;
    }
}
