/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Vue } from "../../src/vue";

import {computed, reactive, triggerRef} from "vue";
import { afterEach, describe, expect, it } from "vitest";
import * as sinon from "sinon";

import { ComponentBuilderImpl } from "../../src/decorator/ComponentBuilderImpl";
import { CompositionApi } from "../../src/vue/composition-api";


afterEach(() => {
    sinon.restore();
});

describe("registerComputedValues(): Register computed properties", () => {
    it("Use a function as computed property", () => {
        const computedProperties = {
            meaning: () => 42,
        };

        const mockedApi = sinon.mock(CompositionApi);
        const mockedComputed = mockedApi.expects("computed");
        mockedComputed
            .once()
            .returns(computed(computedProperties.meaning))
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.createComputedValues(computedProperties);

        mockedComputed.verify();
        expect(instance["meaning"]).toBeTypeOf("number");
        expect(instance["meaning"]).toEqual(computedProperties.meaning());
    });

    it("Computed property with only a getter function fails when setting a value", () => {
        const computedProperties = {
            failOnSetter: () => "fail on setter",
        };

        const mockedApi = sinon.mock(CompositionApi);
        const mockedComputed = mockedApi.expects("computed");
        mockedComputed
            .once()
            .returns(computed(computedProperties.failOnSetter))
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.createComputedValues(computedProperties);

        mockedComputed.verify();
        expect(instance["failOnSetter"]).toBeTypeOf("string");
        expect(instance["failOnSetter"]).toEqual(computedProperties.failOnSetter());
        expect(() => { instance["failOnSetter"] = "this will fail"; }).toThrowError();
    });

    it("Computed property with getter and setter function", () => {
        const instance = { testValue: "starting" as unknown, test: undefined as unknown };
        const computedProperties = {
            test: {
                get: function (this: typeof instance) {
                    return this.testValue;
                },
                set: function (this: typeof instance, newValue: unknown) {
                    this.testValue = newValue;
                },
            },
        };

        const builder = new ComponentBuilderImpl(instance);
        builder.createComputedValues(computedProperties);
        expect(instance.test).toBeTypeOf("string");
        expect(instance.test).toEqual("starting");

        instance.test = "new Value";
        expect(instance.testValue).toBeTypeOf("string");
        expect(instance.testValue).toEqual(instance.testValue);
        expect(instance["test"]).toEqual("new Value");

        instance["test"] = 934;
        expect(instance.testValue).toBeTypeOf("number");
        expect(instance.testValue).toEqual(934);
    });

    it("Computed property is cached but will change with setter", () => {
        const instance = { rawValue: "starting" as unknown, cachedValue: undefined as unknown };
        const computedProperties = {
            cachedValue: {
                get: function (this: typeof instance) {
                    return this.rawValue;
                },
                set: function (this: typeof instance, newValue: unknown) {
                    this.rawValue = newValue;
                },
            },
        };

        const builder = new ComponentBuilderImpl(instance);
        builder.createComputedValues(computedProperties);
        expect(instance.cachedValue).toBeTypeOf("string");
        expect(instance.cachedValue).toEqual("starting");

        instance.cachedValue = "new Value";
        expect(instance.cachedValue).toEqual("new Value");
    });

    it("Apply multiple computed", () => {
        const helloPrefix = "Hello ";
        const instance: { [key: string]: unknown } = {
            rawValue: "starting" as unknown,
            cachedValue: undefined as unknown,
        };
        const computedProperties = {
            cachedValue: {
                get: function (this: typeof instance) {
                    return this.rawValue;
                },
                set: function (this: typeof instance, newValue: unknown) {
                    this.rawValue = newValue;
                },
            },
            valueWithHello: function (this: typeof instance) { return helloPrefix + this.rawValue; },
            valueWithHelloFromCached: () => helloPrefix + instance.cachedValue,
            valueFromFixedInstance: () => helloPrefix + instance.rawValue,
        };

        const builder = new ComponentBuilderImpl(instance);
        builder.createComputedValues(computedProperties);
        expect(instance.valueWithHello).toEqual(helloPrefix + "starting");
        expect(instance.valueWithHelloFromCached).toEqual(helloPrefix + "starting");
        expect(instance.valueFromFixedInstance).toEqual(helloPrefix + "starting");

        instance.cachedValue = "new Value";
        expect(instance.rawValue).toEqual("new Value");
        expect(instance.valueWithHello).toEqual(helloPrefix + "new Value");
        expect(instance.valueWithHelloFromCached).toEqual(helloPrefix + "new Value");

        // the cache is not invalidated in the computed ref, so the new value is not reflected.
        expect(instance.valueFromFixedInstance).toEqual(helloPrefix + "starting");
    });
});
