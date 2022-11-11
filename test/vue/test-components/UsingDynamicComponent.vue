<template>
    <component :is="dynamicComponent" message="Hello world" />
</template>

<script lang="ts">
import { Component, Vue } from "../../../src";
import MessageTextAsDecoratedClass from "./MessageTextAsDecoratedClass.vue";

@Component
export default class UsingDynamicComponent extends Vue {
    public dynamicComponent = MessageTextAsDecoratedClass;
}
</script>
