<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import MarkdownIt from 'markdown-it';
import { computed, onMounted, ref, watch } from 'vue';
import 'katex/dist/katex.min.css'; // 引入 KaTeX CSS

// 定义公式

const specificity = ref([0.97]); // 特异度
const sensitivity = ref([0.95]); // 灵敏度
const infectionRate = ref([0.001]); // 感染率
const population = ref([100000]); // 总人数
const historyFalse = ref<number[]>([]);
const historyTrue = ref<number[]>([]);
const chartDataFalse = ref();
const chartDataTrue = ref();

const truePositiveRate = computed(() => {
  const infectedPopulation = population.value[0] * infectionRate.value[0]; // 真实感染人数
  const healthyPopulation = population.value[0] - infectedPopulation; // 未感染人数

  const truePositives = sensitivity.value[0] * infectedPopulation; // 真阳性数量
  const falsePositives = (1 - specificity.value[0]) * healthyPopulation; // 假阳性数量

  const totalPositiveTests = truePositives + falsePositives; // 总阳性人数

  return totalPositiveTests ? truePositives / totalPositiveTests : 0; // 真实阳性概率
});

const md = new MarkdownIt()

// 示例 Markdown 内容
const markdownContent = ref(`
特异度 = \\frac{真实阳性}{(真实阴性 + 假阳性)}
`);

const markdownContent0 = ref(`
灵敏度 = \\frac{真实阴性}{(真实阳性 + 假阴性)}
`);

const markdownContent1 = ref(`
感染率 = \\frac{感染人数}{总人数}

`);

const markdownContent2 = ref(`
总人数
`);

const katexFormula = computed(() => `
  \\begin{aligned}
      &检测结果为阳性时的患病概率p \\\\ 
      &= \\frac{感染者中显示为阳性的人数}{实际上总的感染人数} \\\\
      &= \\frac{感染者中显示为阳性的人数}{感染者中显示为阳性的人数 +检测为阴性的人中的感染人数} \\\\
      &= \\frac{灵敏度 * 真阳性人数}{灵敏度 * 真阳性人数 +  (1 - 特异度) *未感染新冠的人数} \\\\
      &= \\frac{\\frac{真实阳性}{真实阳性＋假阴性} * 真阳性人数}{\\frac{真阳性}{真阳性＋假阴性} * 真阳性人数 +  (1 - \\frac{真阴性}{真阴性+假阳性}) *未感染人数} \\\\
      &= \\frac{${sensitivity.value[0]} * ${infectionRate.value[0]}}{${sensitivity.value[0]} * ${infectionRate.value[0]} + (1 - ${infectionRate.value[0]}) * (1 - ${specificity.value[0]})} \\\\
      &= ${truePositiveRate.value.toFixed(3)}
  \\end{aligned}
`);

// 渲染 Markdown 内容
const renderedMarkdown = computed(() => {
  return md.render(markdownContent.value, markdownContent0.value);
  // return md.render(markdownContent1.value, markdownContent2.value);
});

const katexContainer = ref<HTMLElement | null>(null);

const mdContainer = ref<HTMLElement | null>(null);
const mdContainer0 = ref<HTMLElement | null>(null);
const mdContainer1 = ref<HTMLElement | null>(null);
const mdContainer2 = ref<HTMLElement | null>(null);

function renderFormula() {
  if (katexContainer.value) {
    katex.render(katexFormula.value, katexContainer.value, {
      throwOnError: false,
    });
    if (mdContainer.value) {
      katex.render(markdownContent.value, mdContainer.value, {
        throwOnError: false,
      });
    }
    if (mdContainer0.value) {
      katex.render(markdownContent0.value, mdContainer0.value, {
        throwOnError: false,
      });
    }
    if (mdContainer1.value) {
      katex.render(markdownContent1.value, mdContainer1.value, {
        throwOnError: false,
      });
    }
    if (mdContainer2.value) {
      katex.render(markdownContent2.value, mdContainer2.value, {
        throwOnError: false,
      });
    }
  }
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

// 输入变量

// 计算结果

const result = computed(() => {
  const infectedPopulation = population.value[0] * infectionRate.value[0]; // 真实感染人数
  const healthyPopulation = population.value[0] - infectedPopulation; // 未感染人数

  const truePositives = sensitivity.value[0] * infectedPopulation; // 真阳性数量
  const falsePositives = (1 - specificity.value[0]) * healthyPopulation; // 假阳性数量

  // 总阳性人数
  return Math.round(truePositives + falsePositives);
});

// 饼图数据
function setChartDataFalse() {
  const kValues = Array.from({ length: historyFalse.value.length }, (_, i) => i + 1);
  historyFalse.value = historyFalse.value.concat(1 - truePositiveRate.value);
  console.log(historyFalse);

  return ({
    labels: kValues,
    datasets: [
      {
        label: '假阳性概率（未患病）',
        data: historyFalse.value,
        fill: false,
        backgroundColor: ['#00C4CC'],
        hoverBackgroundColor: ['#00C4CC'],
        tension: 0.4,
      },
    ],
  });
}
const infectedDots = computed(() => 1000 * infectionRate.value[0] * sensitivity.value[0] + (1000 - 1000 * infectionRate.value[0]) * (1 - specificity.value[0]));

function setChartDateTrue() {
  const kValues = Array.from({ length: historyTrue.value.length }, (_, i) => i + 1);
  historyTrue.value = historyTrue.value.concat(truePositiveRate.value);
  return {
    labels: kValues,
    datasets: [
      {
        label: '真阳性概率（患病）',
        data: historyTrue.value,
        backgroundColor: ['#FF7F0E'],
        hoverBackgroundColor: ['#FF570E'],
      },
    ],
  }
}

// 饼图选项
const chartOptions = computed(() => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  return {
    animation: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
});

// 初始化图形
function drawCanvas() {
  const canvas = canvasRef.value;
  if (!canvas)
    return;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;

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
}

// 计算感染和健康人数

watch([specificity, sensitivity, infectionRate, population], () => {
  chartDataFalse.value = setChartDataFalse();
  chartDataTrue.value = setChartDateTrue();
  drawCanvas();
  renderFormula(); // 在这里调用渲染公式
});

onMounted(() => {
  chartDataFalse.value = setChartDataFalse();
  chartDataTrue.value = setChartDateTrue();
  drawCanvas();
  renderFormula();
});

// Markdown 内容
const content = `
### **概述**
阳性检测问题是统计学和医学中的一个经典问题，涉及到如何正确解读检测结果，特别是在涉及罕见疾病或事件时。例如，当进行医学检测时，可能得到阳性或阴性的结果。然而，检测结果不一定准确，可能出现假阳性或假阴性的情况。阳性检测问题的核心在于，当检测到阳性结果时，实际患有该疾病的概率。

### **实验思路**

在进行模拟实验之前，我们先了解如下概念：

#### **1. 灵敏度**

灵敏度，又称为真阳性率，是指在所有实际患病的个体中，测试能够正确识别出患病者的比例。它衡量了测试发现疾病的能力。

$$
\\text{灵敏度} = \\frac{\\text{真实阳性}}{\\text{真实阳性} + \\text{假阴性}}
$$

#### **2. 特异度**

特异度，又称为真阴性率，是指在所有实际健康的个体中，测试能够正确识别出健康者的比例。它衡量了测试排除非患病者的能力。

$$
\\text{特异度} = \\frac{\\text{真实阴性}}{\\text{真实阴性} + \\text{假阳性}}
$$

### **实例：新冠病毒检测**

以新冠病毒检测为例，以下参数通过输入的方式获得：

- 假设新冠检测的特异度为 $$a$$
- 假设新冠检测的灵敏度为 $$b$$
- 假设该地区内新冠的总感染率为 $$c$$

计算步骤：

 **1.设定总人数**：假设该地区一共有 $$d$$ 人，则有 $$m = d * c$$ 人真实感染新冠，$$n = d - m$$ 人没有感染新冠。

**2. 假阳性**：由于实验特异度为 $$a$$，则在 $$n$$ 人中，有 $$n * (1 - a)$$ 人显示结果为阳性。

**3. 真阳性**：由于实验灵敏度为 $$b$$，则在 $$m$$ 个真实感染新冠的人中，有 $$b * m$$ 个人显示结果为阳性。

 **4.总阳性人数**：该地区总共有 $$b * m + n * (1 - a)$$ 人核酸检测结果为阳性。

 **5.条件概率计算**：当检测结果为阳性时，患病的真实概率是**条件概率**，可以通过**贝叶斯公式**计算：

$$
P(\\text{患病} \\mid \\text{阳性结果}) = \\frac{P(\\text{阳性结果} \\mid \\text{患病}) \\times P(\\text{患病})}{P(\\text{阳性结果})}
$$

代入实际的数值，得出公式为：

$$
P(\\text{患病} \\mid \\text{阳性结果}) = \\frac{b \\times m}{b \\times m + n \\times (1 - a)}
$$

因此，当检测结果为阳性时，真实患病的概率 $$ p $$ 为：

$$
p = \\frac{b \\times m}{b \\times m + n \\times (1 - a)}
$$

`;
</script>

<template>
  <ExperimentBoard title="阳性检测" :tags="['条件概率', '互斥事件', '独立事件']">
    <template #experiment>
      <div class="w-full flex flex-col h-full items-center p-3">
        <canvas ref="canvasRef" width="1000" height="400" class="w-full" />
        <div class="flex items-center text-gray-500">
          <span class="inline-block w-4 h-4 rounded-full bg-[#FF7F0E] mr-2" />
          橙色圆点代表检测结果为阳性的人，共{{ result }}人
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="flex justify-center items-center min-h-0 ">
        <div class="flex  flex-row flex-1 ">
          <Card class="flex w-1/2 flex-col">
        
          <Card class = "flex flex-col space-y-5">
            <!-- 输入框区域 -->    
             <CardHeader class="p-4">
              <CardTitle>
                参数调整
              </CardTitle>
            </CardHeader>
            <div class="flex flex-col flex-1 space-y-4">
              <!-- 第一个输入框组 -->
              <div class="flex space-x-4 justify-center items-center">
                <div class="flex flex-col  space-x-5 flex-1 items-center space-y-3">
                  <div ref="mdContainer" class="markdown-body" v-html="renderedMarkdown" />
                  <Input v-model="specificity[0]" type="number" :min="2" />
                  <Slider v-model="specificity" :min="0.1" :max="1.0" :step="0.01" class="w-full" />
                </div>
                <div class="flex flex-col flex-1 items-center space-y-3">
                  <div ref="mdContainer0" class="markdown-body" v-html="renderedMarkdown" />
                  <Input v-model="sensitivity[0]" type="number" :min="2" />
                  <Slider v-model="sensitivity" :min="0.1" :max="1.0" :step="0.01" class="w-full" />
                </div>
              </div>

              <!-- 第二个输入框组 -->
              <div class="flex space-x-4 justify-center items-center">
                <div class="flex flex-col flex-1 items-center space-y-3">
                  <div ref="mdContainer1" class="markdown-body" v-html="renderedMarkdown" />
                  <Input v-model="infectionRate[0]" type="number" :min="2" />
                  <Slider v-model="infectionRate" :min="0.0" :max="1.0" :step="0.001" class="w-full" />
                </div>
                <div class="flex flex-col flex-1 items-center space-y-3">
                  <div ref="mdContainer2" class="markdown-body" v-html="renderedMarkdown" />
                  <Input v-model="population[0]" type="number" />
                  <Slider v-model="population" :min="1000" :max="1000000" :step="1000" class="w-full" />
                </div>
              </div>
            </div>
          </Card>
          <Card class = "flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                计算公式
              </CardTitle>
            </CardHeader>
            <!-- KaTeX 输入的公式区域 -->
            <div class="flex flex-col flex-1 items-center justify-center p-4 ">
              <div ref="katexContainer" class="text-l" style="line-height: 2;"/>
              
            </div>
          </Card>
        </Card>


          <!-- 图表区域 -->
          <Card class="flex  w-1/2 flex-col justify-center items-center ">
            <div class="w-full max-w-4xl">
              <Chart type="line" :data="chartDataFalse" :options="chartOptions" />
            </div>
            <div class="w-full max-w-4xl">
              <Chart type="line" :data="chartDataTrue" :options="chartOptions" />
            </div>
          </Card>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="positive-test"/>
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* Your custom styles if needed */
.katex-style {
  line-height: 3.5;
  /* 设置较大的行间距 */
}

/* 使用 Tailwind CSS 自定义样式 */
.markdown-body {
  @apply p-4 rounded shadow;
  /* Tailwind CSS 样式 */
}
</style>
