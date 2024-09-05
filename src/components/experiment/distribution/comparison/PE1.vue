<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const lambda = ref([10]);

const latexFormula = computed(() => `f(x) = \\frac{1}{${lambda.value[0]}} e^{-\\frac{x}{${lambda.value[0]}}}, \\quad x \\geq 0`);
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

    const labels = [];
    const data = [];
    const maxK = 3 * lambda.value[0];  // 根据 λ 设置 k 的最大值
    for (let k = 0; k <= maxK; k++) {
        const probabilityOfK = 1 / lambda.value[0] * Math.exp(-k / lambda.value[0]);
        labels.push(k);
        data.push(probabilityOfK);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: '到站时间间隔概率',
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

### 5. 公交车悖论
公交车悖论与指数分布和泊松分布密切相关。公交车的到达时间可以被建模为泊松过程，其中每两辆车之间的时间间隔服从指数分布。指数分布描述了独立事件（如公交车到达）之间的时间间隔，具有无记忆性，即已经等待的时间不影响下一辆车何时到来。尽管公交车的平均间隔是固定的，由于指数分布的特性，乘客更有可能在长间隔内开始等待，导致平均等待时间比直觉预期的更长。泊松分布则描述了在固定时间段内公交车到达的次数，而公交车悖论正是这两种分布共同作用的结果。
`
</script>

<template>
    <experiment-board title="泊松分布与指数分布" :tags="[]">
        <template #experiment>
            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-col items-center justify-center">
                <div class="flex w-full mb-5">
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> 公交车的发车间隔（min） </p>
                        <InputNumber v-model.number="lambda" :min-fraction-digits="1" />
                        <Slider :min="5" :max="30" :step="5" v-model="lambda" class="w-48" />
                    </div>
                </div>
                <div class="w-full flex items-center justify-center mb-5">
                    <div class="dropdown">
                        <div tabindex="0" role="button" class="btn mr-5 text-l">公交车到站的时间间隔:</div>
                        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><router-link to="/dashboard/experiment/comparison/poissonExponential2">每小时到站的公交车数量</router-link>
                            </li>
                        </ul>
                    </div>
                    <div ref="katexContainer" class="text-xl"></div>
                </div>
                <div>平均等车时间{{ lambda }}分钟</div>
            </div>
        </template>
        <template #conclusion>
            <div class="w-full h-full p-5">
                <div v-html="toMarkdown(content)" class="prose max-w-full text-base-content"></div>
            </div>
        </template>
    </experiment-board>
</template>
