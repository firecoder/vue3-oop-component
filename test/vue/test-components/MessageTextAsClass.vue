<template>
  <h1>message: {{ message }}</h1>
</template>

<script lang="ts">
import type { ComponentOptions } from "vue";

export default class MessageTextAsClass {
    public message = "";

    static setup(props: Readonly<Record<string, unknown>>): MessageTextAsClass {
        const instance = new MessageTextAsClass();

        // apply all provided properties
        if (props) {
            Object.getOwnPropertyNames(props)
                .forEach((propName) => Object.defineProperty(instance, propName, {
                    get() {
                        return props[propName];
                    },
                }))
            ;
        }

        return instance;
    }

    // this is the flag that makes the class work with Vue 3.
    static __vccOpts: ComponentOptions = {
        props: ["message"],
        setup: MessageTextAsClass.setup,
        get render() {
            return (MessageTextAsClass as { render: (() => unknown)}).render;
        },
        set render(renderFunc: () => void) {
            (MessageTextAsClass as { render: (() => unknown)}).render = renderFunc;
        },
    };
}
</script>
