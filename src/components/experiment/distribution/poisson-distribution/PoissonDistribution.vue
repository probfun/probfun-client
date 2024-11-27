<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import PoissonDiagram from './PoissonDiagram.vue';
import 'katex/dist/katex.min.css';

const lambda = ref([3]); // Poisson distribution mean (λ)
const an = ref([1]);

const save = ref(false);
function saveImg() {
  save.value = true;
}

// 计算阶乘
function factorial(n: number) {
  if (n === 0 || n === 1)
    return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function back() {
  save.value = false;
}

const result = computed(() => {
  const probabilityOfK = (lambda.value[0] ** an.value[0] * Math.exp(-lambda.value[0])) / factorial(an.value[0]);

  // 计算尾数和指数
  const absValue = Math.abs(probabilityOfK);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (probabilityOfK / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数

  // 形成最终的结果字符串
  return `${mantissa} \\times 10^{${exponent}}`;
});

const latexFormula = computed(() => `P(X = ${an.value}) =\\frac{{λ}^ke^{-λ}}{k!}= \\frac{${lambda.value}^${an.value} e^{-${lambda.value}}}{${an.value}!} = ${result.value}`);
const katexContainer = ref<HTMLElement | null>(null);
function renderFormula() {
  if (katexContainer.value) {
    katex.render(latexFormula.value, katexContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

// 监听 lambda 的变化以动态更新图像
watch(lambda, () => {
  renderFormula();
});

watch(an, () => {
  renderFormula();
});

const content = `
## **概述**
泊松分布$（Poisson\\ Distribution）$ 是统计学中一种离散概率分布，用于描述在固定的时间间隔或空间区域内，事件发生的次数。它常用于建模某个事件的发生频率，特别是在平均事件发生率已知的情况下。泊松分布适用于事件发生概率相互独立的情境，并且事件发生是稀疏且随机的。

## **泊松分布的定义**

泊松分布的概率质量函数$（PMF）$定义为：

$$ 
P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\lambda $$ 是单位时间或单位区域内事件发生的平均次数（期望值）；
- $$ e $$ 是自然对数的底数（约等于 2.71828）；
- $$ k $$ 是事件发生的实际次数（$$ k $$ 为非负整数）。

#### **期望值和方差:**

- **期望值:**$$ E(X) = \\lambda $$
- **方差：**$$ \\text{Var}(X) = \\lambda $$

## **特点**

- **1. 稀疏性**：泊松分布通常用于建模稀疏事件，即事件发生的次数相对较少。
- **2. 独立性**：事件发生的次数之间是独立的。
- **3. 无上限**：理论上事件的发生次数可以是任意大的非负整数。
`
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <PoissonDiagram :lambda="lambda[0]" :save="save" />
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center p-3 gap-3">
        <Card class="w-full">
          <CardHeader>
            <CardTitle>二项分布公式</CardTitle>
          </CardHeader>
          <CardContent class="flex w-full justify-center">
            <div ref="katexContainer" class="text-base" />
          </CardContent>
        </Card>
        <Card class="w-full flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col justify-center gap-5">
            <div class="flex gap-4 pb-8">
              <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <Label> 均值 λ </Label>
                <div class="max-w-xl space-y-3">
                  <Input v-model="lambda[0]" :min-fraction-digits="1" />
                  <Slider v-model="lambda" :min="0" :max="30" :step="0.1" />
                </div>
              </div>
              <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <Label> 事件发生的实际次数 k </Label>
                <div class="max-w-xl space-y-3">
                  <Input v-model="an[0]" :min-fraction-digits="1" />
                  <Slider v-model="an" :min="0" :max="4 * lambda[0]" :step="1" />
                </div>
              </div>
            </div>

            <div class="flex gap-2 items-center justify-center">
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
        <div class="prose-sm max-w-none " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="poissonDistribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
