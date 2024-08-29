<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { toMarkdown } from '@/utils/markdown';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

// 输入变量
const specificity = ref(0.97); // 特异度
const sensitivity = ref(0.99); // 灵敏度
const infectionRate = ref(0.001); // 感染率
const population = ref(100000); // 总人数

// 计算结果
const truePositiveRate = computed(() => {
  const infectedPopulation = population.value * infectionRate.value; // 真实感染人数
  const healthyPopulation = population.value - infectedPopulation; // 未感染人数

  const truePositives = sensitivity.value * infectedPopulation; // 真阳性数量
  const falsePositives = (1 - specificity.value) * healthyPopulation; // 假阳性数量

  const totalPositiveTests = truePositives + falsePositives; // 总阳性人数

  return totalPositiveTests ? truePositives / totalPositiveTests : 0; // 真实阳性概率
});

const result = computed(() => {
  const infectedPopulation = population.value * infectionRate.value; // 真实感染人数
  const healthyPopulation = population.value - infectedPopulation; // 未感染人数

  const truePositives = sensitivity.value * infectedPopulation; // 真阳性数量
  const falsePositives = (1 - specificity.value) * healthyPopulation; // 假阳性数量

  const totalPositiveTests = Math.round(truePositives + falsePositives); // 总阳性人数
  return totalPositiveTests;
});

// 饼图数据
const chartData = computed(() => ({
  labels: ['未患病假阳性', '患病真阳性'],
  datasets: [
    {
      data: [
        1 - truePositiveRate.value,
        truePositiveRate.value
      ],
      backgroundColor: ['#00C4CC', '#FF7F0E'],
      hoverBackgroundColor: ['#0097A7', '#FF570E']
    }
  ]
}));

// 饼图选项
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  return {
    animation: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  };
});

// 初始化图形
const drawCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const totalDots = 1000; // 显示1000个点
  const radius = 5; // 每个点的半径
  const padding = 10; // 点之间的间隔

  for (let i = 0; i < totalDots; i++) {
    const x = (i % 50) * (radius * 2 + padding) + radius;
    const y = Math.floor(i / 50) * (radius * 2 + padding) + radius;

    // 计算点的颜色：可以根据不同状态设置颜色
    ctx.fillStyle = i < infectedDots.value ? '#FF7F0E' : '#00C4CC';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 计算感染和健康人数
const infectedDots = computed(() => 1000 * infectionRate.value * sensitivity.value + (1000 - 1000 * infectionRate.value) * (1 - specificity.value));

// 监听输入变化并更新画布
watch([specificity, sensitivity, infectionRate, population], drawCanvas);

onMounted(() => {
  drawCanvas();
});

// Markdown 内容
const content = `
阳性检测问题是统计学和医学中的一个经典问题，涉及到如何正确解读检测结果，特别是在涉及罕见疾病或事件时。例如，当进行医学检测时，可能得到阳性或阴性的结果。然而，检测结果不一定准确，可能出现假阳性或假阴性的情况。阳性检测问题的核心在于，当检测到阳性结果时，实际患有该疾病的概率。

### **模拟实验求解**

在进行模拟实验之前，我们先了解如下概念：

#### 1. 灵敏度

**灵敏度**，又称为真阳性率，是指在所有实际患病的个体中，测试能够正确识别出患病者的比例。它衡量了测试发现疾病的能力。

$$
\\text{灵敏度} = \\frac{\\text{真实阳性}}{\\text{真实阳性} + \\text{假阴性}}
$$

#### 2. 特异度

**特异度**，又称为真阴性率，是指在所有实际健康的个体中，测试能够正确识别出健康者的比例。它衡量了测试排除非患病者的能力。

$$
\\text{特异度} = \\frac{\\text{真实阴性}}{\\text{真实阴性} + \\text{假阳性}}
$$

### **实例：新冠病毒检测**

以新冠病毒检测为例，以下参数通过输入的方式获得：

- 假设新冠检测的特异度为 $$a$$
- 假设新冠检测的灵敏度为 $$b$$
- 假设该地区内新冠的总感染率为 $$c$$

#### 计算步骤

1. **设定总人数**：假设该地区一共有 $$d$$ 人，则有 $$m = d * c$$ 人真实感染新冠，$$n = d - m$$ 人没有感染新冠。

2. **假阳性**：由于实验特异度为 $$a$$，则在 $$n$$ 人中，有 $$n * (1 - a)$$ 人显示结果为阳性。

3. **真阳性**：由于实验灵敏度为 $$b$$，则在 $$m$$ 个真实感染新冠的人中，有 $$b * m$$ 个人显示结果为阳性。

4. **总阳性人数**：该地区总共有 $$b * m + n * (1 - a)$$ 人核酸检测结果为阳性。

5. **真实患病概率**：当核酸检测结果为阳性时，真实患新冠的概率为 $$p$$，其计算公式为：

$$
p = \\frac{b * m}{b * m + n * (1 - a)}
$$

因此，当核酸检测结果为阳性时，真实患新冠的概率为 $$p$$。

`;
</script>

<template>
  <experiment-board title="阳性检测" :tags="['条件概率', '互斥事件', '独立事件']">
    <template #experiment>
      <div class="w-full flex flex-col h-full items-center p-3">
        <canvas ref="canvasRef" width="1000" height="400" class="w-full"></canvas>
        <div class="flex items-center text-gray-500">
          <span class="inline-block w-4 h-4 rounded-full bg-[#FF7F0E] mr-2"></span>
          橙色圆点代表检测结果为阳性的人，共{{ result }}人
        </div>
      </div>
    </template>
    <template #parameter>
      <div class="flex justify-center items-center h-full w-full p-3">
        <div class="flex flex-col flex-1 space-y-4 justify-center items-center">
          <div class="flex space-x-4 justify-center items-center">
            <div class="flex flex-col flex-1 items-center justify-center space-y-3">
              <p>特异度</p>
              <InputNumber v-model.number="specificity" fluid :minFractionDigits="2" />
              <Slider :min="0.1" :max="1.0" :step="0.01" v-model="specificity" class="w-full" />
            </div>
            <div class="flex flex-col flex-1 items-center justify-center space-y-3">
              <p>灵敏度</p>
              <InputNumber v-model.number="sensitivity" fluid :minFractionDigits="2" />
              <Slider :min="0.1" :max="1.0" :step="0.01" v-model="sensitivity" class="w-full" />
            </div>
          </div>
          <!-- 第二个输入框组 -->
          <div class="flex space-x-4 justify-center items-center">
            <div class="flex flex-col flex-1 items-center justify-center space-y-3">
              <p>感染率</p>
              <InputNumber v-model.number="infectionRate" :minFractionDigits="2" fluid />
              <Slider :min="0.0" :max="1.0" :step="0.001" v-model="infectionRate" class="w-full" />
            </div>
            <div class="flex flex-col flex-1 items-center justify-center space-y-3">
              <p>总人数</p>
              <InputNumber v-model.number="population" fluid />
              <Slider :min="1000" :max="1000000" :step="1000" v-model="population" class="w-full" />
            </div>
          </div>
        </div>
        <!-- 饼图区域 -->
        <div class="flex-1 flex flex-col justify-center items-center">
          <Chart type="pie" :data="chartData" :options="chartOptions" class="" />
          <div class="text-gray-500">
            检测结果为阳性时实际患病的概率 {{ truePositiveRate.toFixed(3) }}
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

<style scoped>
/* Your custom styles if needed */
</style>
