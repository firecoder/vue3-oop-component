/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This file is inspired by package "vue-class-component". Its content is partly taken from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */

import type {
    ComponentPublicInstance,
    ComponentInternalInstance,
    MethodOptions,
    VNode,
    VNodeProps,
    AllowedComponentProps,
    ComponentCustomProps,
    ComponentOptionsBase,
    EmitsOptions,
    ObjectEmitsOptions,
    SetupContext,
    WatchOptions,
    WatchStopHandle,
} from "vue";

import type { ComponentWithCustomSetup } from "../decorator/component-decorator-types";
import type { CompatibleComponentOptions } from "./legacy-component-options";
import type { Constructor } from "./basic-types";

import {
    getCurrentInstance,
    h,
    nextTick,
    watch,
} from "vue";
import { defineNewLinkedProperties } from "../utilities/properties";
import { addLegacyRenderingFunctions } from "./legacy-render-functions";
import { getCurrentSetupContext } from "./setup-context-global-storage";

export type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

export interface ClassComponentHooks {
    // To be extended on user land
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
}

export type Vue<
    Props = any,
    Emits extends EmitsOptions = ObjectEmitsOptions,
    DefaultProps = Record<string, any>
> = ComponentPublicInstance<
    Props,
    Record<string, any>,
    Record<string, any>,
    Record<string, any>,
    MethodOptions,
    Emits,
    PublicProps,
    DefaultProps,
    true
> & ClassComponentHooks & CustomClassImplementation & ComponentWithCustomSetup;

// change to never
export type VueBase = Vue<any, string[]>;

// unlike vue´s vue-class-component, no internal of VueStatic is exposed by default. VueStatic is regarded as
// internal and unstable API. Maybe this API change with next major version like with Vue2 to Vue3.
// By omitting this type, a lot of recursive, forward-looking type declaration is being
// omitted too. This makes the code more lean and understandable.
export type VueConstructor<V extends Vue = VueBase> = Constructor<V>;

// for compatibility with Vue 2
export type VueClass<V extends Vue> = VueConstructor<V>;

type IndexableReturnsAny<T> = T & { [key: string]: any };

/**
 * This is the base implementation of class component instances implementing interface {@code Vue}.
 *
 * <p>
 *     The base class for all Vue class components handled by the component decorator provides the properties, we have
 *     become accustomed using Vue 2. It tries to be a compatible replacement for old Vue 2 "base class".
 * </p>
 */
export class VueComponentBaseImpl implements VueBase {
    /**
     * Reads and sets the internal Vue instance and all properties!
     */
    public constructor() {
        let vueInstance = getCurrentInstance();
        let setupContext = getCurrentSetupContext();

        // use only getter and non-enumerable to avoid Vue to complain about reserved prefix "$".
        Object.defineProperty(this, "$", {
            get: () => vueInstance,
            set: (newValue) => { vueInstance = newValue; },
            enumerable: false,
            configurable: true,
        });

        Object.defineProperty(this, "_setupContext", {
            get: () => setupContext,
            set: (newValue) => { setupContext = newValue; },
            enumerable: false,
            configurable: true,
        });

        defineNewLinkedProperties(this, vueInstance?.props);
        addLegacyRenderingFunctions(this);
    }

    /**
     * This will be set at runtime after the instance has been created, so it is not available with the constructor!
     *
     * <p>
     *     If this class or a derived class is created within unit tests directly, without any internal Vue instance,
     *     this value will be {@code undefined}. However, since this is not the case at runtime, this property
     *     is marked as NOT {@code undefined}. So, be aware of that during unit testing.
     * </p>
     */
    public readonly $!: ComponentInternalInstance;

    /**
     * The setup context as passed to the setup function of this component, if created by a "setup" function.
     */
    public readonly _setupContext?: SetupContext;

    public getSetupContext<E>(): SetupContext<E> | undefined {
        return this._setupContext as unknown as SetupContext<E>;
    }

    // taken from here
    // https://github.com/vuejs/core/blob/bdffc143ef3aa27c347b22f19d0052194b54836e/packages/runtime-core/src/componentPublicInstance.ts#L226
    public get $el() {
        return this.$?.vnode?.el;
    }

    public get $attrs() {
        return this.$?.attrs;
    }

    public get $data() {
        return this.$?.data;
    }

    public get $emit() {
        return this.$?.emit;
    }

    public get $forceUpdate() {
        return this.$?.f || (() => this.$nextTick(() => this.$?.update()));
    }

    public get $nextTick(): (<T extends ThisType<VueBase>>(fn: ((this: T) => void) | undefined) => Promise<void>) {
        return this.$?.n || nextTick.bind(this.$?.proxy);
    }

    public get $parent(): ComponentPublicInstance | null {
        return this.$?.parent as unknown as ComponentPublicInstance;
    }

    public get $props() {
        return this.$?.props;
    }

    public get $options(): ComponentOptionsBase<any, any, any, any, any, any, any, any, any> {
        return this.$?.type as ComponentOptionsBase<any, any, any, any, any, any, any, any, any> || {};
    }

    public get $refs() {
        return this.$?.refs;
    }

    public get $root(): ComponentPublicInstance | null {
        return this.$?.root as unknown as ComponentPublicInstance;
    }

    public get $slots() {
        return this.$?.slots;
    }

    public $watch(
        source: string | ((...args: unknown[]) => void),
        cb: ((...args: unknown[]) => void),
        options: WatchOptions | undefined,
    ): WatchStopHandle {
        if (typeof source === "string") {
            return watch(() => (this as IndexableReturnsAny<VueComponentBaseImpl>)[source] as unknown, cb, options);
        } else {
            return watch(source, cb, options);
        }
    }

    public setup(): void {
        // do nothing special here. This is just a stub for child classes!
    }

    /**
     * This is used internally by the component decorator.
     * @private
     */
    protected _getVueClassComponentOptions(): CompatibleComponentOptions<VueComponentBaseImpl>[] {
        return [];
    }
}

/**
 * Helper function to check, whether the provided instance is based on this Vue base class.
 *
 * <p>
 *     This checks explicitly for a child (instanceof) the custom base class in this package. This check is not
 *     a general check for any Vue 3 based component as this might not be based on this base class. This is an
 *     intended feature!
 * </p>
 *
 * @param instance the unknown instance to check
 */
export function isVueClassInstance(instance: unknown): instance is Vue {
    return typeof instance === "object"
        && instance !== null
        && instance !== undefined
        && instance instanceof Vue
    ;
}

export const Vue: VueConstructor = VueComponentBaseImpl as VueConstructor;
