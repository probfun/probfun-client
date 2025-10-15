<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const conclusionContent = `
## **函数可积条件实验**

本实验通过可视化达布大和与达布小和的收敛过程，直观展示了函数可积的充要条件：当分割无限加细时，上和与下和的差趋于零。

### **函数可积的充要条件**
函数 $f(x)$ 在区间 $[a, b]$ 上可积的充分必要条件是：达布大和与达布小和之差随着分割的加细而趋于零。

达布大和（上和）：$S = \\sum M_i \\Delta x_i$，其中 $M_i$ 是子区间上的上确界
达布小和（下和）：$s = \\sum m_i \\Delta x_i$，其中 $m_i$ 是子区间上的下确界

当分割加细时，如果 $S - s \\to 0$，则函数可积，且积分值为该极限值。

**实验特点：**
- 支持多种函数类型对比（连续函数与间断函数）
- 可手动或自动加细分割
- 实时显示上和、下和及其差值
`;

function onHtmlLoad() {
  console.log('可积条件HTML页面加载完成');
}

onMounted(() => {
  console.log('可积条件实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/calculus/integrability-conditions.html"
          width="100%"
          height="100%"
          frameborder="0"
          class="integration-iframe"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(conclusionContent)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="integrability-conditions" />
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
