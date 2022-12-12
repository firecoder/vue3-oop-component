import type { UnwrapNestedRefs } from "vue";
import type { CompatibleComponentOptions, DefaultData, Vue } from "../vue";
import type { IComponentBuilder } from "./IComponentBuilder";
import type { VueClassComponent } from "./component-decorator-types";
/** @inheritdoc */
export declare class ComponentBuilderImpl<T extends Vue> implements IComponentBuilder<T> {
    private _component?;
    private _hasBeenFinalised;
    private _rawInstance?;
    private _reactiveWrapper?;
    private _watchersToCreate;
    constructor(instanceOrClass?: (T | VueClassComponent<T>));
    createAndUseNewInstance(): ComponentBuilderImpl<T>;
    /** @inheritdoc */
    get componentClass(): VueClassComponent<T> | undefined;
    /** @inheritdoc */
    get instance(): Vue & T | undefined;
    set instance(newInstance: T | undefined);
    /** @inheritdoc */
    get rawInstance(): Vue & T | undefined;
    /** @inheritdoc */
    get reactiveWrapper(): UnwrapNestedRefs<T> | undefined;
    /** @inheritdoc */
    build(): Vue & T;
    /** @inheritdoc */
    applyDataValues(dataValues?: DefaultData<T>): ComponentBuilderImpl<T>;
    /** @inheritdoc */
    createComputedValues(computedValues?: CompatibleComponentOptions<T>["computed"]): ComponentBuilderImpl<T>;
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
    getOptionsForComponent(): CompatibleComponentOptions<T>[];
    /** @inheritdoc */
    injectData(injectDefinitions?: CompatibleComponentOptions<T>["inject"]): ComponentBuilderImpl<T>;
    /** @inheritdoc */
    makeValuePropertiesReactive(): IComponentBuilder<T>;
    /** @inheritdoc */
    provideData(providedValuesSpec?: CompatibleComponentOptions<T>["provide"]): ComponentBuilderImpl<T>;
    /** @inheritdoc */
    registerLifeCycleHooks(): IComponentBuilder<T>;
    /** @inheritdoc */
    registerAdditionalLifeCycleHooks(hookFunctions?: CompatibleComponentOptions<T>): ComponentBuilderImpl<T>;
    setComponentClass(component: VueClassComponent<T>): ComponentBuilderImpl<T>;
    /** @inheritdoc */
    watcherForPropertyChange(watchers?: CompatibleComponentOptions<Vue>["watch"]): ComponentBuilderImpl<T>;
    private _createAllWatchers;
    private _performWatcherCreation;
    private _defineReactiveProperty;
    private _checkValidInstanceAndThrowError;
}
