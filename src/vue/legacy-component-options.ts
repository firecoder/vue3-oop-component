/* eslint-disable @typescript-eslint/no-explicit-any */
// to be as compatible as possible with legacy Vue 2, the code is taken from there.
// see: https://github.com/vuejs/vue/blob/d6bdff890322bc87792094a1690bcd16373cf82d/types/options.d.ts

import type {
    ComponentInternalInstance,
    ComponentPublicInstance,
    ComponentProvideOptions,
    ComponentOptionsBase,
    DebuggerEvent,
    h,
    SetupContext,
    VNode,
    WatchCallback,
    WatchOptions,
    WritableComputedOptions,
} from "vue";
import type { Vue, VueClass } from "./vue";

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

type DefaultData<V> = object | ((this: V) => object);
type DefaultProps = Record<string, any>;
type DefaultMethods<V> = { [key: string]: (this: V, ...args: any[]) => any };
type DefaultComputed = { [key: string]: any };

type MethodsWithoutThis<T> = {
    [key in keyof T]: (...args: any[]) => any
};

// see: https://v2.vuejs.org/v2/api/#provide-inject
export type ObjectInjectOptions = Record<string | symbol, string | symbol | {
    from?: string | symbol;
    default?: unknown;
}>;
export type ComponentInjectOptions = string[] | ObjectInjectOptions;

export interface CompatibleComponentOptions<
    V extends Vue,
    Data = DefaultData<V>,
    Methods = DefaultMethods<V>,
    Computed = DefaultComputed,
    PropsDef = PropsDefinition<DefaultProps>,
    Props = DefaultProps,
> extends Omit<ComponentOptionsBase<Props, V, Data, Accessors<Computed>, MethodsWithoutThis<Methods>, any, any, any>, "setup"> {
    data?: Data;
    props?: PropsDef;
    methods?: Methods;

    setup?: (
        this: VueClass<V>,
        props: Props,
        ctx: SetupContext
    ) => VueClass<V>;

    render?(createElement: CreateElement): VNode;
    renderError?(createElement: CreateElement, err: Error): VNode;

    computed?: Accessors<Computed>;
    watch?: ComponentWatchOptions;
    provide?: ComponentProvideOptions;
    inject?: ComponentInjectOptions;
    // mixins?: Mixin[];
    beforeCreate?(this: ComponentInternalInstance): void;
    created?(this: VueClass<V>): void;
    beforeMount?(this: VueClass<V>): void;
    mounted?(this: VueClass<V>): void;
    beforeUpdate?(this: VueClass<V>): void;
    updated?(this: VueClass<V>): void;
    activated?(this: VueClass<V>): void;
    deactivated?(this: VueClass<V>): void;
    /** @deprecated use `beforeUnmount` instead */
    beforeDestroy?(this: VueClass<V>): void;
    beforeUnmount?(this: VueClass<V>): void;
    /** @deprecated use `unmounted` instead */
    destroyed?(this: VueClass<V>): void;
    unmounted?(this: VueClass<V>): void;
    renderTracked?: DebuggerHook;
    renderTriggered?: DebuggerHook;
    errorCaptured?: ErrorCapturedHook;
    delimiters?: [string, string];
}

export type Prop<T> =
    | { (): T }
    | { new (...args: never[]): T & object }
    | { new (...args: string[]): (...args: any[]) => any }

export type PropType<T> = Prop<T> | Prop<T>[]

export type PropValidator<T> = PropOptions<T> | PropType<T>

export interface PropOptions<T = any> {
    type?: PropType<T>
    required?: boolean
    default?: T | null | undefined | (() => T | null | undefined)
    validator?(value: T): boolean
}

export type RecordPropsDefinition<T> = {
    [K in keyof T]: PropValidator<T[K]>
}
export type ArrayPropsDefinition<T> = (keyof T)[]
export type PropsDefinition<T> =
    | ArrayPropsDefinition<T>
    | RecordPropsDefinition<T>

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
export type ErrorCapturedHook<TError = unknown> = (err: TError, instance: ComponentPublicInstance | null, info: string) => boolean | void;
