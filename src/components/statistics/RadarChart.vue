<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { RadarData } from '../../types/statistics';

const props = defineProps<{
  data: RadarData[];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

// 绘制雷达图
const drawRadarChart = () => {
  if (!canvasRef.value || !props.data.length) return;

  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置画布尺寸
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  const angleStep = (Math.PI * 2) / props.data.length;

  // 绘制网格
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let r = radius / 5; r <= radius; r += radius / 5) {
    ctx.beginPath();
    for (let i = 0; i < props.data.length; i++) {
      const angle = angleStep * i - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 绘制轴线
  ctx.strokeStyle = '#ccc';
  for (let i = 0; i < props.data.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  // 绘制数据区域
  ctx.fillStyle = 'rgba(66, 185, 131, 0.5)';
  ctx.strokeStyle = '#42b983';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < props.data.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    // 使用类型断言获取score属性
    const score = (props.data[i] as any).score || 0;
    const r = (score / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 绘制数据点
  ctx.fillStyle = '#42b983';
  for (let i = 0; i < props.data.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const score = (props.data[i] as any).score || 0;
    const r = (score / 100) * radius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 绘制标签
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < props.data.length; i++) {
    const angle = angleStep * i - Math.PI / 2;
    const r = radius + 20;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    ctx.fillText(props.data[i].subject, x, y);
  }
};

onMounted(drawRadarChart);
watch(() => props.data, drawRadarChart, { deep: true });
</script>

<template>
  <div class="radar-chart-container">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<style scoped>
.radar-chart-container {
 width: clamp(300px, calc(5vw + min(50%, 50vh)), min(90vw, 500px));
 height: clamp(400px, calc(1vw + min(50%, 50vh)), min(99vw, 690px));
 padding: 1rem;
 border-radius: 8px;
 box-shadow: 7px 7px rgba(99,99,99,0.1);
 background-color: white;
}
</style>