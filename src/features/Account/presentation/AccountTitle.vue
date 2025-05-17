<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <h1 class="border bg-sky-500">{{ title }}</h1>
</template>

<style scoped></style>
