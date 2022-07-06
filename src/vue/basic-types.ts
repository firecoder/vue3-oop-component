/* eslint-disable @typescript-eslint/no-explicit-any */
// to be as compatible as possible with legacy Vue 2, the code is taken from there.
// see: https://github.com/vuejs/vue/blob/d6bdff890322bc87792094a1690bcd16373cf82d/types/options.d.ts

import type {
    ComponentPublicInstance,
    ComponentProvideOptions,
    DebuggerEvent,
    h,
    PropType,
    WatchCallback,
    WatchOptions,
    WritableComputedOptions,
} from "vue";

export type CreateElement = typeof h;

/**
 * When the `Computed` type parameter on `ComponentOptions` is inferred,
 * it should have a property with the return type of every get-accessor.
 * Since there isn't a way to query for the return type of function, we allow TypeScript
 * to infer from the shape of `Accessors<Computed>` and work backwards.
 */
export type Accessors<T> = {
    [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>
}

export type DefaultData<V> = object | ((this: V) => object);
export type DefaultProps = Record<string, any> | string[];
export type DefaultMethods<V> = { [key: string]: (this: V, ...args: any[]) => any };
export type DefaultComputed = { [key: string | symbol]: any };

export type MethodsWithoutThis<T> = {
    [key in keyof T]: (...args: any[]) => any
};

// see: https://v2.vuejs.org/v2/api/#provide-inject
export type ObjectInjectOptions = Record<string | symbol, string | symbol | {
    from?: string | symbol;
    default?: unknown;
}>;
export type ComponentInjectOptions = string[] | ObjectInjectOptions;

// eslint-disable-next-line @typescript-eslint/ban-types
export type ObjectProvideOptions = Exclude<ComponentProvideOptions, Function>;

export type PropValidator<T> = PropOptions<T> | PropType<T> | null;

export interface PropOptions<T = any> {
    type?: PropType<T>
    required?: boolean
    default?: T | null | undefined | (() => T | null | undefined)
    validator?(value: T): boolean
}

export type RecordPropsDefinition<T> = {
    [K in keyof T]: PropValidator<T[K]>
};
export type ArrayPropsDefinition<T> = (keyof T)[];
export type PropsDefinition<T> =
    | ArrayPropsDefinition<T>
    | RecordPropsDefinition<T>
;

export interface ComputedOptions<T> extends WritableComputedOptions<T> {
    cache?: boolean
}

export type ObjectWatchOptionItem = {
    handler: WatchCallback | string;
} & WatchOptions;

export type OnCleanup = (cleanupFn: () => void) => void;
export type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem;
export type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];
export type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;

export type DebuggerHook = (e: DebuggerEvent) => void;
export type ErrorCapturedHook<TError = unknown> =
    (err: TError, instance: ComponentPublicInstance | null, info: string) => boolean | void;
