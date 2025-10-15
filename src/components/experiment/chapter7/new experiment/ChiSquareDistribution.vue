<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const conclusionContent = `
## 卡方分布

## 概率密度函数
卡方分布的概率密度函数形式如下：
$$
f(x) = \\frac{1}{2^{\\frac{df}{2}}\\Gamma(\\frac{df}{2})} x^{\\frac{df}{2}-1} e^{-\\frac{x}{2}}
$$
其中：
- $df$ 为自由度
- $\ Γ\$ 表示伽马函数
- $x$ 为随机变量

## 基本性质
- **非负性**：只在$x≥0$时有定义
- **形状参数**：自由度$df$决定分布形状，$df$越小分布越偏斜
- **可加性**：若$X \\sim \\chi^2(n)$，$Y \\sim \\chi^2(m)$，且$X$与$Y$独立，则$X+Y \\sim \\chi^2(n+m)$
- **期望与方差**：$E[X] = df$，$Var(X) = 2df$
- **渐近性质**：当$df \\to∞$时，$\\chi^2(df)$分布近似于$N(df, 2df)$

## 历史发展
卡方分布由德国数学家卡尔·皮尔逊于1900年提出，是统计学中最重要的分布之一。皮尔逊在研究拟合优度检验时首次引入了这一分布。

这一分布最初被称为"$\\chi^2$分布"，其中"$\\chi$"是希腊字母，读作"卡方"，因此中文翻译为卡方分布。卡方分布的提出为假设检验和统计推断奠定了重要基础。

## 应用案例
### 拟合优度检验
在分类数据的拟合优度检验中，卡方分布用于判断观测数据是否与理论分布一致。例如，检验骰子是否均匀。

### 独立性检验
在列联表分析中，使用卡方分布判断两个分类变量是否独立。例如，检验吸烟与肺癌是否相关。

### 方差估计
在正态总体中，样本方差的抽样分布服从卡方分布，可用于方差的区间估计和假设检验。`;

function onHtmlLoad() {
  console.log('卡方分布HTML页面加载完成');
}

onMounted(() => {
  console.log('卡方分布组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter7/chi-square-distribution.html"
          width="100%"
          height="100%"
          frameborder="0"
          class="rounded-lg shadow-lg"
          @load="onHtmlLoad"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <CardContent class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(conclusionContent)" />
        </CardContent>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="chi-square-distribution" />
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
