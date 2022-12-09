import { describe, expect, it } from "vitest";
import { getAllBaseClasses } from "../../src/utilities/traverse-prototype";


describe("getAllBaseClasses(): Test collecting base classes", () => {
    it("Collect base class tree", () => {
        class BaseClass1 { }
        class BaseClass2 extends BaseClass1 { }
        class BaseClass3 extends BaseClass2 { }
        class BaseClass4 extends BaseClass3 { }
        class TestClass extends BaseClass4 { }


        const collectedFunctions = getAllBaseClasses(TestClass, false);
        expect(collectedFunctions.length).toEqual(4);
        expect(collectedFunctions[0] as unknown === BaseClass1).toEqual(true);
    });

    it("Base 'Object' is not part of the collected list", () => {
        class BaseClass1 { }
        class BaseClass2 extends BaseClass1 { }
        class BaseClass3 extends BaseClass2 { }
        class BaseClass4 extends BaseClass3 { }
        class TestClass extends BaseClass4 { }


        const collectedClasses = getAllBaseClasses(TestClass, false);
        for (const clazz of collectedClasses) {
            expect(clazz).not.toBe(Object);
            expect(clazz).not.toBe(Function);
            expect(clazz).not.toBe(null);
        }
    });

    it("Base 'Object' is not part of the collected list even it is the child class", () => {
        class BaseClass1 { }

        const collectedClasses = getAllBaseClasses(BaseClass1, true);
        for (const clazz of collectedClasses) {
            expect(clazz).not.toBe(Object);
            expect(clazz).not.toBe(Function);
            expect(clazz).not.toBe(null);
        }
    });
});
