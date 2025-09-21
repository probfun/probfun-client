<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **二元一次方程组**

### **一、数学定义与矩阵表示**
二元一次方程组是由两个一次方程组成的方程组，每个方程都有两个未知数。其一般形式为：

$$
\\begin{cases}
ax + by = c \\\\
dx + ey = f
\\end{cases}
$$

在**线性代数**中，我们可以将其表示为**矩阵形式**：

$$
\\begin{bmatrix} a & b \\\\
d & e \\end{bmatrix} \\begin{bmatrix} x \\\\
y \\end{bmatrix} = \\begin{bmatrix} c \\\\
f \\end{bmatrix}
$$

其中：
- $A = \\begin{bmatrix} a & b \\\n d & e \\end{bmatrix}$ 称为**系数矩阵**
- $X = \\begin{bmatrix} x \\\\
y \\end{bmatrix}$ 称为**未知数向量**
- $B = \\begin{bmatrix} c \\\\
f \\end{bmatrix}$ 称为**常数项向量**

我们也可以写成紧凑形式：$AX = B$

### **二、增广矩阵与行变换**
为了求解方程组，线性代数中常用**增广矩阵**来表示方程组：

$$
\\left[ \\begin{array}{cc|c} a & b & c \\\\
d & e & f \\end{array} \\right]
$$

通过对增广矩阵进行**初等行变换**（行交换、行倍乘、行加减），我们可以将其转化为**行阶梯形矩阵**或**行最简形矩阵**，从而更容易判断解的存在性和求解。

### **三、几何意义**
二元一次方程组的几何意义是在平面直角坐标系中求解两个直线的交点。每个二元一次方程对应平面上的一条直线，方程组的解就是这两条直线的交点坐标。

这种几何解释建立了**代数与几何之间的重要联系**，是线性代数中"线性空间"概念的基础。

### **四、解的情况与线性相关性**
二元一次方程组的解有三种可能情况，这与系数矩阵的**秩**密切相关：

- **唯一解**：当系数矩阵的秩等于增广矩阵的秩且等于未知数个数（2）时，方程组有唯一解。几何上表现为两条直线相交于一点。
- **无解**：当系数矩阵的秩小于增广矩阵的秩时，方程组无解。几何上表现为两条直线平行且不重合。
- **无穷多解**：当系数矩阵的秩等于增广矩阵的秩但小于未知数个数时，方程组有无穷多解。几何上表现为两条直线重合。

从**线性相关性**角度看：
- 当两个方程对应的行向量线性无关时，方程组有唯一解
- 当两个方程对应的行向量线性相关但常数项不满足相应关系时，方程组无解
- 当两个方程对应的行向量线性相关且常数项也满足相应关系时，方程组有无穷多解

### **五、行列式与克拉默法则**
对于二元一次方程组，我们可以使用**行列式**来判断解的情况：

系数矩阵的行列式为：
$$
\\det(A) = \\begin{vmatrix} a & b \\\\
d & e \\end{vmatrix} = ae - bd
$$

- 当 $\\det(A) \\neq 0$ 时，方程组有唯一解，可由**克拉默法则**求得：
  $$
  x = \\frac{\\begin{vmatrix} c & b \\\\
  f & e \\end{vmatrix}}{\\det(A)}, \\quad y = \\frac{\\begin{vmatrix} a & c \\\\
  d & f \\end{vmatrix}}{\\det(A)}
  $$
- 当 $\\det(A) = 0$ 时，方程组可能无解或有无穷多解

### **六、线性组合视角**
从**线性组合**的角度看，解方程组 $AX = B$ 等价于寻找常数 $x$ 和 $y$，使得：

$$
x \\begin{bmatrix} a \\\\
d \\end{bmatrix} + y \\begin{bmatrix} b \\\\
e \\end{bmatrix} = \\begin{bmatrix} c \\\\
f \\end{bmatrix}
$$

即判断向量 $B$ 是否可以表示为系数矩阵 $A$ 的列向量的线性组合。
`);
</script>

<template>
  <ExperimentBoard title="二元一次方程组" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/xpeqysnd?embed" width="1180" height="750" allowfullscreen
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
      <CommentPanel exp-id="linear-equation" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
