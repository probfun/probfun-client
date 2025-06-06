<script setup lang="ts">
import type { BuffonNeedleArgs, DistributionArgs, ThreeDoorsArgs, ToolArgs } from '@/api/ai/aiType';
import BuffonNeedleDisplay from '@/components/experiment/chapter1/buffon-needle/BuffonNeedleDisplay.vue';
import ThreeDoorsDisplay from '@/components/experiment/chapter1/three-doors/ThreeDoorsDisplay.vue';
import DistributionDiagram from '@/components/experiment/distribution/distribution-diagram/DistributionDiagram.vue';
import { Label } from '@/components/ui/label';
import { useRouter } from 'vue-router'

defineProps<{
  name: string
  args: ToolArgs
}>();

const router = useRouter();

function jumpToExperiment(name: string) {
  const experimentMap: Record<string, string> = {
    buffon_needle: 'buffon-needle',
    three_doors: 'three-doors',
    geometric_distribution: 'geometric-distribution',
    binomial_distribution: 'binomial-distribution',
    poisson_distribution: 'poisson-distribution',
    uniform_distribution: 'uniform-distribution',
    normal_distribution: 'normal-distribution',
    two_d_normal_distribution: '2d-normal-distribution',
    two_d_uniform_distribution: '2d-uniform-distribution',
  };

  const experimentPath = experimentMap[name];
  if (experimentPath) {
    router.push(`/dashboard-prob/experiment/${experimentPath}`);
  }
  else {
    console.error(`No mapping found for experiment name: ${name}`);
  }
}
</script>

<template>
  <div class="flex flex-col">
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

    <Button class="ml-auto" variant="link" @click="jumpToExperiment(name)">
      跳转到对应实验
    </Button>
  </div>
</template>

<style scoped>

</style>
