import type { VueClass } from "./vue";
import type { VueLegacyRenderFunctions } from "./legacy-render-functions";

export * from "./basic-types";
export * from "./composition-api";
export * from "./legacy-component-options";
export * from "./legacy-render-functions";
export * from "./vue";

/**
 * Makes legacy render functions visible to child classes.
 *
 * @param componentClass
 * @constructor
 */
export function MixinCustomRender<A>(componentClass: VueClass<A>): VueClass<A> & VueLegacyRenderFunctions {
    return componentClass as VueClass<A> & VueLegacyRenderFunctions;
}
