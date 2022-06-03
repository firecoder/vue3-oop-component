/**
 * This file is inspired by package "vue-class-component". Its content is partly taken from there and adapted to the needs
 * of this package.
 *
 * @see: https://github.com/vuejs/vue-class-component/blob/next/src/vue.ts
 */

import type {
    ComponentPublicInstance,
    ComputedOptions,
    MethodOptions,
    VNode,
    VNodeProps,
    AllowedComponentProps,
    ComponentCustomProps,
    ComponentOptionsBase,
    EmitsOptions,
    ObjectEmitsOptions, WatchOptions, WatchStopHandle,
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
    Props = unknown,
    Emits extends EmitsOptions = ObjectEmitsOptions,
    DefaultProps = Record<string, unknown>
> = ComponentPublicInstance<
    Props,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, any>,
    MethodOptions,
    Emits,
    PublicProps,
    DefaultProps,
    true
> & ClassComponentHooks & CustomClassImplementation;

// change to never
export type VueBase = Vue<unknown, string[]>;

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

class VueComponentBaseImpl {
    // define some Vue provided properties. These will be overwritten by factory function that is created by
    // the "Component" decorator.
    public $props: Record<string, unknown> = {};
    public $emit: ((event: string, ...args: unknown[]) => void) = (() => { /* ignore */ });
    public $attrs: ComponentPublicInstance["$attrs"] = {};
    public $slots: ComponentPublicInstance["$slots"] = {};

    /*
    constructor(props: Record<string, any>, ctx: SetupContext) {
        defineGetter(this, '$props', () => props)
        defineGetter(this, '$attrs', () => ctx.attrs)
        defineGetter(this, '$slots', () => ctx.slots)
        defineGetter(this, '$emit', () => ctx.emit)

        Object.keys(props).forEach((key) => {
            Object.defineProperty(this, key, {
                enumerable: false,
                configurable: true,
                writable: true,
                value: (props as any)[key],
            })
        })
    }
    */
}

export const Vue: VueConstructor = VueComponentBaseImpl as VueConstructor;
