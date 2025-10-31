<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **二阶矩阵的特征值与特征向量**

### **一、定义**
给定方阵 $M$，若存在非零向量 $v$ 和标量 $\\lambda$，使得
$$
M*v = \\lambda *v
$$
则称 $\\lambda$ 为矩阵 $M$ 的特征值（eigenvalue），$v$ 为对应的特征向量（eigenvector）。

### **二、2×2 矩阵的特征多项式**
对于二阶矩阵
$$
M=\\begin{bmatrix}a & b \\\\ c & d\\end{bmatrix}
$$
特征值由特征方程确定：
$$
\\det(M-\\lambda I)=\\begin{vmatrix}a-\\lambda & b \\\\ c & d-\\lambda\\end{vmatrix}=(a-\\lambda)(d-\\lambda)-bc=0
$$
展开得到二次多项式：
$$
\\lambda^2-(a+d)\\lambda+(ad-bc)=0
$$
其根即为两个（不一定互异的）特征值。

### **三、求特征向量**
当得到某一特征值 $\\lambda$ 后，解齐次线性方程组
$$
(M-\\lambda I)v=0
$$
得到对应的特征向量 $v$（非零解，按比例项生成向量空间）。

### **四、几何意义**
- 特征向量方向在矩阵线性变换下保持不变（仅被伸缩），特征值给出伸缩倍数（有可能为负，表示反向）。
- 对2×2矩阵，可通过绘制若干初始向量变换前后的方向直观理解特征向量。

### **五、对角化与相似变换**
若矩阵 $A$ 有两个线性无关的特征向量，则可构造可逆矩阵 $P$ 使得
$$
P^{-1}MP = \\begin{bmatrix}\\lambda_1 & 0 \\\\ 0 & \\lambda_2\\end{bmatrix},
$$
称 $M$ 可对角化。对角化便于计算高次幂、矩阵指数等。

### **六、重根与不可对角化情形**
当特征多项式有重根（$\\lambda_1=\\lambda_2$）时，需判断特征向量的维数：
- 若代数重数等于几何重数（有两个线性独立特征向量），仍可对角化。
- 否则需用约旦标准形处理。

### **七、例子**
设
$$
A=\\begin{bmatrix}2 & 1\\\\1 & 2\\end{bmatrix},
$$
特征多项式 $\\lambda^2-4\\lambda+3=0$，解得 $\\lambda=1,3$。对应特征向量分别可取 $[1,-1]^T$ 和 $[1,1]^T$。

### **八、应用**
- 常微分方程线性系统（稳定性由实部判定）
- 主成分分析（PCA）中的协方差矩阵特征分解
- 动力学与振动分析中的模式分解

`);
</script>

<template>
  <ExperimentBoard title="二阶矩阵的特征值与特征向量" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/v3f4wk8e" width="100%" height="100%" allowfullscreen
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
      <CommentPanel exp-id="matrix-eigen" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
