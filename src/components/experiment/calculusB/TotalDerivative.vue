<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **全微分的概念与几何意义**
全微分是多元函数微积分中的核心概念，它从局部线性近似的角度描述了多元函数的变化特性

### **一、全微分的定义**
对于二元函数 $ z = f(x, y) $，在点 $ (x, y) $ 的某邻域内有定义，如果函数在点 $ (x, y) $ 的全增量 $ \\Delta z = f(x + \\Delta x, y + \\Delta y) - f(x, y) $ 可表示为：
$$
\\Delta z = A\\Delta x + B\\Delta y + o\\left(\\sqrt{\\Delta x^2 + \\Delta y^2}\\right)
$$
其中 $ A $、$ B $ 不依赖于 $ \\Delta x $、$ \\Delta y $ 而仅与 $ x, y $ 有关，则称函数 $ z = f(x, y) $ 在点 $ (x, y) $ 处可微分，而 $ A\\Delta x + B\\Delta y $ 称为函数在该点的全微分，记作 $ dz $

### **二、全微分的几何意义**
特别地，当函数可微时，全微分中的系数 $ A $ 和 $ B $ 分别为该点处对 $ x $ 和 $ y $ 的偏导数，即
$$
dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy
$$

对于曲面 $ z = f(x, y) $，在点 $ (x_0, y_0) $ 处可微时：曲面在该点有不平行于 $ z $ 轴的切平面
- 切平面的法向量是 $ \\vec{n} = (z_x(P), z_y(P), -1) $
- 切平面方程为：$ z - z_0 = f_x(x_0, y_0)(x - x_0) + f_y(x_0, y_0)(y - y_0) $
- 全微分 $ dz $ 恰好等于切平面上点的竖坐标增量

### **三、可视化理解与示例**
- 通过曲面上一点 $ P $ 分别作平行于 $ xOz $ 和 $ yOz $ 的平面，
- 与曲面相交得到两条空间曲线
- 这两条曲线的切线斜率分别对应于函数在 $ x $ 和 $ y $ 方向的偏导数
- 由这两条切线确定的平面就是切平面
`);
</script>

<template>
  <ExperimentBoard title="全微分" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/cdfabne2?embed" width="1180" height="750" allowfullscreen
          style="border: 1px solid #e4e4e4;border-radius: 4px;"
        />
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="renderLatex(toMarkdown(content))" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="total-derivative" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
