<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';

const lambda = ref(3);  // Poisson distribution mean (λ)

const latexFormula = computed(() => `P(X = k) = \\frac{${lambda.value}^k e^{-\\lambda}}{k!}`);
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

    // 计算泊松分布的数据
    const labels = [];
    const data = [];
    const maxK = Math.ceil(4 * lambda.value);  // 根据 λ 设置 k 的最大值
    for (let k = 0; k <= maxK; k++) {
        const probabilityOfK = (Math.pow(lambda.value, k) * Math.exp(-lambda.value)) / factorial(k);
        labels.push(k);
        data.push(probabilityOfK);
    }

    return {
        labels: labels,
        datasets: [
            {
                label: 'Poisson Distribution',
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
                },
                // 设置 x 轴的最大值
                min: 0,
                max: Math.ceil(2 * lambda.value),
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

// 计算阶乘
const factorial = (n: number) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

// 监听 lambda 的变化以动态更新图像
watch(lambda, () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
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
                            <p> Mean (λ) </p>
                            <InputNumber v-model.number="lambda" />
                            <Slider :min="0.1" :max="20" :step="0.1" v-model="lambda" class="w-48" />
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
