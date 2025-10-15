<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **导数的几何意义**

### **1. 数学定义**
导数 $f'(x_0)$ 表示函数曲线 $y = f(x)$ 在点 $(x_0, f(x_0))$ 处切线的斜率。切线方程为：
$$y = f'(x_0)(x - x_0) + f(x_0)$$

### **2. 可视化说明（以 $f(x) = x^2$ 为例）**
通过调节参数观察导数的几何意义：
- **调节滑动条 h 和 k**：观察曲线割线的极限变化，当割线趋近于某一位置时，会“收敛”为切线，直观体现割线极限是切线的过程
- **调节 $x_0$**：改变切点横坐标，观察切线斜率的变化（斜率由 $f'(x_0)$ 决定）

### **3. 核心结论**
- 导数的几何意义通过“切线斜率”和“割线逼近切线”的可视化，将抽象的导数定义转化为直观几何图形
- 本质是用极限思想（割线→切线）建立函数 $f(x)$ 与导函数 $f'(x)$ 的几何关联
- 导数“刻画函数在某点的变化率”：$f'(x_0)$ 越大，切线越陡峭，函数在 $x_0$ 处变化越快
`);
</script>

<template>
  <ExperimentBoard title="导数" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/classic/xhe8sdbe?embed" width="100%" height="100%" allowfullscreen
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
      <CommentPanel exp-id="derivative-geometry" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
