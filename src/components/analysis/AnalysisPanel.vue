<script setup lang="ts">
import type { Analysis } from '@/api/do-question/doQuestion.ts';

import { onMounted, ref } from 'vue';
import { analysisApi } from '@/api/do-question/doQuestion.ts';
import TestPanel from '@/components/analysis/TestPanel.vue';

const data = ref<Analysis | null>(null);

async function loadAnalysisData() {
  try {
    const response = await analysisApi();
    data.value = response;
    console.log(response);
  }
  catch (error) {
    console.error('Error during analysis analysis:', error);
  }
}

onMounted(() => {
  loadAnalysisData();
});
</script>

<template>
  <TestPanel v-if="data" :data="data" />
</template>
