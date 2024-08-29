<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';

const probability = ref(0.5);  // Probability of success (p)

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
    const data = kValues.map(k => Math.pow(1 - p, k - 1) * p); // 计算几何分布的概率

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
</script>

<template>
    <div class="h-full w-full flex flex-col">
        <div class="card mb-2">
            <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
        </div>
        <div class="w-full flex items-center justify-center mb-5">
            <div ref="katexContainer" class="text-xl"></div>
        </div>
        <div class="flex w-full mb-5">
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                <p> Probability of success </p>
                <InputNumber v-model.number="probability" :minFractionDigits="1" />
                <Slider :min="0" :max="1" :step="0.1" v-model="probability" class="w-48" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
