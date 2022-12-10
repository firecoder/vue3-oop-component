import type { ComponentInternalInstance, SetupContext } from "vue";
import type { Vue, VueClassComponent } from "../src";
import { expect } from "vitest";

export function createComponentInstance<V extends Vue>(
    component: V,
    props?: ComponentInternalInstance["props"],
    context?: SetupContext,
) {
    const setupFunction = (component as VueClassComponent).__vccOpts.setup;
    expect(setupFunction).not.to.be.undefined;

    if (setupFunction) {
        return setupFunction(props || {}, context || { } as SetupContext);
    }
}
