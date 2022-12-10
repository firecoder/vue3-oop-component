/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { VueClassComponent } from "../../src";
import { Vue } from "../../src";

import { describe, expect, it } from "vitest";
import { Component } from "../../src";
import { getComputedValuesDefinitionFromComponentPrototype } from "../../src/decorator/component-decorator-factory";

describe("decorator:", () => {
    it("Detect computed property from getter",  () => {
        class ComponentWithGetter extends Vue {
            public get message(): string {
                return "Hello world";
            }
        }

        const computed = getComputedValuesDefinitionFromComponentPrototype(ComponentWithGetter);
        expect(computed).not.toBeUndefined();
        expect(computed).not.to.be.empty;
        expect(Object.keys(computed || {})).to.contain("message");
    });
});

describe("Component():", () => {
    describe("computed():", () => {
        it("Detect computed property from getter",  () => {
            @Component
            class ComponentWithGetter extends Vue {
                public get message(): string {
                    return "Hello world";
                }
            }

            const options = (ComponentWithGetter as VueClassComponent<ComponentWithGetter>)
                .__vccOpts.__component_decorator_original_options;
            expect(options).not.toBeUndefined();
            expect(options.computed).not.toBeUndefined();
            expect(Object.keys(options.computed || {})).to.contain("message");
        });
    });
});
