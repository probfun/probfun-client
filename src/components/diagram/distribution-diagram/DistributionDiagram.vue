<script setup lang="ts">
import type { GraphEdge, NodeDragEvent } from '@vue-flow/core';
import type { LayoutOptions } from 'cytoscape';
import { vAutoAnimate } from '@formkit/auto-animate'; // 引入 dagre
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { useVueFlow, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import { ChevronRight } from 'lucide-vue-next';
import { markRaw, nextTick, onMounted, ref, watch } from 'vue';
import DistributionNode from '@/components/diagram/distribution-diagram/DistributionNode.vue';
import FloatingEdge from '@/components/diagram/distribution-diagram/FloatingEdge.vue';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils.ts';
import { useConfigStore } from '@/store';
import Icon from '../Icon.vue';
import { initialEdges, initialNodes } from './initial-elements.ts';

const { setViewport, fitView, getEdges } = useVueFlow();

const nodeData = initialNodes();
const edgeData = initialEdges();
const nodes = ref(nodeData);
const searchNodes = ref(nodeData);
const edges = ref<any[]>(edgeData);
const dark = ref(false);
const searchQuery = ref('');
const configStore = useConfigStore();

const customViewport = {
  x: 800, // 初始 X 坐标
  y: 500, // 初始 Y 坐标
  zoom: 0.5, // 初始缩放比例
};

function moveToNode(nodeId: string) {
  const node = nodes.value.find(n => n.id === nodeId);
  if (node) {
    configStore.isMoving = true;
    setInterval(() => {
      configStore.isMoving = false;
    }, 1500);
    fitView({
      nodes: [node.id],
      duration: 1000, // use this if you want a smooth transition to the node
      padding: 10,
    });
  }
}

function searchNode() {
  searchNodes.value = nodes.value.filter((node) => {
    return node.data.label.toLowerCase().includes(searchQuery.value.toLowerCase()) || node.data.chineseTranslation.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
}

// 自动布局 (使用 dagre)
function applyAutoLayout() {
  cytoscape.use(fcose);

  // 1) 构造 elements，并把“节点尺寸”带进 data
  const elements = [
    ...nodes.value.map(n => ({
      data: {
        id: n.id,
        width: 250,
        height: 150,
        label: '',
      },
    })),
    ...edges.value.map((e: any, i: number) => ({
      data: { id: e.id ?? `e-${i}`, source: e.source, target: e.target },
    })),
  ];

  // 2) headless 实例，给出样式让布局读取到真实宽高/标签
  const cy = cytoscape({
    headless: true,
    elements,
    style: [
      { selector: 'node', style: {
        'width': 'data(width)',
        'height': 'data(height)',
        'label': 'data(label)',
        'font-size': 12,
      } },
    ],
  });

  const layout = cy.layout({
    name: 'fcose',
    quality: 'proof',
    randomize: true,
    animate: false,
    nodeDimensionsIncludeLabels: true,
    nodeSeparation: 600,
    nodeRepulsion: () => 500000,
    idealEdgeLength: () => 500,
    edgeElasticity: () => 0.1,
    gravity: 0.02,
    packComponents: true,
    tile: true,
    padding: 0,
  } as LayoutOptions);
  layout.run();

  nodes.value = nodes.value.map((n) => {
    const p = cy.getElementById(n.id).position();
    return { ...n, position: { x: p.x, y: p.y }, dragging: false };
  });

  edges.value = edges.value.map((n) => {
    return { ...n, type: 'floating' };
  });

  cy.destroy();
}

function resetEdges() {
  const edges = getEdges.value as unknown as (GraphEdge & { defaultStroke: string; style: any })[];
  for (const edge of edges) {
    edge.style.stroke = edge.defaultStroke;
    edge.labelStyle!.fill = 'black';
  }
}

// 节点拖动事件处理
function handleNodeDragStop(event: NodeDragEvent) {
  const { node } = event;
  console.log(node.position);
  nodes.value = nodes.value.map((n) => {
    if (n.id === node.id) {
      return {
        ...n,
        position: node.position,
      };
    }
    return n;
  });
}

// 打印当前图形状态
// function logToObject() {
//   console.log(toObject());
// }
//
// // 重置视图
// function resetTransform() {
//   setViewport({ x: 0, y: 0, zoom: 1 });
// }

watch(() => configStore.targetNodeId, () => {
  if (!configStore.targetNodeId) {
    resetEdges();
  }
});

onMounted(() => {
  nextTick(() => {
    applyAutoLayout(); // 应用自动布局
    setViewport(customViewport);
  });
});

const showTooltip = ref(false);
function toggleTooltip() {
  showTooltip.value = !showTooltip.value;
}

const collapse = ref(false);
const edgeTypes = {
  floating: markRaw(FloatingEdge),
};
</script>

<template>
  <div class="flex">
    <div v-auto-animate class="relative h-full z-30">
      <div v-if="!collapse" :class="cn('border-r flex flex-col max-w-xs w-full bg-background h-full')">
        <div class="p-3">
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="搜索分布"
            @update:model-value="searchNode"
          />
        </div>
        <div class="flex gap-3 p-3 flex-col flex-1 overflow-y-auto">
          <Button
            v-for="distribution in searchNodes" :key="distribution.id" variant="outline" :class="cn('flex flex-col h-auto transition-all', configStore.targetNodeId === distribution.id && '!bg-primary !text-primary-foreground font-bold')" @click="() => {
              if (configStore.targetNodeId === distribution.id) {
                configStore.targetNodeId = null;
                resetEdges();
                fitView({
                  nodes: [],
                  duration: 1000, // use this if you want a smooth transition to the node
                  padding: 10,
                  minZoom: 0.5,
                });
              }
              else {
                configStore.targetNodeId = distribution.id;
                moveToNode(distribution.id);
              }
            }"
          >
            <div class="whitespace-pre">
              {{ distribution.data.label.split('\n')[0] }}
            </div>
            <div class="whitespace-pre text-center">
              {{ distribution.data.chineseTranslation }}
            </div>
          </Button>
        </div>
      </div>
      <Button class="bottom-10 absolute right-0 translate-x-[100%] rounded-l-none rounded-r-full" size="icon" @click="collapse = !collapse">
        <ChevronRight :class="cn('transition-all size-5', !collapse && 'rotate-180')" />
      </Button>
    </div>
    <div class="relative flex-1">
      <VueFlow
        :nodes="nodes" :edges="edges" :class="{ dark }" class="basic-flow" :default-viewport="{ zoom: 1.5 }"
        :min-zoom="0.2" :max-zoom="4" :edge-types="edgeTypes"
        @node-drag-stop="handleNodeDragStop"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <template #node-distribution="props">
          <DistributionNode
            :id="props.id" :data="props.data"
          />
        </template>

        <MiniMap />

        <Controls position="top-left" class="border-none flex items-center">
          <Button size="xs" class="ml-2" @click="toggleTooltip">
            显示图例
            <Icon name="info" />
          </Button>
        </Controls>
      </VueFlow>
      <div
        v-if="showTooltip" :style="{
          position: 'absolute',
          bottom: '50px',
          left: '50px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          zIndex: 100,
        }" class="tooltip"
      >
        <div class="tooltip-content">
          <div class="column">
            <p class="highlight">
              <strong>Properties:</strong>
            </p>
            <p><strong>C</strong> convolution</p>
            <p><strong>F</strong> forgetfulness</p>
            <p><strong>I</strong> inverse</p>
            <p><strong>L</strong> linear combination</p>
            <p><strong>M</strong> minimum</p>
            <p><strong>P</strong> product</p>
            <p><strong>R</strong> residual</p>
            <p><strong>S</strong> scaling</p>
            <p><strong>V</strong> variate generation</p>
            <p><strong>X</strong> maximum</p>
          </div>
          <div class="column">
            <p><strong>L → C</strong> </p>
            <p><strong>L → S</strong> </p>
            <p><strong>F → R</strong> </p>
            <p class="highlight">
              <strong>Relationships:</strong>
            </p>
            <p><strong>special cases:</strong> ——></p>
            <p><strong>limiting:</strong>---------—></p>
            <p><strong>bayesian:</strong>--------—></p>
            <p><strong>transformations:</strong> <span class="highlight-text">—————></span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.5/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.5/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.basic-flow.dark {
  background: #2d3748;
  color: #fffffb
}

.basic-flow .vue-flow__controls .vue-flow__controls-button svg {
  height: 100%;
  width: 100%
}

.tooltip {
  font-size: 14px;
  max-width: 600px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  text-align: left;
  /* 让所有内容左对齐 */
  user-select: none;
}

.tooltip-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  user-select: none;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.column p {
  margin: 0;
}

/* 对特定行文字改变颜色 */
.highlight {
  font-size: 20px;
  /* 设置行颜色 */
  user-select: none;
}

.highlight-text {
  color: orange;
  /* 设置部分文字颜色 */
  user-select: none;
}
</style>
