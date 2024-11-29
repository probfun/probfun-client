<script setup lang="ts">
import type { BuffonNeedleArgs } from '@/api/ai/aiType';
import { onMounted, onUnmounted, ref } from 'vue';

// const needleLength = ref(30); // 默认针的长度
// const floorLineSpacing = ref(60); // 默认线的间距
// const needleAmount = ref(1000);

const props = defineProps<{ args: BuffonNeedleArgs }>();
const {
  needleLength,
  floorLineSpacing,
  needleAmount,
} = props.args;

const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

const hits = ref(0);
const estimatedPi = ref(0);

const width = ref(0);
const height = ref(0);

function resizeUpdate() {
  if (container.value) {
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight;

    const ratio = window.devicePixelRatio || 1;

    if (canvas.value?.width !== width.value * ratio || canvas.value?.height !== height.value * ratio) {
      canvas.value!.width = width.value * ratio;
      canvas.value!.height = height.value * ratio;
      const ctx = canvas.value?.getContext('2d');
      ctx?.scale(ratio, ratio);
    }
    runSimulation();
  }
}

function reset() {
  hits.value = 0;
  estimatedPi.value = 0;
  canvas.value?.getContext('2d')?.clearRect(0, 0, canvas.value.width, canvas.value.height);
  const ctx = canvas.value?.getContext('2d');
  if (!canvas.value || !ctx)
    return;
  ctx.strokeStyle = 'black';
  for (let y = 10; y < canvas.value.height; y += floorLineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.value.width, y);
    ctx.stroke();
  }
}

async function runSimulation() {
  const ctx = canvas.value?.getContext('2d');
  if (!canvas.value || !ctx) {
    console.log('canvas or ctx is null');
    return;
  }
  console.log('draw: ', floorLineSpacing, needleAmount, needleLength);
  hits.value = 0;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.strokeStyle = 'black';
  for (let y = 10; y < canvas.value.height; y += floorLineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.value.width, y);
    ctx.stroke();
  }

  for (let i = 0; i < needleAmount; i++) {
    const needleData = generateRandomNeedle(); // 生成随机的针数据
    drawNeedle(ctx, needleData); // 绘制针
  }

  estimatedPi.value = (2 * needleLength * needleAmount) / (hits.value * floorLineSpacing);
}

function generateRandomNeedle() {
  const xCenter = Math.random() * canvas.value!.width;
  const yCenter = Math.random() * canvas.value!.height;
  const theta = Math.random() * Math.PI;
  const x1 = xCenter - (needleLength / 2) * Math.cos(theta);
  const x2 = xCenter + (needleLength / 2) * Math.cos(theta);
  const y1 = yCenter - (needleLength / 2) * Math.sin(theta);
  const y2 = yCenter + (needleLength / 2) * Math.sin(theta);

  return { x1, x2, y1, y2, yCenter };
}

function drawNeedle(ctx: CanvasRenderingContext2D, needleData: { x1: number, x2: number, y1: number, y2: number, yCenter: number }) {
  // 检查是否与地板线相交
  if (Math.floor((needleData.y1 - 10) / floorLineSpacing) !== Math.floor((needleData.y2 - 10) / floorLineSpacing)) {
    hits.value++;
    ctx.beginPath();
    ctx.moveTo(needleData.x1, needleData.y1);
    ctx.lineTo(needleData.x2, needleData.y2);
    ctx.strokeStyle = 'red'; // 相交的针为红色
    ctx.stroke();
  }
  else {
    ctx.beginPath();
    ctx.moveTo(needleData.x1, needleData.y1);
    ctx.lineTo(needleData.x2, needleData.y2);
    ctx.strokeStyle = 'blue'; // 不相交的针为蓝色
    ctx.stroke();
  }
}

const resizeObserver = ref<ResizeObserver | null>(null);
onMounted(() => {
  if (container.value) {
    resizeObserver.value = new ResizeObserver(resizeUpdate);
    resizeObserver.value.observe(container.value);
  }
  runSimulation();
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

defineExpose({ hits, reset, runSimulation, estimatedPi });
</script>

<template>
  <div ref="container" class="h-full overflow-hidden">
    <div class="bg-background">
      <canvas ref="canvas" class="w-full h-full" />
    </div>
  </div>
</template>

<style scoped>

</style>
