/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { VueClassComponent } from "../../src";
import { Vue } from "../../src";

import { describe, expect, it } from "vitest";
import { Component } from "../../src";

describe("Component():", () => {
    describe("render():", () => {
        it("A default render function is created",  () => {
            @Component
            class SimpleComponentClass extends Vue {}

            const SimpleComponentClassVue = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>);
            expect(SimpleComponentClassVue.__vccOpts).not.toBeUndefined();
            expect(SimpleComponentClassVue.__vccOpts.render).not.toBeUndefined();
        });

        it("the render function calls the render hook on the instance",  () => {
            @Component
            class SimpleComponentClass extends Vue {
                public render() {
                    return "TEST";
                }
            }

            const SimpleComponentClassVue = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>);
            expect(SimpleComponentClassVue.__vccOpts.render!(new SimpleComponentClass()))
                .toEqual(new SimpleComponentClass().render());
        });

        it("the render function calls parent class render function",  () => {
            const compareValue = "TEST";

            @Component
            class SimpleBaseComponentClass extends Vue {}
            (SimpleBaseComponentClass as VueClassComponent<SimpleBaseComponentClass>)
                .__vccOpts
                .render = function dummyRender() { return compareValue; }
            ;

            @Component
            class SimpleComponentClass extends SimpleBaseComponentClass {}

            const SimpleComponentClassVue = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>);
            expect(SimpleComponentClassVue.__vccOpts.render!(new SimpleComponentClass()))
                .toEqual(compareValue);
        });

        it("the parent render function avoids loop looking for it's parent", () => {
            const compareValue = "TEST render";

            @Component
            class SimpleBaseComponentClass extends Vue {}
            (SimpleBaseComponentClass as VueClassComponent<SimpleBaseComponentClass>)
                .__vccOpts
                .render = function dummyRender() { return compareValue; }
            ;

            @Component
            class IntermediateChildClass extends SimpleBaseComponentClass { }

            @Component
            class AnotherChildClass extends IntermediateChildClass { }

            @Component
            class SimpleComponentClass extends AnotherChildClass {}

            expect(new SimpleComponentClass().render).toBeUndefined();

            const SimpleComponentClassVue = (SimpleComponentClass as VueClassComponent<SimpleComponentClass>);
            expect(SimpleComponentClassVue.__vccOpts.render!(new SimpleComponentClass()))
                .toEqual(compareValue);
        });
    });
});
