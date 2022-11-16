import type { ComponentPublicInstance, ComponentProvideOptions, DebuggerEvent, h, PropType, WatchCallback, WatchOptions, WritableComputedOptions } from "vue";
export declare type CreateElement = typeof h;
export interface Constructor<T = any> {
    new (...args: any[]): T;
}
/**
 * When the `Computed` type parameter on `ComponentOptions` is inferred,
 * it should have a property with the return type of every get-accessor.
 * Since there isn't a way to query for the return type of function, we allow TypeScript
 * to infer from the shape of `Accessors<Computed>` and work backwards.
 */
export declare type Accessors<T> = {
    [K in keyof T]: (() => T[K]) | ComputedOptions<T[K]>;
};
export declare type DefaultData<V> = Record<string, unknown> | ((this: V) => Record<string, unknown>);
export declare type DefaultProps = Record<string, any> | string[];
export declare type DefaultMethods<V> = {
    [key: string]: (this: V, ...args: any[]) => any;
};
export declare type DefaultComputed = {
    [key: string | symbol]: any;
};
export declare type MethodsWithoutThis<T> = {
    [key in keyof T]: (...args: any[]) => any;
};
export declare type InjectKey = string | symbol;
export declare type ObjectInjectOptions = Record<InjectKey, InjectKey | {
    from?: InjectKey;
    default?: unknown;
}>;
export declare type ComponentInjectOptions = string[] | ObjectInjectOptions;
export declare type ObjectProvideOptions = Exclude<ComponentProvideOptions, Function>;
export declare type PropValidator<T> = PropOptions<T> | PropType<T> | null;
export interface PropOptions<T = any> {
    type?: PropType<T>;
    required?: boolean;
    default?: T | null | undefined | (() => T | null | undefined);
    validator?(value: T): boolean;
}
export declare type RecordPropsDefinition<T> = {
    [K in keyof T]: PropValidator<T[K]>;
};
export declare type ArrayPropsDefinition<T extends Record<string, unknown>> = (string & keyof T)[];
export declare type PropsDefinition<T extends Record<string, any>> = string[] | ArrayPropsDefinition<T> | RecordPropsDefinition<T>;
export interface ComputedOptions<T> extends WritableComputedOptions<T> {
    cache?: boolean;
}
export declare type ObjectWatchOptionItem = {
    handler: WatchCallback | string;
} & WatchOptions;
export declare type OnCleanup = (cleanupFn: () => void) => void;
export declare type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem;
export declare type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];
export declare type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;
export declare type DebuggerHook = (e: DebuggerEvent) => void;
export declare type ErrorCapturedHook<TError = unknown> = (err: TError, instance: ComponentPublicInstance | null, info: string) => boolean | void;
