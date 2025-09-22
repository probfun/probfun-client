<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **三元一次方程组**

### **一、数学定义与矩阵表示**
三元一次方程组是由三个一次方程组成的方程组，每个方程都有三个未知数。其一般形式为：

$$
\\begin{cases}
ax + by + cz = d \\\\
ex + fy + gz = h \\\\
ix + jy + kz = l
\\end{cases}
$$

在**线性代数**中，我们可以将其表示为**矩阵形式**：

$$
\\begin{bmatrix} a & b & c \\\\
e & f & g \\\\
i & j & k \\end{bmatrix} \\begin{bmatrix} x \\\\
y \\\\
z \\end{bmatrix} = \\begin{bmatrix} d \\\\
h \\\\
l \\end{bmatrix}
$$

其中：
- $A = \\begin{bmatrix} a & b & c \\\\
e & f & g \\\\
i & j & k \\end{bmatrix}$ 称为**系数矩阵**
- $X = \\begin{bmatrix} x \\\\
y \\\\
z \\end{bmatrix}$ 称为**未知数向量**
- $B = \\begin{bmatrix} d \\\\
h \\\\
l \\end{bmatrix}$ 称为**常数项向量**

我们也可以写成紧凑形式：$AX = B$

### **二、增广矩阵与行变换**
为了求解方程组，线性代数中常用**增广矩阵**来表示方程组：

$$
\\left[ \\begin{array}{ccc|c} a & b & c & d \\\\
e & f & g & h \\\\
i & j & k & l \\end{array} \\right]
$$

通过对增广矩阵进行**初等行变换**（行交换、行倍乘、行加减），我们可以将其转化为**行阶梯形矩阵**或**行最简形矩阵**，从而更容易判断解的存在性和求解。

### **三、几何意义**
三元一次方程组的几何意义是在三维空间中求解三个平面的交点。每个三元一次方程对应空间中的一个平面，方程组的解就是这三个平面的交点坐标。

这种几何解释进一步拓展了**代数与几何之间的联系**，是理解高维线性空间的基础。

### **四、解的情况与线性相关性**
三元一次方程组的解有三种可能情况，这与系数矩阵的**秩**密切相关：

- **唯一解**：当系数矩阵的秩等于增广矩阵的秩且等于未知数个数（3）时，方程组有唯一解。几何上表现为三个平面相交于一点。
- **无解**：当系数矩阵的秩小于增广矩阵的秩时，方程组无解。几何上表现为三个平面没有共同的交点。
- **无穷多解**：当系数矩阵的秩等于增广矩阵的秩但小于未知数个数时，方程组有无穷多解。几何上表现为三个平面相交于一条直线或三个平面重合。

从**线性相关性**角度看：
- 当三个方程对应的行向量线性无关时，方程组有唯一解
- 当三个方程对应的行向量线性相关但不满足一致性条件时，方程组无解
- 当三个方程对应的行向量线性相关且满足一致性条件时，方程组有无穷多解

### **五、行列式与克拉默法则**
对于三元一次方程组，我们可以使用**行列式**来判断解的情况：

系数矩阵的行列式为：
$$
\\det(A) = \\begin{vmatrix} a & b & c \\\\
e & f & g \\\\
i & j & k \\end{vmatrix} = a(fk - gj) - b(ek - gi) + c(ej - fi)
$$

- 当 $\\det(A) \\neq 0$ 时，方程组有唯一解，可由**克拉默法则**求得：
  $$
  x = \\frac{\\begin{vmatrix} d & b & c \\\\
  h & f & g \\\\
  l & j & k \\end{vmatrix}}{\\det(A)}, \\quad y = \\frac{\\begin{vmatrix} a & d & c \\\\
  e & h & g \\\\
  i & l & k \\end{vmatrix}}{\\det(A)}, \\quad z = \\frac{\\begin{vmatrix} a & b & d \\\\
  e & f & h \\\\
  i & j & l \\end{vmatrix}}{\\det(A)}
  $$
- 当 $\\det(A) = 0$ 时，方程组可能无解或有无穷多解

### **六、线性组合视角**
从**线性组合**的角度看，解方程组 $AX = B$ 等价于寻找常数 $x$、$y$ 和 $z$，使得：

$$
x \\begin{bmatrix} a \\\\
e \\\\
i \\end{bmatrix} + y \\begin{bmatrix} b \\\\
f \\\\
j \\end{bmatrix} + z \\begin{bmatrix} c \\\\
g \\\\
k \\end{bmatrix} = \\begin{bmatrix} d \\\\
h \\\\
l \\end{bmatrix}
$$

即判断向量 $B$ 是否可以表示为系数矩阵 $A$ 的列向量的线性组合。
`);
</script>

<template>
  <ExperimentBoard title="三元一次方程组" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/rkszqv5f?embed" width="1180" height="750" allowfullscreen
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
      <CommentPanel exp-id="linear-equation-3" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
