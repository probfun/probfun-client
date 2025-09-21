<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
## **概述**
均匀分布$（Uniform\ Distribution）$是概率论中的一种分布类型，在指定的区间内，所有的数值出现的概率都相同。均匀分布可以分为离散型均匀分布和连续型均匀分布。

## **均匀分布的定义**

对于连续型均匀分布，其概率密度函数$（PDF）$定义为：

$$ 
f(x) =\\begin{cases} 
\\frac{1}{b-a}, & a \\leq x \\leq b \\\\
0, & \\text{其他} 
\\end{cases} 
$$

对于离散型均匀分布，其概率质量函数$（PMF）$定义为：

$$
P(X = x) = \\frac{1}{n}, \\quad x \\in \\{x_1, x_2, \\dots, x_n\\}
$$

其中：
- $ a $ 和 $ b $ 分别是区间的下限和上限；
- $ X $ 是均匀分布的随机变量；
- $ n $ 是可能取值的数量。

**分布函数 (CDF)**

$$
F(x) = \\begin{cases}
0 & \\text{当 } x < a \\\\ 
\\frac{x-a}{b-a} & \\text{当 } a \\leq x \\leq b \\\\ 
1 & \\text{当 } x> b
\\end{cases}
$$

## **期望值和方差:**

- **对于连续型均匀分布：**
  - 期望值：$ E(X) = \\frac{a + b}{2} $
  - 方差：$ \\text{Var}(X) = \\frac{(b - a)^2}{12} $

- **对于离散型均匀分布：**
  - 期望值：$ E(X) = \\frac{1}{n} \\sum_{i=1}^{n} x_i $
  - 方差：$ \\text{Var}(X) = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - E(X))^2 $

## **特点**

- **1. 均匀性**：均匀分布中的每个数值或区间的每个子区间都有相同的概率。
- **2. 独立性**：每个子区间的概率只与子区间的长度成正比。
- **3. 简单性**：均匀分布是最简单的一种概率分布，特别是在没有任何其他信息时常被用作模型。

## **线性变换**

给定随机变量 $ X \\sim U(a, b) $，考虑线性变换 $ Y = cX + d $，变换后的变量 $ Y $ 也服从均匀分布：

- 当 $ c > 0 $ 时：$ Y \\sim U(c \\cdot a + d, c \\cdot b + d) $
- 当 $ c < 0 $ 时：$ Y \\sim U(c \\cdot b + d, c \\cdot a + d) $

变换后的概率密度函数为：
$$
f_Y(y) = \\frac{1}{|c|(b-a)} \\quad \\text{对于} \\ y \\ \\text{在新区间内}
$$

变换后的分布函数为：
$$
F_Y(y) = \\begin{cases}
0 & y < \\min(c \\cdot a + d, c \\cdot b + d) \\\\ 
\\frac{\\frac{y-d}{c} - a}{b-a} & \\text{当} \\ c>0, \\ ca+d \\leq y \\leq cb+d \\\\ 
\\frac{b - \\frac{y-d}{c}}{b-a} & \\text{当} \\ c<0, \\ cb+d \\leq y \\leq ca+d \\\\ 
1 & y> \\max(c \\cdot a + d, c \\cdot b + d)
\\end{cases}
$$
`;

function onHtmlLoad() {
  console.log('均匀分布HTML页面加载完成');
}

onMounted(() => {
  console.log('均匀分布实验组件已挂载');
});
</script>

<template>
  <ExperimentBoard title="均匀分布" :tags="[]" :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div class="html-experiment-container">
        <iframe
          src="/chapter2/uniform-distribution.html"
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
      <CommentPanel exp-id="uniform-distribution" />
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
