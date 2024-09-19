<script setup lang="ts">
import DistributionDiagram from '@/components/experiment/distribution/DistributionDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import 'katex/dist/katex.min.css';

const mean = ref([0]);
const stdDev = ref([1]);
const a = ref([1]);
const b = ref([0]);
const transformedMean = ref();
const transformedVariance = ref();

const save = ref(false);
function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
}

const latexFormula = computed(() => {
  transformedMean.value = a.value[0] * mean.value[0] + b.value[0];
  transformedVariance.value = a.value[0] ** 2 * stdDev.value[0] ** 2;

  const meanVal = transformedMean.value.toFixed(1);
  const varianceVal = transformedVariance.value.toFixed(1);

  // 如果 meanVal 为负数，则添加括号
  const meanDisplay = meanVal < 0 ? `(${meanVal})` : meanVal;
  // 如果 varianceVal 为负数（虽然理论上方差不会是负数，但以防万一）
  const varianceDisplay = varianceVal < 0 ? `(${varianceVal})` : varianceVal;

  return `f(x) = \\frac{1}{\\sqrt{2\\pi\\times${varianceDisplay}}} e^{-\\frac{(x-${meanDisplay})^2}{2\\times${varianceDisplay}}}`;
});

const transformedFormula = computed(() => {
  // 计算均值和方差
  const transformedMean = a.value[0] * mean.value[0] + b.value[0];
  const transformedVariance = a.value[0] ** 2 * stdDev.value[0] ** 2;

  return `X \\sim N(${transformedMean.toFixed(2)}, ${transformedVariance.toFixed(2)})`;
});

const katexMainFormula = ref<HTMLElement | null>(null);
const katexTransformedFormula = ref<HTMLElement | null>(null);

function renderFormula() {
  if (katexMainFormula.value) {
    katex.render(latexFormula.value, katexMainFormula.value, {
      throwOnError: false,
    });
  }
  if (katexTransformedFormula.value) {
    katex.render(transformedFormula.value, katexTransformedFormula.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

watch([latexFormula, transformedFormula], () => {
  renderFormula();
});

const content = `
## **概述**
正态分布$（Normal Distribution）$，又称高斯分布$（Gaussian Distribution）$，是一种在统计学和自然科学中广泛应用的重要连续概率分布。

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
  <ExperimentBoard title="二项分布" :tags="[]">
    <template #experiment>
      <DistributionDiagram
        class="flex-1 h-full" :mean="transformedMean" :std-dev="transformedVariance" :a="a" :b="b"
        :show-history="save"
      />
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center">
          <div>
            <button v-if="!save" class="btn mr-5" @click="saveImg">
              显示历史图像模式
            </button>
            <div>
              <button v-if="save" class="btn mr-5" @click="back">
                返回
              </button>
            </div>
          </div>
          <div ref="katexMainFormula" class="text-xl mr-5" />
          <div ref="katexTransformedFormula" class="text-xl ml-5" />
        </div>
        <div class="grid grid-cols-2 gap-5 p-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p>Mean</p>
            <InputNumber v-model.number="mean[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="mean" :min="-5" :max="5" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p>Variance</p>
            <InputNumber v-model.number="stdDev[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="stdDev" :min="0.1" :max="5" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p> a </p>
            <InputNumber v-model.number="a[0]" fluid :invalid="a[0] === 0" :min-fraction-digits="1" />
            <Slider v-model="a" :min="-2" :max="2" :step="0.1" class="w-full" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-3">
            <p> b </p>
            <InputNumber v-model.number="b[0]" fluid :min-fraction-digits="1" />
            <Slider v-model="b" :min="-5" :max="5" :step="0.1" class="w-5/6" />
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

  <!--  <Splitter class="mb-8 h-full !border-0"> -->
  <!--    <SplitterPanel class="pr-1.5"> -->
  <!--      <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full"> -->
  <!--        <div class="mb-2 font-bold">实验区</div> -->
  <!--        <div class="h-full w-full flex flex-col"> -->
  <!--          <div class="mb-5 w-full flex-1"> -->
  <!--            <distribution-diagram class="flex-1 h-full" :mean="transformedMean" :std-dev="transformedVariance" :a="a" :b="b" /> -->
  <!--          </div> -->
  <!--          <div class="w-full flex items-center justify-center mb-5"> -->
  <!--            <div ref="katexContainer" class="flex items-center space-x-2"> -->
  <!--              <div ref="katexMainFormula" class="inline-block mr-5 text-xl"></div> -->
  <!--              <div ref="katexTransformedFormula" class="inline-block text-xl"></div> -->
  <!--            </div> -->
  <!--          </div> -->
  <!--          <div class="flex w-full mb-5 space-x-4"> -->
  <!--            <div class="flex flex-col flex-1 items-center justify-center space-y-3"> -->
  <!--              <p>Mean</p> -->
  <!--              <InputNumber v-model.number="mean" fluid /> -->
  <!--              <Slider :min="-5" :max="5" :step="0.1" v-model="mean" class="w-full" /> -->
  <!--            </div> -->
  <!--            <div class="flex flex-col flex-1 items-center justify-center space-y-3"> -->
  <!--              <p>Variance</p> -->
  <!--              <InputNumber v-model.number="stdDev" fluid /> -->
  <!--              <Slider :min="0.1" :max="5" :step="0.1" v-model="stdDev" class="w-full" /> -->
  <!--            </div> -->
  <!--            <div class="flex flex-col flex-1 items-center justify-center space-y-3"> -->
  <!--              <p> a </p> -->
  <!--              <InputNumber v-model.number="a" fluid :invalid="a === 0"/> -->
  <!--              <Slider :min="-2" :max="2" :step="0.1" v-model="a" class="w-full" /> -->
  <!--            </div> -->
  <!--            <div class="flex flex-col flex-1 items-center justify-center space-y-3"> -->
  <!--              <p> b </p> -->
  <!--              <InputNumber v-model.number="b" fluid /> -->
  <!--              <Slider :min="-5" :max="5" :step="0.1" v-model="b" class="w-5/6" /> -->
  <!--            </div> -->
  <!--          </div> -->
  <!--        </div> -->
  <!--      </div> -->
  <!--    </SplitterPanel> -->
  <!--    <SplitterPanel class="pr-3 pl-1.5" :size="25"> -->
  <!--      <Panel header="提示区" class="h-full overflow-auto"> -->
  <!--        <div v-html="toMarkdown(content)" class="markdown-format"> -->
  <!--        </div> -->
  <!--      </Panel> -->
  <!--    </SplitterPanel> -->
  <!--  </Splitter> -->
</template>

<style scoped></style>
