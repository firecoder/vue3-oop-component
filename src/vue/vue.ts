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
    ObjectEmitsOptions, WatchOptions, WatchStopHandle,
} from "vue";

import {
    getCurrentInstance,
    nextTick,
    watch,
} from "vue";

export type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;

export interface ClassComponentHooks {
    // To be extended on user land
    data?(): object
    beforeCreate?(): void
    created?(): void
    beforeMount?(): void
    mounted?(): void
    beforeUnmount?(): void
    unmounted?(): void
    beforeUpdate?(): void
    updated?(): void
    activated?(): void
    deactivated?(): void
    render?(): VNode | void
    errorCaptured?(err: Error, vm: Vue, info: string): boolean | undefined
    serverPrefetch?(): Promise<unknown>
}

export interface CustomClassImplementation {
    [key: string]: undefined | null | unknown;
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
> & ClassComponentHooks & CustomClassImplementation;

// change to never
export type VueBase = Vue<any, string[]>;

// unlike vue's vue-class-component, no internal of VueStatic is exposed by default. VueStatic is regarded as
// internal and unstable API. Maybe this API change with next major version like with Vue2 to Vue3.
// By omitting this type, a lot of recursive, forward-looking type declaration is being
// omitted too. This makes the code more lean and understandable.
export interface VueConstructor<V extends VueBase = VueBase> {
    new (...args: unknown[]): V;
}

export type VueClass<V> = VueConstructor & {
    new (...args: unknown[]): V & Vue;
};

type IndexableReturnsAny<T> = T & { [key: string]: any };

class VueComponentBaseImpl implements VueBase {

    /**
     * Reads and sets the internal Vue instance and all properties!
     */
    public constructor() {
        const vueInstance = getCurrentInstance();
        if (!vueInstance) {
            throw new Error(
                "Failed to access internal Vue companion instance. Maybe Vue API has changed or the instance " +
                "is not created by Vue!",
            );
        }

        this.$ = vueInstance;

        // set the properties as passed by Vue
        Object.keys(this.$props || {}).forEach((key) => {
            Object.defineProperty(this, key, {
                get() { return (this.$props || {})[key]; },
                enumerable: true,
                writable: false,
            });
        });
    }

    /**
     * This will be set at runtime after the instance has been created, so it is not available with the constructor!
     */
    public readonly $!: ComponentInternalInstance;

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
        return this.$.n || nextTick.bind(this.$.proxy);
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
        return this.$.refs;
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
}

export const Vue: VueConstructor = VueComponentBaseImpl as VueConstructor;