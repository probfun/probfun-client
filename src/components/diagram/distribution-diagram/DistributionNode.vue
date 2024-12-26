<script setup lang="ts">
import type { GraphEdge } from '@vue-flow/core';
import { HoverCard } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useConfigStore } from '@/store';
import { toMarkdown } from '@/utils/markdown.ts';
import { Handle, Position, useVueFlow } from '@vue-flow/core'
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  id: string
  data: {
    label: string
    pdf: string | null
    expId?: string
    description?: string
  }
}>();

const { getConnectedEdges, getEdges } = useVueFlow();
const configStore = useConfigStore();
const isHighlight = ref(false);

function updateEdgeStyle() {
  const connectedEdges = getConnectedEdges(props.id);
  isHighlight.value = false;
  for (const edge of connectedEdges) {
    const target = edge.target;
    const source = edge.source;

    if (target !== configStore.targetNodeId && source !== configStore.targetNodeId) {
      continue;
    }

    isHighlight.value = (target === props.id || source === props.id);
  }

  if (configStore.targetNodeId !== props.id) {
    return;
  }
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
  console.log(props.data)
  if (configStore.targetNodeId === props.id) {
    configStore.targetNodeId = null;
  }
  else {
    configStore.targetNodeId = props.id;
  }
}

onMounted(() => {
  updateEdgeStyle();
});

function getDescriptionTitle(description: string) {
  return description?.split('\n\n')[0].split(':')[1];
}

function getDescriptionBody(description: string) {
  return description.split('\n\n')[1];
}
</script>

<template>
  <HoverCard :open="configStore.targetNodeId === id && !configStore.isMoving">
    <HoverCardTrigger>
      <div
        :class="cn('border rounded-xl p-3 bg-background transition-all border-primary', isHighlight && 'border-destructive border-4')"
        @click="onSelect"
      >
        <div class="text-sm whitespace-pre text-center">
          {{ data.label }}
        </div>

        <Handle id="a" type="source" :position="Position.Top" />
        <Handle id="b" type="source" :position="Position.Bottom" />
      </div>
    </HoverCardTrigger>
    <HoverCardContent class="max-w-xl w-auto">
      <Label class="text-base font-bold select-none"> 概率密度函数（PDF） </Label>
      <div class="w-full flex items-center justify-center pt-3">
        <div v-if="data.pdf" class="prose" v-html="toMarkdown(data.pdf)" />
        <div v-else class="">
          <Label>
            这个分布的概率密度函数暂未收录
          </Label>
        </div>
      </div>
      <div v-if="data.description" class="mt-6">
        <Label class="text-base font-bold select-none"> 应用案例： {{ getDescriptionTitle(data.description) }} </Label>
        <div class="w-full flex items-center justify-center">
          <div class="prose" v-html="toMarkdown(getDescriptionBody(data.description))" />
        </div>
      </div>
      <div v-if="data.expId">
        <div class="w-full flex items-center justify-center pt-3">
          <Button>
            <router-link :to="`/dashboard/experiment/${data.expId}`">
              进入实验
            </router-link>
          </Button>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<style scoped></style>
