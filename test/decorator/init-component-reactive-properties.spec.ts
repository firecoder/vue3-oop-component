/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Vue } from "../../src";

import { describe, expect, it } from "vitest";
import { effect } from "vue";
import { ComponentBuilderImpl } from "../../src/decorator/ComponentBuilderImpl";

describe("makeValuePropertiesReactive()", () => {
    it("Change of property triggers reactive event", () => {
        const initialMessage = "Hello World!";
        const changedMessage = "Hello Test!";
        let changeHasBeenTriggered = false;

        const instance = { message: "" } as Vue;
        const builder = new ComponentBuilderImpl(instance);

        // first try without reactive property
        effect(() => instance.message, { onTrigger: () => changeHasBeenTriggered = true } );
        instance.message = initialMessage;
        expect(instance.message).to.eq(initialMessage);
        expect(changeHasBeenTriggered).to.be.false;

        // make reactive and try again
        builder.makeValuePropertiesReactive();
        effect(() => instance.message, { onTrigger: () => changeHasBeenTriggered = true } );
        instance.message = changedMessage;
        expect(instance.message).to.eq(changedMessage);
        expect(changeHasBeenTriggered).to.be.true;
    });

    it("Appending value to array is reactive too", () => {
        let changeHasBeenTriggered = false;

        const instance = { arrayValue: [ Math.random() * 999 ] } as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.makeValuePropertiesReactive();

        effect(() => instance.arrayValue.join(","), { onTrigger: () => changeHasBeenTriggered = true } );

        instance.arrayValue.push(Math.random() * 999);
        expect(changeHasBeenTriggered).to.be.true;
        expect(instance.arrayValue).to.be.length(2);
    });

    it("Replacing array value triggers reactive event", () => {
        let changeHasBeenTriggered = false;

        const instance = { arrayValue: [ Math.random() * 999] } as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.makeValuePropertiesReactive();

        effect(() => instance.arrayValue[0], { onTrigger: () => changeHasBeenTriggered = true } );

        instance.arrayValue[0] = Math.random() * 999;
        expect(changeHasBeenTriggered).to.be.true;
        expect(instance.arrayValue).to.be.length(1);
    });

    it("Values of type object are deep responsive", () => {
        let changeHasBeenTriggered = false;

        const instance = { myData: { counter: 0 } } as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.makeValuePropertiesReactive();

        effect(() => instance.myData.counter, { onTrigger: () => changeHasBeenTriggered = true } );

        instance.myData.counter++;
        expect(changeHasBeenTriggered).to.be.true;
    });

    it("New properties on nested objects do not trigger responsive events", () => {
        let changeHasBeenTriggered = false;

        const instance = { myData: { counter: 0 } } as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.makeValuePropertiesReactive();

        effect(() => instance.myData, { onTrigger: () => changeHasBeenTriggered = true } );

        instance.myData.newProp = Math.random() * 999;
        expect(changeHasBeenTriggered).to.be.false;
    });

    it("New properties on nested objects trigger responsive events if used in advance", () => {
        let changeHasBeenTriggered = false;

        const instance = { myData: { counter: 0 } } as Vue;
        const builder = new ComponentBuilderImpl(instance);
        builder.makeValuePropertiesReactive();

        effect(() => instance.myData.newProp, { onTrigger: () => changeHasBeenTriggered = true } );

        instance.myData.newProp = Math.random() * 999;
        expect(changeHasBeenTriggered).to.be.true;
    });
});
