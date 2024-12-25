<script setup>
import { Background } from '@vue-flow/background'
import { useVueFlow, VueFlow } from '@vue-flow/core';
import { nextTick, ref } from 'vue'
import Icon from '../Icon.vue';

import { initialEdges, initialNodes } from './initial-elements.js'
import { useLayout } from './useLayout.js'

import './nodeStyles.css';

const nodes = ref(initialNodes)
const edges = ref(initialEdges)

const { layout } = useLayout()

const { fitView } = useVueFlow()

// 控制图片显示的状态
const showImage = ref(false);

// 切换图片显示状态
function toggleImage() {
  showImage.value = !showImage.value;
}

nextTick(() => {
  // 调整视图，使其在初始化时居中
  fitView({ padding: 0.1 }); // 适当增加padding以确保视图完全可见且居中
});

async function layoutGraph(direction) {
  nodes.value = layout(nodes.value, edges.value, direction)
  await nextTick();
  nextTick(() => {
    fitView({ padding: 0.1 }) // 在布局更新后再次确保居中
  })
}
</script>

<template>
  <div class="layout-flow">
    <!-- 控制按钮，参考您提供的按钮样式 -->
    <Controls position="top-left" class="border-none flex items-center">
  <Button size="xl" class="ml-2 multi-line-button" @click="toggleImage">
    <span class="multi-line-text">
      检测总次数随<br/>分组人数的变化
    </span>
    <Icon name="info" />
  </Button>
</Controls>

    <!-- 控制图片显示 -->
    <div v-if="showImage" class="image-container">
      <img src="/homePage/image.png" alt="imag" class="image" />
    </div>

    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      fit-view-on-init
      elevate-edges-on-select
      :enable-node-parenting="true"
    >
      <Background />
    </VueFlow>
  </div>
</template>

<style>
.layout-flow {
  height: 100vh;  /* 确保容器占满全屏 */
  width: 100%;
  display: flex;
  justify-content: center;  /* 居中布局 */
  align-items: center;      /* 居中布局 */
  position: relative; /* 使得按钮可以绝对定位 */
}

/* 图片容器样式 */
.image-container {
  position: absolute;
  top: 50px;
  left: 20px;
  z-index: 10; /* 确保图片在按钮之上 */
  left: 200px; /* 将图片稍微向右偏移 */

}

/* 修改图片显示更大 */
.image {
  width: 40vw; /* 设置图片宽度为视口宽度的80% */
  height: auto; /* 保持原始宽高比例 */
  max-width: 1200px; /* 最大宽度限制 */
  border: 3px solid #2563eb;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
.layout-flow {
  height: 100vh;  /* 确保容器占满全屏 */
  width: 100%;
  display: flex;
  justify-content: center;  /* 居中布局 */
  align-items: center;      /* 居中布局 */
  position: relative; /* 使得按钮可以绝对定位 */
}

/* 控制按钮样式 */
.multi-line-button {
  white-space: normal; /* 允许换行 */
  word-wrap: break-word; /* 在单词长时换行 */
  text-align: center; /* 中央对齐文字 */
  
  /* 设置按钮更大 */

  padding: 12px 24px; /* 增加按钮内边距 */
  width: 150px; /* 设置按钮的宽度 */
  height: 100px; /* 设置按钮的高度 */
  line-height: 1.5; /* 设置行高 */
  display: inline-flex; /* 使用flex布局让内容居中 */
  justify-content: center;
  align-items: center;
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影 */
}

/* 按钮内文本样式 */
.multi-line-text {
  display: block; /* 使文字成为块级元素，以便换行 */
  text-align: center; /* 可选：如果你需要让文字在按钮内居中 */
  line-height: 1.5; /* 设置行高，调整这个值来增加或减少行高 */
}



</style>