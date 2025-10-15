<script setup lang="ts">
import type { EdgeProps } from '@vue-flow/core';
import { BaseEdge, getStraightPath, useVueFlow } from '@vue-flow/core';
import { computed } from 'vue';
import { getIntersection, getNodeCenter } from './floating';

const props = defineProps<EdgeProps>();
const { findNode } = useVueFlow();

const edgeParams = computed(() => {
  const sNode = findNode(props.source!);
  const tNode = findNode(props.target!);
  if (!sNode || !tNode)
    return null;

  const sC = getNodeCenter(sNode);
  const tC = getNodeCenter(tNode);

  const s = getIntersection(sNode, tC);
  const t = getIntersection(tNode, sC);

  // 注意解出 labelX/labelY
  const [path, labelX, labelY] = getStraightPath({
    sourceX: s.x,
    sourceY: s.y,
    targetX: t.x,
    targetY: t.y,
  });

  return { path, labelX, labelY };
});
</script>

<template>
  <BaseEdge
    v-if="edgeParams"
    v-bind="props"
    :path="edgeParams.path"
    :label-x="edgeParams.labelX"
    :label-y="edgeParams.labelY"
  />
</template>
