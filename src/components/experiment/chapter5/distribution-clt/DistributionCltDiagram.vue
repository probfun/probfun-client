<script setup lang="ts">
import {
  chartOptions,
  getChartData,
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
  }
}>();

const points = ref<{ x: number[], y: number[] }>({ x: [], y: [] });
const chartData = ref(getChartData(points.value));

function selfConvolution(
  f: (x: number) => number,
  n: number,
  left: number,
  right: number,
): (x: number) => number {
  if (n === 1)
    return f;
  // --- 1) 基本参数、采样设置 ---
  // 区间长度
  const L = right - left;
  if (L <= 0) {
    throw new Error('要求 right > left');
  }

  // 可以视需求调整，这里写死一个默认采样数
  // 你也可以让它成为函数的参数
  const N = 4096;
  // 步长
  const h = L / N;

  // 零填充后的长度：为了避免周期卷积混叠，至少 2*N
  // 并且最好取 2 的幂
  // 这里简单取 M=2048 (>=2*N=2048), 也可更灵活地找大于等于 2N 的最近 2^k
  const M = 2 * N;

  // --- 2) 构造 f'(t) 的离散采样(长度 M)，超出 N 的部分补 0 ---
  const re = Array.from({ length: M }).fill(0) as number[]; // 实部
  const im = Array.from({ length: M }).fill(0) as number[]; // 虚部

  for (let i = 0; i < N; i++) {
    const t = i * h; // t ∈ [0, L)
    // f'(t) = f(t + left)
    re[i] = f(left + t);
  }

  // --- 3) 前向 FFT ---
  const fft = new FFT(M);
  // FFT 需要输入/输出数组长度 2*M (实部、虚部分开)
  const fftInput = Array.from({ length: 2 * M }) as number[];
  const fftOutput = Array.from({ length: 2 * M }) as number[];

  // 将 re, im 拷贝进 fftInput (偶数下标放实部, 奇数下标放虚部)
  for (let i = 0; i < M; i++) {
    fftInput[2 * i] = re[i];
    fftInput[2 * i + 1] = im[i];
  }

  fft.transform(fftOutput, fftInput);

  // --- 4) 频域逐点做 n 次幂 (卷积定理) ---
  for (let k = 0; k < M; k++) {
    const realPart = fftOutput[2 * k];
    const imagPart = fftOutput[2 * k + 1];

    // 极坐标形式
    const r = Math.sqrt(realPart * realPart + imagPart * imagPart);
    const phi = Math.atan2(imagPart, realPart);

    // (r * e^{i phi})^n = r^n * e^{i n phi}
    const rPow = r === 0 ? 0 : r ** n;
    const phiN = phi * n;

    // 转回直角坐标
    fftOutput[2 * k] = rPow * Math.cos(phiN);
    fftOutput[2 * k + 1] = rPow * Math.sin(phiN);
  }

  // --- 5) 逆 FFT 得到时域卷积值 ---
  const ifftOutput = Array.from({ length: 2 * M }) as number[];
  fft.inverseTransform(ifftOutput, fftOutput);

  // ifft 后还需要除以 M
  const conv = Array.from({ length: M }) as number[];
  for (let i = 0; i < M; i++) {
    conv[i] = ifftOutput[2 * i] / M; // 虚部理想情况下应近似 0
  }

  return (x: number) => {
    // 映射回 t
    const t = x - n * left;
    if (t < 0 || t > n * L) {
      return 0; // 卷积值为 0
    }

    // 离散点索引
    const index = t / h;
    const i0 = Math.floor(index);
    const frac = index - i0; // 小数部分

    // 边界保护
    if (i0 < 0)
      return conv[0];
    if (i0 >= M - 1)
      return conv[M - 1];

    // 简单线性插值
    const c0 = conv[i0];
    const c1 = conv[i0 + 1];
    return c0 + frac * (c1 - c0);
  };
}

function calculateMeanAndVariation() {
  const { f, left, right, dx } = props.args;
  const y = [];

  for (let i = left; i <= right; i += dx) {
    y.push(f(i));
  }
  const mean = y.reduce((acc, cur) => acc + cur, 0) / y.length;
  const variation = y.reduce((acc, cur) => acc + (cur - mean) ** 2, 0) / y.length;
  return { mean, variation };
}

function calculatePoints() {
  const { f, left, right, dx, n } = props.args;
  const x = [];
  const y = [];

  const { mean } = calculateMeanAndVariation();
  const ff = selfConvolution(f, n, left * n, right * n);

  for (let i = left * n - 0.5 * mean; i <= right * n + 0.5 * mean; i += dx * n) {
    x.push(i);
    // y.push(f(i));
    y.push(ff(i));
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
