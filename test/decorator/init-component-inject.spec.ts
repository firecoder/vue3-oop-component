/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ObjectInjectOptions, Vue } from "../../src/vue";
import { afterEach, describe, expect, it } from "vitest";
import * as sinon from "sinon";

import { ComponentBuilderImpl } from "../../src/decorator/ComponentBuilderImpl";
import { CompositionApi } from "../../src/vue/composition-api";


afterEach(() => {
    sinon.restore();
});

describe("applyInjectsOnInstance(): Inject data into instance by Name", () => {
    it("Inject single named value into the instance", () => {
        const propsToInject = ["testData1"];
        const propValuesInjected = ["Hello test data 1"];

        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs(propsToInject[0])
            .returns(propValuesInjected[0])
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propsToInject);

        mockedInject.verify();
        expect(instance[propsToInject[0]]).toEqual(propValuesInjected[0]);
    });

    it("Inject multiple named values into the instance", () => {
        const propsToInject = ["testData1", "testData2", "testData3", "testData4"];
        const propValuesInjected = ["Hello test data 1", 42, { someProp: "test" }, [false, true]];

        // stub the function. Mocks just support a single call to the stubbed function. Hence, "stub" must be used.
        const stubbedInject = sinon.stub(CompositionApi, "inject");
        propsToInject.forEach((propName, index) =>
            // @ts-ignore
            stubbedInject.withArgs(propName).returns(propValuesInjected[index]),
        );

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propsToInject);
        stubbedInject.restore();

        // check the calls
        const allCalls = stubbedInject.getCalls();
        for (let i = 0; i < propsToInject.length; i++) {
            const propName = propsToInject[i];

            // @ts-ignore
            expect(stubbedInject.withArgs(propsToInject[i]).callCount).toEqual(1);

            expect(allCalls[i].args.length).toEqual(1);
            expect(allCalls[i].firstArg).toEqual(propName);
            expect(allCalls[i].args[1]).undefined;
            expect(allCalls[i].args[2]).undefined;

            expect(instance[propName]).toEqual(propValuesInjected[i]);
        }
    });

    it("Inject property with default value", () => {
        const propToInject = {
            testProp: {
                default: "Hello World!",
            },
        };

        // stub the function. Mocks just support a single call to the stubbed function. Hence, "stub" must be used.
        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs("testProp", propToInject.testProp.default)
            .returns(propToInject.testProp.default)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);

        mockedInject.verify();
        expect(instance["testProp"]).toEqual(propToInject.testProp.default);
    });

    it("Inject property with different 'from' key", () => {
        const provideValue = "what else?";
        const propToInject = {
            testProp: {
                from: "otherProp",
            },
        };

        // stub the function. Mocks just support a single call to the stubbed function. Hence, "stub" must be used.
        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs("otherProp", undefined)
            .returns(provideValue)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);

        mockedInject.verify();
        expect(instance["testProp"]).toEqual(provideValue);
    });

    it("Inject property with different source name", () => {
        const provideValue = "what else?";
        const propToInject = {
            prop: "other",
        };

        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs(propToInject.prop, undefined)
            .returns(provideValue)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);
        mockedInject.verify();

        expect(instance["prop"]).toEqual(provideValue);
    });

    it("Inject property with default value from factory function", () => {
        const provideValue = "what else?";
        const propToInject = {
            testProp: {
                default: () => provideValue,
            },
        };

        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs("testProp", propToInject.testProp.default, true)
            .returns(provideValue)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);

        mockedInject.verify();
        expect(instance["testProp"]).toEqual(provideValue);
    });

    it("Inject property with symbol name", () => {
        const provideValue = "what else?";
        const property = Symbol("prop");
        const propToInject: ObjectInjectOptions = { };
        propToInject[property] = property;

        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs(property, undefined)
            .returns(provideValue)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);

        mockedInject.verify();
        expect(instance[property]).toEqual(provideValue);
    });

    it("Inject property with symbol index but string source name", () => {
        const provideValue = "what else?";
        const property = Symbol("prop");
        const propToInject: ObjectInjectOptions = { };
        propToInject[property] = "other";

        const mockedApi = sinon.mock(CompositionApi);
        const mockedInject = mockedApi.expects("inject");
        mockedInject
            .once()
            .withArgs("other", undefined)
            .returns(provideValue)
        ;

        const instance = {} as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.injectData(propToInject);

        mockedInject.verify();
        expect(instance[property]).toEqual(provideValue);
    });
});
