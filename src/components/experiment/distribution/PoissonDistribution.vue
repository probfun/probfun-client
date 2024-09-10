<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const lambda = ref([3]);  // Poisson distribution mean (λ)

const latexFormula = computed(() => `P(X = k) = \\frac{${lambda.value}^k e^{-${lambda.value}}}{k!}`);
const katexContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
    if (katexContainer.value) {
        katex.render(latexFormula.value, katexContainer.value, {
            throwOnError: false
        });
    }
};

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    renderFormula();
});

const chartData = ref();
const chartOptions = ref();
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    // 计算泊松分布的数据
    const labels = [];
    const data = [];
    const maxK = Math.ceil(4 * lambda.value[0]);  // 根据 λ 设置 k 的最大值
    for (let k = 0; k <= maxK; k++) {
        const probabilityOfK = (Math.pow(lambda.value[0], k) * Math.exp(-lambda.value[0])) / factorial(k);
        labels.push(k);
        data.push(probabilityOfK);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Poisson Distribution',
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: data
            },
        ]
    };
};

const setChartOptions = () => {
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
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                },
                // 设置 x 轴的最大值
                min: 0,
                max: Math.ceil(2 * lambda.value[0]),
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

// 计算阶乘
const factorial = (n: number) => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};

// 监听 lambda 的变化以动态更新图像
watch(lambda, () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
    renderFormula();
});

const content = `
**泊松分布（Poisson Distribution）** 是统计学中一种离散概率分布，用于描述在固定的时间间隔或空间区域内，事件发生的次数。它常用于建模某个事件的发生频率，特别是在平均事件发生率已知的情况下。泊松分布适用于事件发生概率相互独立的情境，并且事件发生是稀疏且随机的。

#### 泊松分布的定义

泊松分布的概率质量函数（PMF）定义为：

$$ 
P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\lambda $$ 是单位时间或单位区域内事件发生的平均次数（期望值）；
- $$ e $$ 是自然对数的底数（约等于 2.71828）；
- $$ k $$ 是事件发生的实际次数（$$ k $$ 为非负整数）。

#### 期望值和方差

- 期望值：$$ E(X) = \\lambda $$
- 方差：$$ \\text{Var}(X) = \\lambda $$

#### 特点

1. **稀疏性**：泊松分布通常用于建模稀疏事件，即事件发生的次数相对较少。
2. **独立性**：事件发生的次数之间是独立的。
3. **无上限**：理论上事件的发生次数可以是任意大的非负整数。
`
</script>

<template>
  <experiment-board title="二项分布" :tags="[]">
    <template #experiment>
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center mb-5">
          <div ref="katexContainer" class="text-xl"></div>
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Mean (λ) </p>
            <InputNumber v-model.number="lambda[0]" :min-fraction-digits="1"/>
            <Slider :min="0.1" :max="20" :step="0.1" v-model="lambda" class="w-48" />
          </div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div v-html="toMarkdown(content)" class="prose-sm max-w-none text-base-content"></div>
      </div>
    </template>
  </experiment-board>
</template>

<style scoped></style>
