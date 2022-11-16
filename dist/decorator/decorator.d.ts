/**
 * This file is inspired by package "vue-class-component". Its content is taken from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */
import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";
export declare type VueDecorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;
/**
 * Legacy definition of a decorated class for compatibility reasons.
 *
 * <p>
 *     Decorators are stored as a property to the constructor function. Unlike the vue2 version of
 *     "vue-class-component", these decorators are executed in the "Component" decorator of this package
 *     immediately and on each creation of the Vue component. This is due to using the official composition API
 *     instead of the Options API or some internally used, hidden Vue specific property. The composition API is the
 *     better choice for class based components but need to define and detect the list of properties upfront.
 * </p>
 */
export declare type DecoratedClass<V extends Vue = Vue> = VueClass<V> & {
    __decorators__?: ((options: CompatibleComponentOptions<V>) => void)[];
};
export declare function createDecorator<V extends Vue = Vue>(callback: (options: CompatibleComponentOptions<V>) => void): ClassDecorator;
export declare function createDecorator<V extends Vue = Vue>(callback: (options: CompatibleComponentOptions<V>, key: string | symbol) => void): PropertyDecorator;
export declare function createDecorator<V extends Vue = Vue>(callback: <T>(options: CompatibleComponentOptions<V>, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => void): MethodDecorator;
export declare function createDecorator<V extends Vue = Vue>(callback: (options: CompatibleComponentOptions<V>, key: string | symbol, parameterIndex: number) => void): ParameterDecorator;
