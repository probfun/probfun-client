<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **二维平面向量的线性组合**

### **一、线性组合与向量组的张成**
给定平面向量 $\\mathbf{u},\\mathbf{v}\\in\\mathbb{R}^2$，任意标量 $a,b$ 的线性组合为
$$
a\\mathbf{u}+b\\mathbf{v}
$$
所有这类线性组合构成的集合称为 $\\{\\mathbf{u},\\mathbf{v}\\}$ 的张成（span），记为 $\\mathrm{span}\\{\\mathbf{u},\\mathbf{v}\\}$

### **二、线性相关与无关**
- 若存在不全为零的 $a,b$ 使得 $a\\mathbf{u}+b\\mathbf{v}=0$，则 $\\mathbf{u},\\mathbf{v}$ 线性相关。
- 若仅平凡解 $a=b=0$，则线性无关。二维空间中两向量线性无关时可作为基底（basis）。

### **三、基与坐标**
若 $\\{\\mathbf{u},\\mathbf{v}\\}$ 构成基，则任一 $\\mathbf{w}\\in\\mathbb{R}^2$ 唯一表示为
$$
\\mathbf{w}=x\\mathbf{u}+y\\mathbf{v},
$$
系数 $(x,y)$ 即为 $\\mathbf{w}$ 在该基下的坐标。

### **四、几何解释**
- 两个线性无关向量的所有线性组合形成整个平面（二维）。
- 当两个向量共线（线性相关）时，线性组合只生成一条直线。

### **五、解线性方程组的视角**
向量方程 $x\\mathbf{u}+y\\mathbf{v}=\\mathbf{b}$ 等价于求解线性代数方程 $U\\begin{bmatrix}x\\\\y\\end{bmatrix}=\\mathbf{b}$，其中 $U=[\\mathbf{u}\\ \\mathbf{v}]$ 为列矩阵。若 $U$ 可逆（列向量线性无关），则有唯一解。

### **六、示例**
取 $\\mathbf{u}=(1,0)^T,\\ \\mathbf{v}=(0,1)^T$，任意向量 $(x,y)^T$ 可表示为 $x\\mathbf{u}+y\\mathbf{v}$。若 $\\mathbf{u}=(1,1)^T,\\ \\mathbf{v}=(1,-1)^T$，它们也线性无关且可作为另一组基。

### **七、与特征分解的联系**
在线性变换与特征向量讨论中，基的选择（如用特征向量构成的基）能将复杂的变换用更简单的坐标形式表示，便于分析。
`);
</script>

<template>
  <ExperimentBoard title="二维平面向量的线性组合" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/gjxjcyvn" width="100%" height="100%" allowfullscreen
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
      <CommentPanel exp-id="linear-combination" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
