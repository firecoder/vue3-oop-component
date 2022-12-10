import { describe, expect, it } from "vitest";
import { Component, Vue } from "../../src";
import { createComponentInstance } from "../utilities";

describe("beforeCreate():", () => {
    it("decorator option function as hook is executed", () => {
        let wasHookExecuted = false;

        @Component({
            beforeCreate() {
                wasHookExecuted = true;
            },
        })
        class ClassWithHook extends Vue {
        }

        createComponentInstance(ClassWithHook);
        expect(wasHookExecuted).toBeTruthy();
    });

    it("static function as hook is executed", () => {
        let wasHookExecuted = false;

        @Component
        class ClassWithHook extends Vue {
            public constructor() {
                super();
            }

            public static beforeCreate?() {
                wasHookExecuted = true;
            }
        }

        createComponentInstance(ClassWithHook);
        expect(wasHookExecuted).toBeTruthy();
    });

    it("runs prior to the creation of the instance", () => {
        let componentInstance: Vue | undefined = undefined;
        let isRunBeforeInstance = false;

        @Component
        class ClassWithHook extends Vue {
            public constructor() {
                super();
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                componentInstance = this;
            }

            public static beforeCreate?() {
                isRunBeforeInstance = componentInstance === undefined;
            }
        }

        createComponentInstance(ClassWithHook);
        expect(isRunBeforeInstance).toBeTruthy();
        expect(componentInstance).not.to.be.undefined;
    });
});
