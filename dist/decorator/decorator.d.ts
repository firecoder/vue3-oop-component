/**
 * This file is inspired by package "vue-class-component". Its content is taked from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */
import type { ComponentOptions } from "vue";
import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";
export declare type ClassDecorator = (ConstructorFunction: typeof Vue) => void;
export declare type PropertyDecorator = (target: Vue, key: string) => void;
export declare type ParameterDecorator = (target: Vue, key: string, index: number) => void;
export declare type VueDecorator = ClassDecorator | PropertyDecorator | ParameterDecorator;
export declare type ClassDecoratorFactoryFunction = (options: ComponentOptions<Vue>, key: string) => void;
export declare type PropertyDecoratorFactoryFunction = (options: ComponentOptions<Vue>, key: string) => void;
export declare type ParameterDecoratorFactoryFunction = (options: ComponentOptions<Vue>, key: string, index: number) => void;
export declare type VueDecoratorFactoryFunction = ClassDecoratorFactoryFunction | PropertyDecoratorFactoryFunction | ParameterDecoratorFactoryFunction;
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
export declare type DecoratedClass = VueClass<Vue> & {
    __decorators__?: ((options: CompatibleComponentOptions<Vue>) => void)[];
};
export declare function createDecorator(factory: (options: CompatibleComponentOptions<Vue>, key: string, index?: number) => void): VueDecorator;
