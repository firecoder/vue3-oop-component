/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, it } from "vitest";
import { getPropertyFromParentClassDefinition } from "../../src/utilities/traverse-prototype";


describe("getPropertyFromParent(): Test collecting property from parent class", () => {
    class BaseClass1 {
        testPropFunc() {
            return "BaseClass1";
        }
    }
    class BaseClass2a extends BaseClass1 {
        testPropFunc() {
            return "BaseClass2a";
        }
    }
    class TestClass extends BaseClass2a {
        testPropFunc() {
            return "TestClass";
        }
    }

    it("Get property from parent class definition", () => {
        const testPropFunc = getPropertyFromParentClassDefinition<(() => string)>(TestClass, "testPropFunc");
        expect(testPropFunc).not.toBeUndefined();
        expect(testPropFunc).toBeTypeOf("function");
        expect(testPropFunc!()).toEqual("BaseClass2a");
    });

    it("Get property from parent of parent class definition", () => {
        const testPropFunc = getPropertyFromParentClassDefinition<(() => string)>(BaseClass2a, "testPropFunc");
        expect(testPropFunc).not.toBeUndefined();
        expect(testPropFunc).toBeTypeOf("function");
        expect(testPropFunc!()).toEqual("BaseClass1");
    });

    it("Call parent function dynamically", () => {
        class DynamicTestClass extends TestClass { }
        DynamicTestClass.prototype.testPropFunc = function testPropFunc() {
            const parentFunc = getPropertyFromParentClassDefinition<(() => string)>(this, "testPropFunc");
            return parentFunc!() + " + DynamicTestClass";
        };

        const instance = new DynamicTestClass();
        const value = instance.testPropFunc();

        expect(value).not.toBeUndefined();
        expect(value).toBeTypeOf("string");
        expect(value).toEqual("TestClass + DynamicTestClass");
    });

    it("Get parent function skipping parent with non-overwritten function", () => {
        class ParentWithoutOverwrittenFun extends TestClass {}

        class DynamicClass extends ParentWithoutOverwrittenFun { }
        DynamicClass.prototype.testPropFunc = function testPropFunc() {
            const parentFunc = getPropertyFromParentClassDefinition<(() => string)>(
                this, "testPropFunc",
            );
            return parentFunc!() + " + DynamicClass";
        };

        const instance = new DynamicClass();
        const value = instance.testPropFunc();

        expect(value).not.toBeUndefined();
        expect(value).toBeTypeOf("string");
        expect(value).toEqual("TestClass + DynamicClass");
    });
});
