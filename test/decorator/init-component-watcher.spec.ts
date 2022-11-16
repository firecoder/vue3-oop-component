/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Vue } from "../../src/vue";
import { afterEach, describe, expect, it } from "vitest";
import { ref, watch } from "vue";
import * as sinon from "sinon";

import { ComponentBuilderImpl } from "../../src/decorator/ComponentBuilderImpl";
import { CompositionApi } from "../../src/vue/composition-api";


afterEach(() => {
    sinon.restore();
});


// wait as triggering the effect of reactive properties is async and needs some time.
function WaitForTriggerToTakeEffect(milliseconds?: number): Promise<unknown> {
    milliseconds = typeof milliseconds === "number" && !isNaN(milliseconds) && milliseconds >= 0 ? milliseconds : 5;
    return new Promise((resolve: ((data?: unknown) => void)) => {
        setTimeout(resolve, milliseconds);
    });
}

describe("Vue", () => {
    it("Vue watcher reacts as expected", async () => {
        const watchedProperty = ref("initial value");
        const watcher = sinon.spy();

        watch(() => watchedProperty.value, watcher);
        watchedProperty.value = "new value";

        // wait as triggering the effect of reactive properties is async and needs some time.
        await WaitForTriggerToTakeEffect();

        expect(watcher.callCount).toEqual(1);
        expect(watcher.firstCall.firstArg).toEqual("new value");
        expect(watcher.firstCall.args[1]).toEqual("initial value");
    });
});

describe("watcherForPropertyChange():", () => {
    function createFakeConsoleErrorThrowingError(): (() => void) {
        const origConsoleError = console.error;
        console.error = sinon.fake((...args: unknown[]) => {
            if (args && args.length > 0) {
                for (const arg of args) {
                    if (arg instanceof Error) {
                        throw arg;
                    }
                }
            }
        });

        return () => {
            console.error = origConsoleError;
        };
    }

    it("Watch callback is passed to the Vue register function", () => {
        const mockedApi = sinon.mock(CompositionApi);
        const mockedWatch = mockedApi.expects("watch");
        mockedWatch
            .once()
            .returns(undefined)
        ;

        const builder = new ComponentBuilderImpl({ watchedProp: "initial value" } as Vue);
        builder.watcherForPropertyChange({
            watchedProp: () => undefined,
        });
        builder.build();

        mockedWatch.verify();
        expect(mockedWatch.firstCall.args[1]).toBeTypeOf("function");
    });


    it("Named watch handler function is passed to the Vue register function", () => {
        const memberWatcherCallback = sinon.spy();
        const mockedApi = sinon.mock(CompositionApi);
        const mockedWatch = mockedApi.expects("watch");
        mockedWatch
            .once()
            .returns(undefined)
        ;

        const builder = new ComponentBuilderImpl({ namedWatcher: 42, memberWatcherCallback} as Vue);
        builder.watcherForPropertyChange({
            namedWatcher: "memberWatcherCallback",
        });
        builder.build();

        mockedWatch.verify();
        expect(mockedWatch.firstCall.args[1]).toBeTypeOf("function");
    });


    it("Watch callback is called if value changes", async () => {
        const watcher = {
            watchedProp: sinon.spy(),
        };

        const builder = new ComponentBuilderImpl({ watchedProp: "initial value" } as Vue);
        builder.watcherForPropertyChange(watcher);
        builder.build();
        builder.reactiveWrapper.watchedProp = "new value";

        await WaitForTriggerToTakeEffect();

        expect(watcher.watchedProp.callCount).toEqual(1);
        expect(watcher.watchedProp.firstCall.firstArg).toEqual("new value");
        expect(watcher.watchedProp.firstCall.args[1]).toEqual("initial value");
    });


    it("Watch callback is called with 'this' context set to the reactive instance", async () => {
        const watcher = {
            propToWatch: sinon.spy(),
        };

        const builder = new ComponentBuilderImpl({ propToWatch: "initial value" } as Vue);
        builder.watcherForPropertyChange(watcher);
        builder.build();
        builder.reactiveWrapper.propToWatch = "new value";

        await WaitForTriggerToTakeEffect();

        expect(watcher.propToWatch.firstCall.thisValue).toBe(builder.reactiveWrapper);
    });


    it("Watch with multiple callback functions", async () => {
        const watcher = {
            multiWatchers: [sinon.spy(), sinon.spy(), sinon.spy(), sinon.spy()],
        };

        const builder = new ComponentBuilderImpl({ multiWatchers: 42 } as Vue);
        builder.watcherForPropertyChange(watcher);
        builder.build();

        builder.reactiveWrapper.multiWatchers++;
        await WaitForTriggerToTakeEffect();

        for (let i=0; i < watcher.multiWatchers.length; i++) {
            expect(watcher.multiWatchers[i].callCount).toEqual(1);
            expect(watcher.multiWatchers[i].firstCall.firstArg).toEqual(43);
            expect(watcher.multiWatchers[i].firstCall.args[1]).toEqual(42);
        }
    });


    it("Watch callback is member function of instance", async () => {
        const memberFuncToCall = sinon.spy();
        const watcher = {
            namedWatcher: "memberFuncToCall",
        };

        const builder = new ComponentBuilderImpl({ namedWatcher: 42, memberFuncToCall: memberFuncToCall } as Vue);
        builder.watcherForPropertyChange(watcher);
        builder.build();
        builder.reactiveWrapper.namedWatcher += 2;

        await WaitForTriggerToTakeEffect();

        expect(memberFuncToCall.callCount).toEqual(1);
        expect(memberFuncToCall.firstCall.firstArg).toEqual(44);
        expect(memberFuncToCall.firstCall.args[1]).toEqual(42);
    });


    it("Watch callback member function must not be named after property to watch", async () => {
        const restoreConsoleError = createFakeConsoleErrorThrowingError();
        const builder = new ComponentBuilderImpl({ namedWatcher: 42 } as Vue);
        expect(() => builder.watcherForPropertyChange({
            namedWatcher: "namedWatcher",
        }).build()).toThrowError("Invalid watcher defined");
        restoreConsoleError();
    });


    it("Watch callback member function must exist to be named as watcher", async () => {
        const restoreConsoleError = createFakeConsoleErrorThrowingError();
        const builder = new ComponentBuilderImpl({ namedWatcher: 42 } as Vue);
        expect(() => builder.watcherForPropertyChange({
            namedWatcher: "someUnknownFunc",
        }).build()).toThrowError("Invalid watcher defined");
        restoreConsoleError();
    });


    it("Watch callback is member function of instance, named via options", async () => {
        const namedCallback = sinon.spy();
        const watcherSpec = {
            namedHandler: { handler: "namedCallback" },
        };

        const builder = new ComponentBuilderImpl({ namedHandler: 42, namedCallback } as Vue);
        builder.watcherForPropertyChange(watcherSpec);
        builder.build();
        builder.reactiveWrapper.namedHandler += 2;

        await WaitForTriggerToTakeEffect();

        expect(namedCallback.callCount).toEqual(1);
        expect(namedCallback.firstCall.firstArg).toEqual(44);
        expect(namedCallback.firstCall.args[1]).toEqual(42);
    });


    it("Named watcher callback via options must not be named after property to watch", () => {
        const restoreConsoleError = createFakeConsoleErrorThrowingError();
        const builder = new ComponentBuilderImpl({ namedHandler: 42 } as Vue);
        expect(() => builder.watcherForPropertyChange({
            namedHandler: { handler: "namedHandler" },
        }).build()).toThrowError("Invalid watcher defined");
        restoreConsoleError();
    });


    it("Named watcher callback via options must exist to be named as watcher", () => {
        const restoreConsoleError = createFakeConsoleErrorThrowingError();
        const builder = new ComponentBuilderImpl({ namedHandler: 42 } as Vue);
        expect(() => builder.watcherForPropertyChange({
            namedHandler: { handler: "someUnknownProp" },
        }).build()).toThrowError("Invalid watcher defined");
        restoreConsoleError();
    });


    it("Property to watch does not need to exist when activating the watcher", async () => {
        const watcherCallback = sinon.spy();
        const watcherSpec = {
            notYetExistentProperty: { handler: watcherCallback },
        };

        const builder = new ComponentBuilderImpl({ } as Vue);
        builder.watcherForPropertyChange(watcherSpec);
        builder.build();

        builder.reactiveWrapper.notYetExistentProperty = 44;
        await WaitForTriggerToTakeEffect();

        expect(watcherCallback.callCount).toEqual(1);
        expect(watcherCallback.firstCall.firstArg).toEqual(44);
        expect(watcherCallback.firstCall.args[1]).toEqual(undefined);
    });
});
