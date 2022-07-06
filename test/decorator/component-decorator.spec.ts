/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentOptionsWithObjectProps, SetupContext } from "vue";
import type { VueClassComponent } from "../../src";
import { Vue } from "../../src";

import { describe, expect, it, vi } from "vitest";
import MessageTextAsDecoratedClass from ".//../vue/test-components/MessageTextAsDecoratedClass.vue";
import { mount } from "@vue/test-utils";
import { Component } from "../../src";

describe("Component():", () => {
    it("prepares a simple class as Vue component", async () => {

        @Component({
            props: ["message"],
        })
        class SimpleComponentClass extends Vue {
            public message = "";
        }

        const vccOptions = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>).__vccOpts;
        expect(vccOptions).not.toBeUndefined();
        expect(vccOptions.setup).not.toBeUndefined();
        expect(vccOptions.setup).toBeTypeOf("function");
        expect(vccOptions.props).toBeTypeOf("object");
        expect(vccOptions.props.message).toEqual({});

        const instance = vccOptions.setup!({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass;
        expect(instance.message).toEqual("Hello World!");
    });

    it("decorator returns component class", async () => {
        class SimpleComponentClass extends Vue {
            public message = "";
        }

        // call decorator manually
        const DecoratedClass = Component({
            props: ["message"],
        })(SimpleComponentClass);

        expect(DecoratedClass).not.toBeUndefined();
        expect(DecoratedClass).toBeTypeOf("function");

        const vccOptions = DecoratedClass.__vccOpts;
        expect(vccOptions?.setup).toBeTypeOf("function");
        expect(vccOptions.props).toBeTypeOf("object");
    });

    it("SFC exported, decorated class component provides properties", async () => {
        const ClassComponent = (MessageTextAsDecoratedClass as unknown as VueClassComponent["__vccOpts"]);
        expect(ClassComponent.render).not.toBeUndefined();
        expect(ClassComponent.render).toBeTypeOf("function");

        expect(ClassComponent.props).toBeTypeOf("object");
        expect(ClassComponent.props.message).toBeTypeOf("object");
        expect(ClassComponent.props.message).toEqual({});

        const instance = ClassComponent
            .setup!({ message: "Hello World!"}, {} as SetupContext) as MessageTextAsDecoratedClass;

        expect(instance).toBeTypeOf("object");
        expect(instance.message).toEqual("Hello World!");
    });

    it("renders a simple class as Vue component", async () => {
        const ClassComponent = (MessageTextAsDecoratedClass as unknown as VueClassComponent<Vue>["__vccOpts"]);
        const wrapper = mount(
            ClassComponent as ComponentOptionsWithObjectProps<MessageTextAsDecoratedClass>,
            {
                props: {
                    message: "Hello World",
                },
            },
        );

        expect(wrapper.html()).to.contain("Hello World");
    });
});
