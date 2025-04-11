<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import DistributionDiagram from '@/components/experiment/distribution/normal-distribution/NormalDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import 'katex/dist/katex.min.css';

const mean = ref([0]);
const stdDev = ref([1]);
const a = ref([1]);
const b = ref([0]);
const transformedMean = ref(0);
const transformedVariance = ref(1);
const transformedMeanY = ref(0);
const transformedVarianceY = ref(0);
const lineShow = ref(false);

const save = ref(false);
function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
  lineShow.value = false;
}

const latexFormula = computed(() => {
  const meanVal = transformedMean.value.toFixed(1);
  const varianceVal = transformedVariance.value.toFixed(2);

  // 如果 meanVal 为负数，则添加括号
  const meanDisplay = transformedMean.value < 0 ? `(${meanVal})` : meanVal;
  // 如果 varianceVal 为负数（虽然理论上方差不会是负数，但以防万一）
  const varianceDisplay = transformedVariance.value < 0 ? `(${varianceVal})` : varianceVal;

  return `f_X(x) = \\frac{1}{\\sqrt{2\\pi{σ}^2}} e^{-\\frac{(x-μ)^2}{2{σ}^2}}`;
});
//}=\\frac{1}{\\sqrt{2\\pi\\times${varianceDisplay}}} e^{-\\frac{(x-${meanDisplay})^2}{2\\times${varianceDisplay}}

watch([mean, stdDev], () => {
  transformedMean.value = mean.value[0];
  transformedVariance.value = stdDev.value[0];
}, { deep: true });

watch([a, b], () => {
  transformedMean.value = a.value[0] * mean.value[0] + b.value[0];
  transformedVariance.value = a.value[0] ** 2 * stdDev.value[0];
}, { deep: true });

const latexFormulaY = computed(() => {
  const meanValY = transformedMeanY.value.toFixed(2);
  const varianceValY = transformedVarianceY.value.toFixed(2);

  // 如果 meanVal 为负数，则添加括号
  const meanDisplayY = transformedMeanY.value < 0 ? `(${meanValY})` : meanValY;
  // 如果 varianceVal 为负数（虽然理论上方差不会是负数，但以防万一）
  const varianceDisplayY = transformedVarianceY.value < 0 ? `(${varianceValY})` : varianceValY;

  return `f_Y(y) =\\frac{1}{\\sqrt{2\\pi}aσ} e^{-\\frac{(x-(aμ+b))^2}{2{(aσ)^2}} }`;
});
// \\frac{1}{\\sqrt{2\\pi{σ'}^2}} e^{-\\frac{(x-μ')^2}{2{σ'}^2}}= \\frac{1}{\\sqrt{2\\pi\\times${varianceDisplayY}}} e^{-\\frac{(x-${meanDisplayY})^2}{2\\times${varianceDisplayY}}

const transformedFormula = computed(() => {
  // 计算均值和方差
  const transformedMean = mean.value[0];
  const transformedVariance = stdDev.value[0];

  return `X \\sim N(μ,σ^2) \\sim N(${transformedMean.toFixed(2)}, ${transformedVariance.toFixed(2)})`;
});

const transformedFormulaY = computed(() => {
  // 计算均值和方差
  const transformedMeanY = a.value[0] * mean.value[0] + b.value[0];
  const transformedVarianceY = a.value[0] ** 2 * stdDev.value[0];

  return `Y = aX+b \\sim N(aμ+b,a^2σ^2) \\sim N(${transformedMeanY.toFixed(2)}, ${transformedVarianceY.toFixed(2)})`;
});

const katexMainFormula = ref<HTMLElement | null>(null);
const katexMainFormulaY = ref<HTMLElement | null>(null);

const katexTransformedFormula = ref<HTMLElement | null>(null);
const katexTransformedFormulaY = ref<HTMLElement | null>(null);

function renderFormula() {
  if (katexMainFormula.value) {
    katex.render(latexFormula.value, katexMainFormula.value, {
      throwOnError: false,
    });
  }
  if (katexMainFormulaY.value) {
    katex.render(latexFormulaY.value, katexMainFormulaY.value, {
      throwOnError: false,
    });
  }
  if (katexTransformedFormula.value) {
    katex.render(transformedFormula.value, katexTransformedFormula.value, {
      throwOnError: false,
    });
  }
  if (katexTransformedFormulaY.value) {
    katex.render(transformedFormulaY.value, katexTransformedFormulaY.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

watch([latexFormula, latexFormulaY, transformedFormula, transformedFormulaY], () => {
  renderFormula();
});

const content = `
## **概述**
正态分布$（Normal\\ Distribution）$，又称高斯分布$（Gaussian\\ Distribution）$，是一种在统计学和自然科学中广泛应用的重要连续概率分布。

### **正态分布的定义**
正态分布的概率密度函数$(PDF)$的公式为：
$$ 
f(x|\\mu, \\sigma^2) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x - \\mu)^2}{2\\sigma^2}\\right) 
$$

其中：
- $$\\mu$$ 表示正态分布的均值，决定了分布的中心位置。
- $$\\sigma^2$$ 表示方差，决定了分布的宽度和形状。
- $$\\sigma$$ 是标准差，方差的平方根。

## **特点**
正态分布的图形呈钟形曲线，具有以下特点：

- **1. 对称性**：正态分布关于均值 $$\\mu$$ 对称。
- **2. 均值、中位数和众数相等**：正态分布中，均值、中位数和众数是相同的。
- **3. 68-95-99.7 规则**：约68%的数据位于均值 $$\\mu$$ 加减一个标准差 $$\\sigma$$ 范围内，95%的数据位于均值加减两个标准差内，99.7%的数据位于均值加减三个标准差内。
- **4. 渐近性**：曲线的两端渐近于水平线，但永远不会触及水平线。

## **线性变换**
- 正态分布在进行线性变换时，新的分布仍然是正态分布。
- 假设我们对随机变量 $$X \\sim N(\\mu, \\sigma^2)$$ 进行线性变换：$$Y = aX + b$$，其中 $$a$$ 和 $$b$$ 为常数。那么，新的随机变量 $$Y$$ 仍然服从正态分布，且其均值和方差变为：
$$ 
Y \\sim N(a\\mu + b, a^2\\sigma^2)
$$

其中：
- 新的均值 $$a\\mu + b$$ 代表原均值经过线性变换后的值。
- 新的方差 $$a^2\\sigma^2$$ 是原方差乘以系数 $$a^2$$ 后的结果，表示分布的扩展或收缩。

**线性变换保留了正态分布的钟形曲线形状，只是改变了其位置和尺度。**
`
</script>

<template>
  <ExperimentBoard :panel-size="50">
    <template #experiment>
      <!-- <DistributionDiagram class="flex-1 h-full" :mean="transformedMean" :std-dev="transformedVariance" :a="a" :b="b"
        :show-history="save" /> -->
      <DistributionDiagram class="flex-1 h-full" :mean="transformedMean" :std-dev="transformedVariance"
        :transformed-mean-y="transformedMeanY" :transformed-variance-y="transformedVarianceY" :show-history="save"
        :line-show="lineShow" line1-color="red" line2-color="blue" />
    </template>

    <!-- <template #parameter>
      <div class="w-full flex flex-col items-center justify-center min-h-full">
        <div class="w-full flex items-center justify-center">
          <div>
            <button v-if="!save" class="btn mr-5" @click="saveImg">
              显示历史图像模式
            </button>
            <div v-if="save" class="mr-5 flex flex-col items-center">
              <div class="flex items-center justify-center mb-5">
                <div class="mr-2">
                  显示线性变化的历史图像模式
                </div>
                <label class="swap">
                  <input type="checkbox">
                  <div class="swap-on" @click="lineShow = true">ON</div>
                  <div class="swap-off" @click="lineShow = false">OFF</div>
                </label>
              </div>
              <div>
                <button class="btn mr-5" @click="back">
                  返回
                </button>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-start mb-1">
            <div class="flex flex-col items-start mb-4">
              <div ref="katexTransformedFormula" class="l mb-2" />
              <div ref="katexMainFormula" class="text-xl " />
            </div>
            <div class="flex flex-col items-start mb-4" />
            <div ref="katexTransformedFormulaY" class=" mb-2" />
            <div ref="katexMainFormulaY" class="text-xl " />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-5 p-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p>Mean</p>
            <InputNumber v-model.number="mean[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="mean" :min="-10" :max="10" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p>Variance</p>
            <InputNumber v-model.number="stdDev[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="stdDev" :min="0.1" :max="10" :step="0.05" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 font-sm items-center justify-center space-y-3">
            <p> a </p>
            <InputNumber v-model.number="a[0]" fluid :invalid="a[0] === 0" :min-fraction-digits="1" />
            <Slider v-model="a" :min="-10" :max="10" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p> b </p>
            <InputNumber v-model.number="b[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="b" :min="-10" :max="10" :step="0.1" class="w-5/6" />
          </div>
        </div>
      </div>
    </template> -->

    <template #parameter>
      <div class="w-full h-full flex flex-col justify-center p-3 gap-3">
        <!-- <Card class="h-full w-full card">
          <CardHeader class="pb-10">
            <CardTitle>正态分布公式</CardTitle>
          </CardHeader>
          <CardContent class="w-full  h-full flex flex-col items-start gap-3">
            <div class="w-full h-1/2 space-y-5">
              <div ref="katexTransformedFormula" class="text-base" />
              <div ref="katexMainFormula" class="text-base  pb-5" />
            </div>
            <div class="w-full h-1/2 space-y-5">
              <div ref="katexTransformedFormulaY" class="text-base" />
              <div ref="katexMainFormulaY" class="text-base " />
            </div>
          </CardContent>
        </Card> -->

        <Card class="w-full  card flex flex-1">
          <div class="flex flex-col w-full ">
            <div class="flex gap-5 justify-center items-center">
              <!-- 第一个 CardHeader -->
              <div class="flex-1 w-1/3">
                <CardHeader class="pb-5">
                  <CardTitle>正态分布公式</CardTitle>
                </CardHeader>
                <CardContent class="w-full">
                  <div class="flex flex-1 mb-4">
                    <div ref="katexTransformedFormula" class="text-base   mt-1 mr-24" />
                    <div ref="katexMainFormula" class="text-base " />
                  </div>

                  <div class="flex flex-1 ">
                    <div ref="katexTransformedFormulaY" class="text-base mt-2 mr-8" />
                    <div ref="katexMainFormulaY" class="text-base" />
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </Card>

        <Card class="h-full w-full cardflex-1 flex flex-col">
          <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-5 items-center justify-center gap-5">
            <div class="flex flex-1 items-center justify-center font-bold">
              <div class="flex flex-1 items-center justify-center">
                <div class="mr-4" v-html="renderLatex('均值\\(μ\\) = ')" />
                <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                  <Input v-model.number="mean[0]" fluid :min-fraction-digits="1" />
                  <Slider v-model="mean" :min="-10" :max="10" :step="0.1" class="w-full" />
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-center justify-center font-bold">
              <div class="flex flex-1 items-center justify-center">
                <div class="mr-4" v-html="renderLatex(' 方差\\(σ^2\\) = ')" />
                <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                  <Input v-model.number="stdDev[0]" fluid :min-fraction-digits="1" />
                  <Slider v-model="stdDev" :min="0.1" :max="10" :step="0.05" class="w-full" />
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-center justify-center font-bold">
              <div class="flex flex-1 items-center justify-center">
                <div class="mr-4" v-html="renderLatex(' \\(a\\) = ')" />
                <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                  <Input v-model.number="a[0]" fluid :invalid="a[0] === 0" :min-fraction-digits="1" />
                  <Slider v-model="a" :min="-10" :max="10" :step="0.01" class="w-full" />
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-center justify-center font-bold">
              <div class="flex flex-1 items-center justify-center">
                <div class="mr-4" v-html="renderLatex(' \\(b\\) = ')" />
                <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                  <Input v-model.number="b[0]" fluid :min-fraction-digits="1" />
                  <Slider v-model="b" :min="-10" :max="10" :step="0.1" class="w-5/6" />
                </div>
              </div>
            </div>

            <div class="flex gap-2 items-center justify-center">
              <Checkbox id="terms" @update:checked="(checked: boolean) => {
                if (checked) {
                  saveImg();
                }
                else {
                  back();
                }
                console.log(checked)
              }" />
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
      <CommentPanel exp-id="normal-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.flex {
  gap: 0; /* 设置间距为1rem */
}
</style>
