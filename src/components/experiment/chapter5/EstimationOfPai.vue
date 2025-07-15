<template>
  <ExperimentBoard :layout="1" :panel-size="70">
    <template #experiment>
      <div class="w-full h-full p-5 overflow-hidden">
        <!-- 可视化展示 - 强制两列布局 -->
        <div class="grid grid-cols-2 gap-4 h-full">
          <!-- 左侧：随机点分布图 -->
          <div class="bg-white/90 rounded-xl p-4 shadow-lg flex flex-col h-full">
            <h2 class="text-lg font-semibold text-blue-700 pb-2 mb-3 border-b-2 border-blue-500 text-center flex-shrink-0">
              随机点分布
            </h2>
            <div class="relative bg-gray-50 rounded border border-gray-200 overflow-hidden flex-grow flex items-center justify-center">
              <canvas ref="scatterCanvas" width="500" height="500" class="max-w-full max-h-full w-auto h-auto block"></canvas>
            </div>

            <!-- 统计数据 -->
            <div class="grid grid-cols-2 gap-3 mt-3 flex-shrink-0">
              <div class="bg-white/90 rounded-lg p-3 text-center transition-all duration-300 shadow hover:transform hover:-translate-y-0.5 hover:shadow-lg">
                <div class="text-sm text-blue-600">总点数</div>
                <div class="text-2xl font-bold text-red-500 mt-1">{{ totalPoints.toLocaleString() }}</div>
              </div>
              <div class="bg-white/90 rounded-lg p-3 text-center transition-all duration-300 shadow hover:transform hover:-translate-y-0.5 hover:shadow-lg">
                <div class="text-sm text-blue-600">圆内点数</div>
                <div class="text-2xl font-bold text-red-500 mt-1">{{ pointsInsideCircle.toLocaleString() }}</div>
              </div>
            </div>
          </div>

          <!-- 右侧：π值收敛曲线 -->
          <div class="bg-white/90 rounded-xl p-4 shadow-lg flex flex-col h-full">
            <h2 class="text-lg font-semibold text-blue-700 pb-2 mb-3 border-b-2 border-blue-500 text-center flex-shrink-0">
              π值收敛曲线
            </h2>
            <div class="relative bg-gray-50 rounded border border-gray-200 overflow-hidden flex-grow flex items-center justify-center">
              <canvas ref="curveCanvas" width="500" height="500" class="max-w-full max-h-full w-auto h-auto block"></canvas>
            </div>

            <!-- π值显示 -->
            <div class="grid grid-cols-2 gap-3 mt-3 flex-shrink-0">
              <div class="bg-white/90 rounded-lg p-3 text-center transition-all duration-300 shadow hover:transform hover:-translate-y-0.5 hover:shadow-lg">
                <div class="text-sm text-blue-600">当前估算π值</div>
                <div class="text-2xl font-bold text-yellow-500 mt-1" style="text-shadow: 0 0 10px rgba(255, 234, 0, 0.5);">
                  {{ currentPi.toFixed(6) }}
                </div>
              </div>
              <div class="bg-white/90 rounded-lg p-3 text-center transition-all duration-300 shadow hover:transform hover:-translate-y-0.5 hover:shadow-lg">
                <div class="text-sm text-blue-600">真实π值</div>
                <div class="text-2xl font-bold text-red-500 mt-1">3.1415927</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="w-full h-full p-5 overflow-hidden flex items-center">
        <div class="w-full">
          <h3 class="text-lg font-semibold text-blue-700 pb-2 mb-4 border-b-2 border-blue-500">
            模拟参数控制
          </h3>

          <!-- 点生成速度 -->
          <div class="flex items-center my-4">
            <label class="w-32 font-semibold text-sm flex-shrink-0">点生成速度:</label>
            <input
                type="range"
                v-model.number="speed"
                min="1"
                max="100"
                step="1"
                class="flex-1 mx-1.5"
            >
            <span class="min-w-[80px] px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm flex-shrink-0">{{ speed }} 点/帧</span>
          </div>

          <!-- 点大小 -->
          <div class="flex items-center my-4">
            <label class="w-32 font-semibold text-sm flex-shrink-0">点大小:</label>
            <input
                type="range"
                v-model.number="pointSize"
                min="1"
                max="5"
                step="1"
                class="flex-1 mx-1.5"
            >
            <span class="min-w-[80px] px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm flex-shrink-0">{{ pointSize }} 像素</span>
          </div>

          <!-- 批量生成 -->
          <div class="flex items-center my-4">
            <label class="w-32 font-semibold text-sm flex-shrink-0">批量生成:</label>
            <input
                type="range"
                v-model.number="batchSizeIndex"
                min="0"
                max="4"
                step="1"
                class="flex-1 mx-1.5"
            >
            <span class="min-w-[80px] px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm flex-shrink-0">{{ batchSizes[batchSizeIndex].toLocaleString() }} 点/批</span>
          </div>

          <!-- 操作按钮 -->
          <div class="grid grid-cols-2 gap-4 my-5">
            <button
                @click="startSimulation"
                class="py-3 px-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 rounded-lg cursor-pointer font-bold text-base transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              {{ isRunning ? '运行中...' : '开始模拟' }}
            </button>
            <button
                @click="pauseSimulation"
                class="py-3 px-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 rounded-lg cursor-pointer font-bold text-base transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              暂停
            </button>
            <button
                @click="resetSimulation"
                class="py-3 px-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-lg cursor-pointer font-bold text-base transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              重置
            </button>
            <button
                @click="batchGenerate"
                class="py-3 px-5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 rounded-lg cursor-pointer font-bold text-base transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              批量生成
            </button>
          </div>

          <div class="mt-5 p-4 bg-blue-50 rounded-xl text-sm">
            <p class="mb-2 leading-relaxed">
              <span class="font-bold text-red-500">蒙特卡罗方法</span>：通过在正方形内随机投点，统计落在内切圆中的点数比例来估算π值。
            </p>
            <p class="leading-relaxed">
              理论依据：圆面积/正方形面积 = πr²/(2r)² = π/4，因此 <span class="font-bold text-red-500">π ≈ 4 × (圆内点数/总点数)</span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5 overflow-auto">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="pi-estimation" />
    </template>
  </ExperimentBoard>
</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { toMarkdown } from '@/utils/markdown';

// Canvas引用
const scatterCanvas = ref(null);
const curveCanvas = ref(null);

// 状态变量
const totalPoints = ref(0);
const pointsInsideCircle = ref(0);
const currentPi = ref(0);
const isRunning = ref(false);
const speed = ref(50);
const pointSize = ref(2);
const batchSizeIndex = ref(0);

// 常量
const REAL_PI = Math.PI;
const CANVAS_SIZE = 500;
const CIRCLE_RADIUS = 200;
const CIRCLE_CENTER = CANVAS_SIZE / 2;
const SQUARE_START = 50;
const SQUARE_SIZE = 400;
const batchSizes = [1000, 5000, 10000, 50000, 100000];

// 内部变量
let scatterCtx = null;
let curveCtx = null;
let animationId = null;
let piHistory = [];

// 内容
const content = ref(`
## **蒙特卡罗方法估算π值**

蒙特卡罗方法是一种基于随机抽样的数值计算方法，通过大量随机实验来近似求解数学问题。估算π值是展示这一方法的经典案例。

**基本原理：**

在边长为2r的正方形内有一个半径为r的内切圆：
- 正方形面积：$S_{square} = (2r)^2 = 4r^2$
- 圆的面积：$S_{circle} = \\pi r^2$
- 面积比：$\\frac{S_{circle}}{S_{square}} = \\frac{\\pi r^2}{4r^2} = \\frac{\\pi}{4}$

因此：$\\pi = 4 \\times \\frac{S_{circle}}{S_{square}}$

**算法步骤：**

1. 在正方形内随机生成N个点
2. 统计落在内切圆中的点数M
3. 计算比例：$\\frac{M}{N} \\approx \\frac{S_{circle}}{S_{square}} = \\frac{\\pi}{4}$
4. 估算π值：$\\pi \\approx 4 \\times \\frac{M}{N}$

**收敛性分析：**

根据大数定律，当N趋于无穷大时，估算值会收敛到真实的π值。收敛速度遵循：
$$|\\pi_{estimate} - \\pi| \\sim O(\\frac{1}{\\sqrt{N}})$$

这意味着要将误差减小10倍，需要将样本数增加100倍。

**误差分析：**

估算的标准误差为：
$$SE = \\frac{4\\sqrt{p(1-p)}}{\\sqrt{N}}$$

其中p = π/4 ≈ 0.785是点落在圆内的真实概率。

**优化策略：**

1. **重要性采样**：在圆边界附近增加采样密度
2. **分层采样**：将区域分成小格子，每个格子内均匀采样
3. **拟蒙特卡罗**：使用低差异序列（如Halton序列）代替随机数
4. **并行计算**：利用多核处理器并行生成随机点

**应用拓展：**

蒙特卡罗方法广泛应用于：
- 金融衍生品定价
- 粒子物理模拟
- 机器学习中的采样算法
- 计算机图形学中的光线追踪
- 工程可靠性分析

这个实验直观展示了如何通过简单的随机实验解决复杂的数学问题，体现了概率统计在计算中的强大威力。
`);

// 初始化Canvas
function initCanvas() {
  if (!scatterCanvas.value || !curveCanvas.value) return;

  scatterCtx = scatterCanvas.value.getContext('2d');
  curveCtx = curveCanvas.value.getContext('2d');

  // 初始化散点图
  scatterCtx.fillStyle = 'rgba(243, 244, 246, 1)';
  scatterCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 绘制正方形
  scatterCtx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
  scatterCtx.lineWidth = 2;
  scatterCtx.strokeRect(SQUARE_START, SQUARE_START, SQUARE_SIZE, SQUARE_SIZE);

  // 绘制内切圆
  scatterCtx.beginPath();
  scatterCtx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, 0, Math.PI * 2);
  scatterCtx.strokeStyle = '#3b82f6';
  scatterCtx.lineWidth = 3;
  scatterCtx.stroke();

  // 初始化曲线图
  initCurveCanvas();
}

// 初始化曲线图
function initCurveCanvas() {
  curveCtx.fillStyle = 'rgba(243, 244, 246, 1)';
  curveCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 绘制坐标轴
  curveCtx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
  curveCtx.lineWidth = 1;
  curveCtx.beginPath();
  curveCtx.moveTo(50, 50);
  curveCtx.lineTo(50, CANVAS_SIZE - 50);
  curveCtx.lineTo(CANVAS_SIZE - 50, CANVAS_SIZE - 50);
  curveCtx.stroke();

  // 绘制π参考线
  drawPiReferenceLine();

  // 添加标签
  addCurveLabels();
}

// 绘制π参考线
function drawPiReferenceLine() {
  curveCtx.strokeStyle = '#eab308';
  curveCtx.lineWidth = 2;
  curveCtx.setLineDash([5, 5]);
  curveCtx.beginPath();
  const piY = CANVAS_SIZE - 50 - (REAL_PI / 4) * (CANVAS_SIZE - 100);
  curveCtx.moveTo(50, piY);
  curveCtx.lineTo(CANVAS_SIZE - 50, piY);
  curveCtx.stroke();
  curveCtx.setLineDash([]);

  curveCtx.fillStyle = '#eab308';
  curveCtx.font = '14px sans-serif';
  curveCtx.fillText('π = 3.14159', CANVAS_SIZE - 120, piY - 10);
}

// 添加曲线图标签
function addCurveLabels() {
  curveCtx.fillStyle = 'rgba(107, 114, 128, 0.8)';
  curveCtx.font = '12px sans-serif';

  // Y轴刻度
  for (let i = 0; i <= 4; i += 0.5) {
    const y = CANVAS_SIZE - 50 - (i / 4) * (CANVAS_SIZE - 100);
    curveCtx.beginPath();
    curveCtx.moveTo(45, y);
    curveCtx.lineTo(50, y);
    curveCtx.stroke();
    curveCtx.fillText(i.toFixed(1), 25, y + 5);
  }

  // X轴刻度（对数刻度）
  for (let i = 0; i <= 6; i++) {
    const value = Math.pow(10, i);
    const x = 50 + (i / 6) * (CANVAS_SIZE - 100);
    curveCtx.beginPath();
    curveCtx.moveTo(x, CANVAS_SIZE - 50);
    curveCtx.lineTo(x, CANVAS_SIZE - 45);
    curveCtx.stroke();
    if (i <= 3 || i === 6) {
      curveCtx.fillText(value.toLocaleString(), x - 15, CANVAS_SIZE - 30);
    }
  }

  // 轴标签
  curveCtx.font = '14px sans-serif';
  curveCtx.fillText('点数', CANVAS_SIZE / 2 - 20, CANVAS_SIZE - 10);

  curveCtx.save();
  curveCtx.translate(20, CANVAS_SIZE / 2);
  curveCtx.rotate(-Math.PI / 2);
  curveCtx.fillText('估算π值', 0, 0);
  curveCtx.restore();
}

// 生成随机点
function generatePoint() {
  const x = Math.random() * SQUARE_SIZE + SQUARE_START;
  const y = Math.random() * SQUARE_SIZE + SQUARE_START;

  const distance = Math.sqrt(Math.pow(x - CIRCLE_CENTER, 2) + Math.pow(y - CIRCLE_CENTER, 2));
  const isInside = distance <= CIRCLE_RADIUS;

  totalPoints.value++;
  if (isInside) pointsInsideCircle.value++;

  currentPi.value = totalPoints.value > 0 ? 4 * (pointsInsideCircle.value / totalPoints.value) : 0;
  piHistory.push(currentPi.value);

  drawPoint(x, y, isInside);
  updateConvergenceCurve();
}

// 绘制点
function drawPoint(x, y, isInside) {
  scatterCtx.beginPath();
  scatterCtx.arc(x, y, pointSize.value, 0, Math.PI * 2);
  scatterCtx.fillStyle = isInside ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
  scatterCtx.fill();
}

// 更新收敛曲线
function updateConvergenceCurve() {
  // 清除曲线区域
  curveCtx.fillStyle = 'rgba(243, 244, 246, 1)';
  curveCtx.fillRect(51, 0, CANVAS_SIZE - 100, CANVAS_SIZE - 51);

  // 重绘参考线
  drawPiReferenceLine();

  // 绘制收敛曲线
  if (piHistory.length > 0) {
    curveCtx.beginPath();
    curveCtx.strokeStyle = '#3b82f6';
    curveCtx.lineWidth = 3;

    const maxPoints = 1000000;
    const logMax = Math.log10(maxPoints);

    for (let i = 0; i < piHistory.length; i++) {
      const logPoint = Math.log10(i + 1);
      const x = 50 + (logPoint / logMax) * (CANVAS_SIZE - 100);
      const y = CANVAS_SIZE - 50 - (piHistory[i] / 4) * (CANVAS_SIZE - 100);

      if (i === 0) {
        curveCtx.moveTo(x, y);
      } else {
        curveCtx.lineTo(x, y);
      }
    }

    curveCtx.stroke();
  }

  // 更新当前值标签 - 将标签向上移动，避免与曲线重叠
  curveCtx.fillStyle = '#3b82f6';
  curveCtx.font = 'bold 14px sans-serif';
  curveCtx.fillText(`当前估算: ${currentPi.value.toFixed(6)}`, 60, 20);
  curveCtx.fillText(`总点数: ${totalPoints.value.toLocaleString()}`, 60, 40);
}

// 动画循环
function animate() {
  if (!isRunning.value) return;

  const pointsPerFrame = Math.max(1, Math.floor(speed.value / 10));

  for (let i = 0; i < pointsPerFrame; i++) {
    generatePoint();
  }

  animationId = requestAnimationFrame(animate);
}

// 控制函数
function startSimulation() {
  if (!isRunning.value) {
    isRunning.value = true;
    animate();
  }
}

function pauseSimulation() {
  isRunning.value = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resetSimulation() {
  pauseSimulation();

  totalPoints.value = 0;
  pointsInsideCircle.value = 0;
  currentPi.value = 0;
  piHistory = [];

  initCanvas();
}

function batchGenerate() {
  const wasRunning = isRunning.value;
  pauseSimulation();

  const batchSize = batchSizes[batchSizeIndex.value];
  for (let i = 0; i < batchSize; i++) {
    generatePoint();
  }

  if (wasRunning) {
    startSimulation();
  }
}

// 生命周期
onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  pauseSimulation();
});

// 监听点大小变化
watch(pointSize, () => {
  // 点大小改变时不需要重绘所有点，只影响新点
});
</script>

<style scoped>
canvas {
  image-rendering: crisp-edges;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
  image-rendering: pixelated;
}

/* 防止全局滚动条 */
:global(html, body) {
  overflow: hidden;
}
</style>