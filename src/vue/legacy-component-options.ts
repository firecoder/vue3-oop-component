/* eslint-disable @typescript-eslint/no-explicit-any */
// to be as compatible as possible with legacy Vue 2, the code is taken from there.
// see: https://github.com/vuejs/vue/blob/d6bdff890322bc87792094a1690bcd16373cf82d/types/options.d.ts

import type { Vue, VueClass } from "./vue";
import type {
    ComponentInternalInstance,
    ComponentProvideOptions,
    ComponentOptionsBase,
    SetupContext,
    VNode,
} from "vue";
import type {
    Accessors,
    CreateElement,
    ComponentInjectOptions,
    ComponentWatchOptions,
    DebuggerHook,
    DefaultComputed,
    DefaultData,
    DefaultMethods,
    DefaultProps,
    ErrorCapturedHook,
    MethodsWithoutThis,
    PropsDefinition,
} from "./basic-types";

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
