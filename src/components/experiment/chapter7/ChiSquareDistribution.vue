<template>
  <ExperimentBoard :panel-size="90">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe 
          src="/chapter7/chi-square-distribution.html" 
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
        <h3 class="text-lg font-semibold mb-4">卡方分布参数</h3>
        <div class="space-y-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">实验说明</h4>
            <p class="text-sm text-gray-600">
              卡方分布是统计学中的重要分布，用于假设检验和拟合优度检验。
              通过调整自由度参数，观察分布形状的变化。
            </p>
          </div>
        </div>
      </div>
    </template>
    
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full">
          <h3>卡方分布实验</h3>
          <p>卡方分布（Chi-square distribution）是统计学中最重要的分布之一，广泛应用于假设检验。</p>
          
          <h4>主要特征：</h4>
          <ul>
            <li>非对称分布，只取正值</li>
            <li>形状由自由度参数决定</li>
            <li>当自由度增大时，分布逐渐趋于正态分布</li>
            <li>均值等于自由度，方差等于2倍自由度</li>
          </ul>
          
          <h4>应用场景：</h4>
          <ul>
            <li>拟合优度检验</li>
            <li>独立性检验</li>
            <li>方差检验</li>
            <li>置信区间估计</li>
          </ul>
        </div>
      </div>
    </template>
    
    <template #comment>
      <CommentPanel exp-id="chi-square-distribution" />
    </template>
  </ExperimentBoard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue'
import CommentPanel from '@/components/comment/CommentPanel.vue'

function onHtmlLoad() {
  console.log('卡方分布HTML页面加载完成')
}

onMounted(() => {
  console.log('卡方分布组件已挂载')
})
</script>

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