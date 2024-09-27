<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue'
import 'katex/dist/katex.min.css';

const probability = ref([0.5]); // Probability of success (p)
const fixedN = ref([3]); // 固定的试验次数 n
const numberk = ref([1]); // Number of success (k)

const isChart1 = ref(true);
const isChart2 = ref(false);
const isChart3 = ref(false);
function toggleChart1() {
  isChart1.value = true;
  isChart2.value = false;
  isChart3.value = false;
}
function toggleChart2() {
  isChart1.value = false;
  isChart2.value = true;
  isChart3.value = false;
}
function toggleChart3() {
  isChart1.value = false;
  isChart2.value = false;
  isChart3.value = true;
}

const chartData1 = ref();
const chartOptions1 = ref();
function setChartData1() {
  const documentStyle = getComputedStyle(document.documentElement);
  const p = probability.value[0];

  const kValues = Array.from({ length: 20 }, (_, i) => i + 1);
  const data = kValues.map(k => (1 - p) ** (k - 1) * p); // 计算几何分布的概率

  return {
    labels: kValues,
    datasets: [
      {
        label: '几何分布',
        data,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
    ],
  };
}
function setChartOptions1() {
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
        title: {
          display: true,
          text: '试验次数 (k)',
          color: textColor,
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        title: {
          display: true,
          text: '概率 (P(X = k))',
          color: textColor,
        },
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
  if (!isChart1.value) {
    return;
  }
  if (!save.value) {
    return;
  }

  const documentStyle = getComputedStyle(document.documentElement);
  const labels = Array.from({ length: 20 }, (_, i) => i + 1);
  const data = [];

  const p = probability.value[0];
  // 计算几何分布的概率，并将结果直接推入 data 数组
  for (let k = 1; k <= 20; k++) {
    const probabilityOfK = (1 - p) ** (k - 1) * p;
    data.push(probabilityOfK);
  }

  // 检查是否已经存在相同的 dataset
  const existingDataset = chartData.value.datasets.find(
    dataset => dataset.label === `probability=${probability.value[0]}`,
  );

  // 如果已经存在相同的 dataset，不添加
  if (existingDataset) {
    return;
  }

  // 更新 chartData，添加新的 dataset
  chartData.value.labels = labels;
  chartData.value.datasets.push({
    label: `probability=${probability.value[0]}`,
    backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
    borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
    data,
    fill: false,
  });
}

const chartData2 = ref();
const chartOptions2 = ref();
function setChartData2() {
  const documentStyle = getComputedStyle(document.documentElement);
  const p = probability.value[0];

  const kValues = Array.from({ length: 20 }, (_, i) => i + 1); // 生成1到10的k值
  const data = kValues.map(k => (1 - p) ** k * p); // 计算几何分布的概率

  return {
    labels: kValues,
    datasets: [
      {
        label: '几何分布',
        data,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
    ],
  };
}
function setChartOptions2() {
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
        title: {
          display: true,
          text: '试验次数 (k)',
          color: textColor,
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        title: {
          display: true,
          text: '概率 (P(X = k))',
          color: textColor,
        },
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

const chartData3 = ref();
const chartOptions3 = ref();
function setChartData3() {
  const documentStyle = getComputedStyle(document.documentElement);
  const p = probability.value[0];
  const n = fixedN.value[0];

  const kValues = Array.from({ length: 20 }, (_, i) => i + 1); // 生成1到20的k值
  const data1 = kValues.map(k => (1 - p) ** k); // 计算 P(X > k) 的概率
  const data2 = kValues.map(k => (1 - p) ** (k + n)); // 计算 P(X > k + n) 的概率

  return {
    labels: kValues,
    datasets: [
      {
        label: '几何分布 P(X > k)',
        data: data1,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
      {
        label: `条件分布 P(X > k + ${n} | X > ${n})`,
        data: data2,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        tension: 0.4,
        borderDash: [5, 5],
        pointBackgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
        pointBorderColor: documentStyle.getPropertyValue('--p-orange-500'),
        spanGaps: true,
        borderJoinStyle: 'miter',
      },
      {
        label: '',
        data: kValues.map((k, _) => (k >= 1 && k <= 1 + n) ? (1 - p) ** (1 + n) : null), // 限制x范围的y值
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-red-500'), // 设置辅助线的颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  };
}
function setChartOptions3() {
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
        title: {
          display: true,
          text: '试验次数 (k)',
          color: textColor,
        },
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        title: {
          display: true,
          text: '概率',
          color: textColor,
        },
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

function saveImg() {
  save.value = true;
}
function back() {
  save.value = false;
  chartData.value.labels = [];
  chartData.value.datasets = [];
}

const finalResultOne = computed(() => {
  const p = probability.value[0] ;
  const k = numberk.value[0];
  return Math.pow(1-p,k-1)*p;
});

const oneFormula = computed(() => {
  const resultOne = finalResultOne.value.toFixed(15); // 保留10位小数
  return `P(X = k) = (1 - p)^{k-1} \\cdot p = (1 - ${probability.value[0]})^{${numberk.value[0]-1}} \\cdot ${probability.value[0]} = ${resultOne}`;
});
const oneContainer = ref<HTMLElement | null>(null);

const finalResultTwo = computed(() => {
  const p = probability.value[0] ;
  const k = numberk.value[0];
  return Math.pow(1-p,k)*p;
});

const twoFormula = computed(() => {
  const resultTwo = finalResultTwo.value.toFixed(15); // 保留10位小数
  return `P(X = k) = (1 - p)^{k} \\cdot p  = (1 - ${probability.value[0]})^{${numberk.value}} \\cdot ${probability.value[0]} = ${resultTwo}`;
});
const twoContainer = ref<HTMLElement | null>(null);

const finalResultThree = computed(() => {
  const p = probability.value[0] ;
  const k = numberk.value[0];
  return Math.pow(1-p,k);
});

const threeFormula = computed(() => {
  const resultThree = finalResultThree.value.toFixed(20); // 保留10位小数
  return `
  \\begin{aligned}
  P(X > ${fixedN.value[0]} + k \\mid X > ${fixedN.value[0]}) 
  &= P(X > k) =(1 - p)^{k}= (1 - ${probability.value[0]})^{${numberk.value}} \\\\
  &= ${resultThree}
  \\end{aligned}`;
});
const threeContainer = ref<HTMLElement | null>(null);

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
  if (threeContainer.value) {
    katex.render(threeFormula.value, threeContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  chartData1.value = setChartData1();
  chartOptions1.value = setChartOptions1();
  chartData2.value = setChartData2();
  chartOptions2.value = setChartOptions2();
  chartData3.value = setChartData3();
  chartOptions3.value = setChartOptions3();
  renderFormula();
});

// 监听 probability 的变化以动态更新图像
watch([probability, fixedN,numberk], () => {
  chartData1.value = setChartData1();
  chartData2.value = setChartData2();
  chartData3.value = setChartData3();
  addNewDataset();
  renderFormula();
});

const content = `
## **概述**
几何分布$（Geometric Distribution）$是统计学中的一种离散概率分布，用于描述在一系列独立的伯努利试验中，第一次成功发生之前的失败次数。几何分布可以用来表示成功之前进行的失败次数，或直到第一次成功所需的试验次数。

## **几何分布的定义**

对于几何分布，有两种常见的定义：

**1. 第一次成功前的失败次数（$$ X $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(X = k) = (1-p)^k p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是失败的次数（$$ k $$ 为非负整数）。

**2. 直到第一次成功所需的试验次数（$$ Y $$）**：

  其概率质量函数$（PMF）$定义为：
  $$
  P(Y = k) = (1-p)^{k-1} p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是试验次数（$$ k $$ 为正整数）。

#### **期望值和方差:**

  **对于失败次数（$$ X $$）：**

   $$ 
   期望值：E(X) = \\frac{1-p}{p}   \\\\
   方差：\\text{Var}(X) = \\frac{1-p}{p^2} 
   $$

 **对于试验次数（$$ Y $$）：**

$$
期望值： E(Y) = \\frac{1}{p} \\\\
方差： \\text{Var}(Y) = \\frac{1-p}{p^2} 
$$


## **特点**
**1. 无记忆性**：几何分布具有无记忆性，即过去的试验结果不会影响未来的成功概率。数学上表示为：
   $$
   P(X > m + n \\mid X > n) = P(X > m)
   $$
   其中 $$ X $$ 是第一次成功前的失败次数。
   
**2. 离散分布**：几何分布是一种定义在非负整数上的离散概率分布。
`
</script>

<template>
  <ExperimentBoard title="二项分布" :tags="[]">
    <template #experiment>
      <Chart
        v-if="isChart1 && !save" type="line" :data="chartData1" :options="chartOptions1"
        class="h-full w-full"
      />
      <Chart
        v-if="isChart1 && save" type="line" :data="chartData" :options="chartOptions1"
        class="h-full w-full"
      />
      <Chart v-if="isChart2" type="line" :data="chartData2" :options="chartOptions2" class="h-full w-full" />
      <Chart v-if="isChart3" type="line" :data="chartData3" :options="chartOptions3" class="h-full w-full" />
    </template>
    <template #parameter>
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
                <a>直到第一次成功的次数</a>
              </li>
              <li @click="toggleChart2">
                <a>第一次成功前的失败次数</a>
              </li>
              <li @click="toggleChart3">
                <a>几何分布的无记忆性</a>
              </li>
            </ul>
          </div>
          <div v-show="isChart1" ref="oneContainer" class="text-xl" />
          <div v-show="isChart2" ref="twoContainer" class="text-xl" />
          <div v-show="isChart3" ref="threeContainer" class="text-xl" />
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Probability of success(p) </p>
            <InputNumber v-model.number="probability[0]" :min-fraction-digits="1" />
            <Slider v-model="probability" :min="0" :max="1" :step="0.1" class="w-48" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Numbers of trial until success (include)(k) </p>
            <InputNumber v-model.number="numberk[0]" />
            <Slider v-model="numberk" :min="1" :max="60" :step="1" class="w-48" />
          </div>
          <div v-if="isChart3" class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Fixed number of trial </p>
            <InputNumber v-model.number="fixedN[0]" />
            <Slider v-model="fixedN" :min="0" :max="9" :step="1" class="w-48" />
          </div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
