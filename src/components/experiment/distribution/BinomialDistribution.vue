<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { Slider } from '@/components/ui/slider';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const number = ref([1]);  // Number of experiments (n)
const probability = ref([0]);  // Probability of success (p)

const save = ref(false);
const saveImg = () => {
    save.value = true;
}
const back = () => {
    save.value = false;
    chartData.value.labels = [];
    chartData.value.datasets = [];
}

const latexFormula = computed(() => `P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k} = \\binom{${number.value}}{k} ${probability.value}^k (1-${probability.value})^{${number.value}-k}`);
const katexContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
    if (katexContainer.value) {
        katex.render(latexFormula.value, katexContainer.value, {
            throwOnError: false
        });
    }
};

onMounted(() => {
    chartDataO.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartDataO = ref();
const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    // 计算二项分布的数据
    const labels = [];
    const data = [];
    for (let k = 0; k <= number.value[0]; k++) {
        const probabilityOfK = binomialCoefficient(number.value[0], k) *
            Math.pow(probability.value[0], k) *
            Math.pow(1 - probability.value[0], number.value[0] - k);
        labels.push(k);
        data.push(probabilityOfK);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Binomial Distribution',
                backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: data
            },
        ]
    };
};

// 计算二项系数（组合数）
const binomialCoefficient = (n: number, k: number) => {
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    return result;
};
// 维护历史数据的 chartData，包含多个 dataset
const chartData = ref<{
    labels: number[],
    datasets: {
        label: string,
        backgroundColor: string,
        borderColor: string,
        data: number[],
        fill: boolean
    }[]
}>({
    labels: [],
    datasets: []
});
const addNewDataset = () => {
    if (!save.value) {
        return;
    }
    
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const data = [];

    // 计算新的二项分布数据
    for (let k = 0; k <= number.value[0]; k++) {
        const probabilityOfK = binomialCoefficient(number.value[0], k) *
            Math.pow(probability.value[0], k) *
            Math.pow(1 - probability.value[0], number.value[0] - k);
        data.push(probabilityOfK);
    }

    // 检查是否已经存在相同的 dataset
    const existingDataset = chartData.value.datasets.find(
        (dataset) => dataset.label === `n=${number.value[0]}, p=${probability.value[0]}`
    );

    // 如果已经存在相同的 dataset，不添加
    if (existingDataset) {
        return;
    }

    // 更新 chartData，添加新的 dataset
    chartData.value.labels = labels;
    chartData.value.datasets.push({
        label: `n=${number.value[0]}, p=${probability.value[0]}`,
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: data,
        fill: false
    });
};

// 设置图表选项
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
                }
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
};

const chartOptions = ref(setChartOptions());

// 监听 number 和 probability 变化，更新图表
watch([number, probability], () => {
    chartDataO.value = setChartData();
    addNewDataset();
    renderFormula();
});

onMounted(() => {
    renderFormula();
});

const content = `
二项分布（Binomial Distribution）是统计学中常见的一种离散概率分布，用于描述在重复进行的独立试验中，某个事件发生的次数的分布情况。该事件通常只有两个可能的结果，分别称为“成功”和“失败”。二项分布的典型应用场景包括抛硬币、抽样检验等。

#### 二项分布的定义
如果在每次试验中，事件发生的概率为 $$ p $$，那么在进行 $$ n $$ 次独立试验后，事件发生 $$ k $$ 次的概率由以下公式给出：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：
- $$ X $$ 是事件发生的次数；
- $$ \\binom{n}{k} $$ 是二项系数，表示从 $$ n $$ 次试验中选择 $$ k $$ 次成功的组合数，即 $$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$；
- $$ p $$ 是事件成功的概率；
- $$ 1-p $$ 是事件失败的概率。

#### 参数
- **试验次数** $$ n $$：表示进行独立试验的总次数。
- **成功概率** $$ p $$：表示每次试验成功的概率。
- **失败概率** $$ 1-p $$：表示每次试验失败的概率。

#### 期望值和方差
- 期望值：$$ E(X) = np $$
- 方差：$$ \\text{Var}(X) = np(1-p) $$

#### 两点分布（Bernoulli分布）
两点分布，也称伯努利分布（Bernoulli Distribution），是二项分布的特殊情况，即 $$ n = 1 $$ 时的二项分布。它表示一次试验的结果，其中“成功”的概率为 $$ p $$，而“失败”的概率为 $$ 1-p $$。两点分布的概率质量函数（PMF）为：

$$
P(X = k) = \\begin{cases} 
p, & \\text{如果 } k = 1 \\\\
1-p, & \\text{如果 } k = 0 
\\end{cases}
$$

其中：
- $$ X $$ 表示事件发生的结果，取值为 0 或 1。

#### 应用
- **二项分布**：用于计算多次试验中成功次数的分布情况。例如，抛10次硬币，计算出现正面的次数。
- **两点分布**：用于描述单次试验中成功与失败的情况。例如，抛一次硬币，记录正面朝上的概率。

二项分布与两点分布密切相关，是统计学中研究概率和事件发生次数的基本工具。`;
</script>

<template>
    <experiment-board title="二项分布" :tags="[]">
        <template #experiment>
            <Chart v-if="!save" type="line" :data="chartDataO" :options="chartOptions" class="h-full w-full" />
            <Chart v-if="save" type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-col items-center justify-center">
                <div>
                    <button v-if="!save" @click="saveImg" class="btn mb-5">显示历史图像模式</button>
                    <div>
                        <button v-if="save" @click="back" class="btn mb-5 mr-2">返回</button>
                    </div>
                </div>
                <div class="w-full flex items-center justify-center mb-5">
                    <div ref="katexContainer" class="text-xl"></div>
                </div>
                <div class="flex w-full mb-5">
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> Number of experiments </p>
                        <InputNumber v-model.number="number[0]" />
                        <Slider :min="1" :max="10" :step="1" v-model="number" class="w-48" />
                    </div>
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> Probability of success </p>
                        <InputNumber v-model.number="probability[0]" :min-fraction-digits="1" />
                        <Slider :min="0" :max="1" :step="0.1" v-model="probability" class="w-48" />
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
