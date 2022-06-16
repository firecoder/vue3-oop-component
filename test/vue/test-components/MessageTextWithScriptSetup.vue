<script setup>
import { defineProps } from "vue";
defineProps(["message"]);
</script>

<template>
  <h1>message: {{ message }}</h1>
</template>
