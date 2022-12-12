import { describe, expect, it } from "vitest";
import { Component, Vue } from "../../src";
import { createComponentInstance } from "../utilities";

import WrapperOnMessageForPropTest from "../vue/test-components/WrapperOnMessageForPropTest.vue";

describe("render context proxy:", () => {
    it("'ownKeys' returns unique values for non-SFC classes", () => {
        @Component
        class BaseClass extends Vue {
            public get message(): string {
                return "Hello Test";
            }

            public getFoobar(): string {
                return "foo-bar";
            }
        }

        @Component
        class ChildClass1 extends BaseClass {
            public get message(): string {
                return "Hello Test 1";
            }
        }

        @Component
        class ChildClass2 extends ChildClass1 {
            public get message(): string {
                return "Hello Test 2";
            }

            public getFoobar(): string {
                return super.getFoobar() + " another-foo-bar";
            }
        }

        const renderContext = createComponentInstance(ChildClass2);
        expect(renderContext).not.to.be.undefined;

        const ownProps = Object.getOwnPropertyNames(renderContext);
        expect(ownProps).to.be.lengthOf(4);
        expect(ownProps).to.be.contain("message");
        expect(ownProps).to.be.contain("getFoobar");
        for (const expectedProp of ["message", "getFoobar", "getSetupContext", "setup"]) {
            expect(ownProps).to.be.contain(expectedProp);
        }
    });

    it("'ownKeys' returns unique values for SFC components", () => {

        const renderContext = createComponentInstance(WrapperOnMessageForPropTest);
        expect(renderContext).not.to.be.undefined;

        const ownProps = Object.getOwnPropertyNames(renderContext);
        const uniqueProps = Array.from(new Set(ownProps));
        expect(ownProps).to.be.lengthOf(uniqueProps.length);
        expect(ownProps).to.deep.eq(uniqueProps);
    });
});
