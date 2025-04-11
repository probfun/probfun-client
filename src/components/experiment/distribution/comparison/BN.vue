<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue';
import BNDiagram from './BNDiagram.vue';
import 'katex/dist/katex.min.css';

const number = ref([20]);
const probability = ref([0.1]);
const mean = computed(() => number.value[0] * probability.value[0]);
const variance = computed(() => number.value[0] * probability.value[0] * (1 - probability.value[0]));
// const stdDev = computed(() => Math.sqrt(variance.value));

const binomialFormula = computed(() => ` \\\\P(X = k) = \\binom{${number.value[0]}}{k} ${probability.value[0]}^k (1-${probability.value[0]})^{${number.value[0]}-k}`);
const binomialContainer = ref<HTMLElement | null>(null);

const normalFormula = computed(() => `μ = np = {${mean.value.toFixed(2)}} \\\\σ² = np(1-p) = {${variance.value.toFixed(2)}}\\\\ P(X = k) \\approx \\frac{1}{\\sqrt{2\\pi ${variance.value.toFixed(2)}}} e^{-\\frac{(k - ${mean.value.toFixed(2)})^2}{2${variance.value.toFixed(2)}}}`);
const normalContainer = ref<HTMLElement | null>(null);

function renderFormula() {
  if (binomialContainer.value) {
    katex.render(binomialFormula.value, binomialContainer.value, {
      throwOnError: false,
    });
  }
  if (normalContainer.value) {
    katex.render(normalFormula.value, normalContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

// 监听 props 的变化以动态更新图像
watch([number, probability], () => {
  renderFormula();
});

const content = `
## **二项分布与正态分布的关系**

### **1. 二项分布到正态分布的近似**

### **条件**
二项分布 $$ \\text{B}(n, p) $$ 描述的是 $$ n $$ 次独立重复试验中成功次数的分布，每次成功的概率为 $$ p $$。正态分布 $$ \\text{N}(\\mu, \\sigma^2) $$ 是一种连续分布，描述随机变量的取值在某一均值附近的概率分布。

当以下条件满足时，二项分布可以近似为正态分布：

$$
n \\to \\infty, \\quad p \\not\\approx 0, \\quad np \\text{ 和 } np(1-p) \\text{ 足够大}
$$

在这种情况下，二项分布的成功次数 $$ X $$ 接近于正态分布。

### **数学推导**
我们从二项分布的概率质量函数$（PMF）$开始：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：

$$
\\binom{n}{k} = \\frac{n!}{k!(n-k)!}
$$

是组合数。

根据中心极限定理，当 $$ n $$ 很大时，$$ X $$ 的分布趋近于正态分布：

$$
X \\sim \\text{N}(np, np(1-p))
$$

也就是说，$$ X $$ 服从均值为 $$ np $$，方差为 $$ np(1-p) $$ 的正态分布。

### **计算简化**
在实际应用中，当 $$ n $$ 和 $$ p $$ 满足上述条件时，计算二项分布的概率会涉及到较大的数值运算（如组合数计算），而正态分布的计算相对简单，因此这种近似可以大大简化计算过程。

### **2. 两者关系的总结**
- **联系**: 正态分布可以看作是二项分布在 $$ n \\to \\infty $$ 的极限情况。当试验次数很多且成功概率接近于中间值时，二项分布趋近于正态分布。
- **近似条件**: $$ np \\text{ 和 } np(1-p) $$ 足够大。
- **实际应用**: 正态分布常用于在样本量大时近似二项分布，尤其在二项分布的参数不极端的情况下。
`
</script>

<template>
  <ExperimentBoard title="二项分布与正态分布" :tags="[]">
    <template #experiment>
      <BNDiagram :n="number[0]" :p="probability[0]" />
    </template>
    <!-- <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center mb-5">
          <div class="text-xl">
            二项分布:
          </div>
          <div ref="binomialContainer" class="text-xl" />
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Number of experiments </p>
            <InputNumber v-model.number="number[0]" />
            <Slider v-model="number" :min="20" :max="50" :step="1" class="w-48" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Probability of success </p>
            <InputNumber v-model.number="probability[0]" :min-fraction-digits="2" />
            <Slider v-model="probability" :min="0" :max="1" :step="0.01" class="w-48" />
          </div>
        </div>
        <div class="w-full flex flex-col items-center justify-center mb-5">
          <div class="text-xl mb-4">
            正态分布：
          </div>
          <div ref="normalContainer" class="text-xl" />
        </div>
      </div>
    </template> -->

    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center p-3 gap-3">
        <Card class="w-full h-full flex gap-3">
          <Card class="w- space-y-5">
            <CardHeader>
              <div class="flex  gap-5">
                <CardTitle>二项分布公式</CardTitle>
                <div class="w-10 h-1 mt-1 bg-red-500" />
              </div>
            </CardHeader>
            <CardContent class="flex w-full justify-center ">
              <div ref="binomialContainer" class="text-base" />
            </CardContent>
          </Card>
          <Card class="w- gap-3 ">
            <CardHeader>
              <div class="flex  gap-5">
                <CardTitle>正态分布公式</CardTitle>
                <div class="w-10 h-1 mt-1 bg-blue-500" />
              </div>
            </CardHeader>
            <CardContent class="flex w-full justify-center ">
              <div ref="normalContainer" class="text-base" />
            </CardContent>
          </Card>
                  <Card class="w-full  flex-1 flex flex-col">
          <!-- <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader> -->
          <CardContent class="flex-1 flex flex-col justify-center ">
   
            <div class="grid grid-rows-2 ">
              <div class="flex flex-1 items-center justify-center font-bold ">
                <div class="flex flex-1 items-center justify-center mt-4">
                  <div class="mr-4 " v-html="renderLatex('实验次数\\(n\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-">
                    <Input v-model.number="number[0]"  class="w-full mb-2" placeholder="20~100"/>
                  <Slider v-model="number" :min="20" :max="100" :step="1" class="w-full mb-3" />
                  </div>
                </div>
              </div>
              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('成功概率\\(p\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-1">
                    <Input v-model.number="probability[0]" :min-fraction-digits="2" class="w-full mb-2" placeholder="0~1"/>
                  <Slider v-model="probability" :min="0" :max="1" :step="0.01" class="w-full" />
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
        </Card>

      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="binomial-normal" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
