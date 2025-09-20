<script setup lang="ts">
import type { Edge, Node } from '@vue-flow/core';
import { layout as dagreLayout, graphlib } from '@dagrejs/dagre';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { Handle, MarkerType, Position, useVueFlow, VueFlow } from '@vue-flow/core';

import { MiniMap } from '@vue-flow/minimap';
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cn } from '@/lib/utils.ts';

type Level = 1 | 2 | 3;
export interface MindNodeData {
  label: string;
  level: Level;
  [k: string]: any;
}

const props = defineProps<{
  nodes: Node<MindNodeData>[];
  edges: Edge<any>[];
}>();

const router = useRouter();
const orientation = ref<'LR' | 'TB'>('LR');
const openId = ref<string | null>(null);

const levelClasses: Record<Level, string> = {
  1: 'bg-emerald-50 border-emerald-400 text-emerald-900 text-lg',
  2: 'bg-sky-50 border-sky-400 text-sky-900 text-base',
  3: 'bg-amber-50 border-amber-400 text-amber-900 text-sm',
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
  const defaultSize = { width: 220, height: 36 };

  nodes.forEach((n) => {
    const w = (n as any).style?.width ?? defaultSize.width;
    const h = (n as any).style?.height ?? defaultSize.height;
    g.setNode(n.id, { width: Number(w), height: Number(h) });
  });

  edges.forEach(e => g.setEdge(e.source, e.target));

  dagreLayout(g);

  const srcPos = orientation.value === 'LR' ? Position.Right : Position.Bottom;
  const tgtPos = orientation.value === 'LR' ? Position.Left : Position.Top;

  return nodes.map((n) => {
    const pos = g.node(n.id);
    const width = pos?.width ?? defaultSize.width;
    const height = pos?.height ?? defaultSize.height;

    return {
      ...n,
      type: 'mind',
      sourcePosition: srcPos,
      targetPosition: tgtPos,
      position: pos
        ? { x: pos.x - width / 2, y: pos.y - height / 2 }
        : n.position ?? { x: 0, y: 0 },
    } as Node<MindNodeData>;
  });
}

const { fitView, updateNode } = useVueFlow();

function openPanel(id: string) {
  if (openId.value && openId.value !== id) {
    updateNode(openId.value, (n: any) => ({ ...n, zIndex: undefined }));
  }
  openId.value = id;
  updateNode(id, (n: any) => ({ ...n, zIndex: 2000 }));
}

function closePanel(id: string) {
  if (openId.value === id)
    openId.value = null;
  updateNode(id, (n: any) => ({ ...n, zIndex: undefined }));
}

const layoutedNodes = computed(() => layoutGraph(props.nodes, props.edges));

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

    <div class="flex-1">
      <VueFlow
        :nodes="layoutedNodes"
        :edges="edges"
        :default-edge-options="{ type: 'smoothstep', markerEnd: MarkerType.ArrowClosed }"
        :fit-view-on-init="true"
        :nodes-draggable="false"
      >
        <template #node-mind="{ id, data, targetPosition, sourcePosition }">
          <div
            class="select-none"
            @mouseenter="openPanel(id)"
            @mouseleave="closePanel(id)"
          >
            <div
              class="transition-all group relative rounded-2xl border shadow-sm px-4 py-3 min-w-[200px] hover:shadow-md hover:-translate-y-0.5 pointer-events-auto"
              :class="cn(levelClasses[(data?.level ?? 1) as 1 | 2 | 3], (orientation === 'TB' && 'max-w-60'))"
            >
              <Handle id="t" type="target" :position="targetPosition ?? (orientation === 'LR' ? Position.Left : Position.Top)" />
              <Handle id="s" type="source" :position="sourcePosition ?? (orientation === 'LR' ? Position.Right : Position.Bottom)" />

              <div class="flex items-center gap-2">
                <div
                  class="rounded-full bg-current"
                  :class="{
                    'size-2': (data?.level ?? 1) === 1,
                    'size-1.5': (data?.level ?? 1) === 2,
                    'size-1': (data?.level ?? 1) === 3,
                  }"
                />
                <span class="font-medium">{{ data?.label ?? '未命名' }}</span>
              </div>

              <p v-if="data?.description" class="mt-2 text-xs/5 opacity-70">
                {{ data.description }}
              </p>
            </div>

            <div class="pt-1 absolute top-full ">
              <div
                class="rounded-xl border bg-white shadow-lg z-[3000] transition-all p-2 flex gap-2"
                :class="openId === id ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'"
              >
                <Button
                  v-if="data.level === 2"
                  class="w-full text-left px-3 py-2 "
                  @mousedown.stop.prevent
                  @click.stop="() => {
                    router.push({
                      name: 'DoQuestion',
                      params: { chapterId: id },
                    })
                  }"
                >
                  跳转到相关试题
                </Button>
                <Button
                  class="w-full text-left px-3 py-2"
                  variant="outline"
                  @mousedown.stop.prevent
                  @click.stop="() => {
                    router.push({
                      path: '/dashboard/ai',
                      query: { query: `我在学习“${data.label}”这个知识点时遇到了一些问题，能帮我解答吗？` },
                    })
                  }"
                >
                  对该知识点有疑问
                </Button>
              </div>
            </div>
          </div>
        </template>
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
