<script setup lang="ts">
import type { GraphEdge } from '@vue-flow/core';
import { cn } from '@/lib/utils';
import { useConfigStore } from '@/store';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { onMounted, watch } from 'vue';

const props = defineProps<{
  id: string
  data: {
    label: string
  }
}>();

const { getConnectedEdges, getEdges } = useVueFlow();
const configStore = useConfigStore();

function updateEdgeStyle() {
  if (configStore.targetNodeId !== props.id) {
    return;
  }
  const connectedEdges = getConnectedEdges(props.id);
  const edges = getEdges.value as unknown as (GraphEdge & { defaultStroke: string })[];
  for (const edge of edges) {
    edge.style = {
      stroke: edge.defaultStroke,
    }
  }
  for (const edge of connectedEdges) {
    edge.style = {
      stroke: 'red',
    }
  }
}

watch(() => configStore.targetNodeId, () => {
  updateEdgeStyle();
})

function onSelect() {
  if (configStore.targetNodeId === props.id) {
    configStore.targetNodeId = null;
  }
  else {
    configStore.targetNodeId = props.id;
  }
}

onMounted(() => {
  updateEdgeStyle();
})
</script>

<template>
  <div :class="cn('border rounded-xl p-3 bg-background transition-all border-primary', configStore.targetNodeId === id && 'border-destructive')" @click="onSelect">
    <div class="text-sm">
      {{ data.label }}
    </div>

    <Handle id="a" type="source" :position="Position.Top" />
    <Handle id="b" type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>

</style>
