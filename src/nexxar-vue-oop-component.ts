/**
 * Need to export type "Vue", "ComponentOptions", PropOptions for compatibility of property-decorator
 *
 * // ComponentOptions<Vue>
 * // Constructor in types/options
 */
import { Component } from "./decorator/component-decorator";
export default Component; // for compatibility with original vue-class-component
export { Component };

export * from "./vue";
export * from "./mixins";
// export * from "./types";
export * from "./decorator/IComponentBuilder";
export * from "./decorator/decorator";
export * from "./decorator/component-decorator-types";
export {
    isInternalHookName,
    isNotInternalHookName,
    $internalHookNames,
    $lifeCycleHookNames,
} from "./decorator/life-cycle-hooks";
