<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **二重积分的几何与物理意义**
二重积分是多元函数微积分学的重要内容，是一元函数定积分的推广，在物理学、工程学等领域有广泛应用。

### **一、二重积分的定义**
二重积分是二元函数在有界闭区域 $ D $ 上的积分，定义为：
将区域 $ D $ 任意分成 $ n $ 个小区域 $ \\Delta \\sigma_i $，在每个小区域上任取一点 $ (\\xi_i, \\eta_i) $，作和式 $ \\sum f(\\xi_i, \\eta_i)\\Delta \\sigma_i $，当各小区域的最大直径 $ \\lambda $ 趋近于 $ 0 $ 时，若该和式极限存在，则称此极限为 $ f(x, y) $ 在 $ D $ 上的二重积分，记为：
$$
\\iint_D f(x, y) \\, d\\sigma = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} f(\\xi_i, \\eta_i)\\Delta \\sigma_i
$$

### **二、几何意义**

当 $ f(x, y) \\geq 0 $ 时，二重积分 $ \\iint_D f(x, y)\\, d\\sigma $ 表示以 $ D $ 为底、曲面 $ z = f(x, y) $ 为顶的曲顶柱体的体积

当 $ f(x, y) $ 在 $ D $ 上有正有负时，二重积分等于 $ xOy $ 平面上方体积与下方体积之差

### **三、物理意义**
计算平面薄片的质量：若平面薄片在点 $ (x, y) $ 处的面密度为 $ \\rho(x, y) $，则其质量为：
$$
M = \\iint_D \\rho(x, y)\\, dA
$$

### **四、可视化步骤**
**参数$ s $在左侧的代数区可调节**

二重积分的可视化包括以下过程：

1.绘制被积函数 $ z = f(x, y) $ 的三维曲面

2.绘制积分区域 $ D $ 在 $ xOy $ 平面的投影

3.展示曲面与投影区域之间的柱体体积

4.通过分割展示平顶柱体体积和逼近曲顶柱体体积的过程
`);
</script>

<template>
  <ExperimentBoard title="二重积分" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/vvu97jm9?embed" width="100%" height="100%" allowfullscreen
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
      <CommentPanel exp-id="double-integral" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
