<template>
  <ExperimentBoard :panel-size="100" :discuss-tab-list="discussTabList">
    <template #experiment>
      <h1>Poisson Process Simulation</h1>

      <div class="slider-container">
        <label for="numPaths" class="slider-label">Number of Paths:</label>
        <input type="range" id="numPaths" v-model.number="numPaths" min="1" max="20" step="1">
        <span>{{ numPaths }}</span>
      </div>

      <div class="slider-container">
        <label for="totalTime" class="slider-label">Total Time (T):</label>
        <input type="range" id="totalTime" v-model.number="totalTime" min="1" max="10" step="0.1">
        <span>{{ totalTime }}</span>
      </div>

      <div class="slider-container">
        <label for="lambda" class="slider-label">Event Rate (λ):</label>
        <input type="range" id="lambda" v-model.number="lambda" min="0.1" max="5" step="0.1">
        <span>{{ lambda }}</span>
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
const totalTime = ref(5);
const lambda = ref(1);

const content = ref(`
## **泊松过程模拟**
泊松过程模拟（Poisson Process Simulation）是用来**模仿在固定时间或空间间隔内，随机、独立且平均发生频率恒定的事件序列**的方法。

**核心思想：**

1.  **事件的随机性：** 事件在任何给定时间点发生的可能性都是随机的。
2.  **事件的独立性：** 一个事件的发生不影响另一个事件的发生。
3.  **发生率恒定：** 在任何相同的单位时间内，事件发生的平均次数是固定的（这个平均发生率被称为 **$\lambda$ (lambda)**）。
4.  **无记忆性：** 事件发生的概率与上一次事件发生的时间无关。

**应用场景：**

泊松过程广泛应用于模拟稀有事件的发生，例如：
* **客服中心**接到的电话数量。
* **网站**每分钟收到的请求数。
* **放射性衰变**中粒子发射的数量。
* **超市**顾客到达的数量。
* 单位时间内的**交通事故**数量。

**两种常见的模拟方法：**

1.  **基于到达时间的模拟（更常用）：**
    * **核心原理：** 泊松过程中两次相邻事件发生的时间间隔服从**指数分布**。
    * **步骤：**
        1.  设定平均发生率 $\lambda$。
        2.  从一个服从指数分布的随机数生成器中，生成第一个事件发生的时间间隔 $\Delta t_1$。
        3.  下一个事件发生的时间就是上一个事件发生的时间加上 $\Delta t_1$。
        4.  重复步骤2和3，不断生成新的时间间隔，累加得到每个事件的发生时间。
    * 这种方法能直接给出事件发生的具体时间点。

2.  **基于事件计数的模拟：**
    * **核心原理：** 在一个固定时间段 $T$ 内，事件发生的次数服从**泊松分布**，其参数为 $\lambda T$。
    * **步骤：**
        1.  设定平均发生率 $\lambda$ 和总模拟时间 $T$。
        2.  将 $T$ 划分成许多小的、离散的时间步长 $dt$。
        3.  在每个 $dt$ 内，通过生成一个服从泊松分布的随机数来决定在这个小时间步长内发生了多少个事件（通常这个随机数是0或1，因为 $dt$ 很小）。
        4.  累加每个 $dt$ 内的事件数，得到总事件数。
    * 这种方法侧重于计算在特定时间段内事件的总次数，而不是具体时间点。

**简单来说，泊松过程模拟就是模拟“滴答滴答”的事件发生，每次“滴答”的间隔是随机的，但总体平均速度是固定的。**
`)

function generatePoissonProcess(numPaths, totalTime, lambda) {
  const paths = [];
  for (let i = 0; i < numPaths; i++) {
    const events = [0];
    let currentTime = 0;
    while (currentTime < totalTime) {
      const timeToNextEvent = -Math.log(1 - Math.random()) / lambda;
      currentTime += timeToNextEvent;
      if (currentTime <= totalTime) {
        events.push(currentTime);
      }
    }
    paths.push(events);
  }
  return paths;
}

function updatePlot() {
  const paths = generatePoissonProcess(numPaths.value, totalTime.value, lambda.value);

  const data = paths.map((events, i) => {
    const x = [0];
    const y = [0];
    for (let j = 0; j < events.length; j++) {
      x.push(events[j]);
      x.push(events[j]);
      y.push(j);
      y.push(j + 1);
    }
    x.push(totalTime.value);
    y.push(events.length);
    return {
      x: x,
      y: y,
      type: 'scatter',
      mode: 'lines',
      name: `Path ${i + 1}`
    };
  });

  const layout = {
    title: 'Poisson Process Sample Paths',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Number of Events' },
    showlegend: true,
    margin: { l: 50, r: 50, b: 50, t: 50 }
  };

  Plotly.newPlot('plot', data, layout);
}

watch([numPaths, totalTime, lambda], () => {
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