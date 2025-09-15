<script setup lang="ts">
import { toMarkdown } from '@/utils/markdown.ts';

defineProps<{
  text: string;
}>();

function processText(text: string): string {
  text = text.replace(/\\\[(.+?)\\\]/gs, '\n$$$$\n$1\n$$$$\n');
  text = text.replace(/\\\((.+?)\\\)/gs, '$$$1$');
  return text;
}
</script>

<template>
  <div class="prose text-foreground max-w-full" v-html="toMarkdown(processText(text))" />
</template>

<style scoped>

</style>
