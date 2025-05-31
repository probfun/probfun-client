<template>
  <ExperimentBoard :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <h1>Geometric Brownian Motion Simulation</h1>

      <div class="slider-container">
        <label for="numPaths" class="slider-label">Number of Paths:</label>
        <input type="range" id="numPaths" v-model.number="numPaths" min="1" max="20" step="1">
        <span>{{ numPaths }}</span>
      </div>

      <div class="slider-container">
        <label for="timeSteps" class="slider-label">Time Steps:</label>
        <input type="range" id="timeSteps" v-model.number="timeSteps" min="10" max="500" step="10">
        <span>{{ timeSteps }}</span>
      </div>

      <div class="slider-container">
        <label for="totalTime" class="slider-label">Total Time (T):</label>
        <input type="range" id="totalTime" v-model.number="totalTime" min="1" max="10" step="0.1">
        <span>{{ totalTime }}</span>
      </div>

      <div class="slider-container">
        <label for="initialPrice" class="slider-label">Initial Price (S₀):</label>
        <input type="range" id="initialPrice" v-model.number="initialPrice" min="1" max="200" step="1">
        <span>{{ initialPrice }}</span>
      </div>

      <div class="slider-container">
        <label for="drift" class="slider-label">Drift (μ):</label>
        <input type="range" id="drift" v-model.number="drift" min="-0.5" max="0.5" step="0.01">
        <span>{{ drift }}</span>
      </div>

      <div class="slider-container">
        <label for="volatility" class="slider-label">Volatility (σ):</label>
        <input type="range" id="volatility" v-model.number="volatility" min="0.1" max="2" step="0.1">
        <span>{{ volatility }}</span>
      </div>

      <div id="plot" style="width: 100%; height: 600px;"></div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="" />
    </template>
  </ExperimentBoard>
</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist';
import { renderLatex, toMarkdown } from '@/utils/markdown';

const numPaths = ref(5);
const timeSteps = ref(100);
const totalTime = ref(1);
const initialPrice = ref(100);
const drift = ref(0.05);
const volatility = ref(0.2);

const content = ref(`
## **几何布朗运动模拟**
几何布朗运动（Geometric Brownian Motion, GBM）模拟是布朗运动的一种特殊形式，它**常被用来模拟那些其变化量与其当前值成比例增长的随机过程**。最典型的应用就是**金融领域中的股票价格模拟**。

**核心思想：**

不同于普通布朗运动中粒子的绝对位移是随机的，几何布朗运动中，粒子的**相对位移（即百分比变化）是随机的**。这意味着如果粒子当前值很高，它随机“跳动”的绝对幅度也会更大；如果当前值很低，跳动幅度则相对较小。

**数学表达式（简化理解）：**

一个遵循几何布朗运动的变量 $S_t$（比如股票价格）在下一个时间点 $S_{t+dt}$ 的变化，可以近似表示为：

$ S_{t+dt} = S_t \\times e^{(\\mu - \\frac{1}{2}\\sigma^2)dt + \\sigma \\sqrt{dt} Z} $

其中：
* $S_t$: 当前时间点 $t$ 的值。
* $dt$: 一个非常小的时间步长。
* $\mu$ (漂移率/预期收益率): 变量的平均增长率（确定性部分）。
* $\sigma$ (波动率): 变量随机波动的幅度（随机性部分）。
* $Z$: 一个标准正态分布随机数（平均值为0，标准差为1）。

**模拟方法（简化）：**

1.  **确定参数：** 设定初始值 $S_0$、漂移率 $\mu$、波动率 $\sigma$ 和时间步长 $dt$。
2.  **生成随机数：** 在每个时间步长 $dt$ 中，生成一个服从标准正态分布的随机数 $Z$。
3.  **计算新值：** 使用上述公式，根据当前值 $S_t$ 和 $Z$ 来计算 $S_{t+dt}$。
4.  **迭代：** 重复步骤2和3，直到模拟所需的时间长度。

**关键特点及与普通布朗运动的区别：**

* **乘法性质：** 变化是基于当前值的百分比，而不是绝对量。这使得模拟出的值永远不会变成负数，符合股票价格等不能为负的现实情况。
* **对数正态分布：** 如果 $S_t$ 服从几何布朗运动，那么 $\ln(S_t)$ 服从普通布朗运动（即正态分布）。
* **金融应用：** 这是其最主要的用途，因为金融资产的收益率（百分比变化）通常被认为是随机的，且股价不能跌破零。

**简单来说，几何布朗运动模拟就像是“股价每次都随机涨跌一个百分比，而不是随机涨跌一个固定金额”的过程。**
`)

function generateGBM(numPaths, timeSteps, totalTime, initialPrice, drift, volatility) {
  const paths = [];
  const dt = totalTime / timeSteps;
  for (let i = 0; i < numPaths; i++) {
    const path = [initialPrice];
    for (let j = 1; j < timeSteps; j++) {
      const priceChange = Math.exp((drift - 0.5 * volatility * volatility) * dt + volatility * Math.sqrt(dt) * randn());
      path.push(path[j - 1] * priceChange);
    }
    paths.push(path);
  }
  return paths;
}

function randn() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function updatePlot() {
  const paths = generateGBM(numPaths.value, timeSteps.value, totalTime.value, initialPrice.value, drift.value, volatility.value);
  const time = Array.from({ length: timeSteps.value }, (_, i) => i * (totalTime.value / timeSteps.value));
  const data = paths.map((path, i) => ({
    x: time,
    y: path,
    type: 'scatter',
    mode: 'lines',
    name: `Path ${i + 1}`
  }));

  const layout = {
    title: 'Geometric Brownian Motion Sample Paths',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Price' },
    showlegend: true,
    margin: { l: 50, r: 50, b: 50, t: 50 }
  };

  Plotly.newPlot('plot', data, layout);
}

watch([numPaths, timeSteps, totalTime, initialPrice, drift, volatility], () => {
  updatePlot();
});

onMounted(() => {
  updatePlot();
});
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.slider-container {
  margin-bottom: 20px;
}

.slider-label {
  display: inline-block;
  width: 150px;
}
</style>