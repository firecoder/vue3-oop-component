export * from "vue";
export * from "./vue";

export type { ComputedOptions } from "./vue";
export type { ComponentOptions } from "./decorator/component-decorator-types";

// Vue 3 does not provide any default export anymore
export { Vue as default } from "./vue";
