<template>
  <ExperimentBoard :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <h1>Brownian Motion Simulation</h1>

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
        <label for="totalTime" class="slider-label">Total Time:</label>
        <input type="range" id="totalTime" v-model.number="totalTime" min="1" max="10" step="0.1">
        <span>{{ totalTime }}</span>
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
const volatility = ref(1);

const content = ref(`
## **布朗运动模拟**
布朗运动模拟就是用计算机程序来模仿微小粒子在流体中做无规则运动的过程。这种运动是由于流体分子对粒子的随机碰撞造成的。

**核心思想：**

1.  **随机性：** 每次碰撞的方向和力度都是随机的。
2.  **累积效应：** 粒子在每个极短的时间间隔内都会受到一个随机的“推力”，这些小的、随机的位移累积起来就形成了粒子的整体运动轨迹。

**模拟方法（简化）：**

通常采用“随机游走”模型：

* **时间步长：** 将总时间分成许多非常小的、离散的“时间步长”。
* **随机位移：** 在每个时间步长内，让粒子在一个或多个维度上（比如二维平面上的x和y方向）进行一个随机的、微小的位移。
    * 这个位移的大小和方向是随机生成的，通常服从某种分布（比如正态分布）。
* **更新位置：** 将这个随机位移加到粒子当前的位置上，得到粒子在下一个时间步长的新位置。
* **重复：** 重复这个过程，直到模拟时间结束。

**模拟的用途：**

* **理解物理现象：** 帮助直观理解布朗运动的随机性和扩散过程。
* **金融建模：** 用于模拟股票价格、汇率等金融资产的随机波动（例如几何布朗运动）。
* **科学研究：** 在物理、化学、生物学等领域，模拟分子扩散、粒子在细胞中的运动等。

**简单来说，布朗运动模拟就是“粒子走一步，方向随机，再走一步，方向又随机……”然后记录下它走过的整个轨迹。**
`)

function generateBrownianMotion(numPaths, timeSteps, totalTime, volatility) {
  const paths = [];
  const dt = totalTime / timeSteps;
  for (let i = 0; i < numPaths; i++) {
    const path = [0];
    for (let j = 1; j < timeSteps; j++) {
      path.push(path[j - 1] + volatility * Math.sqrt(dt) * randn());
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
  const paths = generateBrownianMotion(numPaths.value, timeSteps.value, totalTime.value, volatility.value);
  const time = Array.from({ length: timeSteps.value }, (_, i) => i * (totalTime.value / timeSteps.value));
  const data = paths.map((path, i) => ({
    x: time,
    y: path,
    type: 'scatter',
    mode: 'lines',
    name: `Path ${i + 1}`
  }));

  const layout = {
    title: 'Brownian Motion Sample Paths',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Position' },
    showlegend: true,
    margin: { l: 50, r: 50, b: 50, t: 50 }
  };

  Plotly.newPlot('plot', data, layout);
}

watch([numPaths, timeSteps, totalTime, volatility], () => {
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