<script setup lang="ts">
import type { BuffonNeedleArgs, ToolArgs } from '@/api/ai/aiType';
import BuffonNeedleDisplay from '@/components/experiment/chapter1/buffon-needle/BuffonNeedleDisplay.vue';
import { Label } from '@/components/ui/label';

const props = defineProps<{
  name: string
  args: ToolArgs
}>();

console.log(props.args);
</script>

<template>
  <div class="w-full h-64 border rounded-xl overflow-hidden bg-background hover:border-primary transition-all">
    <BuffonNeedleDisplay v-if="name === 'buffon_needle'" :args="args as BuffonNeedleArgs" />
    <div v-else class="w-full h-full p-4 flex flex-col gap-2">
      <Label> Unknown experiment: {{ name }}</Label>
      <Label>{{ args }}</Label>
    </div>
  </div>
</template>

<style scoped>

</style>
