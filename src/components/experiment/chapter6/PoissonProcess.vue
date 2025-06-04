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
    <template #conclusion></template>
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

const numPaths = ref(5);
const totalTime = ref(5);
const lambda = ref(1);

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