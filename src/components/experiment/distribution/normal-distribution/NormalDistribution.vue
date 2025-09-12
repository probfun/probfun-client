<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **概述**
正态分布$（Normal\\ Distribution）$，又称高斯分布$（Gaussian\\ Distribution）$，是一种在统计学和自然科学中广泛应用的重要连续概率分布。

### **正态分布的定义**
正态分布的概率密度函数$(PDF)$的公式为：
$$ 
f(x|\\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right) 
$$

其中：
- $$\\mu$$ 表示正态分布的均值，决定了分布的中心位置。
- $$\\sigma^2$$ 表示方差，决定了分布的宽度和形状。
- $$\\sigma$$ 是标准差，方差的平方根。

## **特点**
正态分布的图形呈钟形曲线，具有以下特点：

- **1. 对称性**：正态分布关于均值 $$\\mu$$ 对称。
- **2. 均值、中位数和众数相等**：正态分布中，均值、中位数和众数是相同的。
- **3. 68-95-99.7 规则**：约68%的数据位于均值 $$\\mu$$ 加减一个标准差 $$\\sigma$$ 范围内，95%的数据位于均值加减两个标准差内，99.7%的数据位于均值加减三个标准差内。
- **4. 渐近性**：曲线的两端渐近于水平线，但永远不会触及水平线。

## **线性变换**
- 正态分布在进行线性变换时，新的分布仍然是正态分布。
- 假设我们对随机变量 $$X \\sim N(\\mu, \\sigma^2)$$ 进行线性变换：$$Y = aX + b$$，其中 $$a$$ 和 $$b$$ 为常数。那么，新的随机变量 $$Y$$ 仍然服从正态分布，且其均值和方差变为：
$$ 
Y \\sim N(a\\mu + b, a^2\\sigma^2)
$$

其中：
- 新的均值 $$a\\mu + b$$ 代表原均值经过线性变换后的值。
- 新的方差 $$a^2\\sigma^2$$ 是原方差乘以系数 $$a^2$$ 后的结果，表示分布的扩展或收缩。

**线性变换保留了正态分布的钟形曲线形状，只是改变了其位置和尺度。**
`;

function onHtmlLoad() {
  console.log('正态分布HTML页面加载完成');
}

onMounted(() => {
  console.log('正态分布实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="正态分布" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/normal-distribution.html"
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
      <CommentPanel exp-id="normal-distribution" />
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
