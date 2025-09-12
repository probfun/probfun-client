<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **偏导数的几何意义**
偏导数是多元函数微积分中的重要概念，下面将从基本概念、三维空间表现和可视化示例三个方面详细说明偏导数的几何意义：

### **一、偏导数的基本概念**
偏导数是多元函数保持其他变量不变时对一个变量的导数，其几何意义可以理解为：坐标轴方向的变化率或切线斜率

### **二、三维空间中的几何表现**
曲面：对于曲面 $ z = f(x, y) $，在点 $ (x_0, y_0, z_0) $ 处：

固定 $ y = y_0 $，得到一条平行于 $ xOz $ 平面的曲线，其切线斜率就是 $ f_x(x_0, y_0) $

固定 $ x = x_0 $，得到一条平行于 $ yOz $ 平面的曲线，其切线斜率就是 $ f_y(x_0, y_0) $

### **三、可视化理解与示例**
在三维空间中，对 $ x $ 求偏导的过程可以通过与 $ xOz $ 平面平行的截面来展示，截面与曲面的交线就是一元函数曲线，其斜率即为关于 $ x $ 的偏导数；同理，对 $ y $ 求偏导的过程可以通过与 $ yOz $ 平面平行的截面来展示，截面与曲面的交线的斜率即为关于 $ y $ 的偏导数。
`);
</script>

<template>
  <ExperimentBoard title="偏导数" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/vts36shw?embed" width="1180" height="750" allowfullscreen
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
      <CommentPanel exp-id="partial-derivative" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
