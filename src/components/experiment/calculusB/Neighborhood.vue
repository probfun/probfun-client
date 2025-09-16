<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **邻域**
邻域是数学分析、拓扑学和几何学中的基础概念

### **一、邻域的定义**

**1.基本定义（圆邻域）**：以点 $P_0(x_0, y_0)$ 为中心、以 $\\varepsilon$ 为半径的圆的内部点的全体，即集合
$$
\\{(x,y) \\mid \\sqrt{(x - x_0)^2 + (y - y_0)^2} < \\varepsilon\\}
$$
称为点 $P_0$ 的邻域，并称 $P_0$ 为邻域的中心，$\\varepsilon$ 为邻域的半径。

**2.方邻域**：除了圆形邻域外，平面上的邻域也可以用方形表示，如
$$
\\{(x,y) \\mid |x - x_0| < \\delta \\text{ 且 } |y - y_0| < \\delta\\}
$$

**3.去心邻域**：点 $P_0$ 的去心邻域是指该邻域去掉中心点 $P_0$ 后的集合，表示为
$$
\\{(x,y) \\mid 0 < \\sqrt{(x - x_0)^2 + (y - y_0)^2} < \\varepsilon\\}
$$

### **二、邻域的应用**

**1.函数性质研究**：通过分析函数在各点邻域内的行为，研究函数的连续性、可导性、极值等性质。

**2.极值判定**：极值点的判定常需要考察函数在该点邻域内的取值情况。

**3.拓扑空间构建**：邻域是定义拓扑空间的基础概念，邻域公理是现代数学拓扑结构的基础。

### **三、邻域的关键特点**

1.以某点为中心，包含该点及周围一定范围内的所有点

2.可以是圆形、矩形或其他形状的区域

3.大小由半径参数 $\\varepsilon$ 控制，$\\varepsilon$ 越小，局部性越强

4.是定义开集、闭集、极限、连续性等概念的基础

5.在函数分析、拓扑学、图像处理等多个领域有广泛应用
`);
</script>

<template>
  <ExperimentBoard title="邻域" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <video
          src="/calculusB/neighborhood.mp4"
          width="1180"
          height="750"
          controls
          style="border: 1px solid #e4e4e4;border-radius: 4px;"
        >
          您的浏览器不支持视频播放
        </video>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="renderLatex(toMarkdown(content))" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="neighborhood" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
