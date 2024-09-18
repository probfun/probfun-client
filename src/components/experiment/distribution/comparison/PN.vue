<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const lambda = ref([30]);

const poissonFormula = computed(() => `P(X = k) = \\frac{${lambda.value[0]}^k e^{-${lambda.value[0]}}}{k!}`);
const normalFormula = computed(() => `N(X) = \\frac{1}{\\sqrt{2\\pi \\cdot ${lambda.value[0]}}} e^{-\\frac{(X - ${lambda.value[0]})^2}{2 \\cdot ${lambda.value[0]}}}`);

const poissonContainer = ref<HTMLElement | null>(null);
const normalContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
    if (poissonContainer.value) {
        katex.render(poissonFormula.value, poissonContainer.value, {
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
    const poissonData = [];
    const normalData = [];
    const mean = lambda.value[0];
    const stddev = Math.sqrt(lambda.value[0]);

    for (let k = 0; k <= lambda.value[0] * 2; k++) {
        const poissonProbability = (Math.pow(lambda.value[0], k) * Math.exp(-lambda.value[0])) / factorial(k);
        poissonData.push(poissonProbability);

        const normalProbability = (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(k - mean, 2) / (2 * Math.pow(stddev, 2)));
        normalData.push(normalProbability);

        labels.push(k);
    }

    return {
        labels: labels,
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
                tension: 0.4
            }
        ]
    };
};

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

watch([lambda], () => {
    chartData.value = setChartData();
    renderFormula();
});

const content = `
## 泊松分布与正态分布的关系
泊松分布和正态分布之间的关系在$λ$较大时表现为一种近似关系。具体而言，当泊松分布的参数λ（即平均值）较大时，泊松分布可以近似为一个均值为λ、方差也为λ的正态分布。

泊松分布的概率质量函数为：

$$
P(X = k) = \\frac{λ^k e^{-λ}}{k!}
$$

其中，$λ$是泊松分布的参数（平均值和方差均为$λ$），$k$是非负整数。

当λ足够大时，泊松分布可以近似为一个均值为$λ$、方差为$λ$的正态分布：

$$
X \\sim \\text{Poisson}(λ) \\approx \\text{Normal}(μ = λ, σ^2 = λ)
$$

此时，正态分布的概率密度函数为：

$$
N(X) = \\frac{1}{\\sqrt{2\\pi λ}} e^{-\\frac{(X - λ)^2}{2λ}}
$$

总结来说，随着$λ$的增大，泊松分布逐渐接近一个均值为$λ$、方差为$λ$的正态分布，这种近似在统计学和工程应用中非常有用。

`
</script>

<template>
    <experiment-board title="泊松分布与正态分布" :tags="[]">
        <template #experiment>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-col items-center justify-center">
                <div class="w-full flex items-center justify-center mb-5">
                    <div class="text-xl">泊松分布：</div>
                    <div ref="poissonContainer" class="text-xl"></div>
                </div>
                <div class="w-full flex items-center justify-center mb-5">
                    <div class="text-xl">正态分布：</div>
                    <div ref="normalContainer" class="text-xl"></div>
                </div>
                <div class="flex w-full mb-5">
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> λ </p>
                        <InputNumber v-model.number="lambda[0]" />
                        <Slider :min="30" :max="60" :step="1" v-model="lambda" class="w-48" />
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
