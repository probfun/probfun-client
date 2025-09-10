<script setup>
import { Background } from '@vue-flow/background';
import { Position, useVueFlow, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { nextTick, onUnmounted, ref, watch } from 'vue';

import router from '@/router';
import { initialEdges, initialNodes } from './mindmap.ts';
import { useLayout } from './useLayout.js';

import './nodeStyles.css';

console.log('初始节点数据:', initialNodes);
console.log('初始边数据:', initialEdges);

const originalNodes = initialNodes ? JSON.parse(JSON.stringify(initialNodes)) : [];
const originalEdges = initialEdges ? JSON.parse(JSON.stringify(initialEdges)) : [];

const nodes = ref([...originalNodes]);
const edges = ref([...originalEdges]);
const isHorizontal = ref(false);

const showPopup = ref(false);
const selectedNode = ref(null);
const popupPosition = ref({ x: 0, y: 0 });

const { fitView } = useVueFlow();

const { layout } = useLayout ? useLayout() : { layout: nodes => nodes };

async function layoutGraph() {
  try {
    if (isHorizontal.value) {
      nodes.value = originalNodes.map(node => ({
        ...node,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      }));
      edges.value = [...originalEdges];
    }
    else {
      const newNodes = layout([...nodes.value], [...edges.value], 'LR');
      nodes.value = newNodes.map(node => ({
        ...node,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }));
    }

    isHorizontal.value = !isHorizontal.value;
    showPopup.value = false;

    nextTick(() => {
      fitView();
    });
  }
  catch (error) {
    console.error('布局切换错误:', error);
  }
}

function getNodeDimensions(node) {
  const levelSizes = {
    1: { width: 220, height: 80 },
    2: { width: 180, height: 60 },
    3: { width: 150, height: 50 },
    default: { width: 150, height: 50 },
  };

  return node.width && node.height
    ? { width: node.width, height: node.height }
    : levelSizes[node.data?.level] || levelSizes.default;
}

function handleNodeClick({ node }) {
  nextTick(() => {
    try {
      console.log('点击的节点详情:', node);

      if (node && node.data && node.data.level === 3) {
        selectedNode.value = node;
        updatePopupPosition();
      }
      else {
        showPopup.value = false;
      }
    }
    catch (error) {
      console.error('节点点击处理错误:', error);
      showPopup.value = false;
    }
  });
}

function updatePopupPosition() {
  if (selectedNode.value) {
    const node = selectedNode.value;
    const { width, height } = getNodeDimensions(node);

    // 使用节点的position属性（相对于VueFlow容器的位置）计算弹出框位置
    if (node.position) {
      popupPosition.value = {
        x: node.position.x + width / 2,
        y: node.position.y + height + 10, // 节点下方10px
      };
      showPopup.value = true;
      console.log('弹出层已显示，位置:', popupPosition.value);
    }
    else {
      console.warn('node.position 未定义，无法计算弹出框位置');
      showPopup.value = false;
    }
  }
}

function popupButtonAction() {
  console.log('操作按钮点击，节点信息:', selectedNode.value);
  router.push({
    path: '/dashboard/question/2.1%20随机变量及其分布函数',
  });
  showPopup.value = false;
}

function handleBackgroundClick(event) {
  if (event.target.classList.contains('vue-flow__pane')) {
    showPopup.value = false;
  }
}

// 监听节点位置变化
watch(() => nodes.value, () => {
  if (showPopup.value && selectedNode.value) {
    updatePopupPosition();
  }
}, { deep: true });

// 清理函数
onUnmounted(() => {
  // 清理工作
});
</script>

<template>
  <div class="layout-flow">
    <div v-if="!initialNodes || !initialEdges" class="error-message">
      错误：未加载到思维导图数据，请检查数据源
    </div>

    <VueFlow
      v-else
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      :nodes-draggable="false"
      :edges-updatable="false"
      @node-click="handleNodeClick"
      @click="handleBackgroundClick"
    >
      <!-- 使用简单的div和绝对定位来实现弹出框，相对于VueFlow容器 -->
      <div
        v-if="showPopup"
        class="node-popup"
        :style="{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
        }"
        @click.stop
      >
        <button class="popup-button" @click.stop="popupButtonAction">
          查看详情
        </button>
      </div>

      <Background style="background-color: #F5F7FA" />

      <div class="controls">
        <button class="toggle-layout-btn" @click="layoutGraph">
          {{ isHorizontal ? '切换为竖版' : '切换为横版' }}
        </button>
      </div>

      <MiniMap
        position="bottom-right"
        :node-color="node => {
          const colors = { 1: 'rgb(25, 30, 89)', 2: 'rgb(74, 81, 217)', 3: 'rgb(140, 181, 255)' };
          return colors[node.data?.level] || '#6b7280';
        }"
        :node-stroke-width="2"
      />
    </VueFlow>
  </div>
</template>

<style>
.layout-flow {
  position: relative;
  width: 100%;
  height: 80vh;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.error-message {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  background-color: #fef2f2;
  font-weight: 600;
}

.controls {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
}

.toggle-layout-btn {
  padding: 8px 16px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
}

.toggle-layout-btn:hover {
  background-color: #1d4ed8;
}

.vue-flow__node-input {
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 12px;
}

.vue-flow__node-input[data-level="1"] {
  background-color: #eff6ff;
  border: 2px solid #2563eb;
  color: #1e40af;
}

.vue-flow__node-input[data-level="2"] {
  background-color: #ecfdf5;
  border: 2px solid #10b981;
  color: #059669;
}

.vue-flow__node-input[data-level="3"] {
  background-color: #fef3c7;
  border: 2px solid #f59e0b;
  color: #92400e;
  cursor: pointer;
  transition: transform 0.2s;
}

.vue-flow__node-input[data-level="3"]:hover {
  transform: scale(1.02);
}

/* 弹出框样式 - 相对VueFlow容器定位 */
.node-popup {
  position: absolute;
  transform: translateX(-50%);
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px;
  z-index: 1000;
  pointer-events: auto;
}

.popup-button {
  padding: 6px 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.popup-button:hover {
  background-color: #1d4ed8;
}

.vue-flow__minimap {
  background-color: rgba(187, 210, 246, 0.9);
}

.vue-flow__edge-path {
  stroke: #94a3b8;
  stroke-width: 2;
}
</style>
