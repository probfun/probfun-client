<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';

import { onMounted, ref, watch } from 'vue';

import { useRoute, useRouter } from 'vue-router';

import { fetchDiagramApi } from '@/api/do-question/doQuestion.ts';
import MindmapFlow from '@/components/diagram/question-diagram/MindmapFlow.vue';

const route = useRoute();
const router = useRouter();

const initialEdges = ref<Edge[]>([]);
const initialNodes = ref<Node[]>([]);

async function loadDiagramData() {
  const chapterId = route.params.chapterId as string | undefined;
  try {
    if (!chapterId) {
      router.go(-1);
      return;
    }
    const response = await fetchDiagramApi(chapterId);
    initialEdges.value = response.edges;
    initialNodes.value = response.nodes;
  }
  catch (error) {
    console.error('Error loading diagram data:', error);
    router.go(-1);
  }
}

watch(() => route.params.chapterId, () => {
  loadDiagramData();
});

onMounted(() => {
  loadDiagramData();
});
</script>

<template>
  <div class="rounded-lg border shadow">
    <MindmapFlow v-model:nodes="initialNodes" v-model:edges="initialEdges" initial-rankdir="LR" />
  </div>
</template>
