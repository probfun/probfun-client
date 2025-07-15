<template>
  <ExperimentBoard :panel-size="90">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe 
          src="/chapter7/t-distribution-quantile.html" 
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
        <h3 class="text-lg font-semibold mb-4">t分布上分位点</h3>
        <div class="space-y-4">
          <div class="bg-purple-50 p-4 rounded-lg">
            <h4 class="font-medium mb-2">实验说明</h4>
            <p class="text-sm text-gray-600">
              t分布上分位点是统计推断中的重要概念，用于构造置信区间和进行假设检验。
              通过调整自由度和显著性水平，观察分位点的变化。
            </p>
          </div>
        </div>
      </div>
    </template>
    
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full">
          <h3>t分布上分位点实验</h3>
          <p>t分布的上分位点（upper quantile）是指在给定置信水平下，t分布右尾部的临界值。</p>
          
          <h4>主要概念：</h4>
          <ul>
            <li>上α分位点：P(T > tα) = α</li>
            <li>双侧分位点：P(|T| > tα/2) = α</li>
            <li>分位点随自由度增大而减小</li>
            <li>当自由度趋于无穷时，趋于标准正态分布分位点</li>
          </ul>
          
          <h4>应用场景：</h4>
          <ul>
            <li>单样本t检验</li>
            <li>两样本t检验</li>
            <li>置信区间构造</li>
            <li>假设检验中的临界值确定</li>
          </ul>
        </div>
      </div>
    </template>
    
    <template #comment>
      <CommentPanel exp-id="t-distribution-quantile" />
    </template>
  </ExperimentBoard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue'
import CommentPanel from '@/components/comment/CommentPanel.vue'

function onHtmlLoad() {
  console.log('t分布上分位点HTML页面加载完成')
}

onMounted(() => {
  console.log('t分布上分位点组件已挂载')
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