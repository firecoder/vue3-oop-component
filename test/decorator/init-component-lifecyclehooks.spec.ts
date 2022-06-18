import type { Vue } from "../../src/vue";

import { afterEach, describe, expect, it } from "vitest";
import * as sinon from "sinon";
import { reactive } from "vue";

import { $lifeCycleHookRegisterFunctions } from "../../src/decorator/life-cycle-hooks";
import { registerLifeCycleHooks } from "../../src/decorator/init-component";


afterEach(() => {
    sinon.restore();
});

describe("registerLifeCycleHooks():", () => {
    it("Register a life cycle hook with vue", () => {
        const hooks = {
            activated: () => undefined,
        };

        const registerOnActivated = sinon.spy();
        $lifeCycleHookRegisterFunctions.activated = registerOnActivated;

        const instance = {$: {}} as Vue;
        registerLifeCycleHooks(instance, hooks);
        expect(registerOnActivated.callCount).toEqual(1);
        expect(registerOnActivated.firstCall.firstArg).toBeTypeOf("function");
        expect(registerOnActivated.firstCall.args[1]).toBe(instance.$);
    });

    it("Register a life cycle hook with reactive vue", () => {
        const hooks = {
            activated: sinon.spy(),
        };

        const registerOnActivated = sinon.spy();
        $lifeCycleHookRegisterFunctions.activated = registerOnActivated;

        const instance = reactive({$: {}}) as Vue;
        registerLifeCycleHooks(instance, hooks);
        expect(registerOnActivated.callCount).toEqual(1);
        expect(registerOnActivated.firstCall.firstArg).toBeTypeOf("function");
        expect(registerOnActivated.firstCall.args[1]).toBe(instance.$);

        registerOnActivated.firstCall.firstArg();
        expect(hooks.activated.firstCall.thisValue).toBe(instance);
    });

    it("Life cycle hook is called with 'this' context set to class instance", () => {
        const hooks = {
            activated: sinon.spy(),
        };

        const spyFunc = sinon.spy();
        $lifeCycleHookRegisterFunctions.activated = spyFunc;

        const instance = {$: {}} as Vue;
        registerLifeCycleHooks(instance, hooks);

        spyFunc.firstCall.firstArg();
        expect(hooks.activated.firstCall.thisValue).toBe(instance);
    });
});
