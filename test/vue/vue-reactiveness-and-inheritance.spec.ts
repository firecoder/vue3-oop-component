import { describe, expect, it } from "vitest";
import { reactive, isReactive } from "vue";

describe("Vue:", () => {
    it("Reactive instance with parent class is reactive calling super()",() => {
        class ParentClass {
            public overwriteFuncFromParent(test: (parentClazz: ParentClass) => void) {
                test(this);
                return this.baseProp;
            }

            baseProp = "test";
        }

        class ChildClass extends ParentClass {
            overwriteFuncFromParent(test: (parentClazz: ParentClass) => void): string {
                return super.overwriteFuncFromParent(test);
            }

            getBasePropertyFromParent(test: (parentClazz: ParentClass) => void): string {
                test(this);
                return this.baseProp;
            }
        }

        const rawInstance = new ChildClass();
        const reactiveInstance = reactive(rawInstance);

        reactiveInstance.overwriteFuncFromParent((parent) => {
            expect(isReactive(parent)).toBeTruthy();
        });

        reactiveInstance.getBasePropertyFromParent((parent) => {
            expect(isReactive(parent)).toBeTruthy();
        });
    });
});
