<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **概述**
几何分布$（Geometric\\ Distribution）$是统计学中的一种离散概率分布，用于描述在一系列独立的伯努利试验中，第一次成功发生之前的失败次数。几何分布可以用来表示成功之前进行的失败次数，或直到第一次成功所需的试验次数。

## **几何分布的定义**

对于几何分布，有两种常见的定义：

**1. 第一次成功前的失败次数（$$ X $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(X = k) = (1-p)^k p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是失败的次数（$$ k $$ 为非负整数）。

**2. 直到第一次成功所需的试验次数（$$ Y $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(Y = k) = (1-p)^{k-1} p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是试验次数（$$ k $$ 为正整数）。

#### **期望值和方差:**

  **对于失败次数（$$ X $$）：**

   $$ 
   期望值：E(X) = \\frac{1-p}{p}   \\\\
   方差：\\text{Var}(X) = \\frac{1-p}{p^2} 
   $$

 **对于试验次数（$$ Y $$）：**

$$
期望值： E(Y) = \\frac{1}{p} \\\\
方差： \\text{Var}(Y) = \\frac{1-p}{p^2} 
$$


## **特点**
**1. 无记忆性**：几何分布具有无记忆性，即过去的试验结果不会影响未来的成功概率。数学上表示为：
   $$
   P(X > m + n \\mid X > n) = P(X > m)
   $$
   其中 $$ X $$ 是第一次成功前的失败次数。
   
**2. 离散分布**：几何分布是一种定义在非负整数上的离散概率分布。
`;

function onHtmlLoad() {
  console.log('几何分布HTML页面加载完成');
}

onMounted(() => {
  console.log('几何分布实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="几何分布" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/geometric-distribution.html"
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
      <CommentPanel exp-id="geometric-distribution" />
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
