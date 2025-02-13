<script setup lang="ts">
import {
  chartOptions,
  getChartData,
} from '@/components/experiment/chapter5/distribution-clt/config';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  args: {
    f: (x: number) => number
    left: number
    right: number
    dx: number
    n: number
  }
}>();

const points = ref<{ x: number[], y: number[] }>({ x: [], y: [] });
const chartData = ref(getChartData(points.value));

function integrateSimpson(func: (t: number) => number, left: number, right: number, steps: number = 10): number {
  const h = (right - left) / steps;
  let integral = func(left) + func(right);
  for (let i = 1; i < steps; i++) {
    const x = left + i * h;
    integral += (i % 2 === 0 ? 2 : 4) * func(x);
  }
  integral *= h / 3;
  return integral;
}

function selfConvolution(f: (x: number) => number, n: number, left: number, right: number): (x: number) => number {
  const cache = new Map<string, number>();

  function convolutionHelper(f: (x: number) => number, m: number, x: number): number {
    const key = `${m}-${x}`;
    if (cache.has(key))
      return cache.get(key)!;

    if (m === 1) {
      cache.set(key, f(x));
      return f(x);
    }

    const result = integrateSimpson(
      t => f(t) * convolutionHelper(f, m - 1, x - t),
      left,
      right,
    );
    cache.set(key, result);
    return result;
  }

  return (x: number) => convolutionHelper(f, n, x);
}

function calculatePoints() {
  const { f, left, right, dx, n } = props.args;
  const x = [];
  const y = [];
  for (let i = left; i <= right; i += dx) {
    x.push(i);
    // y.push(f(i));
    y.push(selfConvolution(f, n, left, right)(i));
  }
  points.value = { x, y };
}

watch(() => props.args, () => {
  calculatePoints();
  chartData.value = getChartData(points.value);
}, { deep: true });

onMounted(() => {
  calculatePoints();
  chartData.value = getChartData(points.value);
});
</script>

<template>
  <div class="w-full h-full">
    <chart type="line" :data="chartData" class="w-full h-full" :options="chartOptions" />
  </div>
</template>

<style scoped>

</style>
