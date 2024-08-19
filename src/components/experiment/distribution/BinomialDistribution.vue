<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';

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

</script>

<template>
    <Splitter class="mb-8 h-full !border-0">
        <SplitterPanel class="pr-1.5">
            <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
                <div class="mb-2 font-bold"> 实验区 </div>
                <div class="h-full w-full flex flex-col">
                    <div class="card">
                        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]" />
                    </div>
                    <div class="w-full flex items-center justify-center mb-5">
                        <div ref="katexContainer" class="text-xl"></div>
                    </div>
                    <div class="flex w-full mb-5">
                        <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                            <p> Number of experiments </p>
                            <InputNumber v-model.number="number" />
                            <Slider :min="1" :max="10" :step="1" v-model="number" class="w-48" />
                        </div>
                        <div class="flex flex-col flex-1 items-center justify-center space-y-5">
                            <p> Probability of success </p>
                            <InputNumber v-model.number="probability" />
                            <Slider :min="0" :max="1" :step="0.1" v-model="probability" class="w-48" />
                        </div>
                    </div>
                </div>
            </div>
        </SplitterPanel>
        <SplitterPanel class="pr-3 pl-1.5" :size="25">
            <Panel header="提示区" class="h-full">
                <p class="m-0">
                </p>
            </Panel>
        </SplitterPanel>
    </Splitter>
</template>

<style scoped></style>
