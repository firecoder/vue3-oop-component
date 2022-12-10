/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ComponentOptionsWithObjectProps, SetupContext } from "vue";
import type { VueClassComponent } from "../../src";
import { Vue } from "../../src";

import { describe, expect, it } from "vitest";
import MessageTextAsDecoratedClass from ".//../vue/test-components/MessageTextAsDecoratedClass.vue";
import { mount } from "@vue/test-utils";
import { Component } from "../../src";

describe("Component():", () => {
    it("prepares a simple class as Vue component",  () => {

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

        const instance = vccOptions.setup !== undefined ?
            vccOptions.setup({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass :
            undefined
        ;
        expect(instance?.message).toEqual("Hello World!");
    });

    it("decorator returns component class",  () => {
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

    it("SFC exported, decorated class component provides properties",  () => {
        const ClassComponent = (MessageTextAsDecoratedClass as unknown as VueClassComponent);
        expect(ClassComponent.__vccOpts.render).not.toBeUndefined();
        expect(ClassComponent.__vccOpts.render).toBeTypeOf("function");

        expect(ClassComponent.__vccOpts.props).toBeTypeOf("object");
        expect(ClassComponent.__vccOpts.props.message).toBeTypeOf("object");
        expect(ClassComponent.__vccOpts.props.message).toEqual({});

        const instance = ClassComponent.__vccOpts.setup ?
            ClassComponent.__vccOpts.setup(
                { message: "Hello World!"},
                {} as SetupContext,
            ) as MessageTextAsDecoratedClass : undefined
        ;

        expect(instance).toBeTypeOf("object");
        expect(instance?.message).toEqual("Hello World!");
    });

    it("renders a simple class as Vue component",  () => {
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

    describe("setup()",  () => {
        it("returned render context does not contain '$' or '_' prefixed properties",  () => {

            @Component({
                props: ["message"],
            })
            class SimpleComponentClass extends Vue {
                public message = "";
                public printMessage() {
                    return this.message;
                }
                public $func() {
                    return "ignore this";
                }
            }

            const vccOptions = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>).__vccOpts;
            const instance = vccOptions.setup ?
                vccOptions.setup({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass :
                undefined
            ;

            expect(Object.getOwnPropertyNames(instance)).to.not.contain("$func");
            expect(instance).toHaveProperty("$func");
        });

        it("hidden property of instance - prefixed with '$' or '_' - is still accessible",  () => {
            @Component({
                props: ["message"],
            })
            class SimpleComponentClass extends Vue {
                public message = "";
                public $func() {
                    return "ignore this";
                }
            }

            const vccOptions = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>).__vccOpts;
            const instance = vccOptions.setup ?
                vccOptions.setup({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass :
                undefined
            ;
            expect(instance?.$func).toBeTypeOf("function");
        });

        it("new property of instance is visible with 'in' operator",  () => {
            @Component({
                props: ["message"],
            })
            class SimpleComponentClass extends Vue {
                public message = "";
                public $func() {
                    return "ignore this";
                }
            }

            const vccOptions = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>).__vccOpts;
            const instance = vccOptions.setup ?
                vccOptions.setup({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass :
                undefined
            ;

            expect(instance).not.to.be.undefined;
            if (instance !== undefined) {
                expect(Object.hasOwn(instance, "newProp")).toBeFalsy();

                // define new property
                instance.newProp = "Level 42";
                expect(Object.hasOwn(instance, "newProp")).toBeTruthy();
                expect("newProp" in instance).toBeTruthy();
            }
        });

        it("returned methods have `this` context bound",  () => {
            @Component({
                props: ["message"],
            })
            class SimpleComponentClass extends Vue {
                public message = "TEST";
                public testFunc() {
                    return this.message;
                }
            }

            const vccOptions = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>).__vccOpts;
            const instance = vccOptions.setup ?
                vccOptions.setup({ message: "Hello World!"}, {} as SetupContext) as SimpleComponentClass :
                undefined
            ;
            expect(instance?.testFunc).toBeTypeOf("function");
            expect(instance?.testFunc.call(undefined)).toEqual("Hello World!");
        });
    });
});
