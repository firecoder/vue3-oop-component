/**
 * Exports composition API functions as part of an object, which enables mocking and testing.
 */

import {
    computed,
    getCurrentInstance,
    inject,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onErrorCaptured,
    onServerPrefetch,
    onUnmounted,
    onUpdated,
    provide,
    ref,
    warn,
    watch,
} from "vue";

/**
 * This redirection object is used for better testability of the component decorator.
 */
export const CompositionApi = {
    computed,
    getCurrentInstance,
    inject,
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onErrorCaptured,
    onServerPrefetch,
    onUnmounted,
    onUpdated,
    provide,
    ref,
    warn,
    watch,
};
