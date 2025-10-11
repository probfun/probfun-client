<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## 离散随机变量的概率质量函数$（PMF）$

### 一、实验目的
本实验通过交互式界面帮助理解离散随机变量的概率质量函数$(PMF)$的概念及其性质。

### 二、实验原理
概率质量函数$(PMF)$是描述离散随机变量取各个可能值的概率的函数。对于离散随机变量$X$，其$PMF$，即$P(X = x)$表示X取值为x的概率。

$PMF$具有以下性质：
1. 对于所有可能的取值$x$，$P(X = x) ≥ 0$
2. 所有可能取值的概率之和为1，即$ΣP(X = x) = 1$

### 三、实验操作
下面控制面板提供了三个滑动条，分别用于调整三个离散点的概率值。每次调整后，上方的$PMF$图表会实时更新，展示当前概率分布情况。

### 四、观察与思考
- 当调整一个点的概率时，其他点的概率如何变化？
- $PMF$图表的高度代表什么含义？
- 如何从$PMF$图表中判断哪个结果发生的可能性最大？

### 五、结论
通过本实验，我们直观地理解了离散随机变量的概率质量函数的概念和性质，以及如何通过调整概率值来观察概率分布的变化。
`;

function onHtmlLoad() {
  console.log('离散随机变量的PMFHTML页面加载完成');
}

onMounted(() => {
  console.log('离散随机变量的PMF实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="离散随机变量的PMF" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/discrete-pmf.html"
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
      <CommentPanel exp-id="discrete-pmf" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 900px;
}

.integration-iframe {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
