<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **数列极限的几何解释**

### **1. 数轴上的表示**
对于任意 $\\varepsilon > 0$，存在正整数 $N$，当 $n > N$ 时，数列 $\\{a_n\\}$ 的所有项 $a_n$ 都落在区间 $(a - \\varepsilon, a + \\varepsilon)$ 内。

数学符号描述：
$$\\forall \\varepsilon > 0,\\ \\exists N \\in \\mathbb{N}^*,\\ 当\\ n > N\\ 时，有\\ |a_n - a| < \\varepsilon$$

### **2. 平面上的点集表示**
对于任意 $\\varepsilon > 0$，存在正整数 $N$，当 $n > N$ 时，点 $(n, a_n)$ 全部落在直线 $y = a - \\varepsilon$ 与 $y = a + \\varepsilon$ 之间的带状区域内。

几何意义：随着 $n$ 增大，数列点 $(n, a_n)$ 会被“限制”在越来越窄的带状区域中，体现无限趋近于 $a$ 的过程。

### **3. 可视化说明（以数列 $\\left\\{ \\frac{(-1)^n \\cdot 10}{n + 1} \\right\\}$ 为例）**
取数列 $a_n = \\frac{(-1)^n \\cdot 10}{n + 1}$，其极限为 $0$（因 $n \\to \\infty$ 时，$\\frac{10}{n + 1} \\to 0$）。

#### 关键观察：
- 当 $n$ 为奇数时，$a_n$ 为负数，落在第四象限
- 当 $n$ 为偶数时，$a_n$ 为正数，落在第一象限
- 随着 $n$ 增大，点 $(n, a_n)$ 逐渐靠近 $x$ 轴（$y=0$）
`);
</script>

<template>
  <ExperimentBoard title="数列极限" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/classic/phwxmpbd?embed" width="800" height="600" allowfullscreen
          style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
        />
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="renderLatex(toMarkdown(content))" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="sequence-limit" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
