<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import DistributionCltDiagram from '@/components/experiment/chapter5/distribution-clt/DistributionCltDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Slider } from '@/components/ui/slider'
import { toMarkdown } from '@/utils/markdown.ts';
import { ref, watch } from 'vue';
import { content } from './content';

function f(x: number): number {
  if (x >= 0) {
    return Math.exp(-x);
  }
  else {
    return 0;
  }
}
const n_list = ref<number[]>([2]);
const n = ref(2);
watch(() => n_list, () => {
  n.value = n_list.value[0];
  console.log(n.value);
}, { deep: true });
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <DistributionCltDiagram :args="{ f, dx: 0.1, left: 0, right: 3, n }" />
    </template>
    <template #parameter>
      <div class="p-5">
        <Slider v-model="n_list" :min="1" :max="30" />
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>

</style>
