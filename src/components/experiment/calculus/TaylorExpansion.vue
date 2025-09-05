<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **泰勒定理**

### **1. 数学定义**
设函数 $f(x)$ 在 $[a,b]$ 上存在直至 $n$ 阶连续导函数，在 $(a,b)$ 上存在 $n+1$ 阶导函数，则对任意给定的 $x, x_0 \\in [a,b]$，至少存在一点 $\\xi \\in (a,b)$，使得：
$$f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!} (x - x_0)^k + R_n(x)$$

### **2. 公式组成**
- **泰勒多项式**：$T_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(x_0)}{k!} (x - x_0)^k$
- **拉格朗日型余项**：$R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} (x - x_0)^{n+1}$
- **佩亚诺型余项**：$R_n(x) = o((x - x_0)^n)$（当 $f(x)$ 仅在 $x_0$ 点有 $n$ 阶导数时）

### **3. 特殊情形：麦克劳林公式**
当 $x_0 = 0$ 时，泰勒公式称为麦克劳林公式：
$$f(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(0)}{k!} x^k + R_n(x)$$

### **4. 可视化说明**
以 $f(x) = \\sin x$ 为例演示泰勒公式的近似效果：**调节滑动条 $n$**，观察随着阶数增加，泰勒多项式与原函数的逼近程度
`);
</script>

<template>
  <ExperimentBoard title="泰勒展开" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <iframe
        src="https://www.geogebra.org/classic/wkkhrrkg?embed" width="800" height="600" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="renderLatex(toMarkdown(content))" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="taylor-expansion" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
