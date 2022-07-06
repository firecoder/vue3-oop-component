import { CompositionApi } from "../vue";
export declare type TLifeCycleHookRegisterFunction = (() => undefined) | typeof CompositionApi.onBeforeMount | typeof CompositionApi.onMounted | typeof CompositionApi.onBeforeUnmount | typeof CompositionApi.onBeforeUnmount | typeof CompositionApi.onUnmounted | typeof CompositionApi.onBeforeUpdate | typeof CompositionApi.onUpdated | typeof CompositionApi.onActivated | typeof CompositionApi.onDeactivated | typeof CompositionApi.onRenderTriggered | typeof CompositionApi.onRenderTracked | typeof CompositionApi.onErrorCaptured | typeof CompositionApi.onServerPrefetch;
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
export declare const $lifeCycleHookRegisterFunctions: {
    [hookName: string]: TLifeCycleHookRegisterFunction;
    beforeCreate: (() => undefined);
    created: (() => undefined);
    beforeMount: typeof CompositionApi.onBeforeMount;
    mounted: typeof CompositionApi.onMounted;
    beforeDestroy: typeof CompositionApi.onBeforeUnmount;
    beforeUnMount: typeof CompositionApi.onBeforeUnmount;
    destroyed: typeof CompositionApi.onUnmounted;
    unmounted: typeof CompositionApi.onUnmounted;
    beforeUpdate: typeof CompositionApi.onBeforeUpdate;
    updated: typeof CompositionApi.onUpdated;
    activated: typeof CompositionApi.onActivated;
    deactivated: typeof CompositionApi.onDeactivated;
    renderTracked: typeof CompositionApi.onRenderTracked;
    renderTriggered: typeof CompositionApi.onRenderTriggered;
    errorCaptured: typeof CompositionApi.onErrorCaptured;
    serverPrefetch: typeof CompositionApi.onServerPrefetch;
};
export declare const $lifeCycleHookNames: string[];
export declare const $internalHookNames: string[];
export declare function isNotInternalHookName(name: string | symbol): boolean;
export declare function isInternalHookName(name: string | symbol): boolean;
