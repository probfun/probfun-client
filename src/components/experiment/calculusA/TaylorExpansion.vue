<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const select = ref('sin');

const buttonTexts = ref([
  { id: 'sin', text: '$\sin x$' },
  { id: 'cos', text: '$\cos x$' },
  { id: 'exp', text: '$\e^x$' },
  { id: 'ln', text: '$\ln(1+x)$' },
  { id: 'pow', text: '$\(1+x)^m$' },
]);

function handleButtonClick(id) {
  select.value = id;
}

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
以 $f(x) = \\sin x, \\cos x, \e^x, \\ln(1+x), \(1+x)^m$ 为例演示泰勒公式的近似效果：**调节滑动条 $n$**，观察随着阶数增加，泰勒多项式与原函数的逼近程度
`);
</script>

<template>
  <ExperimentBoard title="泰勒展开" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <iframe
        v-if="select === 'sin'"
        src="https://www.geogebra.org/calculator/vj86stas?embed" width="1180" height="700" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
      <iframe
        v-if="select === 'cos'"
        src="https://www.geogebra.org/calculator/cuzz5rje?embed" width="1180" height="700" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
      <iframe
        v-if="select === 'exp'"
        src="https://www.geogebra.org/calculator/bhg3tau9?embed" width="1180" height="700" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
      <iframe
        v-if="select === 'ln'"
        src="https://www.geogebra.org/calculator/rtxrsvnp?embed" width="1180" height="700" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
      <iframe
        v-if="select === 'pow'"
        src="https://www.geogebra.org/calculator/uczthqbc?embed" width="1180" height="700" allowfullscreen
        style="border: 1px solid #e4e4e4;border-radius: 4px;" frameborder="0"
      />
      <div class="flex items-center mb-1 mt-3">
        <span class="text-lg font-bold ml-8">选择函数：</span>
        <div class="flex ml-2 gap-2">
          <button
            v-for="btn in buttonTexts"
            :key="btn.id"
            class="px-8 py-2 rounded-lg transition-all duration-200" :class="[
              select === btn.id
                ? 'bg-primary text-white font-medium shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            @click="handleButtonClick(btn.id)"
            v-html="renderLatex(toMarkdown(btn.text))"
          />
        </div>
      </div>
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
