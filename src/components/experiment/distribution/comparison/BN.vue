<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const number = ref([20]);
const probability = ref([0.1]);
const mean = computed(() => number.value[0] * probability.value[0]);
const variance = computed(() => number.value[0] * probability.value[0] * (1 - probability.value[0]));
const stdDev = computed(() => Math.sqrt(variance.value));

const binomialFormula = computed(() => `P(X = k) = \\binom{${number.value[0]}}{k} ${probability.value[0]}^k (1-${probability.value[0]})^{${number.value[0]}-k}`);
const binomialContainer = ref<HTMLElement | null>(null);

const normalFormula = computed(() => `P(X = k) \\approx \\frac{1}{\\sqrt{2\\pi ${variance.value.toFixed(2)}}} e^{-\\frac{(k - ${mean.value.toFixed(2)})^2}{2${variance.value.toFixed(2)}}}`);
const normalContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
    if (binomialContainer.value) {
        katex.render(binomialFormula.value, binomialContainer.value, {
            throwOnError: false
        });
    }
    if (normalContainer.value) {
        katex.render(normalFormula.value, normalContainer.value, {
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

    const labels = [];
    const binomialData = [];
    const normalData = [];
    for (let k = 0; k <= number.value[0]; k++) {
        // 计算二项分布
        const probabilityOfK = binomialCoefficient(number.value[0], k) *
            Math.pow(probability.value[0], k) *
            Math.pow(1 - probability.value[0], number.value[0] - k);
        binomialData.push(probabilityOfK);

        // 计算正态分布
        const normalProbability = (1 / (stdDev.value * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(k - mean.value, 2) / (2 * variance.value));
        normalData.push(normalProbability);

        labels.push(k);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Binomial Distribution',
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                data: binomialData,
                fill: false,
            },
            {
                label: 'Normal Distribution',
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                data: normalData,
                fill: false,
                tension: 0.4
            }
        ]
    };
};

// 计算阶乘
const factorial = (n: number): number => {
    return n <= 1 ? 1 : n * factorial(n - 1);
};

const setChartOptions = () => {
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
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

// 计算二项系数（组合数）
const binomialCoefficient = (n: number, k: number) => {
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
    }
    return result;
};

// 监听 props 的变化以动态更新图像
watch([number, probability], () => {
    chartData.value = setChartData();
    renderFormula();
});

const content = `
## 二项分布与正态分布的关系

### 1. 二项分布到正态分布的近似

#### 条件
二项分布 $$ \\text{Binomial}(n, p) $$ 描述的是 $$ n $$ 次独立重复试验中成功次数的分布，每次成功的概率为 $$ p $$。正态分布 $$ \\text{Normal}(\\mu, \\sigma^2) $$ 是一种连续分布，描述随机变量的取值在某一均值附近的概率分布。

当以下条件满足时，二项分布可以近似为正态分布：

$$
n \\to \\infty, \\quad p \\not\\approx 0, \\quad np \\text{ 和 } np(1-p) \\text{ 足够大}
$$

在这种情况下，二项分布的成功次数 $$ X $$ 接近于正态分布。

#### 数学推导
我们从二项分布的概率质量函数（PMF）开始：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：

$$
\\binom{n}{k} = \\frac{n!}{k!(n-k)!}
$$

是组合数。

根据中心极限定理，当 $$ n $$ 很大时，$$ X $$ 的分布趋近于正态分布：

$$
X \\sim \\text{Normal}(np, np(1-p))
$$

也就是说，$$ X $$ 服从均值为 $$ np $$，方差为 $$ np(1-p) $$ 的正态分布。

#### 计算简化
在实际应用中，当 $$ n $$ 和 $$ p $$ 满足上述条件时，计算二项分布的概率会涉及到较大的数值运算（如组合数计算），而正态分布的计算相对简单，因此这种近似可以大大简化计算过程。

### 2. 两者关系的总结
- **联系**: 正态分布可以看作是二项分布在 $$ n \\to \\infty $$ 的极限情况。当试验次数很多且成功概率接近于中间值时，二项分布趋近于正态分布。
- **近似条件**: $$ np \\text{ 和 } np(1-p) $$ 足够大。
- **实际应用**: 正态分布常用于在样本量大时近似二项分布，尤其在二项分布的参数不极端的情况下。
`
</script>

<template>
    <experiment-board title="二项分布与正态分布" :tags="[]">
        <template #experiment>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-col items-center justify-center">
                <div class="w-full flex items-center justify-center mb-5">
                    <div class="text-xl">二项分布：</div>
                    <div ref="binomialContainer" class="text-xl"></div>
                </div>
                <div class="flex w-full mb-5">
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> Number of experiments </p>
                        <InputNumber v-model.number="number[0]" />
                        <Slider :min="20" :max="50" :step="1" v-model="number" class="w-48" />
                    </div>
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> Probability of success </p>
                        <InputNumber v-model.number="probability[0]" :min-fraction-digits="2" />
                        <Slider :min="0" :max="1" :step="0.01" v-model="probability" class="w-48" />
                    </div>
                </div>
                <div class="w-full flex flex-col items-center justify-center mb-5">
                    <div class="text-xl mb-4">正态分布：μ = np = {{ mean.toFixed(2) }}, σ² = np(1-p) = {{
                        variance.toFixed(2) }}</div>
                    <div ref="normalContainer" class="text-xl"></div>
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
