<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **概述**
二项分布（$$Binomial\\ Distribution$$）是统计学中常见的一种离散概率分布，用于描述在重复进行的独立试验中，某个事件发生的次数的分布情况。该事件通常只有两个可能的结果，分别称为“成功”和“失败”。二项分布的典型应用场景包括抛硬币、抽样检验等。

## **二项分布的定义**
如果在每次试验中，事件发生的概率为 $$ p $$，那么在进行 $$ n $$ 次独立试验后，事件发生 $$ k $$ 次的概率由以下公式给出：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\binom{n}{k} $$ 是二项系数，表示从 $$ n $$ 次试验中选择 $$ k $$ 次成功的组合数，即 $$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$；
- $$ p $$ 是事件成功的概率；
- $$ 1-p $$ 是事件失败的概率。

#### 参数：
- 试验次数 $$ n $$：表示进行独立试验的总次数。
- 成功概率 $$ p $$：表示每次试验成功的概率。
- 失败概率 $$ 1-p $$：表示每次试验失败的概率。

#### **期望值和方差**：
- **期望值：$$ E(X) = np $$**
- **方差：$$ \\text{Var}(X) = np(1-p) $$**

## **对比：两点分布（Bernoulli分布）**
两点分布，是二项分布的特殊情况，即 $$ n = 1 $$ 时的二项分布。它表示一次试验的结果，其中“成功”的概率为 $$ p $$，而“失败”的概率为 $$ (1-p) $$。两点分布的概率质量函数$（PMF）$为：

$$
P(X = k) = \\begin{cases} 
p, & \\text{如果 } k = 1 \\\\
1-p, & \\text{如果 } k = 0 
\\end{cases}
$$

其中：
- $$ X $$ 表示事件发生的结果，取值为 $0$ 或 $1$。

## **应用**
**二项分布**：用于计算多次试验中成功次数的分布情况。例如，抛10次硬币，计算出现正面的次数。

**两点分布**：用于描述单次试验中成功与失败的情况。例如，抛一次硬币，记录正面朝上的概率。

二项分布与两点分布密切相关，是统计学中研究概率和事件发生次数的基本工具。`;

function onHtmlLoad() {
  console.log('二项分布HTML页面加载完成');
}

onMounted(() => {
  console.log('二项分布实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="二项分布" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/binomial-distribution.html"
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
      <CommentPanel exp-id="binomial-distribution" />
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
