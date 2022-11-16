import type { Component } from "vue";
import type { CompatibleComponentOptions, DefaultProps, RecordPropsDefinition, Vue } from "../vue";
import type { ComponentWithCustomSetup, VueClassComponent, VueComponentSetupFunction } from "./component-decorator-types";
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
export declare function componentFactory<V extends Vue = Vue>(component: ComponentWithCustomSetup<V>, options?: CompatibleComponentOptions<V>): VueClassComponent<V>;
/**
 * Create the Vue class component options onto the provided component and returns the patched one.
 *
 * @param component
 * @param options
 */
export declare function createVccOptions<V extends Vue = Vue>(component: VueClassComponent<V>, options?: CompatibleComponentOptions<V>): VueClassComponent<V>["__vccOpts"] | undefined;
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
export declare function getComputedValuesDefinitionFromComponentPrototype<V extends Vue = Vue>(component: ComponentWithCustomSetup<V>): CompatibleComponentOptions<V>["computed"];
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
export declare function applyMethodsFromOptions<V extends Vue = Vue>(component: ComponentWithCustomSetup<V>, options: CompatibleComponentOptions<V>): ComponentWithCustomSetup<V>;
/**
 * Generate getter function to fetch definition of Vue properties from the options stored in the component instance.
 *
 * @param component the component to instantiate and read its options.
 */
export declare function generateGetterForProperties<V extends Vue = Vue>(component: VueClassComponent<V>): (() => RecordPropsDefinition<DefaultProps>);
/**
 * Generate getter function to fetch definition of imported components from the options stored in the instance.
 *
 * @param component the component to instantiate and read its options.
 */
export declare function generateGetterForComponents<V extends Vue = Vue>(component: VueClassComponent<V>): (() => Record<string, Component>);
/**
 * Generates a setup function for the class component.
 *
 * <p>
 *     The class component instance is created and the class component options fetched from this instance.
 *     Then the options are used to dynamically patch the instance according to the provided options.
 * </p>
 * @param component
 */
export declare function generateSetupFunction<V extends Vue>(component: VueClassComponent<V>): VueComponentSetupFunction;
