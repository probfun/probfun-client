<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';
import { layout as dagreLayout, graphlib } from '@dagrejs/dagre';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import {
  MarkerType,
  Position,
  useVueFlow,
  VueFlow,
} from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { computed, nextTick, ref, watch } from 'vue';

// === 类型定义 ===
type Level = 1 | 2 | 3;
export interface MindNodeData {
  label: string;
  level: Level;
  [k: string]: any;
}

// Props：把你已有的 ref/数组直接传进来
const props = defineProps<{
  nodes: Node<MindNodeData>[];
  edges: Edge<any>[];
}>();

// 布局方向：左右(LR) / 上下(TB)
const orientation = ref<'LR' | 'TB'>('LR');

// level 对应 Tailwind 颜色
const levelClasses: Record<Level, string> = {
  1: 'bg-emerald-50 border-emerald-400 text-emerald-900',
  2: 'bg-sky-50 border-sky-400 text-sky-900',
  3: 'bg-amber-50 border-amber-400 text-amber-900',
};

// dagre 自动排版
function layoutGraph(nodes: Node<MindNodeData>[], edges: Edge<any>[]) {
  const g = new graphlib.Graph();
  g.setGraph({
    rankdir: orientation.value, // LR: 左→右, TB: 上→下
    ranksep: 96,
    nodesep: 56,
    edgesep: 8,
    marginx: 24,
    marginy: 24,
  });
  g.setDefaultEdgeLabel(() => ({}));

  // 预估节点尺寸；如有自定义宽高可放在 node.style.width/height
  const defaultSize = { width: 220, height: 72 };

  nodes.forEach((n) => {
    const w = (n as any).style?.width ?? defaultSize.width;
    const h = (n as any).style?.height ?? defaultSize.height;
    g.setNode(n.id, { width: Number(w), height: Number(h) });
  });

  edges.forEach(e => g.setEdge(e.source, e.target));

  dagreLayout(g);

  const srcPos = orientation.value === 'LR' ? Position.Right : Position.Bottom;
  const tgtPos = orientation.value === 'LR' ? Position.Left : Position.Top;

  const baseNodeClass = 'rounded-2xl border shadow-sm px-4 py-3 select-none transition hover:shadow-md hover:-translate-y-0.5';

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const width = pos?.width ?? defaultSize.width;
    const height = pos?.height ?? defaultSize.height;
    const level = (n as Node<MindNodeData>).data?.level ?? 1;

    return {
      ...n,
      type: n.type ?? 'default',
      sourcePosition: srcPos,
      targetPosition: tgtPos,
      class: [baseNodeClass, levelClasses[level as Level]].join(' '),
      position: pos
        ? { x: pos.x - width / 2, y: pos.y - height / 2 }
        : n.position ?? { x: 0, y: 0 },
    } as Node<MindNodeData>;
  });
}

const layoutedNodes = computed(() => layoutGraph(props.nodes, props.edges));

// 视口自适应
const { fitView } = useVueFlow();

watch(
  () => orientation.value,
  async () => {
    await nextTick();
    await fitView({ padding: 0.1, duration: 500 });
  },
);

watch(
  () => [props.nodes, props.edges],
  async () => {
    // wait 100 ms
    await new Promise(resolve => setTimeout(resolve, 100));
    await fitView({ padding: 0.1, duration: 500 });
  },
  { deep: true },
);
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <!-- 顶部工具条 -->
    <div class="flex items-center gap-2 p-2 border-b bg-white">
      <span class="text-sm text-gray-500">布局方向：</span>
      <div class="inline-flex rounded-xl border overflow-hidden">
        <button
          class="px-3 py-1 text-sm hover:bg-gray-50"
          :class="orientation === 'LR' ? 'bg-gray-100 font-medium' : ''"
          @click="orientation = 'LR'"
        >
          左右
        </button>
        <button
          class="px-3 py-1 text-sm hover:bg-gray-50 border-l"
          :class="orientation === 'TB' ? 'bg-gray-100 font-medium' : ''"
          @click="orientation = 'TB'"
        >
          上下
        </button>
      </div>
    </div>

    <!-- 画布区 -->
    <div class="flex-1">
      <VueFlow
        :nodes="layoutedNodes"
        :edges="edges"
        :default-edge-options="{ type: 'smoothstep', markerEnd: MarkerType.ArrowClosed }"
        :fit-view-on-init="true"
        :nodes-draggable="false"
      >
        <Background pattern-color="#e5e7eb" :gap="16" />
        <MiniMap />
        <Controls position="bottom-right" />
      </VueFlow>
    </div>
  </div>
</template>

<style scoped>
/* 可按需微调 */
</style>
