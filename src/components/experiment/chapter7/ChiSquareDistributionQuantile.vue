<template>
  <ExperimentBoard :panel-size="90">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe 
          src="/chapter7/chi-square-distribution-quantile.html" 
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
        <h3 class="text-lg font-semibold mb-4">卡方分布上分位点</h3>
        <div class="space-y-4">
          <div class="bg-orange-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">实验说明</h4>
            <p class="text-sm text-gray-600">
              卡方分布上分位点是统计推断中的重要概念，用于方差检验和拟合优度检验。
              通过调整自由度和显著性水平，观察分位点的变化。
            </p>
          </div>
        </div>
      </div>
    </template>
    
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full">
          <h3>卡方分布上分位点实验</h3>
          <p>卡方分布的上分位点（upper quantile）是指在给定置信水平下，卡方分布右尾部的临界值。</p>
          
          <h4>主要概念：</h4>
          <ul>
            <li>上α分位点：P(χ² > χ²α) = α</li>
            <li>分位点随自由度增大而增大</li>
            <li>当自由度较大时，分布趋于正态分布</li>
            <li>用于确定检验统计量的临界值</li>
          </ul>
          
          <h4>应用场景：</h4>
          <ul>
            <li>方差齐性检验</li>
            <li>拟合优度检验</li>
            <li>独立性检验</li>
            <li>置信区间构造</li>
          </ul>
        </div>
      </div>
    </template>
    
    <template #comment>
      <CommentPanel exp-id="chi-square-distribution-quantile" />
    </template>
  </ExperimentBoard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue'
import CommentPanel from '@/components/comment/CommentPanel.vue'

function onHtmlLoad() {
  console.log('卡方分布上分位点HTML页面加载完成')
}

onMounted(() => {
  console.log('卡方分布上分位点组件已挂载')
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