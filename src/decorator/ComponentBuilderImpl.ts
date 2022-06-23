import type { Ref, UnwrapNestedRefs, WatchCallback, WatchOptions } from "vue";
import type { CompatibleComponentOptions, ObjectProvideOptions, Vue } from "../vue";
import type { IComponentBuilder } from "./IComponentBuilder";

import { reactive, toRaw } from "vue";
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
    private _hasBeenFinalised = false;
    private _watchersToCreate: CompatibleComponentOptions<Vue>["watch"][] = [];

    public constructor(instance: T) {
        this.rawInstance = toRaw(instance);
        this.reactiveWrapper = reactive(instance as object) as UnwrapNestedRefs<T>;
    }

    /** @inheritdoc */
    public get instance(): T & Vue {
        return this.reactiveWrapper;
    }

    /** @inheritdoc */
    public readonly rawInstance: T & Vue;

    /** @inheritdoc */
    public readonly reactiveWrapper: UnwrapNestedRefs<T & Vue>;

    /** @inheritdoc */
    public build(): T {
        if (this._hasBeenFinalised) {
            CompositionApi.warn(
                `ComponentBuilder's "build()" function has already been called!
                Calling a second time risks errors with watchers!`,
            );
        }
        this._hasBeenFinalised = true;

        this._createAllWatchers();
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

    /** @inheritdoc */
    public watcherForPropertyChange(watchers: CompatibleComponentOptions<Vue>["watch"]): IComponentBuilder<T> {
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

    private _performWatcherCreation(watchers: CompatibleComponentOptions<Vue>["watch"]): IComponentBuilder<T> {
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

    private _defineReactiveProperty(property: PropertyKey, vueReference: Ref, hasSetter?: boolean): IComponentBuilder<T> {
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
}
