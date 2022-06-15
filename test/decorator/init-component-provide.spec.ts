import type { Vue } from "../../src/vue";
import { afterEach, describe, expect, it } from "vitest";
import * as sinon from "sinon";

import { registerProvidedValues } from "../../src/decorator/init-component";
import { CompositionApi } from "../../src/vue/composition-api";


afterEach(() => {
    sinon.restore();
});

describe("registerProvidedValues(): Provide data to child components", () => {
    it("Provide single named value", () => {
        const providing = {
            testData1: "hello test data",
        };

        const mockedApi = sinon.mock(CompositionApi);
        const mockedProvide = mockedApi.expects("provide");
        mockedProvide
            .once()
            .withArgs("testData1", providing.testData1)
            .returns(undefined)
        ;

        registerProvidedValues({} as Vue, providing);
        mockedProvide.verify();
    });

    describe("Provide multiple values", () => {
        const providing: { [index: string | symbol]: unknown } = {
            testData1: "hello test data",
            testData2: "what else",
            dataProvider: () => null,
        };

        providing[Symbol("meaning")] = 42;
        providing[Symbol("something more")] = true;

        const indexes = [
            ...Object.getOwnPropertyNames(providing),
            ...Object.getOwnPropertySymbols(providing),
        ];

        function performTest(registerProvidedValuesFunc: typeof registerProvidedValues) {
            // stub the function. Mocks just support a single call to the stubbed function. Hence, "stub" must be used.
            const stubbedProvide = sinon.stub(CompositionApi, "provide");
            expect(indexes.length).toEqual(5);

            indexes.forEach((propName) =>
                stubbedProvide.withArgs(propName, providing[propName]),
            );

            registerProvidedValuesFunc({} as Vue, providing);

            stubbedProvide.restore();
            const allCalls = stubbedProvide.getCalls();
            for (let i = 0; i < indexes.length; i++) {
                const propName = indexes[i];
                expect(stubbedProvide.withArgs(propName, providing[propName]).callCount).toEqual(1);
                expect(allCalls[i].args.length).toEqual(2);
                expect(allCalls[i].firstArg).toEqual(propName);
                expect(allCalls[i].args[1]).toEqual(providing[propName]);
            }
        }

        it("Provide them as object", () => {
            performTest((instance, providedValuesSpec) =>
                registerProvidedValues(instance, providedValuesSpec),
            );
        });

        it("Provide them as factory function", () => {
            const provideAsFactoryFunc = sinon.stub();

            performTest((instance, providedValuesSpec) => {
                provideAsFactoryFunc.returns(providedValuesSpec);
                registerProvidedValues(instance, provideAsFactoryFunc);
            });

            expect(provideAsFactoryFunc.callCount).toEqual(1);
        });
    });

    it("Providing factory function is called with 'this' set to instance", () => {
        const provideAsFactoryFunc = sinon.stub();
        provideAsFactoryFunc.returns({
            testData1: "hello test data",
        });

        const mockedApi = sinon.mock(CompositionApi);
        const mockedProvide = mockedApi.expects("provide");
        mockedProvide
            .once()
            .returns(undefined)
        ;

        const instance = {} as Vue;
        registerProvidedValues(instance, provideAsFactoryFunc);
        expect(provideAsFactoryFunc.firstCall.thisValue).toBe(instance);
    });
});
