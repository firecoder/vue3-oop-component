import type { ComponentInternalInstance, ComponentOptionsWithObjectProps } from "vue";
import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";
export declare type ComponentOptions<V> = CompatibleComponentOptions<V>;
/**
 * A custom component setup function/method that will be called once at the very end of the setup.
 */
export declare type CustomComponentSetupFunction<V extends Vue = Vue> = Pick<CompatibleComponentOptions<V>, "setup">["setup"];
/**
 * A class providing the custom setup function to the component decorator.
 */
export interface ComponentWithCustomSetup<V extends Vue = Vue> extends VueClass<V> {
    setup?: CustomComponentSetupFunction<V>;
}
/**
 * This is the component setup functions that is used to create the instance from the class component.
 *
 * <p>
 *     The setup function, created by the component, uses the Vue 3 Composition API to create the requested connections
 *     between the Vue internal component and the class component, like computed values, watchers, reactivity, etc.
 * </p>
 */
export declare type VueComponentSetupFunction = Pick<ComponentOptionsWithObjectProps, "setup">["setup"];
/**
 * A Vue class component as created by the component decorator.
 *
 * <p>
 *     Vue 3 requires the property {@code __vccOpts} to be able to use a class (=constructor function) as a component.
 *     Ordinary functions are used as functional components. Thus, there need to be a way to distinguish functional
 *     components from class components. The property {@code __vccOpts} is the marker. If existent on a function, the
 *     data of this property is used to define the component instead.
 * </p>
 *
 * <p>
 *     For setting up the component, the original options passed to the decorator need to be available to the setup
 *     function. Thus, these will be stored at the extra property of {@code __vccOpts}.
 *     the class component property.
 * </p>
 */
export interface VueClassComponent<V extends Vue = Vue> extends ComponentWithCustomSetup<V> {
    /**
     * This is the Vue 3 "trigger" to make a class work as component.
     */
    __vccOpts: ComponentOptionsWithObjectProps<V> & {
        __component_decorator_original_options: CompatibleComponentOptions<V>;
    };
    /**
     * The optional hook to call before an instance of this class is created.
     *
     * <p>
     *     Unfortunately, Vue 3 is not executing the {@code beforeCreate} hook in all occasions. Reading the source code
     *     correctly, the hook is only called of some sort of Vue2 compatibility is enabled. This is not the case with
     *     all versions of Vue nor does it need to be in the future. Hence, the component decorator handles this hook
     *     separately and calls it on its own instead of just passing to Vue 3.
     * </p>
     */
    beforeCreate?(this: ComponentInternalInstance): void;
}