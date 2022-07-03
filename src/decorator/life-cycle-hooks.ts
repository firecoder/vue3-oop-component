// inspired by and much taken from here:
// https://github.com/vuejs/vue-class-component/blob/16433462b40aefecc030919623f17b0ec9afe61c/src/component.ts#L24

import type { ComponentInternalInstance } from "vue";
import type { DebuggerHook, ErrorCapturedHook } from "../vue";

import { CompositionApi } from "../vue";

export type TLifeCycleHookRegisterFunction =
    | (() => undefined)
    | typeof CompositionApi.onBeforeMount
    | typeof CompositionApi.onMounted
    | typeof CompositionApi.onBeforeUnmount
    | typeof CompositionApi.onBeforeUnmount
    | typeof CompositionApi.onUnmounted
    | typeof CompositionApi.onBeforeUpdate
    | typeof CompositionApi.onUpdated
    | typeof CompositionApi.onActivated
    | typeof CompositionApi.onDeactivated
    | typeof CompositionApi.onRenderTriggered
    | typeof CompositionApi.onRenderTracked
    | typeof CompositionApi.onErrorCaptured
    | typeof CompositionApi.onServerPrefetch
;

/**
 * Provides mapping between legacy life cycle hooks and new Composition API functions.
 *
 * <p>
 *     The Composition API functions are not directly bound to new names but wrapped with a function. Thus, any
 *     mocked API function will be used instead af od the original function. This way, the tests are really able to
 *     check, whether the Composition API functions are called properly.
 * </p>
 *
 * <p>
 *     The life cycle hooks of {@code beforeCreate} and {@code created} are not handled by the composition API.
 *     Thus, the provided functions are just stubs here. The hook functions are handled internally by this component
 *     decorator.
 * </p>
 */
export const $lifeCycleHookRegisterFunctions: {
    [hookName: string]: TLifeCycleHookRegisterFunction;
    beforeCreate: (() => undefined),
    created: (() => undefined),
    beforeMount: typeof CompositionApi.onBeforeMount,
    mounted: typeof CompositionApi.onMounted,
    beforeDestroy: typeof CompositionApi.onBeforeUnmount,
    beforeUnMount: typeof CompositionApi.onBeforeUnmount,
    destroyed: typeof CompositionApi.onUnmounted,
    unmounted: typeof CompositionApi.onUnmounted,
    beforeUpdate: typeof CompositionApi.onBeforeUpdate,
    updated: typeof CompositionApi.onUpdated,
    activated: typeof CompositionApi.onActivated,
    deactivated: typeof CompositionApi.onDeactivated,
    renderTracked: typeof CompositionApi.onRenderTracked,
    renderTriggered: typeof CompositionApi.onRenderTriggered,
    errorCaptured: typeof CompositionApi.onErrorCaptured,
    serverPrefetch: typeof CompositionApi.onServerPrefetch,
} = {
    beforeCreate: () => undefined,
    created: () => undefined,

    beforeMount: function beforeMount(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onBeforeMount(hook, target);
    },

    mounted: function mounted(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onMounted(hook, target);
    },

    beforeDestroy: function beforeDestroy(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onBeforeUnmount(hook, target);
    },

    beforeUnMount: function beforeUnMount(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onBeforeUnmount(hook, target);
    },

    destroyed: function destroyed(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onUnmounted(hook, target);
    },

    unmounted: function unmounted(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onUnmounted(hook, target);
    },

    beforeUpdate: function beforeUpdate(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onBeforeUpdate(hook, target);
    },

    updated: function updated(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onUpdated(hook, target);
    },

    // eslint-disable-next-line @typescript-eslint/ban-types
    activated: function activated(hook: Function, target?: ComponentInternalInstance | null) {
        return CompositionApi.onActivated(hook, target);
    },

    // eslint-disable-next-line @typescript-eslint/ban-types
    deactivated: function deactivated(hook: Function, target?: ComponentInternalInstance | null) {
        return CompositionApi.onDeactivated(hook, target);
    },

    renderTracked: function render(hook: DebuggerHook, target?: ComponentInternalInstance | null) {
        return CompositionApi.onRenderTracked(hook, target);
    },

    renderTriggered: function render(hook: DebuggerHook, target?: ComponentInternalInstance | null) {
        return CompositionApi.onRenderTriggered(hook, target);
    },

    errorCaptured: function errorCaptured<TError = Error>(
        hook: ErrorCapturedHook<TError>, target?: ComponentInternalInstance | null,
    ) {
        return CompositionApi.onErrorCaptured(hook, target);
    },

    serverPrefetch: function serverPrefetch(hook: () => unknown, target?: ComponentInternalInstance | null) {
        return CompositionApi.onServerPrefetch(hook, target);
    },
};

export const $lifeCycleHookNames = Object.getOwnPropertyNames($lifeCycleHookRegisterFunctions);
export const $internalHookNames = [
    ...$lifeCycleHookNames,
    "data",
    "render",
];

export function isNotInternalHookName(name: string | symbol): boolean {
    return !isInternalHookName(name);
}

export function isInternalHookName(name: string | symbol): boolean {
    return !!(name && typeof name === "string" && $internalHookNames.indexOf(name) >= 0);
}
