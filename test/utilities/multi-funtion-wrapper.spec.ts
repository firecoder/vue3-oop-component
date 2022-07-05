import { describe, expect, it, vi } from "vitest";
import { generateMultiFunctionWrapper } from "../../src/utilities/wrappers";

describe("generateMultiFunctionWrapper()", () => {
    it("wrap a single function", () => {
        const baseFunction = vi.fn();
        const wrappedFunction = generateMultiFunctionWrapper(baseFunction);

        const params = ["param1", 42, false];
        wrappedFunction(...params);
        expect(baseFunction).toHaveBeenCalledOnce();
        expect(baseFunction).toHaveBeenCalledWith(...params);
    });

    it("wrap more functions", () => {
        const baseFunctions = [vi.fn(), vi.fn(), vi.fn(), vi.fn(), vi.fn()];
        const wrappedFunction = generateMultiFunctionWrapper(...baseFunctions);

        const params = ["param1", 42, false];
        wrappedFunction(...params);
        baseFunctions.forEach((func) => {
            expect(func).toHaveBeenCalledOnce();
            expect(func).toHaveBeenCalledWith(...params);
        });
    });

    it("deliver return value of first function", () => {
        const baseFunctions = [vi.fn(() => "test"), vi.fn(), vi.fn(), vi.fn(), vi.fn()];
        const wrappedFunction = generateMultiFunctionWrapper(...baseFunctions);

        const params = ["param1", 42, false];
        const result = wrappedFunction(...params);
        baseFunctions.forEach((func) => {
            expect(func).toHaveBeenCalledOnce();
            expect(func).toHaveBeenCalledWith(...params);
        });

        expect(result).toEqual(baseFunctions[0]());
    });

    it("ignore return value of other functions", () => {
        const baseFunctions = [vi.fn(() => "test"), vi.fn(() => "test2"), vi.fn(), vi.fn(), vi.fn()];
        const wrappedFunction = generateMultiFunctionWrapper(...baseFunctions);

        const params = ["param1", 42, false];
        const result = wrappedFunction(...params);
        expect(result).toEqual(baseFunctions[0]());
    });


    it("pass on this context", () => {
        const data = { counter: 0 };
        function testFunc(this: typeof data) {
            this.counter++;
        }

        const baseFunctions = [vi.fn(testFunc), vi.fn(testFunc)];
        const wrappedFunction = generateMultiFunctionWrapper(...baseFunctions);

        wrappedFunction.call(data);
        expect(data.counter).toEqual(2);
    });
});
