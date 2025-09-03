<script setup lang="ts">
import type { ProgressData } from '../../types/statistics';
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  data: ProgressData[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

// 绘制折线图
function drawCurveChart() {
  if (!canvasRef.value || !props.data.length)
    return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  // 设置画布尺寸
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 边距
  const padding = { top: 30, right: 30, bottom: 40, left: 50 };
  const chartWidth = canvas.width - padding.left - padding.right;
  const chartHeight = canvas.height - padding.top - padding.bottom;

  // 获取数据范围
  const scores = props.data.map(d => (d as any).score || 0);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const scoreRange = maxScore - minScore || 1; // 避免除以零

  // 绘制坐标轴
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;

  // Y轴
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, canvas.height - padding.bottom);
  ctx.stroke();

  // X轴
  ctx.beginPath();
  ctx.moveTo(padding.left, canvas.height - padding.bottom);
  ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
  ctx.stroke();

  // 绘制Y轴刻度
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y = padding.top + (chartHeight * (yTicks - i)) / yTicks;
    const score = minScore + (i * scoreRange) / yTicks;

    // 绘制网格线
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(canvas.width - padding.right, y);
    ctx.strokeStyle = '#f0f0f0';
    ctx.stroke();

    // 绘制刻度文本
    ctx.fillText(score.toFixed(0), padding.left - 10, y);
  }

  // 绘制X轴刻度
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const xTicks = Math.min(10, props.data.length);
  const step = Math.max(1, Math.floor(props.data.length / xTicks));
  props.data.forEach((d, i) => {
    if (i % step === 0) {
      const x = padding.left + (i * chartWidth) / (props.data.length - 1);
      ctx.fillText(d.date, x, canvas.height - padding.bottom + 10);

      // 绘制网格线
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, canvas.height - padding.bottom);
      ctx.strokeStyle = '#f0f0f0';
      ctx.stroke();
    }
  });

  // 绘制折线
  ctx.beginPath();
  ctx.strokeStyle = '#42b983';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  props.data.forEach((d, i) => {
    const x = padding.left + (i * chartWidth) / (props.data.length - 1);
    const score = (d as any).score || 0;
    const y = padding.top + chartHeight - ((score - minScore) / scoreRange) * chartHeight;

    if (i === 0) {
      ctx.moveTo(x, y);
    }
    else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  // 绘制数据点
  ctx.fillStyle = '#42b983';
  props.data.forEach((d, i) => {
    const x = padding.left + (i * chartWidth) / (props.data.length - 1);
    const score = (d as any).score || 0;
    const y = padding.top + chartHeight - ((score - minScore) / scoreRange) * chartHeight;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // 数据点光晕
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(66, 185, 131, 0.2)';
    ctx.fill();
  });
}

onMounted(drawCurveChart);
watch(() => props.data, drawCurveChart, { deep: true });
</script>

<template>
  <div class="progress-curve-container">
    <canvas ref="canvasRef" class="w-full h-full" />
  </div>
</template>

<style scoped>
.progress-curve-container {
  width: clamp(300px, calc(5vw + min(50%, 50vh)), min(90vw, 1000px));
  height: clamp(400px, calc(1vw + min(50%, 50vh)), min(99vw, 690px));
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 7px 7px rgba(99,99,99,0.1);
  background-color: white;
}
</style>
