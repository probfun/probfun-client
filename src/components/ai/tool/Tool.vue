<script setup lang="ts">
import type { BuffonNeedleArgs, DistributionArgs, ThreeDoorsArgs, ToolArgs } from '@/api/ai/aiType';
import BuffonNeedleDisplay from '@/components/experiment/chapter1/buffon-needle/BuffonNeedleDisplay.vue';
import ThreeDoorsDisplay from '@/components/experiment/chapter1/three-doors/ThreeDoorsDisplay.vue';
import DistributionDiagram from '@/components/experiment/distribution/distribution-diagram/DistributionDiagram.vue';
import { Label } from '@/components/ui/label';

defineProps<{
  name: string
  args: ToolArgs
}>();
</script>

<template>
  <div class="w-full min-h-72 border rounded-xl overflow-hidden bg-background hover:border-primary transition-all">
    <BuffonNeedleDisplay v-if="name === 'buffon_needle'" :args="args as BuffonNeedleArgs" />
    <DistributionDiagram
      v-else-if="name.endsWith('distribution')"
      :args="args as DistributionArgs"
    />
    <ThreeDoorsDisplay v-else-if="name === 'three_doors'" :args="args as ThreeDoorsArgs" />
    <div v-else class="w-full h-full p-4 flex flex-col gap-2">
      <Label> Unknown experiment: {{ name }}</Label>
      <Label>{{ args }}</Label>
    </div>
  </div>
</template>

<style scoped>

</style>
