<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **函数极限的几何解释**

### **1. 数学定义**
函数 $f(x)$ 在点 $x_0$ 的**某去心邻域**内有定义，如果存在常数 $A$，对于**任意给定**的 $\\varepsilon > 0$（无论多么小），总存在 $\\delta > 0$，使得当 $0 < |x - x_0| < \\delta$ 时，有 $|f(x) - A| < \\varepsilon$，则称 $A$ 是 $f(x)$ 当 $x$ 趋向于 $x_0$ 时的极限。

数学符号描述：
$$\\lim_{x \\to x_0} f(x) = A \\quad \\text{或} \\quad f(x) \\to A \\ (x \\to x_0)$$

### **2. 几何意义**
对于任意 $\\varepsilon > 0$，总**存在** $\\delta > 0$，使得当 $x$ 进入 $x_0$ 的 $\\delta$ 邻域（去心）时，函数图像上的点 $(x, f(x))$ 全部落入直线 $y = A - \\varepsilon$ 与 $y = A + \\varepsilon$ 之间的带状区域内。

**注**：$\\delta$ 依赖于 $\\varepsilon$ 和 $x_0$，定义中 $0 < |x - x_0|$ 表示 $x$ 可以无限接近 $x_0$ 但不等于 $x_0$

### **3. 可视化说明（以 $f(x) = \\frac{1}{x}$ 为例）**
通过调节 $\\varepsilon$ 大小可调整带子宽度，拖动滑动条 $t$ 可观察 $x$ 距离 $x_0$ 多近时，函数图像进入 $2\\varepsilon$ 宽的带子中。另一方面，分别调节$\\varepsilon$和$x_0$滑动条，直观展示 $\\delta$ 与 $\\varepsilon$、$x_0$ 的依赖关系。`);
</script>

<template>
  <ExperimentBoard title="函数极限" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/classic/saqeyxpa?embed" width="1180" height="750" allowfullscreen
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
      <CommentPanel exp-id="function-limit" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
