<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const lambda = ref();

const poissonFormula = computed(() => `P(X = k) = \\frac{${lambda.value.toFixed(2)}^k e^{-${lambda.value.toFixed(2)}}}{k!}`);
const poissonContainer = ref<HTMLElement | null>(null);



onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Poisson Distribution',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
            },
            {
                label: 'Exponential Distribution',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                tension: 0.4
            }
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

const content = `
## 泊松分布与指数分布的关系

泊松分布和指数分布之间有着紧密的关系，特别是在描述随机事件的时间和数量方面。以下是两者的详细关系及相关公式：

### 1. 泊松分布 (Poisson Distribution)

泊松分布描述的是在固定时间内随机事件发生的次数。其概率质量函数（PMF）为：

$$
P(X = k) = \\frac{{\\lambda^k e^{-\\lambda}}}{{k!}}
$$

- $$ X $$ 是单位时间内发生的事件次数。
- $$ \\lambda $$ 是单位时间内事件发生的平均次数。
- $$ k $$ 是事件的具体发生次数（$$ k = 0, 1, 2, \\dots $$）。

### 2. 指数分布 (Exponential Distribution)

指数分布描述的是两个连续事件之间的时间间隔。其概率密度函数（PDF）为：

$$
f(t) = \\lambda e^{-\\lambda t}, \\quad t \\geq 0
$$

- $$ t $$ 是两个事件之间的时间间隔。
- $$ \\lambda $$ 同样表示单位时间内事件发生的平均次数（与泊松分布中的参数相同）。

### 3. 泊松过程 (Poisson Process)

泊松分布和指数分布之间的关系可以通过泊松过程来理解。泊松过程是一个描述随机事件在时间上发生的模型。

- 假设事件以固定的平均速率 $$ \\lambda $$ 随机发生，并且事件之间相互独立。
- 在一个时间段 $$ [0, T] $$ 内，事件发生的次数 $$ N(T) $$ 服从参数为 $$ \\lambda T $$ 的泊松分布，即：

$$
P(N(T) = k) = \\frac{{(\\lambda T)^k e^{-\\lambda T}}}{{k!}}, \\quad k = 0, 1, 2, \\dots
$$

- 事件之间的时间间隔 $$ T_i $$ 服从参数为 $$ \\lambda $$ 的指数分布：

$$
P(T_i > t) = e^{-\\lambda t}, \\quad t \\geq 0
$$

这意味着，在泊松过程中，两个连续事件之间的时间间隔是指数分布的，而在给定时间段内发生的事件总数是泊松分布的。

### 4. 关系总结

- 如果事件发生次数 $$ N(T) $$ 服从泊松分布 

$$
P(N(T) = k) = \\frac{{(\\lambda T)^k e^{-\\lambda T}}}{{k!}} 
$$

那么相邻事件的时间间隔 $$ T_i $$ 服从指数分布 

$$
P(T_i > t) = e^{-\\lambda t}, \\quad t \\geq 0
$$

- 泊松分布的参数 $$ \\lambda $$ 是单位时间内的平均事件次数，而指数分布的参数 $$ \lambda $$ 是时间间隔的倒数。

通过这些公式，可以清晰地看到泊松分布和指数分布在描述随机事件发生过程中的紧密联系。泊松分布用于描述事件的数量，而指数分布用于描述事件之间的时间间隔，两者共同构成了泊松过程的基础。

`
</script>

<template>
    <experiment-board title="泊松分布与指数分布" :tags="[]">
        <template #experiment>
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
        </template>
        <template #parameter>

        </template>
        <template #conclusion>
            <div class="w-full h-full p-5">
                <div v-html="toMarkdown(content)" class="prose max-w-full text-base-content"></div>
            </div>
        </template>
    </experiment-board>
</template>