<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import GeoGebraApplet from '@/components/experiment/GeoGebraApplet.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import { ref } from 'vue';

const content = ref(`
## **二维向量场的线积分**
二维向量场的线积分，简单来说，就是**计算一个力场（或其他向量场）沿着一条给定路径（曲线）所做的“总功”**。

想象你在一个充满风（风速和方向随地点变化，这就是一个向量场）的区域里行走。你沿着一条特定的弯曲路径前进。线积分就是计算这股风**在你的行进方向上**，对你产生了多少“累积的推动力”。

**核心思想：**

1.  **向量场：** 每个点都关联着一个向量（有方向和大小），比如风速场 $\\vec{F}(x,y) = \\langle P(x,y), Q(x,y) \\rangle$。
2.  **路径（曲线）：** 你要沿着一条特定的曲线 $C$（例如，从点A到点B的路径）进行积分。这条曲线可以用参数方程表示，比如 $x=x(t)$, $y=y(t)$。
3.  **点积（方向一致性）：** 在路径上的每一点，我们只关心向量场中与你**当前行进方向**一致的分量。这个通过向量的点积来实现。
    * 你的行进方向可以用曲线的微分矢量 $d\\vec{r} = \\langle dx, dy \\rangle$ 来表示。
    * 在每一点，计算 $\\vec{F} \\cdot d\\vec{r}$。
4.  **积分（累积求和）：** 把沿着整条路径上所有这些点积的结果累加起来，就得到了线积分。

**数学表示（简化）：**

二维向量场 $\\vec{F}(x,y) = P(x,y)\\hat{i} + Q(x,y)\\hat{j}$
沿着曲线 $C$ 的线积分表示为：

$\\int_C \\vec{F} \\cdot d\\vec{r} = \\int_C (P(x,y) dx + Q(x,y) dy)$

如果曲线 $C$ 用参数 $t$ 表示为 $x=x(t), y=y(t)$，且 $t$ 从 $a$ 变化到 $b$，那么：

$\\int_a^b \\left( P(x(t),y(t)) \\frac{dx}{dt} + Q(x(t),y(t)) \\frac{dy}{dt} \\right) dt$

**直观意义：**

* 如果向量场和路径方向一致，贡献为正（“顺风而行”）。
* 如果向量场和路径方向相反，贡献为负（“逆风而行”）。
* 如果向量场垂直于路径方向，贡献为零（“风从侧面吹过，不影响前进”）。

线积分的结果就是一个**标量值**，代表了向量场沿着特定路径的总效应。在物理学中，这通常代表了力所做的功、流体的流量等。
`);
</script>

<template>
  <ExperimentBoard title="二维向量场的线积分" :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="flex w-full h-full">
        <GeoGebraApplet filename="/vector.ggb" :show-tool-bar="false" class="w-full h-full" />
      </div>
    </template>>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="renderLatex(toMarkdown(content))" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* ... */
</style>
