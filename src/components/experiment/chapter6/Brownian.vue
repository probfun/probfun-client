<template>
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

<script setup>
import { ref, onMounted, watch } from 'vue';
import Plotly from 'plotly.js-dist';

const numPaths = ref(5);
const timeSteps = ref(100);
const totalTime = ref(1);
const volatility = ref(1);

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