<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkDown } from '@/utils/markdown';

const number = ref(5);  // Number of experiments (n)
const probability = ref(0.5);  // Probability of success (p)

const latexFormula = computed(() => `P(X = k) = \\binom{${number.value}}{k} ${probability.value}^k (1-${probability.value})^{${number.value}-k}`);
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

    // 计算二项分布的数据
    const labels = [];
    const data = [];
    for (let k = 0; k <= number.value; k++) {
        const probabilityOfK = binomialCoefficient(number.value, k) *
            Math.pow(probability.value, k) *
            Math.pow(1 - probability.value, number.value - k);
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

二项分布与两点分布密切相关，是统计学中研究概率和事件发生次数的基本工具。
`
</script>

<template>
    <Splitter class="mb-8 h-full !border-0">
        <SplitterPanel class="pr-1.5">
            <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
                <div class="mb-2 font-bold"> 实验区 </div>
                <div class="h-full w-full flex flex-col">
                    <div class="card">
                        <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
                    </div>
                    <div class="w-full flex items-center justify-center mb-5">
                        <div ref="katexContainer" class="text-xl"></div>
                    </div>
                    <div class="flex w-full mb-5">
                        <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                            <p> Number of experiments </p>
                            <InputNumber v-model.number="number" :minFractionDigits="1"/>
                            <Slider :min="1" :max="10" :step="1" v-model="number" class="w-48" />
                        </div>
                        <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                            <p> Probability of success </p>
                            <InputNumber v-model.number="probability" :minFractionDigits="1"/>
                            <Slider :min="0" :max="1" :step="0.1" v-model="probability" class="w-48" />
                        </div>
                    </div>
                </div>
            </div>
        </SplitterPanel>
        <SplitterPanel class="pr-3 pl-1.5" :size="25">
            <Panel header="提示区" class="h-full overflow-auto">
                <div v-html="toMarkDown(content)" class="markdown-format">
                </div>
            </Panel>
        </SplitterPanel>
    </Splitter>
</template>

<style scoped></style>
