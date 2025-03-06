<script setup lang="ts">
import {
  getChartData,
  getChartDataMulti,
  getChartOption,
  getChartOptionMulti,
} from '@/components/experiment/chapter5/distribution-clt/config';
import FFT from 'fft.js';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  args: {
    f: (x: number) => number
    left: number
    right: number
    dx: number
    n: number
    multi: boolean
  }
}>();

const xs = ref<number[]>([]);
const y1s = ref<number[]>([]);
const y2s = ref<number[]>([]);
const yns = ref<number[][]>([]);
const chartData = ref(getChartData(xs.value, y1s.value, y2s.value));
const chartOption = ref(getChartOption(y1s.value, y2s.value));

function selfConvolution(
  f: (x: number) => number,
  n: number,
  left: number,
  right: number,
): (x: number) => number {
  // if (n === 1)
  //   return f;
  // --- 1) 基本参数、采样设置 ---
  // 区间长度
  const L = right - left;
  const N = 1024;
  const h = L / N;
  const M = 2 * N;

  const re = Array.from({ length: M }).fill(0) as number[]; // 实部
  const im = Array.from({ length: M }).fill(0) as number[]; // 虚部

  for (let i = 0; i < N; i++) {
    const t = i * h;
    re[i] = f(left + t);
  }

  const fft = new FFT(M);
  const fftInput = Array.from({ length: 2 * M }) as number[];
  const fftOutput = Array.from({ length: 2 * M }) as number[];

  for (let i = 0; i < M; i++) {
    fftInput[2 * i] = re[i];
    fftInput[2 * i + 1] = im[i];
  }

  fft.transform(fftOutput, fftInput);
  for (let k = 0; k < M; k++) {
    const realPart = fftOutput[2 * k];
    const imagPart = fftOutput[2 * k + 1];
    const r = Math.sqrt(realPart * realPart + imagPart * imagPart);
    const phi = Math.atan2(imagPart, realPart);
    const rPow = r === 0 ? 0 : r ** n;
    const phiN = phi * n;
    fftOutput[2 * k] = rPow * Math.cos(phiN);
    fftOutput[2 * k + 1] = rPow * Math.sin(phiN);
  }

  const ifftOutput = Array.from({ length: 2 * M }) as number[];
  fft.inverseTransform(ifftOutput, fftOutput);

  const conv = Array.from({ length: M }) as number[];
  for (let i = 0; i < M; i++) {
    conv[i] = ifftOutput[2 * i] / M;
  }

  const sum = conv.reduce((acc, v) => acc + v, 0) * h;
  for (let i = 0; i < M; i++) {
    conv[i] /= sum;
  }

  return (x: number) => {
    const t = x - n * left;
    if (t < 0 || t > n * L) {
      return 0; // 卷积值为 0
    }

    const index = t / h;
    const i0 = Math.floor(index);
    const frac = index - i0; // 小数部分

    if (i0 < 0)
      return conv[0];
    if (i0 >= M - 1)
      return conv[M - 1];

    const c0 = conv[i0];
    const c1 = conv[i0 + 1];
    return c0 + frac * (c1 - c0);
  };
}

function calculateMeanAndVariance() {
  const { f, left, right, dx } = props.args;
  const x = [];
  const fValues = [];

  for (let i = left; i <= right; i += dx) {
    x.push(i);
    fValues.push(f(i));
  }
  const normalization = fValues.reduce((sum, v) => sum + v, 0) * dx;
  for (let i = 0; i < fValues.length; i++) {
    fValues[i] /= normalization;
  }

  let mean = 0;
  for (let i = 0; i < x.length; i++) {
    mean += x[i] * fValues[i] * dx;
  }

  let meanSq = 0;
  for (let i = 0; i < x.length; i++) {
    meanSq += x[i] ** 2 * fValues[i] * dx;
  }

  const variance = meanSq - mean ** 2;
  return { mean, variance };
}

function calculatePoints() {
  const { f, left, right, dx, n } = props.args;
  const x = [];
  const y1 = [];
  const y2 = [];

  const { mean, variance } = calculateMeanAndVariance();
  const cur_mean = mean * n;
  const cur_variance = variance * n;

  const ff = selfConvolution(f, n, left * n, right * n);
  const len = (right - left) * n;
  for (let i = left * n - 0.5 * len; i <= right * n + 0.5 * len; i += dx * n) {
    i = Math.round(i * 100) / 100;
    x.push(i);
    y1.push(ff(i));
    y2.push(1 / Math.sqrt(2 * Math.PI * cur_variance) * Math.exp(-0.5 * (i - cur_mean) ** 2 / cur_variance));
  }

  xs.value = x;
  y1s.value = y1;
  y2s.value = y2;

  chartOption.value = getChartOption(y1, y2);
}

function calculateConvergeFuncPoints() {
  const { f, left, right, dx } = props.args;
  const n = 30;
  const x = [];
  const y = [];

  const { mean, variance } = calculateMeanAndVariance();

  for (let j = 1; j <= 30; j++) {
    const cur_mean = mean * j;
    const cur_variance = variance * j;
    const len = (right - left) * j;

    const fn = selfConvolution(f, j, left * j, right * j);
    let maxDiff = 0;
    for (let i = left * n - 0.5 * len; i <= right * n + 0.5 * len; i += dx * n) {
      i = Math.round(i * 100) / 100;
      const y1 = fn(i);
      const y2 = 1 / Math.sqrt(2 * Math.PI * cur_variance) * Math.exp(-0.5 * (i - cur_mean) ** 2 / cur_variance);
      maxDiff = Math.max(maxDiff, Math.abs(y1 - y2));
    }
    x.push(j);
    y.push(maxDiff);
  }

  return { x, y };
}

function calculatePointsMulti() {
  const { f, left, right, dx } = props.args;
  const n = 30;
  const x = [];
  const yn = Array.from({ length: 30 }).map(() => []) as number[][];
  const y2 = [];

  const { mean, variance } = calculateMeanAndVariance();
  const cur_mean = mean * n;
  const cur_variance = variance * n;

  // const ff = selfConvolution(f, n, left * n, right * n);
  const len = (right - left) * n;

  for (let j = 1; j <= 30; j++) {
    const fn = selfConvolution(f, j, left * j, right * j);
    for (let i = left * n - 0.5 * len; i <= right * n + 0.5 * len; i += dx * n) {
      i = Math.round(i * 100) / 100;
      yn[j - 1].push(fn(i));
    }
  }
  for (let i = left * n - 0.5 * len; i <= right * n + 0.5 * len; i += dx * n) {
    i = Math.round(i * 100) / 100;
    x.push(i);
    y2.push(1 / Math.sqrt(2 * Math.PI * cur_variance) * Math.exp(-0.5 * (i - cur_mean) ** 2 / cur_variance));
  }

  xs.value = x;
  yns.value = yn;
  y2s.value = y2;

  chartOption.value = getChartOptionMulti(yn, y2);
}

watch(() => props.args, () => {
  console.log('calculatePoints');
  if (props.args.multi) {
    calculatePointsMulti();
    chartData.value = getChartDataMulti(xs.value, yns.value, y2s.value);
  }
  else {
    calculatePoints();
    chartData.value = getChartData(xs.value, y1s.value, y2s.value);
  }
}, { deep: true });

onMounted(() => {
  if (props.args.multi) {
    calculatePointsMulti();
    chartData.value = getChartDataMulti(xs.value, yns.value, y2s.value);
  }
  else {
    calculatePoints();
    chartData.value = getChartData(xs.value, y1s.value, y2s.value);
  }
});

defineExpose({
  calculateConvergeFuncPoints,
});
</script>

<template>
  <div class="w-full h-full">
    <chart type="line" :data="chartData" class="w-full h-full" :options="chartOption" />
  </div>
</template>

<style scoped>

</style>
