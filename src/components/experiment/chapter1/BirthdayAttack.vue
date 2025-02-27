<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = `
#### **实验简述**

生日攻击是一种针对哈希函数的攻击方法，基于概率理论中的“生日悖论”。在密码学中，哈希函数用于将任意长度的输入映射为固定长度的输出。理想的哈希函数应具有抗碰撞性，即找到两个不同的输入具有相同哈希值的概率应该非常小。然而，生日攻击利用了生日悖论的原理，证明即使哈希函数的输出空间很大，找到两个不同输入具有相同哈希值（称为碰撞）的概率也远比直觉上认为的要高。

#### **实验思路**

**1. 不同位数的哈希值下，碰撞事件发生的频率**

   程序生成了 $k$ 个随机哈希值，这些值在 $0$ 到 $N - 1$ 的范围内分布，其中 $N = 2 ^ n$, $n$ 是用户选择的哈希位数。生成的哈希值可以视为从均匀分布中抽取的样本 $hashvalues∼U(0,N−1)$。接下来，程序将这些哈希值绘制成直方图，以展示它们在哈希空间中的分布，其中蓝色的柱状条表示在每个区间$（bin）$内哈希值的频率。如果某个区间内有两个或以上的哈希值，即发生了碰撞，程序会在图中用红色虚线标记碰撞的发生位置，从而直观地展示碰撞情况。

**2. 不同位数的哈希值下，碰撞事件发生的概率**

   在理论计算部分，程序基于生日悖论的公式来推导和计算哈希碰撞的概率。首先，考虑到哈希空间大小为 $N = 2^n$，生成了 $k$ 个随机哈希值。无碰撞的概率计算为
   $$ P(\\text{无碰撞}) = 1 \\times \\frac{N-1}{N} \\times \\frac{N-2}{N} \\times \\dots \\times \\frac{N-(k-1)}{N} $$
   这可以近似为 $\\exp\\left(-\\frac{k(k-1)}{2N}\\right)$（对每一项取对数并应用泰勒展开 $\\ln(1-x) \\approx -x$ )。

   碰撞的概率为 $P(\\text{碰撞}) = 1 - P(\\text{无碰撞})$，简化为 $1 - \\exp\\left(-\\frac{k^2}{2N}\\right)$。在代码中，这一公式用于计算不同位数 $n$下的碰撞概率，程序通过折线图展示这些概率随位数的变化。
`;
</script>

<template>
  <ExperimentBoard title="生日攻击问题" :tags="['条件概率', '泰勒展开', '独立事件的联合概率']">
    <template #experiment />

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="birthday-attack"/>
    </template>
  </ExperimentBoard>
</template>


<style scoped>
div, label {
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE/Edge */
}
</style>
