<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';

// 响应式数据 - 使用基础ref确保响应式更新
const df = ref(5);

// 计算属性 - 确保均值、方差、偏度实时更新
const mean = computed(() => df.value);
const variance = computed(() => 2 * df.value);
const skewness = computed(() => df.value > 2 ? Math.sqrt(8 / df.value) : 0);

const conclusionContent = `
## 卡方分布

## 概率密度函数
卡方分布的概率密度函数形式如下：
$$
f(x) = \\frac{1}{2^{\\frac{df}{2}}\\Gamma(\\frac{df}{2})} x^{\\frac{df}{2}-1} e^{-\\frac{x}{2}}
$$
其中：
- $df$ 为自由度
- $\ Γ\$ 表示伽马函数
- $x$ 为随机变量

## 基本性质
- **非负性**：只在$x≥0$时有定义
- **形状参数**：自由度$df$决定分布形状，$df$越小分布越偏斜
- **可加性**：若$X \\sim \\chi^2(n)$，$Y \\sim \\chi^2(m)$，且$X$与$Y$独立，则$X+Y \\sim \\chi^2(n+m)$
- **期望与方差**：$E[X] = df$，$Var(X) = 2df$
- **渐近性质**：当$df \\to∞$时，$\\chi^2(df)$分布近似于$N(df, 2df)$

## 历史发展
卡方分布由德国数学家卡尔·皮尔逊于1900年提出，是统计学中最重要的分布之一。皮尔逊在研究拟合优度检验时首次引入了这一分布。

这一分布最初被称为"$\\chi^2$分布"，其中"$\\chi$"是希腊字母，读作"卡方"，因此中文翻译为卡方分布。卡方分布的提出为假设检验和统计推断奠定了重要基础。

## 应用案例
### 拟合优度检验
在分类数据的拟合优度检验中，卡方分布用于判断观测数据是否与理论分布一致。例如，检验骰子是否均匀。

### 独立性检验
在列联表分析中，使用卡方分布判断两个分类变量是否独立。例如，检验吸烟与肺癌是否相关。

### 方差估计
在正态总体中，样本方差的抽样分布服从卡方分布，可用于方差的区间估计和假设检验。`;

// Canvas 相关
const canvasRef = ref<HTMLCanvasElement | null>(null);
let resizeObserver: ResizeObserver | null = null;

// 更新自由度
function updateDF(newValue: number) {
  df.value = newValue;
  // 直接触发重绘，确保图表实时更新
  drawChart();
}

// Gamma 函数计算 (Lanczos 近似)
function gamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  else {
    z -= 1;
    let x = p[0];
    for (let i: number = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
  }
}

// 卡方分布 PDF
function chiSquarePDF(x: number, df: number): number {
  if (x <= 0)
    return 0;

  const numerator = x ** (df / 2 - 1) * Math.exp(-x / 2);
  const denominator = 2 ** (df / 2) * gamma(df / 2);

  return numerator / denominator;
}

// 获取最大PDF值用于缩放
function getMaxPDF(df: number, xMin: number, xMax: number): number {
  let maxPDF = 0;
  const step = (xMax - xMin) / 200;

  for (let x = xMin; x <= xMax; x += step) {
    const pdf = chiSquarePDF(x, df);
    if (pdf > maxPDF)
      maxPDF = pdf;
  }

  return Math.min(1, maxPDF * 1.1); // 限制最大值，避免太高
}

// 绘制箭头
function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number): void {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

// 绘制图表 - 优化尺寸和比例
function drawChart(): void {
  if (!canvasRef.value)
    return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  // 重要：设置Canvas实际尺寸，避免拉伸变形
  const container = canvas.parentElement;
  if (container) {
    // 获取容器实际显示尺寸
    const { width: containerWidth, height: _containerHeight } = container.getBoundingClientRect();
    // 设置Canvas内在尺寸（解决模糊问题）
    canvas.width = containerWidth - 40; // 减去内边距
    canvas.height = 400; // 固定高度确保图表不扁
    // 设置CSS尺寸与内在尺寸一致
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
  }

  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  // 清除画布
  ctx.clearRect(0, 0, width, height);

  // 绘制网格
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
  ctx.lineWidth = 1;

  // 水平网格线
  for (let y = padding; y < height - padding; y += 30) {
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // 垂直网格线
  for (let x = padding; x < width - padding; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }

  // 绘制坐标轴
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;

  // X轴
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();

  // Y轴
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();

  // 坐标轴箭头
  drawArrow(ctx, width - padding, height - padding, width - padding - 10, height - padding - 5);
  drawArrow(ctx, width - padding, height - padding, width - padding - 10, height - padding + 5);
  drawArrow(ctx, padding, padding, padding - 5, padding + 10);
  drawArrow(ctx, padding, padding, padding + 5, padding + 10);

  // 轴标签
  ctx.fillStyle = '#333';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('x', width - padding + 20, height - padding + 20);
  ctx.textAlign = 'right';
  ctx.fillText('f(x)', padding - 10, padding - 10);

  // 刻度标签
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  // 根据df设置x轴范围，优化显示比例
  let xMax;
  if (df.value <= 30) {
    xMax = Math.min(50, df.value * 3);
  }
  else {
    xMax = 100;
  }
  const xMin = 0;
  const xRange = xMax - xMin;

  // X轴刻度
  const xTicks = 10;
  for (let i = 0; i <= xTicks; i++) {
    const x = padding + (i * (width - 2 * padding)) / xTicks;
    const xValue = ((i * xRange) / xTicks).toFixed(1);
    ctx.fillText(xValue, x, height - padding + 20);

    // 刻度线
    ctx.beginPath();
    ctx.moveTo(x, height - padding);
    ctx.lineTo(x, height - padding + 5);
    ctx.stroke();
  }

  // Y轴刻度
  const maxPDF = getMaxPDF(df.value, xMin, xMax);
  for (let i = 0; i <= 5; i++) {
    const y = height - padding - (i * (height - 2 * padding)) / 5;
    const yValue = (i * maxPDF / 5).toFixed(2);
    ctx.textAlign = 'right';
    ctx.fillText(yValue, padding - 10, y + 4);

    // 刻度线
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding - 5, y);
    ctx.stroke();
  }

  // 标题
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(`卡方分布概率密度函数 (df = ${df.value})`, width / 2, padding / 2);

  // 绘制多个分布曲线用于比较
  const colors = [
    { color: '#3b82f6', width: 3 }, // 当前卡方分布 - 蓝色
    { color: '#10b981', width: 2 }, // df=1 - 绿色
    { color: '#f59e0b', width: 1.5 }, // df=10 - 橙色
    { color: '#ef4444', width: 1.5 }, // df=30 - 红色
  ];

  // 要比较的df值
  const currentDf = df.value;
  let otherDfs: number[] = [];

  if (currentDf >= 1 && currentDf <= 5) {
    otherDfs = [currentDf + 2, currentDf + 5, currentDf + 10];
  }
  else if (currentDf >= 6 && currentDf <= 15) {
    otherDfs = [currentDf - 3, currentDf + 5, currentDf + 15];
  }
  else {
    otherDfs = [currentDf - 5, currentDf + 10, currentDf + 20];
  }

  // 确保自由度为正数
  otherDfs = otherDfs.map(v => Math.max(1, v));
  const dfValues = [currentDf, ...otherDfs];

  for (let idx = 0; idx < dfValues.length; idx++) {
    const dfToPlot = dfValues[idx];
    const style = colors[idx];

    // 绘制曲线
    ctx.beginPath();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineJoin = 'round';

    for (let i = 0; i <= width - 2 * padding; i++) {
      const x = xMin + (i / (width - 2 * padding)) * xRange;
      const pdf = chiSquarePDF(x, dfToPlot);

      const plotX = padding + i;
      const plotY = height - padding - (pdf / maxPDF) * (height - 2 * padding);

      if (i === 0) {
        ctx.moveTo(plotX, plotY);
      }
      else {
        ctx.lineTo(plotX, plotY);
      }
    }

    ctx.stroke();
  }

  // 添加图例
  ctx.textAlign = 'left';
  ctx.fillStyle = '#333';
  ctx.font = 'bold 14px Arial';
  ctx.fillText('图例:', width - padding - 150, padding + 20);

  for (let idx = 0; idx < dfValues.length; idx++) {
    const dfToPlot = dfValues[idx];
    const style = colors[idx];

    ctx.beginPath();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.moveTo(width - padding - 150, padding + 40 + idx * 25);
    ctx.lineTo(width - padding - 120, padding + 40 + idx * 25);
    ctx.stroke();

    ctx.fillStyle = style.color;
    ctx.font = (idx === 0) ? 'bold 14px Arial' : '14px Arial';
    ctx.fillText(`df = ${dfToPlot} ${idx === 0 ? '(当前)' : ''}`, width - padding - 110, padding + 44 + idx * 25);
  }
}

// 调整Canvas大小
function resizeCanvas(): void {
  drawChart();
}

onMounted(() => {
  // 初始化绘制
  drawChart();

  // 监听窗口大小变化
  window.addEventListener('resize', resizeCanvas);

  // 监听父容器大小变化（更精确的响应式）
  if (canvasRef.value?.parentElement) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (canvasRef.value) {
          canvasRef.value.width = entry.contentRect.width - 40;
          canvasRef.value.height = 400;
          drawChart();
        }
      }
    });

    resizeObserver.observe(canvasRef.value.parentElement);
  }

  // 监听df变化，确保图表更新
  watch(df, () => {
    drawChart();
  });
});

onUnmounted(() => {
  // 清理监听器，防止内存泄漏
  window.removeEventListener('resize', resizeCanvas);
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <ExperimentBoard :show-parameter-panel="false">
    <template #experiment>
      <div class="bg-white rounded-lg shadow-md p-4 mb-6 overflow-hidden">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          概率密度函数
        </h2>
        <!-- 两列布局 -->
        <div class="flex flex-col md:flex-row gap-6">
          <!-- 图表区域 - 左侧 -->
          <div class="w-full md:w-2/3">
            <canvas ref="canvasRef" class="w-full h-[400px] border rounded-md" />
            <!-- 恢复参数显示区域 -->
            <div class="grid grid-cols-2 gap-4 mt-4">
              <Card class="p-2 border border-gray-200">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    当前自由度
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ df }}
                  </p>
                </CardContent>
              </Card>
              <Card class="p-2 border border-gray-200">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    分布均值
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ mean.toFixed(2) }}
                  </p>
                </CardContent>
              </Card>
              <Card class="p-2 border border-gray-200">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    分布方差
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ variance.toFixed(2) }}
                  </p>
                </CardContent>
              </Card>
              <Card class="p-2 border border-gray-200">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    分布偏度
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ df > 2 ? skewness.toFixed(2) : 'N/A' }}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <!-- 参数控制区域 - 右侧 -->
          <div class="w-full md:w-1/3">
            <div class="mt-0 p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">
                参数控制
              </h3>
              <div class="space-y-4">
                <div>
                  <h4 class="text-base font-medium text-gray-700 mb-2">
                    自由度 (df)
                  </h4>
                  <div class="space-y-2">
                    <Label for="dfSlider" class="text-sm text-gray-600">调整卡方分布的自由度参数:</Label>
                    <input
                      id="dfSlider" type="range" min="1" max="50" :value="df" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      @input="updateDF(parseInt(($event.target as HTMLInputElement)?.value || '0'))"
                    >
                    <div class="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span class="font-medium text-gray-800">{{ df }}</span>
                      <span>50</span>
                    </div>
                  </div>
                </div>

                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="text-base font-medium text-blue-800 mb-2">
                    卡方分布特性
                  </h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li>卡方分布由自由度参数df控制，是<span class="font-semibold text-blue-700">多个独立标准正态变量平方和</span>的分布。</li>
                    <li>• 当<span class="font-semibold text-blue-700">df=1</span>时，分布高度偏斜</li>
                    <li>• 当<span class="font-semibold text-blue-700">df增大</span>时，分布逐渐趋于对称</li>
                    <li>• df→∞时，卡方分布收敛于正态分布</li>
                    <li>
                      • 均值：<span class="font-semibold text-blue-700">df</span>，方差：<span
                        class="font-semibold text-blue-700"
                      >2×df</span>
                    </li>
                    <li>• 偏度：<span class="font-semibold text-blue-700">√(8/df)</span>（df&gt;2时）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #conclusion>
      <CardContent class="markdown-body prose prose-sm max-w-none space-y-4">
        <div v-html="toMarkdown(conclusionContent)" />
      </CardContent>
    </template>

    <template #comment>
      <CommentPanel exp-id="chi-square-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.prose-sm {
  max-width: 100%;
}

.prose-sm h4 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* 确保卡片内容正确显示 */
:deep(.card) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.card-content) {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
