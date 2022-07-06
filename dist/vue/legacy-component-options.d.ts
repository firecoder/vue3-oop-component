import type { Vue, VueClass } from "./vue";
import type { ComponentInternalInstance, ComponentProvideOptions, ComponentOptionsBase, SetupContext, VNode } from "vue";
import type { Accessors, CreateElement, ComponentInjectOptions, ComponentWatchOptions, DebuggerHook, DefaultComputed, DefaultData, DefaultMethods, DefaultProps, ErrorCapturedHook, MethodsWithoutThis, PropsDefinition } from "./basic-types";
import type { IComponentBuilder } from "../decorator/IComponentBuilder";
export interface CompatibleComponentOptions<V extends Vue, Data = DefaultData<V>, Methods = DefaultMethods<V>, Computed = DefaultComputed, PropsDef = PropsDefinition<DefaultProps>, Props = DefaultProps> extends Omit<ComponentOptionsBase<Props, V, Data, Accessors<Computed>, MethodsWithoutThis<Methods>, any, any, any>, "setup"> {
    data?: Data;
    props?: PropsDef;
    methods?: Methods;
    /**
     * Optional custom component setup function.
     *
     * <p>
     *     The component instance has already been created and this function is executed in the context of its
     *     reactive wrapper. The passed-on builder can be used to fetch original instance and perform some more
     *     monkey-patching of the instance.
     * </p>
     *
     * <p>
     *     All the Vue provided properties have already been applied to the instance and the Vue internal component
     *     is available as {@code this.$}.
     * </p>
     *
     * @param builder the helper builder with utility functions to patch the instance.
     * @param props the original properties as passed by Vue
     * @param ctx the Vue setup context
     */
    setup?: (this: V, builder: IComponentBuilder<V>, props: ComponentInternalInstance["props"], ctx: SetupContext) => void;
    render?(createElement: CreateElement): VNode;
    renderError?(createElement: CreateElement, err: Error): VNode;
    computed?: Accessors<Computed>;
    watch?: ComponentWatchOptions;
    provide?: ComponentProvideOptions;
    inject?: ComponentInjectOptions;
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
