<template>
  <message :message="message"/>
</template>

<script lang="ts">
import { Component, Vue } from "../../../src";
import MessageTextAsDecoratedClass from "./MessageTextAsDecoratedClass.vue";

@Component({
    components: {
        message: MessageTextAsDecoratedClass,
    },
})
export default class WrapperOnMessageForPropTest extends Vue {
    private _message = "Hello Test2";

    public get message(): string | undefined {
        return this._message;
    }

    public setMessage(newMessage?: string): void {
        this._message = newMessage;
    }
}
</script>
