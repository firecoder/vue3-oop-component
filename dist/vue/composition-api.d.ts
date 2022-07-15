/**
 * Exports composition API functions as part of an object, which enables mocking and testing.
 */
import { h, inject, onActivated, onDeactivated, onErrorCaptured, provide, ref, warn, watch } from "vue";
/**
 * This redirection object is used for better testability of the component decorator.
 */
export declare const CompositionApi: {
    computed: typeof import("@vue/reactivity").computed;
    getCurrentInstance: () => import("vue").ComponentInternalInstance;
    h: typeof h;
    inject: typeof inject;
    onActivated: typeof onActivated;
    onBeforeMount: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onBeforeUnmount: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onBeforeUpdate: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onDeactivated: typeof onDeactivated;
    onMounted: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onRenderTracked: (hook: (e: import("vue").DebuggerEvent) => void, target?: import("vue").ComponentInternalInstance) => false | Function;
    onRenderTriggered: (hook: (e: import("vue").DebuggerEvent) => void, target?: import("vue").ComponentInternalInstance) => false | Function;
    onErrorCaptured: typeof onErrorCaptured;
    onServerPrefetch: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onUnmounted: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    onUpdated: (hook: () => any, target?: import("vue").ComponentInternalInstance) => false | Function;
    provide: typeof provide;
    ref: typeof ref;
    warn: typeof warn;
    watch: typeof watch;
};
