/**
 * This file is inspired by package "vue-class-component". Its content is taked from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */

import type { ComponentOptions } from "vue";
import type { CompatibleComponentOptions, Vue, VueClass } from "./vue";

export type ClassDecorator = (ConstructorFunction: typeof Vue) => void;
export type PropertyDecorator = (target: Vue, key: string) => void;
export type ParameterDecorator = (target: Vue, key: string, index: number) => void;
export type VueDecorator = ClassDecorator | PropertyDecorator | ParameterDecorator;

export type ClassDecoratorFactoryFunction = (options: ComponentOptions<Vue>, key: string) => void;
export type PropertyDecoratorFactoryFunction = (options: ComponentOptions<Vue>, key: string) => void;
export type ParameterDecoratorFactoryFunction =
    (options: ComponentOptions<Vue>, key: string, index: number) => void;
export type VueDecoratorFactoryFunction =
    ClassDecoratorFactoryFunction | PropertyDecoratorFactoryFunction | ParameterDecoratorFactoryFunction;

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
export type DecoratedClass = VueClass<Vue> & {
    // Property, method and parameter decorators created by `createDecorator` helper
    // will enqueue functions.
    __decorators__?: ((options: CompatibleComponentOptions<Vue>) => void)[]
}

export function createDecorator(
    factory: (options: CompatibleComponentOptions<Vue>, key: string, index?: number) => void,
): VueDecorator {
    return (target: Vue | typeof Vue, key: string, index?: number) => {

        const ConstructorFunc = typeof target === "function"
            ? target as DecoratedClass
            : target.constructor as DecoratedClass
        ;

        if (!ConstructorFunc.__decorators__) {
            ConstructorFunc.__decorators__ = [];
        }

        if (typeof index !== "number") {
            index = undefined;
        }

        ConstructorFunc.__decorators__.push((options) => factory(options, key, index));
    };
}
