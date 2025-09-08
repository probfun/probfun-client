<script setup lang="ts">
import { toMarkdown } from '@/utils/markdown.ts';

defineProps<{
  text: string;
}>();
</script>

<template>
  <div class="prose text-foreground" v-html="toMarkdown(text)" />
</template>

<style scoped>

</style>
