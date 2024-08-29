<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';

const probability = ref(0.5);  // 成功的概率 (p)
const fixedN = ref(3);  // 固定的试验次数 n

const latexMemoryless = computed(() => `P(X > ${fixedN.value} + k \\mid X > ${fixedN.value}) = P(X > k) = (1 - ${probability.value})^k`);
const katexMemorylessContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
    if (katexMemorylessContainer.value) {
        katex.render(latexMemoryless.value, katexMemorylessContainer.value, {
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
    const n = fixedN.value;

    const kValues = Array.from({ length: 20 }, (_, i) => i + 1);  // 生成1到20的k值
    const data1 = kValues.map(k => Math.pow(1 - p, k)); // 计算 P(X > k) 的概率
    const data2 = kValues.map(k => Math.pow(1 - p, k + n)); // 计算 P(X > k + n) 的概率

    return {
        labels: kValues,
        datasets: [
            {
                label: '几何分布 P(X > k)',
                data: data1,
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                tension: 0.4
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
                borderJoinStyle: 'miter'
            },
            {
                label: '',
                data: kValues.map((k, index) => (k >= 1 && k <= 1 + n) ? Math.pow(1 - p, 1 + n) : null), // 限制x范围的y值
                fill: false,
                borderColor: documentStyle.getPropertyValue('--p-red-500'), // 设置辅助线的颜色
                borderWidth: 1, // 辅助线的宽度
                pointRadius: 0, // 不显示点
                borderDash: [10, 5], // 虚线样式
                tension: 0 // 线的张力设置为 0，确保为直线
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
                    text: '概率',
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

// 监听 probability 和 fixedN 的变化以动态更新图像和公式
watch([probability, fixedN], () => {
    chartData.value = setChartData();
    renderFormula();
});
</script>

<template>
    <div class="h-full w-full flex flex-col">
        <div class="card mb-2">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
        </div>
        <div class="w-full flex items-center justify-center mb-5">
            <div ref="katexMemorylessContainer" class="text-xl"></div>
        </div>
        <div class="flex w-full mb-5">
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <p>Probability of success</p>
                <InputNumber v-model.number="probability" :minFractionDigits="1" />
                <Slider :min="0" :max="1" :step="0.1" v-model="probability" class="w-48" />
            </div>
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <p>Fixed trial number n</p>
                <InputNumber v-model.number="fixedN" :min="1" :max="20" />
                <Slider :min="1" :max="20" :step="1" v-model="fixedN" class="w-48" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
