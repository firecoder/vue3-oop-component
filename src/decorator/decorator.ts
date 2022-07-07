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
export type DecoratedClass = VueClass<Vue> & {
    // Property, method and parameter decorators created by `createDecorator` helper
    // will enqueue functions.
    __decorators__?: ((options: CompatibleComponentOptions<Vue>) => void)[]
}

export function createDecorator(callback: (options: CompatibleComponentOptions<Vue>) => void): ClassDecorator;
export function createDecorator(
    callback: (options: CompatibleComponentOptions<Vue>, key: string | symbol) => void,
): PropertyDecorator;
export function createDecorator(
    callback: <T>(
        options: CompatibleComponentOptions<Vue>, key: string | symbol, descriptor: TypedPropertyDescriptor<T>,
    ) => void,
): MethodDecorator;
export function createDecorator(
    callback: (options: CompatibleComponentOptions<Vue>, key: string | symbol, parameterIndex: number) => void,
): ParameterDecorator;

export function createDecorator(
    callback: (options: CompatibleComponentOptions<Vue>, key: string | symbol, descriptorOrNumber: any) => void,
): VueDecorator {
    return function CreatedVueDecorator(
        target: Vue | typeof Vue,
        key?: string | symbol,
        index?: number | TypedPropertyDescriptor<any>,
    ) {

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

        ConstructorFunc.__decorators__.push((options) => callback(options, key || Symbol(), index));
    };
}
