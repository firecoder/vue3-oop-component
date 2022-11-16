import { describe, expect, it } from "vitest";
import { getAllInheritedPropertiesFromPrototypeChain } from "../../src/utilities/traverse-prototype";


describe("getAllInheritedPropertiesFromPrototypeChain", () => {
    it("getting properties of class ignores constructor", () => {
        class TestClass {
            public testFunction() {
                return 42;
            }
        }

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestClass);
        const allPropertyKeys = Object.getOwnPropertyNames(allProperties);

        expect(allPropertyKeys).not.toContain("constructor");
        expect(allPropertyKeys).toContain("testFunction");
    });

    it("getting properties of instance's class but ignore instance properties", () => {
        class TestClass {
            public message = "Hello World";
            public testFunction() {
                return 42;
            }
        }

        const instance = new TestClass();
        const allProperties = getAllInheritedPropertiesFromPrototypeChain(instance);
        const allPropertyKeys = Object.getOwnPropertyNames(allProperties);

        expect(allPropertyKeys).not.toContain("constructor");
        expect(allPropertyKeys).not.toContain("message");
        expect(allPropertyKeys).toContain("testFunction");
        expect(allPropertyKeys.length).toEqual(1);
    });

    it("get ALL properties of single class", () => {
        const TestSymbol = Symbol("TEST_SYM");

        class TestClass {
            public [TestSymbol]() {
                return 42;
            }

            public testFunction() {
                return this._protectedTestFunc();
            }

            private _protectedTestFunc() {
                return this._privateTestFunction();
            }

            private _privateTestFunction() {
                return "test";
            }
        }

        (TestClass.prototype as unknown as { someProp: string }).someProp = "some property";

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestClass);
        const allPropertyKeys = ([] as PropertyKey[])
            .concat(Object.getOwnPropertyNames(allProperties))
            .concat(Object.getOwnPropertySymbols(allProperties))
        ;

        expect(allPropertyKeys.length).toEqual(5);
        expect(allPropertyKeys).toContain("someProp");
        expect(allPropertyKeys).toContain("testFunction");
        expect(allPropertyKeys).toContain("_protectedTestFunc");
        expect(allPropertyKeys).toContain("_privateTestFunction");
        expect(allPropertyKeys).toContain(TestSymbol);

        expect(allProperties.someProp.value).toEqual((TestClass.prototype as unknown as { someProp: unknown}).someProp);
        expect(allProperties[TestSymbol].value).toBeTypeOf("function");

        expect(allProperties.testFunction).not.toBeUndefined();
        expect(allProperties.testFunction.value).not.toBeUndefined();
        expect(allProperties.testFunction.value).toBeTypeOf("function");
    });

    it("get inherited properties, too", () => {
        class BaseClass {
            public superBase() {
                return 42;
            }
        }
        class TestBaseClass extends BaseClass {
            public testParentFunction() {
                return "parent test";
            }
        }
        class TestChildClass extends TestBaseClass {
            public testChildFunction() {
                return "child test";
            }
        }

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestChildClass);
        const allPropertyNames = Object.getOwnPropertyNames(allProperties);

        expect(allPropertyNames.length).toEqual(3);
        expect(allPropertyNames).toContain("testChildFunction");
        expect(allPropertyNames).toContain("testParentFunction");
        expect(allPropertyNames).toContain("superBase");
    });

    it("property on parent's prototype is in the list of all properties", () => {
        class BaseClass { }
        (BaseClass.prototype as unknown as { testProp: string}).testProp = "Level 42";

        class TestBaseClass extends BaseClass {
            public testParentFunction2() {
                return "parent test";
            }
        }
        class TestChildClass extends TestBaseClass {
            public testChildFunction2() {
                return "child test";
            }
        }

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestChildClass);
        const allPropertyKeys = Object.getOwnPropertyNames(allProperties);
        expect(allPropertyKeys).toContain("testProp");
    });

    it("getters are detected and added to the list", () => {
        class TestClassWithGetter {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            public get someProp(): string {
                return "Level 42";
            }
        }

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestClassWithGetter);
        const allPropertyKeys = Object.getOwnPropertyNames(allProperties);
        expect(allPropertyKeys).toContain("someProp");
    });

    it("getter - defined on prototype - is detected and added to the list", () => {
        class TestClassWithGetter { }

        Object.defineProperty(TestClassWithGetter.prototype, "someProp", {
            get() {
                return "Level 42";
            },
            enumerable: true,
            configurable: true,
        });

        const allProperties = getAllInheritedPropertiesFromPrototypeChain(TestClassWithGetter);
        const allPropertyKeys = Object.getOwnPropertyNames(allProperties);
        expect(allPropertyKeys).toContain("someProp");
    });
});
