<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **概述**
泊松分布$（Poisson\\ Distribution）$ 是统计学中一种离散概率分布，用于描述在固定的时间间隔或空间区域内，事件发生的次数。它常用于建模某个事件的发生频率，特别是在平均事件发生率已知的情况下。泊松分布适用于事件发生概率相互独立的情境，并且事件发生是稀疏且随机的。

## **泊松分布的定义**

泊松分布的概率质量函数$（PMF）$定义为：

$$ 
P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\lambda $$ 是单位时间或单位区域内事件发生的平均次数（期望值）；
- $$ e $$ 是自然对数的底数（约等于 $2.71828$）；
- $$ k $$ 是事件发生的实际次数（$$ k $$ 为非负整数）。

#### **期望值和方差:**

- **期望值:**$$ E(X) = \\lambda $$
- **方差：**$$ \\text{Var}(X) = \\lambda $$

## **特点**

- **1. 稀疏性**：泊松分布通常用于建模稀疏事件，即事件发生的次数相对较少。
- **2. 独立性**：事件发生的次数之间是独立的。
- **3. 无上限**：理论上事件的发生次数可以是任意大的非负整数。
`;

function onHtmlLoad() {
  console.log('泊松分布HTML页面加载完成');
}

onMounted(() => {
  console.log('泊松分布实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="泊松分布" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/poisson-distribution.html"
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
      <CommentPanel exp-id="poisson-distribution" />
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
