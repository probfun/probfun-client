<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';

// 定义响应式数据
const df = ref(5);
const mean = ref(0.00);
const variance = ref(1.67);
const kurtosis = ref(3.00);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const conclusionContent = `
## t分布实验

## 概率密度函数
t分布的概率密度函数形式如下：
$$
f(t) = \\frac{\\Gamma(\\frac{df+1}{2})}{\\sqrt{df\\pi}\\Gamma(\\frac{df}{2})}\\left(1+\\frac{t^2}{df}\\right)^{-\\frac{df+1}{2}}
$$
其中：
- $\df\$ 为自由度
- $\ Γ\$ 表示伽马函数
- $\ t\$ 为随机变量

## 基本性质
- **对称性**：关于$\ t=0\$对称，均值为0（当$\ df>1\$时）
- **形状参数**：自由度$\ df\$决定分布形状，$\ df\$越小尾部越厚
- **方差特性**：方差为$\\frac{df}{df-2}\$（当$\ df>2\$时），$\df≤2\$时方差无穷大
- **渐近性质**：当$\ df→∞\$时，$\ t\$分布收敛于标准正态分布
- **峰度特性**：峰度大于正态分布，有更厚的数据尾部（$\ df>4\$时峰度为$\\frac{3+6}{df-4}\$）

## 历史发展
$\ t\$分布由英国统计学家威廉·希利·戈塞特于1908年提出。当时戈塞特在爱尔兰都柏林的吉尼斯啤酒厂工作，需要解决小样本数据的统计问题。

由于吉尼斯公司禁止员工发表研究成果，戈塞特被迫使用笔名"$\ Student\$"发表论文，因此$\ t\$分布也被称为"学生$\ t\$分布"。这一发现革命性地改变了小样本统计分析方法，为后来的假设检验和置信区间估计奠定了基础。

## 应用案例
### 医学研究
在新药临床试验中，使用$\ t\$检验比较小样本(如30名患者)的治疗效果，判断药物是否显著有效。

### 质量控制
制造业中，对生产批次的小样本进行$\ t\$检验，判断生产过程是否稳定，是否需要调整工艺参数。

### 市场调研
在消费者满意度调查中，通过$\ t\$分布计算置信区间，用小样本数据推断整体消费者群体的满意度水平。`;

// t分布PDF计算
function tPDF(x: number, df: number): number {
  // Gamma函数计算（使用Lanczos近似）
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
      for (let i = 1; i < g + 2; i++) {
        x += p[i] / (z + i);
      }
      const t = z + g + 0.5;
      return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
    }
  }

  // t分布PDF公式
  const numerator = gamma((df + 1) / 2);
  const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2) * (1 + (x * x) / df) ** ((df + 1) / 2);

  return numerator / denominator;
}

// 标准正态分布PDF
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// 获取最大PDF值用于缩放
function getMaxPDF(df: number, xMin: number, xMax: number): number {
  let maxPDF = 0;
  const step = (xMax - xMin) / 200;

  // 检查t分布和标准正态分布的最大值
  for (let x = xMin; x <= xMax; x += step) {
    const pdf = Math.max(tPDF(x, df), normalPDF(0));
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

// 绘制图表
function drawChart(): void {
  if (!canvasRef.value)
    return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  if (!ctx)
    return;

  // 设置Canvas尺寸
  const container = canvas.parentElement;
  if (container) {
    canvas.width = container.clientWidth - 40; // 减去内边距
    canvas.height = 300;
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

  // 设置x轴范围（-4到4）
  const xMin = -4;
  const xMax = 4;
  const xRange = xMax - xMin;

  // X轴刻度
  const xTicks = 8;
  for (let i = 0; i <= xTicks; i++) {
    const x = padding + (i * (width - 2 * padding)) / xTicks;
    const xValue = (xMin + (i * xRange) / xTicks).toFixed(1);
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
  ctx.fillText(`t分布概率密度函数 (df = ${df.value})`, width / 2, padding / 2);

  // 绘制多个分布曲线用于比较
  const colors = [
    { color: '#3b82f6', width: 3 }, // 当前t分布 - 蓝色
    { color: '#10b981', width: 2 }, // 标准正态分布 - 绿色
    { color: '#f59e0b', width: 1.5 }, // df=1 - 橙色
    { color: '#ef4444', width: 1.5 }, // df=30 - 红色
  ];

  // 要比较的df值
  const dfValues = [df.value, Infinity, 1, 30];

  for (let idx = 0; idx < dfValues.length; idx++) {
    const currentDf = dfValues[idx];
    const style = colors[idx];

    // 绘制曲线
    ctx.beginPath();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.lineJoin = 'round';

    for (let i = 0; i <= width - 2 * padding; i++) {
      const x = xMin + (i / (width - 2 * padding)) * xRange;
      let pdf;

      if (currentDf === Infinity) {
        // 标准正态分布
        pdf = normalPDF(x);
      }
      else {
        // t分布
        pdf = tPDF(x, currentDf);
      }

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
    const currentDf = dfValues[idx];
    const style = colors[idx];

    ctx.beginPath();
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.width;
    ctx.moveTo(width - padding - 150, padding + 40 + idx * 25);
    ctx.lineTo(width - padding - 120, padding + 40 + idx * 25);
    ctx.stroke();

    ctx.fillStyle = style.color;
    ctx.font = (idx === 0) ? 'bold 14px Arial' : '14px Arial';

    let label;
    if (currentDf === Infinity) {
      label = '标准正态分布';
    }
    else if (idx === 0) {
      label = `df = ${currentDf} (当前)`;
    }
    else {
      label = `df = ${currentDf}`;
    }

    ctx.fillText(label, width - padding - 110, padding + 44 + idx * 25);
  }
}

// 更新自由度显示和图表
function updateDF(value: number): void {
  df.value = value;

  // 更新分布特性
  mean.value = 0.00;

  // 方差：df > 2时存在
  if (df.value > 2) {
    variance.value = Number.parseFloat((df.value / (df.value - 2)).toFixed(2));
  }
  else {
    variance.value = Infinity;
  }

  // 峰度：df > 4时存在
  if (df.value > 4) {
    kurtosis.value = Number.parseFloat((6 / (df.value - 4)).toFixed(2));
  }
  else {
    kurtosis.value = Infinity;
  }

  drawChart();
}

// 调整Canvas大小
function resizeCanvas(): void {
  drawChart();
}

onMounted(() => {
  updateDF(5); // 初始值
  window.addEventListener('resize', resizeCanvas);
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
            <canvas ref="canvasRef" class="w-full border rounded-md" />
            <!-- 恢复参数显示区域 -->
            <div class="grid grid-cols-2 gap-4 mt-4">
              <Card class="p-2">
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
              <Card class="p-2">
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
              <Card class="p-2">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    分布方差
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ variance === Infinity ? '∞' : variance.toFixed(2) }}
                  </p>
                </CardContent>
              </Card>
              <Card class="p-2">
                <CardHeader class="p-2 pb-0">
                  <CardTitle class="text-sm font-medium text-center">
                    分布峰度
                  </CardTitle>
                </CardHeader>
                <CardContent class="p-2 pt-0">
                  <p class="text-lg font-bold text-center">
                    {{ kurtosis === Infinity ? '∞' : kurtosis.toFixed(2) }}
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
                    <Label for="dfSlider" class="text-sm text-gray-600">调整t分布的自由度参数:</Label>
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
                    t分布特性
                  </h4>
                  <ul class="text-sm text-gray-700 space-y-1">
                    <li>t分布由自由度参数df控制，是<span class="font-semibold text-blue-700">小样本统计推断</span>的基础。</li>
                    <li>• 当<span class="font-semibold text-blue-700">df=1</span>时，分布为柯西分布</li>
                    <li>• 当<span class="font-semibold text-blue-700">df增大</span>时，分布趋近于标准正态分布</li>
                    <li>• df→∞时，t分布收敛于标准正态分布</li>
                    <li>
                      • 均值：<span class="font-semibold text-blue-700">0</span>（df&gt;1），方差：<span
                        class="font-semibold text-blue-700"
                      >df/(df-2)</span>（df&gt;2）
                    </li>
                    <li>• 峰度：<span class="font-semibold text-blue-700">6/(df-4)</span>（df&gt;4）</li>
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
      <CommentPanel exp-id="t-distribution" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
