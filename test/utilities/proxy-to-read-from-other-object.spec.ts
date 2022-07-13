/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, it } from "vitest";
import { createProxyRedirectReads } from "../../src/utilities/properties";


describe("createProxyRedirectReads():", () => {
    it("Read missing property from other object", () => {
        const writeTarget = {};
        const readTarget = { test1: "test1" };
        const proxy = createProxyRedirectReads(writeTarget, readTarget);
        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("test1");
    });

    it("Ignore other object if property exists in target", () => {
        const writeTarget = { test1: "expected value" };
        const readTarget = { test1: "alternative" };
        const proxy = createProxyRedirectReads(writeTarget, readTarget);
        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("expected value");
    });

    it("Write new proxy to target only", () => {
        const writeTarget = { test1: "expected value" };
        const readTarget = { test1: "alternative" };
        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        proxy.newProp = "new property";

        expect((writeTarget as typeof proxy).newProp).not.toBeUndefined();
        expect((writeTarget as typeof proxy).newProp).toBeTypeOf("string");
        expect((writeTarget as typeof proxy).newProp).toEqual("new property");

        expect((readTarget as typeof proxy).newProp).toBeUndefined();
    });

    it("Define a new property in target only", () => {
        const writeTarget = { test1: "expected value" } as Record<string, unknown>;
        const readTarget = { test1: "alternative" } as Record<string, unknown>;
        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        Object.defineProperty(proxy, "newProp", { value: "new property" });

        expect(writeTarget.newProp).not.toBeUndefined();
        expect(writeTarget.newProp).toBeTypeOf("string");
        expect(writeTarget.newProp).toEqual("new property");

        expect(readTarget.newProp).toBeUndefined();
    });

    it("Ignore other object if property is newly created in target", () => {
        const writeTarget = { } as Record<string, unknown>;
        const readTarget = { test1: "alternative" };

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("alternative");

        writeTarget.test1 = "expected value";

        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("expected value");
    });

    it("Ignore other object if property is created via proxy in target", () => {
        const writeTarget = { } as Record<string, unknown>;
        const readTarget = { test1: "alternative" };

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("alternative");

        proxy.test1 = "expected value";

        expect(proxy.test1).not.toBeUndefined();
        expect(proxy.test1).toBeTypeOf("string");
        expect(proxy.test1).toEqual("expected value");
    });

    it("Delete a proxy in the target", () => {
        const writeTarget = { propToDelete: 42 } as Record<string, unknown>;
        const readTarget = { test1: "alternative" } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        expect(proxy.propToDelete).not.toBeUndefined();
        expect(proxy.propToDelete).toBeTypeOf("number");
        expect(proxy.propToDelete).toEqual(42);

        delete proxy.propToDelete;
        expect(proxy.propToDelete).toBeUndefined();
    });

    it("Delete a proxy in the target but not in read alternative", () => {
        const writeTarget = { propToDelete: 43 } as Record<string, unknown>;
        const readTarget = { propToDelete: 42 } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        expect(proxy.propToDelete).not.toBeUndefined();
        expect(proxy.propToDelete).toBeTypeOf("number");
        expect(proxy.propToDelete).toEqual(43);

        delete proxy.propToDelete;
        expect(writeTarget.propToDelete).toBeUndefined();
        expect(proxy.propToDelete).toBeUndefined();

        expect(readTarget.propToDelete).not.toBeUndefined();
        expect(readTarget.propToDelete).toBeTypeOf("number");
        expect(readTarget.propToDelete).toEqual(42);
    });

    it("Enumerate properties", () => {
        const writeTarget = { prop1: 43 } as Record<string, unknown>;
        const readTarget = { prop2: 42 } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        const props = Object.getOwnPropertyNames(proxy);
        expect(props).not.toBeUndefined();
        expect(props.length).toEqual(2);
        expect(props).toContain("prop1");
        expect(props).toContain("prop2");
    });

    it("Enumerate properties but ignore deleted", () => {
        const writeTarget = { prop1: 43 } as Record<string, unknown>;
        const readTarget = { prop2: 42, propToDelete: 42 } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        let props = Object.getOwnPropertyNames(proxy);
        expect(props).not.toBeUndefined();
        expect(props.length).toEqual(3);
        expect(props).toContain("prop1");
        expect(props).toContain("prop2");
        expect(props).toContain("propToDelete");

        delete proxy.propToDelete;

        props = Object.getOwnPropertyNames(proxy);
        expect(props.length).toEqual(2);
        expect(props).not.toContain("propToDelete");
    });

    it("Enumerate properties but ignore deleted from target", () => {
        const writeTarget = { prop1: 43, propToDelete: "delete me" } as Record<string, unknown>;
        const readTarget = { prop2: 42 } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        let props = Object.getOwnPropertyNames(proxy);
        expect(props.length).toEqual(3);
        expect(props).toContain("propToDelete");

        delete writeTarget.propToDelete;

        props = Object.getOwnPropertyNames(proxy);
        expect(props.length).toEqual(2);
        expect(props).not.toContain("propToDelete");
    });

    it("Check hasOwn() properties but ignore deleted", () => {
        const writeTarget = { prop1: 43 } as Record<string, unknown>;
        const readTarget = { prop2: 42, propToDelete: 42 } as Record<string, unknown>;

        const proxy = createProxyRedirectReads(writeTarget, readTarget);

        expect(Object.hasOwn(proxy, "propToDelete")).toBeTruthy();
        delete proxy.propToDelete;
        expect(Object.hasOwn(proxy, "propToDelete")).toBeFalsy();
    });
});
