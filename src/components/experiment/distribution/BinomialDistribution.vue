<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue';
import BinomialDiagram from './BinomialDiagram.vue';
import 'katex/dist/katex.min.css';

const number = ref([1]); // Number of experiments (n)
const probability = ref([0]); // Probability of success (p)
const numberk = ref([1]); // Number of success (k)

const chartDataO = ref();
function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  // 计算二项分布的数据
  const labels = [];
  const data = [];
  for (let k = 0; k <= number.value[0]; k++) {
    const probabilityOfK = binomialCoefficient(number.value[0], k)
      * probability.value[0] ** k
      * (1 - probability.value[0]) ** (number.value[0] - k);
    labels.push(k);
    data.push(probabilityOfK);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Binomial Distribution',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data,
      },
    ],
  };
}

// 计算二项系数（组合数）
function binomialCoefficient(n: number, k: number) {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }
  return result;
}
// 维护历史数据的 chartData，包含多个 dataset
const chartData = ref<{
  labels: number[]
  datasets: {
    label: string
    backgroundColor: string
    borderColor: string
    data: number[]
    fill: boolean
  }[]
}>({
  labels: [],
  datasets: [],
});

const save = ref(false);
function addNewDataset() {
  if (!save.value) {
    return;
  }

  const documentStyle = getComputedStyle(document.documentElement);
  const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const data = [];

  // 计算新的二项分布数据
  for (let k = 0; k <= number.value[0]; k++) {
    const probabilityOfK = binomialCoefficient(number.value[0], k)
      * probability.value[0] ** k
      * (1 - probability.value[0]) ** (number.value[0] - k);
    data.push(probabilityOfK);
  }

  // 检查是否已经存在相同的 dataset
  const existingDataset = chartData.value.datasets.find(
    dataset => dataset.label === `n=${number.value[0]}, p=${probability.value[0]}`,
  );

  // 如果已经存在相同的 dataset，不添加
  if (existingDataset) {
    return;
  }

  chartData.value.labels = labels;
  chartData.value.datasets.push({
    label: `n=${number.value[0]}, p=${probability.value[0]}`,
    backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
    borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
    data,
    fill: false,
  });
}

// 计算属性，用于动态更新k的最大值
const maxK = ref(0);
watch(number, () => {
  maxK.value = number.value[0];
}, { deep: true });
ref(number.value[0]);
// 监视n的变化，确保k的值不大于n
watch(number, (newVal) => {
  if (numberk.value[0] > newVal[0]) {
    numberk.value[0] = newVal[0];
  }
});

function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
  chartData.value.labels = [];
  chartData.value.datasets = [];
}

// 计算组合数的函数
function BinomialCoefficient(n: number, k: number): number {
  if (k > n)
    return 0;

  const factorial = (num: number): number => {
    return num <= 1 ? 1 : num * factorial(num - 1);
  };

  return factorial(n) / (factorial(k) * factorial(n - k));
}

const finalResult = ref(0);

// 定义 watch
watch(
  [number, numberk, probability], // 监听多个 ref
  ([newNumber, newNumberk, newProbability]) => {
    const n = newNumber[0];
    const k = newNumberk[0];
    const p = newProbability[0];
    const coefficient = BinomialCoefficient(n, k);
    finalResult.value = coefficient * p ** k * (1 - p) ** (n - k);
  },
  { deep: true }, // 深度监听
);

// 输出LaTeX公式
const latexFormula = computed(() => {
  const absValue = Math.abs(finalResult.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResult.value / 10 ** exponent).toFixed(3); // 计算尾数并保留5位小数
  const result = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串
  return `P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k} = \\binom{${number.value}}{${numberk.value}} ${probability.value}^{${numberk.value}} (1-${probability.value})^{${number.value}-${numberk.value}} = ${result}`;
});

// const latexFormula = computed(() => `P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k} = \\binom{${number.value}}${numberk.value} ${probability.value}^${numberk.value} (1-${probability.value})^{${number.value}-${numberk.value}} =  ${result} `);
const katexContainer = ref<HTMLElement | null>(null);

function renderFormula() {
  if (katexContainer.value) {
    katex.render(latexFormula.value, katexContainer.value, {
      throwOnError: false,
    });
  }
}

// 设置图表选项
function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  };
}

const chartOptions = ref(setChartOptions());

// 监听 number 和 probability 变化，更新图表
watch([number, probability, numberk], () => {
  chartDataO.value = setChartData();
  addNewDataset();
  renderFormula();
}, { deep: true });

onMounted(() => {
  chartDataO.value = setChartData();
  chartOptions.value = setChartOptions();
});

onMounted(() => {
  renderFormula();
});

const content = `
## **概述**
二项分布（$$Binomial\\ Distribution$$）是统计学中常见的一种离散概率分布，用于描述在重复进行的独立试验中，某个事件发生的次数的分布情况。该事件通常只有两个可能的结果，分别称为“成功”和“失败”。二项分布的典型应用场景包括抛硬币、抽样检验等。

## **二项分布的定义**
如果在每次试验中，事件发生的概率为 $$ p $$，那么在进行 $$ n $$ 次独立试验后，事件发生 $$ k $$ 次的概率由以下公式给出：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\binom{n}{k} $$ 是二项系数，表示从 $$ n $$ 次试验中选择 $$ k $$ 次成功的组合数，即 $$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$；
- $$ p $$ 是事件成功的概率；
- $$ 1-p $$ 是事件失败的概率。

#### 参数：
- 试验次数 $$ n $$：表示进行独立试验的总次数。
- 成功概率 $$ p $$：表示每次试验成功的概率。
- 失败概率 $$ 1-p $$：表示每次试验失败的概率。

#### **期望值和方差**：
- **期望值：$$ E(X) = np $$**
- **方差：$$ \\text{Var}(X) = np(1-p) $$**

## **对比：两点分布$（Bernoulli分布）$**
两点分布，是二项分布的特殊情况，即 $$ n = 1 $$ 时的二项分布。它表示一次试验的结果，其中“成功”的概率为 $$ p $$，而“失败”的概率为 $$ (1-p) $$。两点分布的概率质量函数$（PMF）$为：

$$
P(X = k) = \\begin{cases} 
p, & \\text{如果 } k = 1 \\\\
1-p, & \\text{如果 } k = 0 
\\end{cases}
$$

其中：
- $$ X $$ 表示事件发生的结果，取值为 $0$ 或 $1$。

## **应用**
**二项分布**：用于计算多次试验中成功次数的分布情况。例如，抛10次硬币，计算出现正面的次数。

**两点分布**：用于描述单次试验中成功与失败的情况。例如，抛一次硬币，记录正面朝上的概率。

二项分布与两点分布密切相关，是统计学中研究概率和事件发生次数的基本工具。`;
</script>

<template>
  <ExperimentBoard title="二项分布" :tags="[]" :panel-size="60">
    <template #experiment>
      <BinomialDiagram :n="number[0]" :p="probability[0]" :save="save" />
    </template>
    <template #parameter>
      <div class="w-full min-h-full flex flex-col items-center justify-center p-3 gap-3">
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
            <div class="grid grid-cols-4">
              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('试验次数 \\(n\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-1">
                    <Input v-model="number[0]" class="w-full mb-2" />
                    <Slider v-model="number" :min="1" :max="100" :step="1" class="w-full" />
                  </div>
                </div>
              </div>

              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('成功次数 \\(k\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                    <Input v-model="numberk[0]" />
                    <Slider v-model="numberk" :min="1" :max="maxK" :step="1" />
                  </div>
                </div>
              </div>

              <div class="flex flex-1 items-center justify-center font-bold">
                <div class="flex flex-1 items-center justify-center">
                  <div class="mr-4" v-html="renderLatex('成功率 \\(p\\) = ')" />
                  <div class="flex flex-col items-center justify-center w-1/2 space-y-3">
                    <Input v-model="probability[0]" :min-fraction-digits="1" />
                    <Slider v-model="probability" :min="0" :max="1" :step="0.1" />
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
      <CommentPanel exp-id="binomial-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
