<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const conclusionContent = `
## t分布实验

## 概率密度函数
t分布的概率密度函数形式如下：
$$
f(t) = \\frac{\\Gamma(\\frac{df+1}{2})}{\\sqrt{df\\pi}\\Gamma(\\frac{df}{2})}\\left(1+\\frac{t^2}{df}\\right)^{-\\frac{df+1}{2}}
$$
其中：
- $\df\$ 为自由度
- $\ Γ\$ 表示伽马函数
- $\ t\$ 为随机变量

## 基本性质
- **对称性**：关于$\ t=0\$对称，均值为0（当$\ df>1\$时）
- **形状参数**：自由度$\ df\$决定分布形状，$\ df\$越小尾部越厚
- **方差特性**：方差为$\\frac{df}{df-2}\$（当$\ df>2\$时），$\df≤2\$时方差无穷大
- **渐近性质**：当$\ df→∞\$时，$\ t\$分布收敛于标准正态分布
- **峰度特性**：峰度大于正态分布，有更厚的数据尾部（$\ df>4\$时峰度为$\\frac{6}{df-4}\$）

## 历史发展
$\ t\$分布由英国统计学家威廉·希利·戈塞特于1908年提出。当时戈塞特在爱尔兰都柏林的吉尼斯啤酒厂工作，需要解决小样本数据的统计问题。

由于吉尼斯公司禁止员工发表研究成果，戈塞特被迫使用笔名"$\ Student\$"发表论文，因此$\ t\$分布也被称为"学生$\ t\$分布"。这一发现革命性地改变了小样本统计分析方法，为后来的假设检验和置信区间估计奠定了基础。

## 应用案例
### 医学研究
在新药临床试验中，使用$\ t\$检验比较小样本(如30名患者)的治疗效果，判断药物是否显著有效。

### 质量控制
制造业中，对生产批次的小样本进行$\ t\$检验，判断生产过程是否稳定，是否需要调整工艺参数。

### 市场调研
在消费者满意度调查中，通过$\ t\$分布计算置信区间，用小样本数据推断整体消费者群体的满意度水平。`;

function onHtmlLoad() {
  console.log('t分布HTML页面加载完成');
}

onMounted(() => {
  console.log('t分布组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter7/t-distribution.html"
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
      <CommentPanel exp-id="t-distribution" />
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
