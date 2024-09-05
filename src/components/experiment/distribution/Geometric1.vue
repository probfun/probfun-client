<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const probability = ref([0.5]);  // Probability of success (p)

const latexFormula = computed(() => `P(X = k) = (1 - ${probability.value})^{k-1} \\cdot ${probability.value}`);
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
    const p = probability.value;

    const kValues = Array.from({ length: 20 }, (_, i) => i + 1);  // 生成1到10的k值
    const data = kValues.map(k => Math.pow(1 - p[0], k - 1) * p[0]); // 计算几何分布的概率

    return {
        labels: kValues,
        datasets: [
            {
                label: '几何分布',
                data: data,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
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
                title: {
                    display: true,
                    text: '试验次数 (k)',
                    color: textColor
                },
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                title: {
                    display: true,
                    text: '概率 (P(X = k))',
                    color: textColor
                },
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

// 监听 probability 的变化以动态更新图像
watch([probability], () => {
    chartData.value = setChartData();
    renderFormula();
});

const content = `
**几何分布（Geometric Distribution）** 是统计学中的一种离散概率分布，用于描述在一系列独立的伯努利试验中，第一次成功发生之前的失败次数。几何分布可以用来表示成功之前进行的失败次数，或直到第一次成功所需的试验次数。

#### 几何分布的定义

对于几何分布，有两种常见的定义：

- **第一次成功前的失败次数（$$ X $$）**：
  其概率质量函数（PMF）定义为：
  $$
  P(X = k) = (1-p)^k p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是失败的次数（$$ k $$ 为非负整数）。

- **直到第一次成功所需的试验次数（$$ Y $$）**：
  其概率质量函数（PMF）定义为：
  $$
  P(Y = k) = (1-p)^{k-1} p
  $$
  其中：
  - $$ p $$ 是每次试验成功的概率；
  - $$ k $$ 是试验次数（$$ k $$ 为正整数）。

#### 期望值和方差

- 对于失败次数（$$ X $$）：
  - 期望值：$$ E(X) = \\frac{1-p}{p} $$
  - 方差：$$ \\text{Var}(X) = \\frac{1-p}{p^2} $$

- 对于试验次数（$$ Y $$）：
  - 期望值：$$ E(Y) = \\frac{1}{p} $$
  - 方差：$$ \\text{Var}(Y) = \\frac{1-p}{p^2} $$


#### 特点
1. **无记忆性**：几何分布具有无记忆性，即过去的试验结果不会影响未来的成功概率。数学上表示为：
   $$
   P(X > m + n \\mid X > n) = P(X > m)
   $$
   其中 $$ X $$ 是第一次成功前的失败次数。
   
2. **离散分布**：几何分布是一种定义在非负整数上的离散概率分布。
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
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn m-1">点我切换</div>
                        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            <li><router-link to="/dashboard/experiment/geometric1">直到第一次成功的次数</router-link></li>
                            <li><router-link to="/dashboard/experiment/geometric2">第一次成功前的失败次数</router-link></li>
                            <li><router-link to="/dashboard/experiment/geometric3">几何分布的无记忆性</router-link></li>
                        </ul>
                    </div>
                    <div ref="katexContainer" class="text-xl"></div>
                </div>
                <div class="flex w-full mb-5">
                    <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                        <p> Probability of success </p>
                        <InputNumber v-model.number="probability" :min-fraction-digits="1"/>
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
