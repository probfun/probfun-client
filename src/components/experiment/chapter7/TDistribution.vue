<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';

function onHtmlLoad() {
  console.log('t分布HTML页面加载完成');
}

onMounted(() => {
  console.log('t分布组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter7/t-distribution.html"
          width="100%"
          height="800px"
          frameborder="0"
          class="rounded-lg shadow-lg"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #parameter>
      <div class="parameter-panel">
        <h3 class="text-lg font-semibold mb-4">
          t分布参数
        </h3>
        <div class="space-y-4">
          <div class="bg-blue-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">
              实验说明
            </h4>
            <p class="text-sm text-gray-600">
              t分布是统计学中的重要分布，用于小样本推断。
              通过调整自由度参数，观察分布形状的变化。
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full">
          <h3>t分布实验</h3>
          <p>t分布（Student's t-distribution）是由威廉·戈塞特（William Gosset）在1908年提出的概率分布。</p>

          <h4>主要特征：</h4>
          <ul>
            <li>对称分布，中心位于0</li>
            <li>形状由自由度参数决定</li>
            <li>当自由度增大时，逐渐趋近于标准正态分布</li>
            <li>尾部比正态分布更厚</li>
          </ul>

          <h4>应用场景：</h4>
          <ul>
            <li>小样本均值检验</li>
            <li>回归分析中的显著性检验</li>
            <li>置信区间估计</li>
          </ul>
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="t-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

.parameter-panel {
  padding: 1rem;
}

iframe {
  border: none;
  background: white;
}
</style>
