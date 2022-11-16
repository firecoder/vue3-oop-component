/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file is inspired by package "vue-class-component". Its content is taken from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */

import type { CompatibleComponentOptions, Vue, VueClass } from "../vue";

/* from lib.es5.d.ts */

export type VueDecorator =
    | ClassDecorator
    | PropertyDecorator
    | MethodDecorator
    | ParameterDecorator
;

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
export type DecoratedClass<V extends Vue = Vue> = VueClass<V> & {
    // Property, method and parameter decorators created by `createDecorator` helper
    // will enqueue functions.
    __decorators__?: ((options: CompatibleComponentOptions<V>) => void)[]
}

export function createDecorator<V extends Vue = Vue>(callback: (options: CompatibleComponentOptions<V>) => void): ClassDecorator;
export function createDecorator<V extends Vue = Vue>(
    callback: (options: CompatibleComponentOptions<V>, key: string | symbol) => void,
): PropertyDecorator;
export function createDecorator<V extends Vue = Vue>(
    callback: <T>(
        options: CompatibleComponentOptions<V>, key: string | symbol, descriptor: TypedPropertyDescriptor<T>,
    ) => void,
): MethodDecorator;
export function createDecorator<V extends Vue = Vue>(
    callback: (options: CompatibleComponentOptions<V>, key: string | symbol, parameterIndex: number) => void,
): ParameterDecorator;

export function createDecorator<V extends Vue = Vue>(
    callback: (options: CompatibleComponentOptions<V>, key: string | symbol, descriptorOrNumber: any) => void,
): VueDecorator {
    return function CreatedVueDecorator(
        target: DecoratedClass<V> | V,
        key?: string | symbol,
        index?: number | TypedPropertyDescriptor<any>,
    ) {

        const ConstructorFunc = typeof target === "function"
            ? target as DecoratedClass<V>
            : (target as { constructor: DecoratedClass<V> }).constructor
        ;

        if (!Object.hasOwn(ConstructorFunc, "__decorators__") || !ConstructorFunc.__decorators__) {
            Object.defineProperty(ConstructorFunc, "__decorators__", {
                enumerable: true,
                value: [],
                writable: true,
            });
        }

        if (typeof index !== "number") {
            index = undefined;
        }

        if (ConstructorFunc.__decorators__ !== undefined) {
            ConstructorFunc.__decorators__.push((options) => callback(options, key || Symbol(), index));
        }
    } as VueDecorator;
}
