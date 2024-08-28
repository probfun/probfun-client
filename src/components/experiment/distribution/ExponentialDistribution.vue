<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ExponentialDiagram from './ExponentialDiagram.vue';
import { toMarkdown } from '@/utils/markdown';

const rate = ref(2);
const selectedCity = ref();
const cities = ref([
  { name: '正态分布' },
]);

const latexFormula = computed(() => `f(x) = ${rate.value} e^{-${rate.value} x}, \\quad x \\geq 0`);
const katexContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
  if (katexContainer.value) {
    katex.render(latexFormula.value, katexContainer.value, {
      throwOnError: false
    });
  }
};

onMounted(() => {
  renderFormula();
});

watch(latexFormula, () => {
  renderFormula();
});

const content = `
**指数分布（Exponential Distribution）** 是一种连续概率分布，用于描述在固定的时间间隔内，事件发生的时间间隔。它常用于建模事件发生的时间间隔，特别是当事件发生的速率已知且事件发生是独立的情况下。指数分布是泊松过程的连续时间模型，特别适用于描述无记忆性质的现象。

#### 指数分布的定义

指数分布的概率密度函数（PDF）定义为：

$$
f(x) = 
\\begin{cases} 
\\lambda e^{-\\lambda x}, & x \\geq 0 \\\\
0, & x < 0 
\\end{cases}
$$

其中：
- $$ \\lambda $$ 是事件发生的速率参数（$$ \\lambda > 0 $$）；
- $$ x $$ 是时间间隔或等待时间（$$ x \\geq 0 $$）。

#### 期望值和方差

- 期望值：$$ E(X) = \\frac{1}{\\lambda} $$
- 方差：$$ \\text{Var}(X) = \\frac{1}{\\lambda^2} $$

#### 特点

1. **无记忆性**：指数分布具有无记忆性，即未来事件发生的概率不受过去时间的影响。数学上表示为：
   $$
   P(X > s + t \\mid X > s) = P(X > t)
   $$
   其中 $$ X $$ 是等待时间，$$ s $$ 和 $$ t $$ 是非负实数。

2. **连续分布**：指数分布是一种定义在非负实数上的连续概率分布。

3. **与泊松分布的关系**：指数分布是泊松过程的时间间隔分布，描述了在固定时间内发生事件的等待时间。
`
</script>

<template>
  <Splitter class="mb-8 h-full !border-0">
    <SplitterPanel class="pr-1.5">
      <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
        <div class="mb-2 font-bold"> 实验区 </div>
        <div class="h-full w-full flex flex-col">
          <div class="mb-5 w-full flex-1">
            <exponential-diagram class="flex-1 h-full" :rate="rate" />
          </div>
          <div class="w-full flex items-center justify-center mb-5">
            <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="选择一个分布"
              class="w-full md:w-56 mr-5" />
            <div ref="katexContainer" class="text-2xl"></div>
          </div>
          <div class="flex w-full mb-5">
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
              <p> Rate parameter </p>
              <InputNumber v-model.number="rate" />
              <Slider :min="0" :max="5" :step="0.1" v-model="rate" class="w-48" />
            </div>
          </div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5" :size="25">
      <Panel header="提示区" class="h-full overflow-auto">
        <div v-html="toMarkdown(content)" class="markdown-format"></div>
      </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>