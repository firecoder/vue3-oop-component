import type { ComponentPublicInstance, ComponentProvideOptions, DebuggerEvent, h, PropType, WatchCallback, WatchOptions, WritableComputedOptions } from "vue";
export type CreateElement = typeof h;
export interface Constructor<T = any> {
    new (...args: any[]): T;
}
/**
 * When the `Computed` type parameter on `ComponentOptions` is inferred,
 * it should have a property with the return type of every get-accessor.
 * Since there isn't a way to query for the return type of function, we allow TypeScript
 * to infer from the shape of `Accessors<Computed>` and work backwards.
 */
export type Accessors<T> = {
    [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>;
};
export type DefaultData<V> = Record<string, unknown> | ((this: V) => Record<string, unknown>);
export type DefaultProps = Record<string, any> | string[];
export type DefaultMethods<V> = {
    [key: string]: (this: V, ...args: any[]) => any;
};
export type DefaultComputed = {
    [key: string | symbol]: any;
};
export type MethodsWithoutThis<T> = {
    [key in keyof T]: (...args: any[]) => any;
};
export type InjectKey = string | symbol;
export type ObjectInjectOptions = Record<InjectKey, InjectKey | {
    from?: InjectKey;
    default?: unknown;
}>;
export type ComponentInjectOptions = string[] | ObjectInjectOptions;
export type ObjectProvideOptions = Exclude<ComponentProvideOptions, Function>;
export type PropValidator<T> = PropOptions<T> | PropType<T> | null;
export interface PropOptions<T = any> {
    type?: PropType<T>;
    required?: boolean;
    default?: T | null | undefined | (() => T | null | undefined);
    validator?(value: T): boolean;
}
export type RecordPropsDefinition<T> = {
    [K in keyof T]: PropValidator<T[K]>;
};
export type ArrayPropsDefinition<T extends Record<string, unknown>> = (string & keyof T)[];
export type PropsDefinition<T extends Record<string, any>> = string[] | ArrayPropsDefinition<T> | RecordPropsDefinition<T>;
export interface ComputedOptions<T> extends WritableComputedOptions<T> {
    cache?: boolean;
}
export type ObjectWatchOptionItem = {
    handler: WatchCallback | string;
} & WatchOptions;
export type OnCleanup = (cleanupFn: () => void) => void;
export type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem;
export type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];
export type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;
export type DebuggerHook = (e: DebuggerEvent) => void;
export type ErrorCapturedHook<TError = unknown> = (err: TError, instance: ComponentPublicInstance | null, info: string) => boolean | void;
