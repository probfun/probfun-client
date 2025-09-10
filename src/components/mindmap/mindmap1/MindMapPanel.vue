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
const isInteractive = ref(true);

const correctRate = ref(0);

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
    // 恢复交互
    isInteractive.value = true;

    nextTick(() => {
      fitView();
    });
  }
  catch (error) {
    console.error('布局切换错误:', error);
  }
}

function handleNodeClick({ node }) {
  nextTick(() => {
    try {
      console.log('点击的节点详情:', node);

      if (node && node.data && node.data.level === 3) {
        selectedNode.value = node;
        updatePopupPosition();
        // 显示弹出层时锁定交互
        showPopup.value = true;
        isInteractive.value = false;
      }
      else {
        showPopup.value = false;
        // 隐藏弹出层时恢复交互
        isInteractive.value = true;
      }
    }
    catch (error) {
      console.error('节点点击处理错误:', error);
      showPopup.value = false;
      isInteractive.value = true;
    }
  });
}

function updatePopupPosition() {
  if (selectedNode.value) {
    const node = selectedNode.value;

    if (isHorizontal.value) {
      if (node.position) {
        popupPosition.value = {
          x: node.computedPosition.x + 160,
          y: node.computedPosition.y - 27,
        };
        if (!node.isParent) {
          if (node.id === '7') {
            popupPosition.value.y = node.computedPosition.y - 68;
          }
          else if (node.id === '8') {
            popupPosition.value.y = node.computedPosition.y - 83;
          }
          else if (node.id === '9') {
            popupPosition.value.y = node.computedPosition.y - 120;
          }
          else if (node.id === '10') {
            popupPosition.value.y = node.computedPosition.y - 145;
          }
          else if (node.id === '11') {
            popupPosition.value.y = node.computedPosition.y - 174;
          }
          else if (node.id === '12') {
            popupPosition.value.y = node.computedPosition.y - 200;
          }
          else if (node.id === '13') {
            popupPosition.value.y = node.computedPosition.y - 228;
          }
          else if (node.id === '14') {
            popupPosition.value.y = node.computedPosition.y - 252;
          }
          else if (node.id === '15') {
            popupPosition.value.y = node.computedPosition.y - 280;
          }
          else if (node.id === '16') {
            popupPosition.value.y = node.computedPosition.y - 305;
          }
        }
        console.log('弹出层已显示，位置:', popupPosition.value);
      }
      else {
        console.warn('node.position 未定义，无法计算弹出框位置');
        showPopup.value = false;
        isInteractive.value = true;
      }
    }

    else {
      if (node.position) {
        popupPosition.value = {
          x: node.computedPosition.x + 1040,
          y: node.computedPosition.y + 245,
        };
        if (!node.isParent) {
          if (node.id === '7') {
            popupPosition.value.x = node.computedPosition.x + 980;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '8') {
            popupPosition.value.x = node.computedPosition.x + 922;
          }
          else if (node.id === '9') {
            popupPosition.value.x = node.computedPosition.x + 865;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '10') {
            popupPosition.value.x = node.computedPosition.x + 805;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '11') {
            popupPosition.value.x = node.computedPosition.x + 748;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '12') {
            popupPosition.value.x = node.computedPosition.x + 690;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '13') {
            popupPosition.value.x = node.computedPosition.x + 633;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '14') {
            popupPosition.value.x = node.computedPosition.x + 575;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '15') {
            popupPosition.value.x = node.computedPosition.x + 515;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
          else if (node.id === '16') {
            popupPosition.value.x = node.computedPosition.x + 455;
            popupPosition.value.y = node.computedPosition.y + 230;
          }
        }
        console.log('弹出层已显示，位置:', popupPosition.value);
      }
      else {
        console.warn('node.position 未定义，无法计算弹出框位置');
        showPopup.value = false;
        isInteractive.value = true;
      }
    }
  }
}

function popupButtonAction() {
  console.log('操作按钮点击，节点信息:', selectedNode.value);
  let path = '';
  if (selectedNode.value.parentNode === '2') {
    path = '/dashboard/question/1.1%20样本空间与随机事件';
  }
  else if (selectedNode.value.parentNode === '3') {
    path = '/dashboard/question/1.2%20事件的概率';
  }
  else if (selectedNode.value.parentNode === '4') {
    path = '/dashboard/question/1.3%20条件概率';
  }
  else if (selectedNode.value.parentNode === '5') {
    path = '/dashboard/question/1.4%20事件的独立性';
  }
  router.push({ path });
  showPopup.value = false;
  isInteractive.value = true;
}

function toAi() {
  console.log('hello');
}

function handleBackgroundClick(event) {
  if (event.target.classList.contains('vue-flow__pane')) {
    showPopup.value = false;
    isInteractive.value = true;
  }
}

watch(() => nodes.value, () => {
  if (showPopup.value && selectedNode.value) {
    updatePopupPosition();
  }
}, { deep: true });

onUnmounted(() => {
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
      :zoom-on-scroll="isInteractive"
      :zoom-on-double-clic="isInteractive"
      :pan-on-drag="isInteractive"
      @node-click="handleNodeClick"
      @click="handleBackgroundClick"
    >
      <div
        v-if="showPopup"
        class="node-popup"
        :style="{
          left: `${popupPosition.x}px`,
          top: `${popupPosition.y}px`,
        }"
        @click.stop
      >
        <div class="popup-content">
          <span class="popup-title">
            该知识点的正确率为：{{ correctRate }}
          </span>
          <button class="popup-button-question" @click.stop="popupButtonAction">
            跳转到相应题目
          </button>
          <button class="popup-button-ai" @click.stop="toAi">
            寻求AI帮助
          </button>
        </div>
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

.node-popup {
  position: absolute;
  transform: translateX(-50%);
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 1000;
  pointer-events: auto;
}

.popup-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.popup-title {
  text-align: center;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.popup-button-question {
  padding: 6px 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.popup-button-question:hover {
  background-color: #1d4ed8;
}

.popup-button-ai{
  padding: 6px 12px;
  background-color: #4bd330;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}

.popup-button-ai:hover {
  background-color: #38bd26;
}

.vue-flow__minimap {
  background-color: rgba(187, 210, 246, 0.9);
}

.vue-flow__edge-path {
  stroke: #94a3b8;
  stroke-width: 2;
}
</style>
