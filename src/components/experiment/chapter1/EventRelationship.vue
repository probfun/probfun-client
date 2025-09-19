<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## 事件关系与运算总结

通过本实验，我们直观地了解了概率论中事件之间的基本关系和运算规则。以下是实验的核心内容总结：

### 一、事件的基本关系

1. **包含关系 (A ⊆ B)**
   - 当事件A发生必然导致事件B发生时，称事件A包含于事件B
   - 可视化中表现为事件A的圆形完全位于事件B的圆形内部

2. **互斥事件**
   - 若事件A和事件B不可能同时发生，则它们是互斥事件
   - 可视化中表现为两个圆形没有交集

3. **对立事件**
   - 若事件A和事件B互斥，且它们的并集构成整个样本空间，则它们是对立事件
   - 可视化中事件B表示为整个画布区域，事件A为其中的一个圆形区域

4. **相等关系 (A = B)**
   - 若事件A和事件B表示完全相同的事件，则它们相等
   - 可视化中表现为两个圆形完全重合

### 二、事件的基本运算

1. **并集运算 (A ∪ B)**
   - 表示事件A或事件B至少有一个发生的事件
   - 可视化中用蓝色区域表示两个事件覆盖的全部区域

2. **交集运算 (A ∩ B)**
   - 表示事件A和事件B同时发生的事件
   - 可视化中用蓝色区域表示两个事件的重叠部分

3. **差集运算 (A - B)**
   - 表示事件A发生而事件B不发生的事件
   - 可视化中用蓝色区域表示事件A中不与事件B重叠的部分

4. **补集运算 (A')**
   - 表示事件A不发生的事件
   - 可视化中用蓝色区域表示整个样本空间中除去事件A的部分

### 三、交互功能

- 通过点击不同的事件关系按钮，可以切换展示不同的事件关系模型
- 通过点击不同的事件运算按钮，可以可视化展示相应的运算结果
- 在非包含关系和非相等关系模式下，可以拖动事件A和事件B的圆形区域，观察不同位置关系下的运算结果变化

### 四、概率论意义

事件的关系和运算是概率论的基础，通过可视化的方式理解这些概念，有助于建立对概率空间和事件运算的直观认识，为进一步学习概率论的计算和应用奠定基础。
`;

function onHtmlLoad() {
  console.log('事件关系HTML页面加载完成');
}

onMounted(() => {
  console.log('事件关系实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="事件关系" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter1/event-relationship.html"
          width="100%"
          height="800px"
          frameborder="0"
          class="integration-iframe"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(content)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="event-relationship" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.integration-iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
