<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import UniformDiagram from './UniformDiagram.vue';
import 'katex/dist/katex.min.css';

const a = ref([0]);
const b = ref([1]);
const k = ref([1]);
const m = ref([0]);

const save = ref(false);
function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
}

const latexFormulaOne = computed(() => {
  const aFormatted = a.value[0] < 0 ? `(${a.value[0]})` : a.value[0];
  const bFormatted = b.value[0] < 0 ? `(${b.value[0]})` : b.value[0];

  return `f(x) =
 \\begin{cases} 
\\frac{${1}}{b - a} , & \\text{if } a \\leq x \\leq b \\\\
0 , & \\text{otherwise}
\\end{cases}
 = 
 \\begin{cases} 
\\frac{${1}}{${bFormatted} - ${aFormatted}} , & \\text{if } ${a.value[0]} \\leq x \\leq ${bFormatted} \\\\
0 , & \\text{otherwise}
\\end{cases}`;
});

const latexFormulaTwo = computed(() => {
  const aFormatted = a.value[0] < 0 ? `(${a.value[0]})` : a.value[0];
  const bFormatted = b.value[0] < 0 ? `(${b.value[0]})` : b.value[0];
  const kaPlusM = k.value[0] * a.value[0] + m.value[0];
  const kbPlusM = k.value[0] * b.value[0] + m.value[0];
  return String.raw`
f_Y(y) =
\begin{cases}
\frac{1}{K(b-a)}, & \text{if } Ka + M \leq y \leq Kb + M \\
0, & \text{otherwise}
\end{cases}
\\
\phantom{f_Y(y)}=
\begin{cases}
\frac{1}{${k.value[0]}(${bFormatted} - ${aFormatted})}, & \text{if } ${kaPlusM.toFixed(2)} \leq y \leq ${kbPlusM.toFixed(2)} \\
0, & \text{otherwise}
\end{cases}
`;
});

const oneContainer = ref<HTMLElement | null>(null);
const twoContainer = ref<HTMLElement | null>(null);

function renderFormula() {
  if (oneContainer.value) {
    katex.render(latexFormulaOne.value, oneContainer.value, {
      throwOnError: false,
    });
  }
  if (twoContainer.value) {
    katex.render(latexFormulaTwo.value, twoContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

watch([latexFormulaOne, latexFormulaTwo], () => {
  renderFormula(); // 这里传入回调函数
});

const content = `
## **概述**
均匀分布$（Uniform\\ Distribution）$是概率论中的一种分布类型，在指定的区间内，所有的数值出现的概率都相同。均匀分布可以分为离散型均匀分布和连续型均匀分布。

## **均匀分布的定义**

对于连续型均匀分布，其概率密度函数$（PDF）$定义为：

$$ 
f(x) =
\\begin{cases} 
\\frac{1}{b-a}, & \\text{if } a \\leq x \\leq b \\\\ 
0, & \\text{otherwise} 
\\end{cases}
$$

对于离散型均匀分布，其概率质量函数$（PMF）$定义为：

$$
P(X = x) = \\frac{1}{n}, \\quad x \\in \\{x_1, x_2, \\dots, x_n\\}
$$

其中：
- $$ a $$ 和 $$ b $$ 分别是区间的下限和上限；
- $$ X $$ 是均匀分布的随机变量；
- $$ n $$ 是可能取值的数量。

## **期望值和方差:**

- **对于连续型均匀分布：**
  - 期望值：$$ E(X) = \\frac{a + b}{2} $$
  - 方差：$$ \\text{Var}(X) = \\frac{(b - a)^2}{12} $$

- **对于离散型均匀分布：**
  - 期望值：$$ E(X) = \\frac{1}{n} \\sum_{i=1}^{n} x_i $$
  - 方差：$$ \\text{Var}(X) = \\frac{1}{n} \\sum_{i=1}^{n} (x_i - E(X))^2 $$

## **特点**

- **1. 均匀性**：均匀分布中的每个数值或区间的每个子区间都有相同的概率。
- **2. 独立性**：每个子区间的概率只与子区间的长度成正比。
- **3. 简单性**：均匀分布是最简单的一种概率分布，特别是在没有任何其他信息时常被用作模型。
`
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <UniformDiagram class="flex-1 h-full" :a="a[0]" :b="b[0]" :k="k[0]" :m="m[0]" :show-history="save" />
      <Chart v-if="!save" type="line" :data="UniformDiagram" class="flex-1 h-full w-full" />
      <Chart v-if="save" type="line" :data="UniformDiagram" class="flex-1 h-full w-full" />
    </template>
    <!-- <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div>
          <button v-if="!save" class="btn mb-5" @click="saveImg">
            显示历史图像模式
          </button>
          <div>
            <button v-if="save" class="btn mb-5 mr-2" @click="back">
              返回
            </button>
          </div>
        </div>
        <div class="flex flex-col items-start">
          <div class="flex flex-col items-start">
            <div ref="oneContainer" class="l mb-1" />

          </div>
          <div class="flex flex-col items-start mb-4"></div>
          <div ref="twoContainer" />
        </div>

      </div>
      <div class="grid grid-cols-4 gap-2 ">
        <div class="flex flex-col flex-1 items-center justify-center space-y-2 w-full">
          <p> 左边界a </p>
          <InputNumber v-model.number="a[0]" :invalid="a > b" :min-fraction-digits="1" fluid />
          <Slider v-model="a" :min="-10" :max="9.9" :step="0.1" class="w-full" />
        </div>
        <div class="flex flex-col flex-1 items-center justify-center space-y-2 w-full">
          <p> 右边界b </p>
          <InputNumber v-model.number="b[0]" :min-fraction-digits="1" fluid />
          <Slider v-model="b" :min="a[0] + 0.1" :max="10" :step="0.1" class="w-full" />
        </div>
        <div class="flex flex-col flex-1 items-center justify-center space-y-2 w-full">
          <p> k </p>
          <InputNumber v-model.number="k[0]" :min-fraction-digits="1" fluid />
          <Slider v-model="k" :min="0.1" :max="10" :step="0.1" class="w-full" />
        </div>
        <div class="flex flex-col flex-1 items-center justify-center space-y-2 w-full">
          <p> m </p>
          <InputNumber v-model.number="m[0]" :min-fraction-digits="1" fluid />
          <Slider v-model="m" :min="0" :max="10" :step="0.1" class="w-full" />
        </div>
      </div>

    </template> -->

    <template #parameter>
      <div class="w-full h-full flex flex-row justify-center p-3 gap-3">
        <Card class="w-3/5 h-full card">
          <CardHeader class="pb-5">
            <CardTitle>均匀分布概率密度函数</CardTitle>
          </CardHeader>
          <CardContent class="w-full flex flex-col items-start">
            <div ref="oneContainer" class="text-sm" />
          </CardContent>
          <CardHeader class="pb-5">
            <CardTitle class="flex items-center gap-1">
              函数
              <div v-html="toMarkdown('$$Y=KX+M\\ (K \\ge 0)$$')" />
              的概率密度函数
            </CardTitle>
          </CardHeader>
          <CardContent class="w-full flex flex-col items-start gap-10 ">
            <div ref="twoContainer" class="text-sm" />
          </CardContent>
        </Card>
        <Card class="w-2/5 h-full card flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col items-center justify-center gap-5">
            <div class="grid grid-cols-2 gap-10 ">
              <div class="flex flex-col  gap-8 pb-5">
                <div class="flex flex-col  md:w-full w-1/2 flex-1 items-center justify-center space-y-5">
                  <div v-html="renderLatex('左边界\\(a\\)')" />
                  <div class="max-w-xl space-y-3">
                    <Input v-model="a[0]" :invalid="a > b" :min-fraction-digits="1" fluid />
                    <Slider v-model="a" :min="-10" :max="9.9" :step="0.1" class="w-full" />
                  </div>
                </div>
                <div class="flex flex-col  md:w-full w-1/2 flex-1 items-center justify-center space-y-5">
                  <div v-html="renderLatex('右边界\\(b\\)')" />
                  <div class="max-w-xl space-y-3">
                    <Input v-model.number="b[0]" :min-fraction-digits="1" fluid />
                    <Slider v-model="b" :min="a[0] + 0.1" :max="10" :step="0.1" class="w-full" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-8 pb-5">
                <div class="flex flex-col  md:w-full w-1/2 flex-1 items-center justify-center space-y-5">
                  <div v-html="renderLatex('\\(K\\)')" />
                  <div class="max-w-xl space-y-3">
                    <Input v-model.number="k[0]" :min-fraction-digits="1" fluid />
                    <Slider v-model="k" :min="0.1" :max="10" :step="0.1" class="w-full" />
                  </div>
                </div>
                <div class="flex flex-col  md:w-full w-1/2 flex-1 items-center justify-center space-y-5">
                  <div v-html="renderLatex('\\(M\\)')" />                  <div class="max-w-xl space-y-3">
                    <Input v-model.number="m[0]" :min-fraction-digits="1" fluid />
                    <Slider v-model="m" :min="0" :max="10" :step="0.1" class="w-full" />
                  </div>
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
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="uniform-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
