<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import GeometricDiagram from './GeometricDiagram.vue';
import 'katex/dist/katex.min.css';

const probability = ref([0.5]); // Probability of success (p)
const fixedN = ref([3]); // 固定的试验次数 n
const numberk = ref([1]); // Number of success (k)

const isChart1 = ref(true);
const isChart2 = ref(false);
const isChart3 = ref(false);

function toggleChart1() {
  isChart1.value = true;
  isChart2.value = false;
  isChart3.value = false;
}
function toggleChart2() {
  isChart1.value = false;
  isChart2.value = true;
  isChart3.value = false;
}
function toggleChart3() {
  isChart1.value = false;
  isChart2.value = false;
  isChart3.value = true;
}

const save = ref(false);

function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
}

const finalResultOne = computed(() => {
  const p = probability.value[0];
  const k = numberk.value[0];
  return (1 - p) ** (k - 1) * p;
});

const oneFormula = computed(() => {
  const absValue = Math.abs(finalResultOne.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultOne.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const resultOne = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `P(X = k) = (1 - p)^{k-1} \\cdot p = (1 - ${probability.value[0]})^{${numberk.value[0] - 1}} \\cdot ${probability.value[0]} = ${resultOne}`;
});
const oneContainer = ref<HTMLElement | null>(null);

const finalResultTwo = computed(() => {
  const p = probability.value[0];
  const k = numberk.value[0];
  return (1 - p) ** k * p;
});

const twoFormula = computed(() => {
  const absValue = Math.abs(finalResultTwo.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultTwo.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const resultTwo = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `P(X = k) = (1 - p)^{k} \\cdot p  = (1 - ${probability.value[0]})^{${numberk.value}} \\cdot ${probability.value[0]} = ${resultTwo}`;
});
const twoContainer = ref<HTMLElement | null>(null);

const finalResultThree = computed(() => {
  const p = probability.value[0];
  const k = numberk.value[0];
  return (1 - p) ** k;
});

const threeFormula = computed(() => {
  const absValue = Math.abs(finalResultThree.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultThree.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const resultThree = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `
  \\begin{aligned}
  P(X > ${fixedN.value[0]} + k \\mid X > ${fixedN.value[0]}) 
  = P(X > k) =(1 - p)^{k}= (1 - ${probability.value[0]})^{${numberk.value}}
  = ${resultThree}
  \\end{aligned}`;
});
const threeContainer = ref<HTMLElement | null>(null);

function renderFormula() {
  if (oneContainer.value) {
    katex.render(oneFormula.value, oneContainer.value, {
      throwOnError: false,
    });
  }
  if (twoContainer.value) {
    katex.render(twoFormula.value, twoContainer.value, {
      throwOnError: false,
    });
  }
  if (threeContainer.value) {
    katex.render(threeFormula.value, threeContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

// 监听 probability 的变化以动态更新图像
watch([probability, fixedN, numberk], () => {
  renderFormula();
});

const content = `
## **概述**
几何分布$（Geometric\\ Distribution）$是统计学中的一种离散概率分布，用于描述在一系列独立的伯努利试验中，第一次成功发生之前的失败次数。几何分布可以用来表示成功之前进行的失败次数，或直到第一次成功所需的试验次数。

## **几何分布的定义**

对于几何分布，有两种常见的定义：

**1. 第一次成功前的失败次数（$$ X $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(X = k) = (1-p)^k p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是失败的次数（$$ k $$ 为非负整数）。

**2. 直到第一次成功所需的试验次数（$$ Y $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(Y = k) = (1-p)^{k-1} p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是试验次数（$$ k $$ 为正整数）。

#### **期望值和方差:**

  **对于失败次数（$$ X $$）：**

   $$ 
   期望值：E(X) = \\frac{1-p}{p}   \\\\
   方差：\\text{Var}(X) = \\frac{1-p}{p^2} 
   $$

 **对于试验次数（$$ Y $$）：**

$$
期望值： E(Y) = \\frac{1}{p} \\\\
方差： \\text{Var}(Y) = \\frac{1-p}{p^2} 
$$


## **特点**
**1. 无记忆性**：几何分布具有无记忆性，即过去的试验结果不会影响未来的成功概率。数学上表示为：
   $$
   P(X > m + n \\mid X > n) = P(X > m)
   $$
   其中 $$ X $$ 是第一次成功前的失败次数。
   
**2. 离散分布**：几何分布是一种定义在非负整数上的离散概率分布。
`
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <GeometricDiagram
        :p="probability[0]" :n="fixedN[0]" :is-chart1="isChart1" :is-chart2="isChart2"
        :is-chart3="isChart3" :save="save"
      />
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center gap-3 p-3">
        <Card class="w-full">
          <CardHeader>
            <CardTitle>几何分布公式</CardTitle>
          </CardHeader>
          <CardContent class="flex w-full justify-center">
            <div v-show="isChart1" ref="oneContainer" class="text-base" />
            <div v-show="isChart2" ref="twoContainer" class="text-base" />
            <div v-show="isChart3" ref="threeContainer" class="text-base" />
          </CardContent>
        </Card>
        <Card class="w-full flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col justify-center items-center gap-3">
            <div class="dropdown ">
              <Button tabindex="0" role="button" class="m-1">
                点我切换
              </Button>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li @click="toggleChart1">
                  <a>直到第一次成功的次数</a>
                </li>
                <li @click="toggleChart2">
                  <a>第一次成功前的失败次数</a>
                </li>
                <li @click="toggleChart3">
                  <a>几何分布的无记忆性</a>
                </li>
              </ul>
            </div>
            <div class="flex gap-4 pb-1 w-full">
              <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <div v-html="renderLatex('成功概率\\(p\\)')" />

                <div class="max-w-xl space-y-3">
                  <Input v-model="probability[0]" type="number" />
                  <Slider v-model="probability" :min="0" :max="0.95" :step="0.05" />
                </div>
              </div>
              <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <div v-html="renderLatex('成功前的尝试次数（包含）\\( k \\)')" />
                <div class="max-w-xl space-y-3">
                  <Input v-model="numberk[0]" type="number" />
                  <Slider v-model="numberk" :min="1" :max="60" :step="1" />
                </div>
              </div>
              <div v-if="isChart3" class="flex flex-col flex-1 items-center justify-center space-y-5">
                <div v-html="renderLatex('固定实验次数')" />
                <div class="max-w-xl space-y-3">
                  <Input v-model="fixedN[0]" type="number" />
                  <Slider v-model="fixedN" :min="0" :max="9" :step="1" />
                </div>
              </div>
            </div>
            <div v-if="isChart1" class="flex gap-2 items-center justify-center">
              <Checkbox
                id="terms" @update:checked="(checked: boolean) => {
                  if (checked) {
                    saveImg();
                  }
                  else {
                    back();
                  }
                  console.log(checked)
                }"
              />
              <label for="terms" class="text-sm select-none font-bold">开启历史图像模式</label>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="geometricDistribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
