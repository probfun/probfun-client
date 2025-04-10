<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue';
import PNDiagram from './PNDiagram.vue';
import 'katex/dist/katex.min.css';

const lambda = ref([30]);

const poissonFormula = computed(() => `P(X = k) = \\frac{${lambda.value[0]}^k e^{-${lambda.value[0]}}}{k!}`);
const normalFormula = computed(() => `N(X) = \\frac{1}{\\sqrt{2\\pi \\cdot ${lambda.value[0]}}} e^{-\\frac{(X - ${lambda.value[0]})^2}{2 \\cdot ${lambda.value[0]}}}`);

const poissonContainer = ref<HTMLElement | null>(null);
const normalContainer = ref<HTMLElement | null>(null);

function renderFormula() {
  if (poissonContainer.value) {
    katex.render(poissonFormula.value, poissonContainer.value, {
      throwOnError: false,
    });
  }
  if (normalContainer.value) {
    katex.render(normalFormula.value, normalContainer.value, {
      throwOnError: false,
    });
  }
}

const chartData = ref();
const chartOptions = ref();
onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  renderFormula();
});

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  const labels = [];
  const poissonData = [];
  const normalData = [];
  const mean = lambda.value[0];
  const stddev = Math.sqrt(lambda.value[0]);

  for (let k = 0; k <= lambda.value[0] * 2; k++) {
    const poissonProbability = (lambda.value[0] ** k * Math.exp(-lambda.value[0])) / factorial(k);
    poissonData.push(poissonProbability);

    const normalProbability = (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-((k - mean) ** 2) / (2 * stddev ** 2));
    normalData.push(normalProbability);

    labels.push(k);
  }

  return {
    labels,
    datasets: [
      {
        label: 'Poisson Distribution',
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: poissonData,
        fill: false,
      },
      {
        label: 'Normal Distribution',
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: normalData,
        fill: false,
        tension: 0.4,
      },
    ],
  };
}

function factorial(n: number): number {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
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
          
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
}

watch([lambda], () => {
  chartData.value = setChartData();
  renderFormula();
});

const content = `
## **泊松分布与正态分布的关系**
泊松分布和正态分布之间的关系在$λ$较大时表现为一种近似关系。具体而言，当泊松分布的参数$λ$（即平均值）较大时，泊松分布可以近似为一个均值为$λ$、方差也为$λ$的正态分布。

泊松分布的概率质量函数$(PMF)$为：

$$
P(X = k) = \\frac{λ^k e^{-λ}}{k!}
$$

其中，$λ$是泊松分布的参数（平均值和方差均为$λ$），$k$是非负整数。

当$λ$足够大时，泊松分布可以近似为一个均值为$λ$、方差为$λ$的正态分布：

$$
X \\sim \\text{P}(λ) \\approx \\text{N}(μ = λ, σ^2 = λ)
$$

此时，正态分布的概率密度函数$(PDF)$为：

$$
N(X) = \\frac{1}{\\sqrt{2\\pi λ}} e^{-\\frac{(X - λ)^2}{2λ}}
$$

总结来说，随着$λ$的增大，泊松分布逐渐接近一个均值为$λ$、方差为$λ$的正态分布，这种近似在统计学和工程应用中非常有用。

`
</script>

<template>
  <ExperimentBoard title="泊松分布与正态分布" :tags="[]">
    <template #experiment>
      <PNDiagram :lambda="lambda[0]" />
    </template>
    <!-- <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center mb-5">
          <div class="text-xl">
            泊松分布：
          </div>
          <div ref="poissonContainer" class="text-xl" />
        </div>
        <div class="w-full flex items-center justify-center mb-5">
          <div class="text-xl">
            正态分布：
          </div>
          <div ref="normalContainer" class="text-xl" />
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> λ </p>
            <InputNumber v-model.number="lambda[0]" />
            <Slider v-model="lambda" :min="30" :max="100" :step="1" class="w-48" />
          </div>
        </div>
      </div>
    </template> -->

    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center p-3 gap-3">
        <Card class="w-full h-full flex gap-3">
          <Card class="w-1/3 gap-3 ">
            <CardHeader>
              <div class="flex  gap-5">
                <CardTitle>泊松分布公式</CardTitle>
                <div class="w-10 h-1 mt-1 bg-blue-500" />
              </div>
            </CardHeader>
            <CardContent class="flex w-full justify-center ">
              <div ref="poissonContainer" class="text-base" />
            </CardContent>
          </Card>
          <Card class="w-1/3 gap-3 ">
            <CardHeader>
              <div class="flex  gap-5">
                <CardTitle>正态分布公式</CardTitle>
                <div class="w-10 h-1 mt-1 bg-red-500" />
              </div>
            </CardHeader>
            <CardContent class="flex w-full justify-center ">
              <div ref="normalContainer" class="text-base" />
            </CardContent>
          </Card>
          <Card class="w-1/3 gap-3 ">
          
            <CardContent class="flex w-full justify-center ">
              <div class="flex  flex-1 items-center font-bold justify-center mt-8 space-x-2">
                <div v-html="renderLatex('\\(λ\\) = ')" />

                <div class=" space-y-3">
                  <Input v-model.number="lambda[0]" class="w-full"/>
                  <Slider v-model="lambda" :min="30" :max="100" :step="1" class="w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Card>
        <!-- <Card class="w-full  flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col justify-center ">
            <div class="flex gap-4 pb-8">
              <div class="flex flex-col flex-1 items-center justify-center space-y-2">
                <div v-html="renderLatex('\\(λ\\)')" />

                <div class="max-w-xl space-y-3">
                  <Input v-model.number="lambda[0]" />
                  <Slider v-model="lambda" :min="30" :max="100" :step="1" class="w-48" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card> -->
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="poisson-normal" />
    </template>
  </ExperimentBoard>
</template>
