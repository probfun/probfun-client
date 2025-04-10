<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import ExponentialDiagram from './ExponentialDiagram.vue';
import 'katex/dist/katex.min.css';

const rate = ref([2]);
const shift = ref([1]);
const numberx = ref([1]);

const save = ref(false);
function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
}

const isChart1 = ref(true);
const isChart2 = ref(false);
function toggleChart1() {
  isChart1.value = true;
  isChart2.value = false;
}
function toggleChart2() {
  isChart1.value = false;
  isChart2.value = true;
}

const finalResultOne = computed(() => {
  const r = rate.value[0];
  const x = numberx.value[0];
  return Math.E ** (-r * x) * r;
});

const oneFormula = computed(() => {
  const absValue = Math.abs(finalResultOne.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultOne.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const resultOne = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `f(x) = λe^{-λx} = ${rate.value} e^{-${rate.value} \\cdot ${numberx.value}} = ${resultOne}( x \\geq 0)`;
});
const oneContainer = ref<HTMLElement | null>(null);

const finalResultTwo = computed(() => {
  const r = rate.value[0];
  const x = numberx.value[0];
  return Math.E ** (-r * x);
});

const twoFormula = computed(() => {
  const absValue = Math.abs(finalResultTwo.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultTwo.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const resultTwo = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `
  \\begin{aligned}
  P(X > ${shift.value} + x \\mid X > ${shift.value}) 
  = P(X > x) = e^{-${rate.value} × ${numberx.value}}
  = ${resultTwo}
 \\end{aligned} `;
});
const twoContainer = ref<HTMLElement | null>(null);

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
}
onMounted(() => {
  renderFormula();
});

watch([oneFormula, twoFormula], () => {
  renderFormula();
});

const content = `
## **概述**
指数分布$（Exponential\\ Distribution）$ 是一种连续概率分布，用于描述在固定的时间间隔内，事件发生的时间间隔。它常用于建模事件发生的时间间隔，特别是当事件发生的速率已知且事件发生是独立的情况下。指数分布是泊松过程的连续时间模型，特别适用于描述无记忆性质的现象。

## **指数分布的定义**

指数分布的概率密度函数$（PDF）$定义为：

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

#### **期望值和方差:**

$$
期望值： E(X) = \\frac{1}{\\lambda} 
$$
$$
方差：\\text{Var}(X) = \\frac{1}{\\lambda^2} 
$$

## **特点**

**1. 无记忆性**：指数分布具有无记忆性，即未来事件发生的概率不受过去时间的影响。数学上表示为：
   $$
   P(X > s + t \\mid X > s) = P(X > t)
   $$
   其中 $$ X $$ 是等待时间，$$ s $$ 和 $$ t $$ 是非负实数。

**2. 连续分布**：指数分布是一种定义在非负实数上的连续概率分布。

**3. 与泊松分布的关系**：指数分布是泊松过程的时间间隔分布，描述了在固定时间内发生事件的等待时间。
`
</script>

<template>
  <ExperimentBoard title="二项分布" :tags="[]" :panel-size="60">
    <template #experiment>
      <ExponentialDiagram
        class="flex-1 h-full" :rate="rate[0]" :shift="shift[0]" :show-graph="isChart1"
        :show-history="save"
      />
    </template>
    <!-- <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div v-if="isChart1">
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
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn m-1">
              点我切换
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li @click="toggleChart1">
                <a>一般指数分布</a>
              </li>
              <li @click="toggleChart2">
                <a>指数分布的无记忆性</a>
              </li>
            </ul>
          </div>
          <div v-show="isChart1" ref="oneContainer" class="text-2xl" />
          <div v-show="isChart2" ref="twoContainer" class="text-2xl" />
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Rate parameter(λ) </p>
            <InputNumber v-model.number="rate[0]" :min-fraction-digits="1" />
            <Slider v-model="rate" :min="0" :max="10" :step="0.1" class="w-48" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> x </p>
            <InputNumber v-model.number="numberx[0]" />
            <Slider v-model="numberx" :min="1" :max="10" :step="0.2" class="w-48" />
            </div>
          <div v-if="isChart2" class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Fixed number </p>
            <InputNumber v-model.number="shift[0]" :min-fraction-digits="1" />
            <Slider v-model="shift" :min="0" :max="5" :step="0.1" class="w-48" />
          </div>
        </div>
      </div>
    </template> -->

    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center gap-3 p-3">
        <Card class="w-full">
          <CardHeader>
            <CardTitle>指数分布公式</CardTitle>
          </CardHeader>
          <CardContent class="flex w-full justify-center">
            <div v-show="isChart1" ref="oneContainer" class="text-base" />
            <div v-show="isChart2" ref="twoContainer" class="text-base" />
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
              <Button tabindex="0" role="button" class="m-0">
                点我切换
              </Button>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li @click="toggleChart1">
                  <a>一般指数分布</a>
                </li>
                <li @click="toggleChart2">
                  <a>指数分布的无记忆性</a>
                </li>
              </ul>
            </div>
            <div class="items-center justify-center  flex flex-1 gap-4">
              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('事件发生的速率参数\\(λ\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                    <Input v-model.number="rate[0]" :min-fraction-digits="1" class="w-full mb-2" />
                    <Slider v-model="rate" :min="0" :max="10" :step="0.1" class="w-full" />
                  </div>
                </div>
              </div>

              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('间隔时间\\(x\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                    <Input v-model.number="numberx[0]" class="w-full mb-2" />
                    <Slider v-model="numberx" :min="1" :max="10" :step="0.2" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- 第三组：固定值 -->
              <div v-if="isChart2" class="flex flex-1 items-center justify-center font-bold ">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('固定值 = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                    <Input v-model.number="shift[0]" :min-fraction-digits="1" class="w-full mb-2" />
                    <Slider v-model="shift" :min="0" :max="5" :step="0.1" class="w-full" />
                  </div>
                </div>
              </div>

              <!-- 第四组：历史图像模式 -->
              <div class="flex items-center justify-center">
                <Checkbox
                  id="terms" @update:checked="(checked: boolean) => {
                    if (checked) {
                      saveImg();
                    }
                    else {
                      back();
                    }
                    console.log(checked);
                  }"
                />
                <label for="terms" class="text-sm select-none font-bold">开启历史图像模式</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="exponential-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
