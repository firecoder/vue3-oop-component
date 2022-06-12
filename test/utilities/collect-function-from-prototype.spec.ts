import { describe, expect, it } from "vitest";
import { collectStaticFunctionFromPrototypeChain } from "../../src/utilities/traverse-prototype";


describe("collectFunctionFromPrototypeChain(): Test collecting functions from prototype chain", () => {
    it("Collect static function", () => {
        class TestClass {
            static testFunction() {
                return "test";
            }
        }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(1);
        expect(collectedFunctions[0]()).toEqual("test");
    });

    it("Non-static function is ignored", () => {
        class TestClass {
            public testFunction() {
                return "test";
            }
        }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(0);
    });

    it("Non-static function of class tree are ignored", () => {
        class BaseClass1 {
            public testFunction() {
                return "test";
            }
        }
        class BaseClass2 extends BaseClass1 {
            public testFunction() {
                return super.testFunction() + " 1 ";
            }
        }
        class TestClass extends BaseClass2 {
            public testFunction() {
                return super.testFunction() + " 2 ";
            }
        }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(0);
        expect(new BaseClass1().testFunction()).toEqual("test");
        expect(new BaseClass2().testFunction()).toEqual("test 1 ");
        expect(new TestClass().testFunction()).toEqual("test 1  2 ");
    });

    it("Dynamically created functions on the class tree are ignored", () => {
        type ObjWithTestFunc = { testFunction: (() => string) };

        class BaseClass1 { }
        (BaseClass1.prototype as unknown as ObjWithTestFunc).testFunction = function testFunction() {
            return "test";
        };

        class BaseClass2 extends BaseClass1 { }
        (BaseClass2.prototype as unknown as ObjWithTestFunc).testFunction = function testFunction() {
            return (BaseClass1.prototype as unknown as ObjWithTestFunc).testFunction.call(this) + " 1 ";
        };

        class TestClass extends BaseClass2 { }
        (TestClass.prototype as unknown as ObjWithTestFunc).testFunction = function testFunction() {
            return (BaseClass2.prototype as unknown as ObjWithTestFunc).testFunction.call(this) + " 2 ";
        };

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(0);
        expect((new BaseClass1() as ObjWithTestFunc).testFunction()).toEqual("test");
        expect((new BaseClass2() as ObjWithTestFunc).testFunction()).toEqual("test 1 ");
        expect((new TestClass() as ObjWithTestFunc).testFunction()).toEqual("test 1  2 ");
    });

    it("Collect single static function from parent class", () => {
        class BaseClass1 {
            static testFunction() {
                return "test";
            }
        }
        class BaseClass2 extends BaseClass1 { }
        class TestClass extends BaseClass2 { }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(1);
        expect(collectedFunctions[0]()).toEqual("test");
    });

    it("Collect overridden, multiple static function from parent class", () => {
        class BaseClass1 {
            static testFunction() {
                return "test";
            }
        }
        class BaseClass2 extends BaseClass1 {
            static testFunction() {
                return "test2";
            }
        }
        class TestClass extends BaseClass2 { }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(2);
        expect(collectedFunctions[0]()).toEqual("test");
        expect(collectedFunctions[1]()).toEqual("test2");
    });

    it("Collect static function but ignore dynamic from parent class", () => {
        class BaseClass1 {
            public testFunction() {
                return "test";
            }
        }
        class BaseClass2a extends BaseClass1 {
            static testFunction() {
                return "test2";
            }
        }
        class TestClass extends BaseClass2a { }

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(1);
        expect(collectedFunctions[0]()).toEqual("test2");
    });

    it("Collect static function dynamically applied to parent class", () => {
        // this is the way the component decorator is applying a "setup" function to the classes!!

        class BaseClass1 { }
        class BaseClass2a extends BaseClass1 { }
        class TestClass extends BaseClass2a { }

        (BaseClass1 as unknown as Record<string, any>).testFunction = function testFunction() {
            return "test2";
        };

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(1);
        expect(collectedFunctions[0]()).toEqual("test2");
    });

    it("Collect multiple static function dynamically applied to parent class", () => {
        // this is the way the component decorator is applying a "setup" function to the classes!!

        class BaseClass1 { }
        class BaseClass2a extends BaseClass1 { }
        class TestClass extends BaseClass2a { }

        (BaseClass1 as unknown as Record<string, any>).testFunction = function testFunction() {
            return "test1";
        };

        (BaseClass2a as unknown as Record<string, any>).testFunction = function testFunction() {
            return "test2a";
        };

        const collectedFunctions = collectStaticFunctionFromPrototypeChain(TestClass, "testFunction");
        expect(collectedFunctions.length).toEqual(2);
        expect(collectedFunctions[0]()).toEqual("test1");
        expect(collectedFunctions[1]()).toEqual("test2a");
    });
});
