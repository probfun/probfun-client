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
1. 使用"n值"滑动条调整离散分布的取值数量
2. 使用"动画速度"滑动条控制动画播放速度
3. 点击"播放动画"按钮可以观察n值变化时PMF和CDF的变化趋势
4. 点击"重置"按钮可以恢复到初始状态

### 四、观察与思考
- 当n值增大时，概率质量函数的形状如何变化？
- 累积分布函数(CDF)与概率质量函数(PMF)之间有什么关系？
- 如何从PMF图表中判断期望值的位置？

### 五、结论
通过本实验，我们直观地理解了离散随机变量的概率质量函数和累积分布函数的概念和性质，以及它们之间的关系。
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
