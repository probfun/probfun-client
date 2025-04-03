<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { renderLatex, toMarkdown } from '@/utils/markdown';
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
          ctx.lineTo(startX - 12 * (2 * n.value + 1), 244 - n.value * 15);
          let fromX = startX - 12 * (2 * n.value + 1);
          let fromY = 244 - n.value * 15;

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
      else if (n.value == 9) {
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
          ctx.lineTo(startX - 15 * (2 * n.value + 1), 218 - n.value * 20);
          let fromX = startX - 15 * (2 * n.value + 1);
          let fromY = 218 - n.value * 20;
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
      else if (3 <= n.value && n.value <= 7) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 圆的半径
        const radius = 4;
        // 层与层之间的垂直间距
        const verticalSpacing = 30;
        // 水平圆之间的间距
        const horizontalSpacing = 35;
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
          ctx.moveTo(startX - 43 * (n.value - 1) / 2, 200); // 保持竖线位置与底层圆对齐
          // 绘制竖线到结束点
          ctx.lineTo(startX - 43 * (n.value - 1) / 2, 230); // 竖线长度
          // 绘制路径
          ctx.stroke();
          // 更新下一条竖线的起始 x 坐标
          startX += 43;
        }

        // 绘制小球轨迹
        if (path.value.length > 0) {
          ctx.beginPath();
          ctx.moveTo(startX - 21.5 * (2 * n.value + 1), 200 - n.value * 30);
          ctx.lineTo(startX - 21.5 * (2 * n.value + 1), 227.5 - n.value * 30);
          let fromX = startX - 21.5 * (2 * n.value + 1);
          let fromY = 227.5 - n.value * 30;
          console.log(path.value);

          for (let i = 0; i < path.value.length; i++) {
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX + path.value[i] * 21.5, fromY + 30);
            fromX = fromX + path.value[i] * 21.5;
            fromY = fromY + 30;
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
## **初始条件**
一个小球从钉板顶部的中央位置处释放，钉板上有水平排列的钉子，每排钉子均匀交错排列。
小球运动：小球在下落过程中遇到钉子时会向左或向右弹开，其概率相等，即
$$
P_左=P_右=0.5。
$$

## **最终结果**
小球经过多排钉子后会落在底部不同的槽中，形成某种特定的分布。当小球数量足够多或钉板排数足够大时，
落入每个槽中小球的数量会形成正态分布，大多数小球会集中在中间的槽中，越靠近两边的槽，小球数量越少。

## **实验分析**
假设有 n 排钉子，小球每次遇到钉子向左或向右的概率为 p=0.5。
小球最终落入某个槽的概率可以用二项分布公式表示：
$$
P(X=k)=C_n^kp^k(1-p)^{n-k}。
$$
其中 X 表示小球向左移动的次数，k 是具体的次数。

当钉板的排数 n 足够大时，根据中心极限定理，二项分布可以近似为正态分布：$$N(\\mu,\\sigma^2)。$$
其中均值 $$μ=np$$，方差 $$\\sigma^2=np(1-p)$$。
`
</script>

<template>
  <ExperimentBoard :panel-size="70">
    <template #experiment>
      <div class="flex flex-col gap-4 h-full">
        <div class="flex justify-center items-center">
          <div>
            <canvas ref="canvasRef" width="400" height="250" />
          </div>
        </div>
        <div class="flex justify-center items-center h-full">
          <Chart v-if="n <= 5" type="bar" :data="chartData" :options="chartOptions" class="h-full w-1/4" />
          <Chart v-else type="bar" :data="chartData" :options="chartOptions" class="h-full w-1/3" />
        </div>
        <div class="flex justify-center items-center">
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
                  <div v-html="renderLatex('框的数量')" />

                  <div class="max-w-xl space-y-3">
                    <InputNumber v-model="n" fluid />
                    <Slider v-model="n" :min="3" :max="15" :step="2" class="w-full" />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-8 pb-0">
                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-1">
                  <div v-html="renderLatex('球的数量(大于50时不予展示每个小球下落的路径)')" />

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
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>
