<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ExponentialDiagram from './ExponentialDiagram.vue';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const rate = ref([2]);
const shift = ref([1]);

const isChart1 = ref(true);
const isChart2 = ref(false);
const toggleChart1 = () => {
  isChart1.value = true;
  isChart2.value = false;
}
const toggleChart2 = () => {
  isChart1.value = false;
  isChart2.value = true;
}

const oneFormula = computed(() => `f(x) = ${rate.value} e^{-${rate.value} x}, \\quad x \\geq 0`);
const oneContainer = ref<HTMLElement | null>(null);

const twoFormula = computed(() => `P(X > ${shift.value} + s \\mid X > t) = P(X > s) = e^{-${rate.value} s}`);
const twoContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
  if (oneContainer.value) {
    katex.render(oneFormula.value, oneContainer.value, {
      throwOnError: false
    });
  }
  if (twoContainer.value) {
    katex.render(twoFormula.value, twoContainer.value, {
      throwOnError: false
    });
  }
};

onMounted(() => {
  renderFormula();
});

watch([oneFormula, twoFormula], () => {
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
  <experiment-board title="二项分布" :tags="[]">
    <template #experiment>
      <exponential-diagram class="flex-1 h-full" :rate="rate" :shift="shift" :show-graph="isChart1"/>
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center mb-5">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">点我切换</div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li @click="toggleChart1"><a>一般指数分布</a></li>
              <li @click="toggleChart2"><a>指数分布的无记忆性</a></li>
            </ul>
          </div>
          <div v-show="isChart1" ref="oneContainer" class="text-2xl"></div>
          <div v-show="isChart2" ref="twoContainer" class="text-2xl"></div>
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Rate parameter </p>
            <InputNumber v-model.number="rate[0]" :min-fraction-digits="1" />
            <Slider :min="0" :max="10" :step="0.1" v-model="rate[0]" class="w-48" />
          </div>
          <div v-if="isChart2" class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Fixed number </p>
            <InputNumber v-model.number="shift[0]" :min-fraction-digits="1" />
            <Slider :min="0" :max="5" :step="0.1" v-model="shift[0]" class="w-48" />
          </div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div v-html="toMarkdown(content)" class="prose max-w-full text-base-content"></div>
      </div>
    </template>
  </experiment-board>
</template>

<style scoped></style>