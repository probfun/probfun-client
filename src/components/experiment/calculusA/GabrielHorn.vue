<script setup lang="ts">
import { onMounted } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const conclusionContent = `
## 加百利喇叭 (Gabriel's Horn)

### 概念介绍
加百利喇叭是一个数学悖论，由曲线 $y = \\frac{1}{x} (x ≥ 1)$ 绕x轴旋转而成的几何物体。这个奇特的三维形状具有**无限表面积**却拥有**有限体积**的矛盾性质。

### 数学性质
- **无限表面积**：表面积积分发散至无穷大
- **有限体积**：体积积分收敛于 $\\pi$
- **形状特征**：随着x值增大，喇叭无限延伸且无限变细

### 历史发展
加百利喇叭由意大利数学家埃万杰利斯塔·托里拆利于17世纪发现，因此也被称为"托里拆利的小号"。

这一发现挑战了当时人们对无穷大的理解，成为微积分发展史上的重要案例，展示了看似矛盾的几何性质如何通过严格的数学分析得到证明。

### 数学公式
#### 体积计算
$$V = \\pi \\int_{1}^{\\infty} \\left(\\frac{1}{x}\\right)^2 dx = \\pi$$

#### 表面积计算
$$A = 2\\pi \\int_{1}^{\\infty} \\frac{1}{x}\\sqrt{1 + \\frac{1}{x^4}} dx = \\infty$$

### 悖论解释
加百利喇叭悖论产生的原因是：当喇叭无限延伸时，其直径以足够快的速度减小，使得体积收敛为有限值，而表面积仍然发散至无穷大。

这意味着理论上你可以用有限的油漆填满喇叭内部，却无法用这些油漆覆盖其外表面——这一违反直觉的结论展现了无穷级数收敛与发散的微妙差别。

### 数学意义
加百利喇叭在数学分析中具有重要意义：
- 帮助理解反常积分的收敛与发散判定
- 展示了几何直觉可能与数学严格性产生冲突
- 为后来的分形几何和测度理论提供了思想基础
`;

onMounted(() => {
  console.log('加百利喇叭组件已挂载');
});
</script>

<template>
  <ExperimentBoard :panel-size="90" :show-parameter-panel="false">
    <template #experiment>
      <div style="width: 100%; height: calc(100% - 60px); padding: 10px;">
        <iframe
          src="https://www.geogebra.org/calculator/qkt9vhhz?embed" width="100%" height="100%" allowfullscreen
          style="border: 1px solid #e4e4e4; border-radius: 4px;"
          frameborder="0"
        />
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="markdown-body prose prose-sm max-w-none space-y-4">
          <div v-html="toMarkdown(conclusionContent)" />
        </div>
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="gabriel-horn" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.html-experiment-container {
  width: 100%;
  height: 100%;
  min-height: 800px;
}

iframe {
  border: none;
  background: white;
}
</style>
