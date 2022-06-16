<script>
import { defineComponent } from "vue";
export default defineComponent({
    props: ["message"],
});
</script>

<template>
  <h1>message: {{ message }}</h1>
</template>
