import type { Ref, UnwrapNestedRefs } from "vue";
import type { CompatibleComponentOptions, Vue } from "../vue";

/**
 * Setting up the Vue component from a class is not as trivial as it seems as reactive behaviour must be implemented.
 *
 * <p>
 *     Reactive behaviour is vital for watchers or computed values. However, it is not performant to replace properties
 *     with reactive versions that already have been replaced. So, we need to keep track of all manipulated things
 *     on the instance that make it compatible with Vue. This builder helps to keep a record af changes in order to
 *     avoid duplications.
 * </p>
 */
export interface IComponentBuilder<T extends Vue> {
    /**
     * The unwrapped instances that is not reactive.
     *
     * <p>
     * New properties will be defined directly on this instance and not on the reactive wrapper.
     * </p>
     */
    readonly rawInstance: T & Vue;

    /**
     * The created reactive wrapper for the raw instance.
     *
     * <p>
     * The reactive instance is used as {@code this} context for watchers, computed values an alike. It makes these
     * react to value changes.
     * </p>
     */
    readonly reactiveWrapper: UnwrapNestedRefs<T & Vue>;

    /**
     * Finalises the build and returns the fully initialised and patched Component that should be returned to Vue.
     */
    build(): T;

    /**
     * Creates computed values in the instance to build and registers these with Vue.
     *
     * <p>
     *     A defined computed value will replace any existing property on the instance.
     * </p>
     *
     * <p>
     *     The provided getter and setter functions will be executed with {@code this} context set to the reactive
     *     wrapper of the instance. This is the way to make them reactive on changes to any property of the instance
     *     the getter is reading. Otherwise the getter will not even reflect changes if assigned via setter.
     *     see: https://github.com/vuejs/core/issues/6130
     * </p>
     *
     * @param computedValues
     * @see https://github.com/vuejs/core/issues/6130
     */
    createComputedValues(computedValues: CompatibleComponentOptions<T>["computed"]):  IComponentBuilder<T>;

    /**
     * Defines a property that is a Vue reactive reference.
     *
     * <p>
     *     This project is about best supporting TypeScript classes. Computed properties on instances usually are defined
     *     in the class but are not expected to have an accessor property of {@code .value}. So, the reference property
     *     applied where will be unwrapped automatically.
     * </p>
     *
     * @param propertyName the name of the new property
     * @param vueReference the Vue reactive reference to use for reading and setting values
     * @param hasSetter set to {@code true} to apply a setter as well. Otherwise, no setter will be created.
     * @see https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref-unwrapping-in-reactive-objects
     */
    defineReactiveProperty(propertyName: PropertyKey, vueReference: Ref, hasSetter?: boolean): IComponentBuilder<T>;

    /**
     * Inject properties from the Vue dependency injector pool.
     *
     * <p>
     *     Vue supports a very limited, lightweight dependency injection system. Parent components may provide some
     *     data to their child components. This function will read the provided data and inject them into the
     *     instance currently build.
     * </p>
     *
     * @param injectDefinitions
     */
    injectData(injectDefinitions: CompatibleComponentOptions<T>["inject"]): IComponentBuilder<T>;

    /**
     * Checks, whether the named property is a reactive {@code Ref} value or internally registered as reactive.
     *
     * <p>
     *     The named property is checked to be a Vue reactive reference or to have already been converted to such and
     *     internally stored in the register of all converted properties. There is no way to detect wrappers on
     *     properties that make them hidden reactive.
     * </p>
     *
     * @param propertyName the name of the property to check
     */
    isPropertyReactive(propertyName: PropertyKey): boolean;

    /**
     * Replace property with a reactive {@code ref} version of it.
     *
     * <p>
     *     The named property is replaced with the return value of {@code ref(rawInstance[propertyName])}.
     *     A reactive property is needed by watchers. However, the property itself is wrapped into anonymous
     *     getters and setters to hide the additional reactive indirection. Thus, direct access to the property is
     *     still possible. The way to access the property value does not change, so the code of the component class
     *     will not fail. As a result, any "converted" property is registered internally, to avoid duplicate
     *     conversions as there is no way to distinguish converted properties from ordinary ones. If an already
     *     converted property is to be converted again, the conversion is aborted but the already internally registered
     *     reactive wrapper is returned instead.
     * </p>
     *
     * @param propertyName the name of the new property
     * @return {@code} undefined if the property name is invalid.
     */
    makePropertyReactive(propertyName: PropertyKey): Ref | undefined;

    /**
     * Provides data from this instance to the Vue injection pool and this to the children of this component.
     *
     * <p>
     *     Vue supports a very limited, lightweight dependency injection system. Parent components may provide some
     *     data to their child components. This function will provide data to the injection pool.
     * </p>
     *
     * @param providedValuesSpec
     */
    provideData(providedValuesSpec: CompatibleComponentOptions<T>["provide"]): IComponentBuilder<T>;

    /**
     * Registers the life-cycle hooks from the builder-instance.
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
     */
    registerLifeCycleHooks(): IComponentBuilder<T>;

    /**
     * Registers additional life-cycle hooks from the options data.
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
     *
     * @param hookFunctions
     * @see #registerLifeCycleHooks()
     */
    registerAdditionalLifeCycleHooks(hookFunctions?: CompatibleComponentOptions<T>): IComponentBuilder<T>;
}
