<template>
  <h1>message: {{ message }}</h1>
</template>

<script lang="ts">
import { Component, Vue } from "../../../src";

@Component({
    props: ["message"],
})
export default class MessageTextAsClass extends Vue {
    public message = "";
}
</script>
