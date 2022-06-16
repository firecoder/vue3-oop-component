import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MessageTextAsClass from ".//test-components/MessageTextAsClass.vue";
import MessageTextWithScriptSetup from ".//test-components/MessageTextWithScriptSetup.vue";
import MessageTextWithDefineComponent from ".//test-components/MessageTextWithDefineComponent.vue";

interface ComponentSpec {
    name: string,
    description: string,
    component: typeof MessageTextWithScriptSetup,
}

describe("Components defines with various techniques are possible", () => {
    const components: ComponentSpec[] = [{
        name: "MessageTextAsClass",
        component: MessageTextAsClass,
        description: "Defined as class",
    }, {
        name: "MessageTextWithDefineComponent",
        component: MessageTextWithDefineComponent,
        description: "Defined with defineComponent",
    }, {
        name: "MessageTextWithScriptSetup",
        component: MessageTextWithScriptSetup,
        description: "Defined with Vue 3 Script 'setup'",
    }];

    components
        .forEach((componentSpec) => {

            describe(`${componentSpec.description} (${componentSpec.name})`, () => {
                it("renders", async () => {
                    const wrapper = mount(
                        componentSpec.component,
                        {
                            props: {
                                message: "Hello World",
                            },
                        },
                    );
                    expect(wrapper.html()).to.contain("Hello World");
                });
            });
        })
    ;
});
