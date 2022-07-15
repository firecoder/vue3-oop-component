/**
 * This file is inspired by package "vue-class-component". Its content is partly taken from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */
import type { ComponentPublicInstance, ComponentInternalInstance, MethodOptions, VNode, VNodeProps, AllowedComponentProps, ComponentCustomProps, ComponentOptionsBase, EmitsOptions, ObjectEmitsOptions, SetupContext, WatchOptions, WatchStopHandle } from "vue";
import type { ComponentWithCustomSetup } from "../decorator/component-decorator-types";
import type { CompatibleComponentOptions } from "./legacy-component-options";
import type { Constructor } from "./basic-types";
import { h } from "vue";
export declare type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;
export interface ClassComponentHooks {
    data?(): object;
    beforeCreate?(): void;
    created?(): void;
    beforeMount?(): void;
    mounted?(): void;
    beforeUnmount?(): void;
    unmounted?(): void;
    beforeUpdate?(): void;
    updated?(): void;
    activated?(): void;
    deactivated?(): void;
    render?(createElement: typeof h, ctx: SetupContext): VNode | void;
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined;
    serverPrefetch?(): Promise<unknown>;
}
export interface CustomClassImplementation {
    [key: string]: undefined | null | unknown;
}
export declare type Vue<Props = any, Emits extends EmitsOptions = ObjectEmitsOptions, DefaultProps = Record<string, any>> = ComponentPublicInstance<Props, Record<string, any>, Record<string, any>, Record<string, any>, MethodOptions, Emits, PublicProps, DefaultProps, true> & ClassComponentHooks & CustomClassImplementation & ComponentWithCustomSetup;
export declare type VueBase = Vue<any, string[]>;
export declare type VueConstructor<V extends Vue = VueBase> = Constructor<V>;
export declare type VueClass<V extends Vue> = VueConstructor<V>;
/**
 * This is the base implementation of class component instances implementing interface {@code Vue}.
 *
 * <p>
 *     The base class for all Vue class components handled by the component decorator provides the properties, we have
 *     become accustomed using Vue 2. It tries to be a compatible replacement for old Vue 2 "base class".
 * </p>
 */
export declare class VueComponentBaseImpl implements VueBase {
    /**
     * Reads and sets the internal Vue instance and all properties!
     */
    constructor();
    /**
     * This will be set at runtime after the instance has been created, so it is not available with the constructor!
     *
     * <p>
     *     If this class or a derived class is created within unit tests directly, without any internal Vue instance,
     *     this value will be {@code undefined}. However, since this is not the case at runtime, this property
     *     is marked as NOT {@code undefined}. So, be aware of that during unit testing.
     * </p>
     */
    readonly $: ComponentInternalInstance;
    /**
     * The setup context as passed to the setup function of this component, if created by a "setup" function.
     */
    readonly _setupContext?: SetupContext;
    getSetupContext<E>(): SetupContext<E> | undefined;
    get $el(): import("vue").RendererNode;
    get $attrs(): {
        [x: string]: unknown;
    };
    get $data(): {
        [x: string]: unknown;
    };
    get $emit(): (event: string, ...args: any[]) => void;
    get $forceUpdate(): () => void;
    get $nextTick(): (<T extends ThisType<VueBase>>(fn: ((this: T) => void) | undefined) => Promise<void>);
    get $parent(): ComponentPublicInstance | null;
    get $props(): {
        [x: string]: unknown;
    };
    get $options(): ComponentOptionsBase<any, any, any, any, any, any, any, any, any>;
    get $refs(): {
        [x: string]: unknown;
    };
    get $root(): ComponentPublicInstance | null;
    get $slots(): {
        [name: string]: import("vue").Slot;
    };
    $watch(source: string | ((...args: unknown[]) => void), cb: ((...args: unknown[]) => void), options: WatchOptions | undefined): WatchStopHandle;
    setup(): void;
    /**
     * This is used internally by the component decorator.
     * @private
     */
    protected _getVueClassComponentOptions(): CompatibleComponentOptions<VueComponentBaseImpl>[];
}
export declare const Vue: VueConstructor;
