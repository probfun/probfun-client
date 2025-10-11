<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const content = ref(`
## **空间曲线弧长**

### **一、定义**
若在弧 $\\overset{\\frown}{AB}$ 上任意作内接折线，当折线段的最大边长 $\\lambda \\to 0$ 时，若折线的长度趋向于一个确定的极限，则称此极限为曲线弧 $\\overset{\\frown}{AB}$ 的弧长，即
$$
s = \\lim_{\\lambda \\to 0} \\sum_{i=1}^{n} |M_{i-1}M_i| =: \\int_{\\overset{\\frown}{AB}} ds
$$

### **二、参数方程形式的弧长公式**
若空间曲线由参数方程 $x = x(t), y = y(t), z = z(t)$ 给出，$t \\in [\\alpha, \\beta]$，则弧长公式：
$$
s = \\int_{\\alpha}^{\\beta} \\sqrt{x'(t)^2 + y'(t)^2 + z'(t)^2} dt
$$

### **三、示例：计算螺旋线弧长**
计算螺旋线 $x = \\sin(t), y = \\cos(t), z = t$ 在 $t \\in [0, 2\pi]$ 的弧长：
$$
s = \\int_{0}^{2\\pi} \\sqrt{(-\\sin(t))^2 + \\cos(t)^2 + 1^2} dt \\\\
= \\int_{0}^{2\\pi} \\sqrt{2} dt = 2\\sqrt{2}\\pi
$$

### **四、可视化：研究螺旋线弧长与折线段长度之间的关系**

1.绘制螺旋线：采用参数方程 $x = \\cos(t), y = \\sin(t), z = t, t \\in [0, 2\\pi]$

2.均匀描点：在螺旋线上均匀选取 $n$ 个点，随着 $n$ 增加点间距逐渐减小

3.绘制折线段：连接相邻两点形成折线段，计算所有折线段的总长度 $s$

4.计算弧长：根据弧长公式计算螺旋线的实际弧长 $c$

5.比较分析：观察差值 $(c - s)$ 随 $n$ 变化的趋势
`);
</script>

<template>
  <ExperimentBoard title="空间曲线弧长" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <iframe
          src="https://www.geogebra.org/calculator/hecw5spa?embed" width="100%" height="100%" allowfullscreen
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
      <CommentPanel exp-id="space-curve" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
