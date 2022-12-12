import type { Vue } from "../../src";

import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import WrapperOnMessageForPropTest from ".//test-components/WrapperOnMessageForPropTest.vue";

describe("Vue:", () => {
    it("Change of property is propagated to nested component",async () => {
        const wrapper = mount(WrapperOnMessageForPropTest as Vue);
        expect(wrapper.html()).to.contain("Hello Test");

        // extract the external component instance from the internal component instance
        const messageWrapperVueInternalComponent = wrapper
            .findComponent(WrapperOnMessageForPropTest)
            .getCurrentComponent()
        ;
        const messageWrapperComponent = (
            messageWrapperVueInternalComponent as unknown as { setupState: WrapperOnMessageForPropTest }
        ).setupState;
        expect(messageWrapperComponent).not.to.be.undefined;

        const testMessage = "Change is propagated!";
        messageWrapperComponent.setMessage(testMessage);

        wrapper.vm.$forceUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).to.contain(testMessage);
    });
});
