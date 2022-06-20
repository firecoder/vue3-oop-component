import type { Ref, UnwrapNestedRefs } from "vue";
import type { CompatibleComponentOptions, ObjectProvideOptions, Vue } from "../vue";
import type { IComponentBuilder } from "./IComponentBuilder";

import { isReactive, isRef, reactive, ref, toRaw } from "vue";
import { CompositionApi } from "../vue";
import { $lifeCycleHookRegisterFunctions, isNotInternalHookName } from "./life-cycle-hooks";

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
    private _alreadyReactiveProperties = new Map<PropertyKey, Ref>();

    public constructor(instance: T) {
        this.rawInstance = toRaw(instance);
        this.reactiveWrapper = reactive(instance as object) as UnwrapNestedRefs<T>;
    }

    /** @inheritdoc */
    public readonly rawInstance: T & Vue;

    /** @inheritdoc */
    public readonly reactiveWrapper: UnwrapNestedRefs<T & Vue>;

    /** @inheritdoc */
    public build(): T {
        return this.reactiveWrapper;
    }

    /** @inheritdoc */
    public createComputedValues(computedValues: CompatibleComponentOptions<T>["computed"]):  IComponentBuilder<T> {
        if (!computedValues) {
            return this;
        }

        // add computed properties but assign "this" context to instance
        Object.getOwnPropertyNames(computedValues || {})
            .filter(isNotInternalHookName)
            .forEach((key) => {

                const computedSpec = computedValues[key];
                if (typeof computedSpec === "function") {
                    this.defineReactiveProperty(
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
                    this.defineReactiveProperty(
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

    /** @inheritdoc */
    public defineReactiveProperty(property: PropertyKey, vueReference: Ref, hasSetter?: boolean): IComponentBuilder<T> {
        if (property) {
            // TODO what to do with previous reactive definitions?
            // The only case is: A watcher creates a reactive property but this is replaced by a computed value
            // later. The watcher still holds a reference to the previous reactive property.
            const previousProperty = this._alreadyReactiveProperties.get(property);

            Object.defineProperty(this.rawInstance, property, {
                get: createReferenceGetterFunc(vueReference).bind(this.reactiveWrapper),
                set: hasSetter ? createReferenceSetterFunc(vueReference).bind(this.reactiveWrapper) : undefined,
            });

            this._alreadyReactiveProperties.set(property, vueReference);
        }

        return this;
    }

    /** @inheritdoc */
    public injectData(injectDefinitions: CompatibleComponentOptions<T>["inject"]): IComponentBuilder<T> {
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

                this.makePropertyReactive(propName);
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
    public isPropertyReactive(propertyName: PropertyKey): boolean {
        return !!propertyName && !!(
            isRef(this.rawInstance[propertyName]) ||
            isReactive(this.rawInstance[propertyName]) ||
            this._alreadyReactiveProperties.has(propertyName)
        );
    }

    /** @inheritdoc */
    public makePropertyReactive(property: PropertyKey): Ref | undefined {
        if (property && this._alreadyReactiveProperties.has(property)) {
            return this._alreadyReactiveProperties.get(property);

        } else if (property) {
            const reactiveProperty = ref(this.rawInstance[property]);

            this.defineReactiveProperty(
                property,
                reactiveProperty,
                true,
            );
            return reactiveProperty;
        }
        return undefined;
    }

    /** @inheritdoc */
    public provideData(providedValuesSpec: CompatibleComponentOptions<T>["provide"]): IComponentBuilder<T> {
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
    public registerAdditionalLifeCycleHooks(hookFunctions?: CompatibleComponentOptions<T>): IComponentBuilder<T> {
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
}
