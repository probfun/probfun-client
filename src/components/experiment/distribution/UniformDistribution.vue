<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
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

const latexFormula = computed(() => {
  const aFormatted = a.value[0] < 0 ? `(${a.value[0]})` : a.value[0];
  const bFormatted = b.value[0] < 0 ? `(${b.value[0]})` : b.value[0];

  return `f(x) =
\\begin{cases} 
\\frac{${k.value[0]}}{${bFormatted} - ${aFormatted}} + ${m.value[0]}, & \\text{if } ${a.value[0]} \\leq x \\leq ${bFormatted} \\\\
0 + ${m.value[0]}, & \\text{otherwise}
\\end{cases}`;
});

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

watch(latexFormula, () => {
  renderFormula();
});

const content = `
## **概述**
均匀分布$（Uniform Distribution）$是概率论中的一种分布类型，在指定的区间内，所有的数值出现的概率都相同。均匀分布可以分为离散型均匀分布和连续型均匀分布。

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
- **2. 独立性**：每个取值或区间是相互独立的，没有偏好。
- **3. 简单性**：均匀分布是最简单的一种概率分布，特别是在没有任何其他信息时常被用作模型。
`
</script>

<template>
  <ExperimentBoard title="二项分布" :tags="[]">
    <template #experiment>
      <UniformDiagram class="flex-1 h-full" :a="a[0]" :b="b[0]" :k="k[0]" :m="m[0]" :show-history="save" />
    </template>
    <template #parameter>
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
        <div class="w-full flex items-center justify-center mb-5">
          <div ref="katexContainer" class="text-xl" />
        </div>
        <div class="grid grid-cols-4 gap-5 p-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5 w-full">
            <p> a </p>
            <InputNumber v-model.number="a[0]" :invalid="a > b" :min-fraction-digits="1" fluid />
            <Slider v-model="a" :min="-10" :max="9.9" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5 w-full">
            <p> b </p>
            <InputNumber v-model.number="b[0]" :min-fraction-digits="1" fluid />
            <Slider v-model="b" :min="a[0] + 0.1" :max="10" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5 w-full">
            <p> k </p>
            <InputNumber v-model.number="k[0]" :min-fraction-digits="1" fluid />
            <Slider v-model="k" :min="0.1" :max="10" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5 w-full">
            <p> m </p>
            <InputNumber v-model.number="m[0]" :min-fraction-digits="1" fluid />
            <Slider v-model="m" :min="0" :max="10" :step="0.1" class="w-full" />
          </div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
