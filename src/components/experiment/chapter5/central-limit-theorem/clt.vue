<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import { Button } from '@/components/ui/button';
import { toMarkdown } from '@/utils/markdown';
import Chart from 'primevue/chart';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { onMounted, ref, watch } from 'vue';
import ExperimentBoard from '../../ExperimentBoard.vue';

const n = ref(3); // 框的数量
const ball = ref(10); // 球的数量
const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartData = ref();
const chartOptions = ref();
const binCounts = ref<number[]>([]);
const path = ref<number[]>([]);
let isSimulating = false;

function setChartData() {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: Array.from({ length: n.value }, (_, i) => i + 1),
    datasets: [
      {
        type: 'line',
        label: '近似曲线',
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        data: binCounts,
      },
      {
        type: 'bar',
        label: '每个框中球的数量',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: binCounts,
      },
    ],
  };
}
function setChartOptions() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
}

function drawBoard() {
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (n.value >= 11) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 圆的半径
        const radius = 2;
        // 层与层之间的垂直间距
        const verticalSpacing = 15;
        // 水平圆之间的间距
        const horizontalSpacing = 20;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // 每层圆的数量
        const circlesPerLayer = [];
        for (let i = 0; i < n.value; i++) {
          circlesPerLayer.push(n.value - i + 1);
        }

        // 起始 y 坐标
        let y = canvas.height - radius - 20;
        let bottomLayerStartX = 0; // 最下面一层的起始 x 坐标
        circlesPerLayer.forEach((count, layerIndex) => {
          // 计算该层圆的总宽度（包含间距）
          const totalWidth = (count - 1) * (2 * radius + horizontalSpacing);
          // 计算该层第一个圆的起始 x 坐标
          const layerStartX = (canvas.width - totalWidth) / 2;

          if (layerIndex === circlesPerLayer.length - 1) {
            // 保存最下面一层的起始 x 坐标
            bottomLayerStartX = layerStartX;
          }

          for (let i = 0; i < count; i++) {
            // 计算当前圆的 x 坐标，考虑水平间距
            const x = layerStartX + i * (2 * radius + horizontalSpacing);

            // 开始绘制路径
            ctx.beginPath();
            // 绘制圆
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            // 设置填充颜色
            ctx.fillStyle = 'black';
            // 填充圆
            ctx.fill();
            // 设置边框颜色
            ctx.strokeStyle = 'black';
            // 设置边框宽度
            ctx.lineWidth = 2;
            // 绘制边框
            ctx.stroke();
          }

          // 更新 y 坐标到下一层
          y -= verticalSpacing;
        });

        // 绘制竖线：保持竖线数量不变
        let startX = bottomLayerStartX;
        for (let i = 0; i < n.value + 1; i++) {
          // 开始一条新路径
          ctx.beginPath();
          // 移动到竖线的起始点
          ctx.moveTo(startX - 24 * (n.value - 1) / 2, 230); // 保持竖线位置与底层圆对齐
          // 绘制竖线到结束点
          ctx.lineTo(startX - 24 * (n.value - 1) / 2, 250); // 竖线长度
          // 绘制路径
          ctx.stroke();
          // 更新下一条竖线的起始 x 坐标
          startX += 24;
        }

        // 绘制小球轨迹
        if (path.value.length > 0) {
          ctx.beginPath();
          ctx.moveTo(startX - 12 * (2 * n.value + 1), 230 - n.value * 15);
          ctx.lineTo(startX - 12 * (2 * n.value + 1), 258 - n.value * 15);
          let fromX = startX - 12 * (2 * n.value + 1);
          let fromY = 258 - n.value * 15;
          console.log(path.value);

          for (let i = 0; i < path.value.length; i++) {
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX + path.value[i] * 12, fromY + 15);
            fromX = fromX + path.value[i] * 12;
            fromY = fromY + 15;
          }
          ctx.strokeStyle = 'blue'; // 设置轨迹颜色
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        path.value = []
      }
      else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 圆的半径
        const radius = 3;
        // 层与层之间的垂直间距
        const verticalSpacing = 20;
        // 水平圆之间的间距
        const horizontalSpacing = 24;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // 每层圆的数量
        const circlesPerLayer = [];
        for (let i = 0; i < n.value; i++) {
          circlesPerLayer.push(n.value - i + 1);
        }

        // 起始 y 坐标
        let y = canvas.height - radius - 50;
        let bottomLayerStartX = 0; // 最下面一层的起始 x 坐标
        circlesPerLayer.forEach((count, layerIndex) => {
          // 计算该层圆的总宽度（包含间距）
          const totalWidth = (count - 1) * (2 * radius + horizontalSpacing);
          // 计算该层第一个圆的起始 x 坐标
          const layerStartX = (canvas.width - totalWidth) / 2;

          if (layerIndex === circlesPerLayer.length - 1) {
            // 保存最下面一层的起始 x 坐标
            bottomLayerStartX = layerStartX;
          }

          for (let i = 0; i < count; i++) {
            // 计算当前圆的 x 坐标，考虑水平间距
            const x = layerStartX + i * (2 * radius + horizontalSpacing);

            // 开始绘制路径
            ctx.beginPath();
            // 绘制圆
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            // 设置填充颜色
            ctx.fillStyle = 'black';
            // 填充圆
            ctx.fill();
            // 设置边框颜色
            ctx.strokeStyle = 'black';
            // 设置边框宽度
            ctx.lineWidth = 2;
            // 绘制边框
            ctx.stroke();
          }

          // 更新 y 坐标到下一层
          y -= verticalSpacing;
        });

        // 绘制竖线：保持竖线数量不变
        let startX = bottomLayerStartX;
        for (let i = 0; i < n.value + 1; i++) {
          // 开始一条新路径
          ctx.beginPath();
          // 移动到竖线的起始点
          ctx.moveTo(startX - 30 * (n.value - 1) / 2, 200); // 保持竖线位置与底层圆对齐
          // 绘制竖线到结束点
          ctx.lineTo(startX - 30 * (n.value - 1) / 2, 230); // 竖线长度
          // 绘制路径
          ctx.stroke();
          // 更新下一条竖线的起始 x 坐标
          startX += 30;
        }

        // 绘制小球轨迹
        if (path.value.length > 0) {
          ctx.beginPath();
          ctx.moveTo(startX - 15 * (2 * n.value + 1), 200 - n.value * 20);
          ctx.lineTo(startX - 15 * (2 * n.value + 1), 238 - n.value * 20);
          let fromX = startX - 15 * (2 * n.value + 1);
          let fromY = 238 - n.value * 20;
          console.log(path.value);

          for (let i = 0; i < path.value.length; i++) {
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX + path.value[i] * 15, fromY + 20);
            fromX = fromX + path.value[i] * 15;
            fromY = fromY + 20;
          }
          ctx.strokeStyle = 'blue'; // 设置轨迹颜色
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        path.value = []
      }
    }
  }
}

async function startSimulation() {
  isSimulating = true
  binCounts.value = Array.from({ length: n.value }).fill(0) as number[];
  for (let i = 0; i < ball.value; i++) {
    if (!isSimulating) {
      break;
    }
    path.value = [];
    let position = 0;
    for (let j = 0; j < n.value - 1; j++) {
      const prob = Math.random();
      if (prob < 0.5) {
        position -= 1;
        path.value.push(-1)
      }
      else {
        position += 1;
        path.value.push(1);
      }
    }
    drawBoard();
    binCounts.value[Math.floor(n.value / 2) + position / 2]++;
    if (ball.value <= 50) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  if (isSimulating) {
    chartData.value = setChartData();
  }
  isSimulating = false;
}

function stopSimulation() {
  isSimulating = false;
}

onMounted(() => {
  drawBoard();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
watch([n, ball], () => {
  drawBoard();
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const content = `
## **概述**
中心极限定理$（Central Limit Theorem, CLT）$是统计学中最重要的定理之一，它描述了在一定条件下，随机变量的均值分布趋近于正态分布。简单来说，中心极限定理表明，无论原始数据分布如何，只要样本容量足够大，样本均值的分布就会接近正态分布。这一性质的应用非常广泛，从参数估计、假设检验到金融建模、质量控制等多个领域都发挥着重要作用。通过中心极限定理，我们能够处理各种复杂的实际问题，尤其是当我们面对大量数据时，能够应用正态分布来进行近似推理和决策。
## **定义**
中心极限定理的正式定义如下：

假设我们有一组独立同分布（i.i.d.）的随机变量$X_1,X_2,...X_N$,它们的均值为$μ$和方差为$σ²$。对于大样本量$n$，我们定义样本均值：
$$
 \\bar{X}_n = \\frac{1}{n} \\sum_{i=1}^{n} X_i

$$
根据中心极限定理，当$n$足够大时，样本均值 $\\bar{X}_n$的分布将趋近于一个正态分布，即：
$$
\\bar{X}_n \\sim N(μ， \\frac{σ²}{n})
$$
即，样本均值的分布逼近于均值$μ$和方差$\\frac{σ²}{n}$的正态分布。这个结果表明，无论原始数据的分布是什么样的，只要样本足够大，样本均值的分布都会近似为正态分布。

## **特点**
- **1.原始数据分布无关**：中心极限定理的重要特点是无论原始数据的分布是什么样的（如均匀分布、二项分布等），只要数据是独立同分布的，样本均值的分布都会趋近于正态分布。
- **2.大样本性**：为了保证中心极限定理的适用性，样本容量$n$需要足够大。通常来说，样本量$n ≥ 30$被认为是足够大的，尽管实际情况可能根据数据分布的偏态性有所不同。
- **3.均值和方差**：随着样本量$n$的增加，样本均值的分布的方差$\\frac{σ²}{n}$会逐渐减小。这意味着样本均值会越来越集中在总体均值附近，减少波动。
- **4.渐进性质**：随着样本量的增大，样本均值的分布趋近于正态分布，但对于有限样本，样本均值的分布可能会有轻微的偏差。因此，中心极限定理适用于大样本量的情况。
- **5.标准化**：通过标准化样本均值（即减去均值并除以标准差），我们可以得到标准正态分布，即$Z = \\frac{\\bar{X}_n - μ}{σ/n^{1/2}}$将服从标准正态分布$N(0,1)$。

## **具体应用拓展**
中心极限定理在多个领域具有广泛应用。
- **参数估计**：通过**样本均值估计总体均值**，支持有效的统计推断；
- **假设检验**：保证了大样本均值趋近正态分布，使得**t检验、z检验**等方法有效；
- **金融建模**：利用样本均值的正态分布特性进行投资组合的风险评估和收益预测；
- **质量控制**：通过样本均值判断生产过程是否正常，估计产品质量波动；
- **大数据分析**：提供了对大规模数据集的近似处理方法，支持**回归分析、聚类分析**等；
- **模拟实验**：如通过**蒙特卡洛模拟验证**样本均值分布趋向正态分布。

`
</script>

<template>
  <ExperimentBoard :panel-size="70">
    <template #experiment>
      <div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <canvas ref="canvasRef" width="400" height="250" />
          </div>
          <div>
            <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full" />
          </div>
        </div>
        <div class="flex justify-center items-center mt-5">
          <Button class="m-1" @click="startSimulation()">
            开始模拟
          </Button>
          <Button class="m-1" @click="stopSimulation()">
            停止模拟
          </Button>
        </div>
      </div>
    </template>
    <template #parameter>
      <div class="w-full h-full p-3">
        <Card class="h-full w-full cardflex-1 flex flex-col overflow-y-auto">
          <CardHeader>
            <CardTitle>参数调整</CardTitle>
          </CardHeader>
          <CardContent class=" flex flex-col justify-center items-center gap-3">
            <div class="grid grid-cols-2 gap-10">
              <div class="flex flex-col gap-8 pb-0">
                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-1">
                  <Label>框的数量</Label>
                  <div class="max-w-xl space-y-3">
                    <InputNumber v-model="n" fluid />
                    <Slider v-model="n" :min="3" :max="15" :step="2" class="w-full" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-8 pb-0">
                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-1">
                  <Label>球的数量(大于50时不予展示每个小球下落的路径)</Label>
                  <div class="max-w-xl space-y-3">
                    <InputNumber v-model="ball" fluid />
                    <Slider v-model="ball" :min="5" :max="1000" :step="5" class="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="centralLimitTheorem" />
    </template>
  </ExperimentBoard>
</template>
