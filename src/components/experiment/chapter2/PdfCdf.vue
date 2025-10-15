<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## 概率密度函数$（PDF）$与累积分布函数$（CDF）$

### 一、实验目的
本实验旨在帮助理解连续随机变量的概率密度函数$(PDF)$和累积分布函数$(CDF)$的概念及其相互关系。

### 二、实验原理
#### 1.概率密度函数$(PDF)$
概率密度函数描述了连续随机变量在某一点附近的概率密度。对于连续随机变量$X$，其$PDF$，即$f(x)$满足：
- $f(x) ≥ 0$ 对于所有x
- $\\int_{-\\infty}^{\\infty} f(x) dx = 1$（在整个定义域上的积分等于1）

#### 2.累积分布函数$(CDF)$
累积分布函数$F(x)$表示随机变量$X$取值小于等于$x$的概率，即$F(x) = P(X ≤ x)$。

$PDF$和$CDF$的关系：$F(x) = ∫(-∞, x) f(t)dt$，即$CDF$是$PDF$的积分。

### 三、实验操作
通过实验界面，你可以观察$PDF$和$CDF$曲线的形状，以及它们之间的对应关系。

### 四、观察与思考
- $PDF$曲线下的面积代表什么？
- 如何从$CDF$曲线中读取某个区间的概率？
- $PDF$和$CDF$各自的特点和应用场景是什么？

### 五、结论
本实验通过可视化展示，帮助我们建立了对连续随机变量$PDF$和$CDF$的直观理解，以及它们之间的数学关系。
`;
function onHtmlLoad() {
  console.log('PDF-CDFHTML页面加载完成');
}

onMounted(() => {
  console.log('PDF-CDF实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="PDF-CDF" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/pdf-cdf.html"
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
          <div v-html="toMarkdown(content)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="pdf-cdf" />
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
