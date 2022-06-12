import { describe, expect, it } from "vitest";
import { getAllBaseClasses } from "../../src/utilities/traverse-prototype";


describe("getAllBaseClasses(): Test collecting base classes", () => {
    it("Collect base class tree", () => {
        class BaseClass1 { }
        class BaseClass2 extends BaseClass1 { }
        class BaseClass3 extends BaseClass2 { }
        class BaseClass4 extends BaseClass3 { }
        class TestClass extends BaseClass4 { }


        const collectedFunctions = getAllBaseClasses(TestClass);
        expect(collectedFunctions.length).toEqual(4);
        expect(collectedFunctions[0] as unknown === BaseClass1).toEqual(true);
    });
});
