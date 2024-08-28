<template>
  <experiment-board title="Buffon投针" :tags="['辛钦大数定律', '蒙特卡罗方法']">
    <template #experiment>
      <div ref="container" class="h-full">
        <div class="bg-blue-900">
          <canvas ref="canvas" class="w-full" height="400"></canvas>
        </div>
      </div>
    </template>

    <template #argument>
      <div class="w-full h-full flex justify-center items-center space-x-3">
        <div class="flex flex-col items-center flex-1">
          <div class="flex w-full justify-center space-x-3 mb-2">
            <FloatLabel>
              <InputNumber class="w-24" v-model.number="needleAmount" :max="5000" />
              <label for="username">抛针数量</label>
            </FloatLabel>
            <Button label="抛针" @click="addNeedles" :disabled="isCalculating || isSimulating" />
            <Button :label="isSimulating ? '停止模拟' : '自动模拟'" @click="isSimulating ? endSimulate() : startSimulate()" />
          </div>
          <div class="text-start">
            <div > 和线相交的针的数量：{{ hits }} </div>
            <div> 估算的 Pi 值：{{ estimatedPi.toFixed(5) }} </div>
            <div> 历史估算 Pi 值的平均值：{{ getAverageEstimatedPi().toFixed(5) }}</div>
          </div>
        </div>
        <div class="flex-1 h-full flex items-center">
          <chart type="line" :data="chartData" class="w-full" :height="200" :options="chartOptions" />
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div v-html="toMarkdown(content)" class="prose max-w-full text-base-content"> </div>
      </div>
    </template>
  </experiment-board>
</template>

<script setup lang="ts">
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";
import {ref, onMounted, onBeforeUnmount, watch, computed, onUnmounted} from 'vue';
import {toMarkdown} from "@/utils/markdown";

const content = `
### 实验思路
在平面上有彼此相距为 $d$ 的平行线，向此平面任意投一长度为 $l$ 的针，假定 $l \\leq d$（本实验中 $l = \\frac{d}{2}$），则所投的针至多可与一条直线相交。

在每次实验中，随机投掷 $N$ 根针。运用两组均匀分布，一组为 $U \\sim (0, d)$ 随机生成针中心到平行线的距离 $y_{\\text{center}}$，
一组为 $U \\sim (0, \\pi)$ 随机生成针与平行线的夹角 $\\theta$。
根据针的中心位置和角度，计算针两个端点的纵坐标 $y_1$ 和 $y_2$。
通过检查针的端点是否与间距为 $d$ 的平行线相交，统计相交事件的次数 $n$，
通过 $\\frac{2lN}{dn}$ 来估计 $\\pi$ 的值。

针与线相交的概率：$P = \\frac{2l}{\\pi d} \\approx \\frac{n}{N}$

$$
\\pi = \\frac{2l}{Pd}
$$

$$
\\pi \\text{估计值} \\approx \\frac{2lN}{dn}
$$

### 结论

当横线数目固定时，随着投针次数增加，针与横线相交的概率起初有较大波动；
但当投针次数达到一定值时，平均相交概率 $p_1$ 逐渐趋近于 $0.31831$。
由辛钦大数定理可知，当投针次数不断增加直至无穷时，
随机变量 $p$ 的算术平均值 $\\\\bar{p}$ 不断趋向于其数学期望 $E(p) \\\\approx 0.31831$，
而 $E(p)$ 的倒数，即圆周率 $\\\\pi$ 的估计值趋近于 $3.14159$。
`;

const isSimulating = ref(false);

async function startSimulate() {
  console.log('start');
  isSimulating.value = true;
  while (true) {
    if (!isSimulating.value) {
      break;
    }
    await addNeedles();
  }
}

function endSimulate() {
  isSimulating.value = false;
}

const container = ref<HTMLDivElement | null>(null);
let needleAmount = ref(1000);
const hits = ref(0);
const estimatedPi = ref(0);
const historyEstimatedPi = ref<number[]>([]);

const chartData = computed(() => {
  const kValues = Array.from({ length: historyEstimatedPi.value.length }, (_, i) => i + 1);
  const averagePi = [];
  let sum = 0, cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      averagePi[i] = sum / ++cnt;
    }
  }

  return({
    labels: kValues,
    datasets: [
      {
        label: '估算的 Pi 值',
        data: historyEstimatedPi.value,
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // 浅绿色
        tension: 0.4,
      },
      {
        label: '平均估算的 Pi 值',
        data: averagePi,
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // 蓝色
        tension: 0.4,
      }
    ],
  });
});

const documentStyle = getComputedStyle(document.documentElement);
const textColor = documentStyle.getPropertyValue('--p-text-color');
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

const chartOptions = ref({
  animation: {
    duration: 0 // 禁用所有动画效果
  },
  maintainAspectRatio: false,
  responsive: false,
  aspectRatio: 0.6,
  plugins: {
    legend: {
      labels: {
        color: textColor
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder
      }
    },
    y: {
      ticks: {
        color: textColorSecondary
      },
      grid: {
        color: surfaceBorder
      },
    }
  }
});

const isCalculating = ref(false);

const canvas = ref<HTMLCanvasElement | null>(null);

function runSimulation() {
  const needleLength = 30;
  const floorLineSpacing = 60;
  if (!canvas.value) return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx) return;
  hits.value = 0;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.strokeStyle = 'white';
  for (let y = floorLineSpacing; y < canvas.value.height; y += floorLineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.value.width, y);
    ctx.stroke();
  }
  for (let i = 0; i < needleAmount.value; i++) {
    const xCenter = Math.random() * canvas.value.width;
    const yCenter = Math.random() * canvas.value.height;
    const theta = Math.random() * Math.PI;
    const x1 = xCenter - (needleLength / 2) * Math.cos(theta);
    const x2 = xCenter + (needleLength / 2) * Math.cos(theta);
    const y1 = yCenter - (needleLength / 2) * Math.sin(theta);
    const y2 = yCenter + (needleLength / 2) * Math.sin(theta);


    // 检查是否与线相交
    if (Math.floor(y1 / floorLineSpacing) !== Math.floor(y2 / floorLineSpacing)) {
      hits.value++;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'red';
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'yellow';
      ctx.stroke();
    }
  }

  estimatedPi.value = (2 * needleLength * needleAmount.value) / (hits.value * floorLineSpacing);
  historyEstimatedPi.value = historyEstimatedPi.value.concat(estimatedPi.value);

}

const width = ref(0);
const height = ref(0);

function resizeUpdate() {
  if (container.value) {
    console.log('ok');
    width.value = container.value.clientWidth;
    height.value = container.value.clientHeight;

    const ratio = window.devicePixelRatio || 1;

    if (canvas.value?.width !== width.value * ratio || canvas.value?.height !== height.value * ratio) {
      canvas.value!.width = width.value * ratio;
      canvas.value!.height = height.value * ratio;
      const ctx = canvas.value?.getContext('2d');
      ctx?.scale(ratio, ratio);
    }

  }
}

function getAverageEstimatedPi() {
  if (historyEstimatedPi.value.length === 0) return 0; // 防止数组为空时出现除以零的情况
  let sum = 0, cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      ++cnt;
    }
  }
  return sum / cnt;
}

async function addNeedles() {
  runSimulation();
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
}

const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  if (container.value) {
    resizeObserver.value = new ResizeObserver(resizeUpdate);
    resizeObserver.value.observe(container.value);
  }
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

</script>

<style scoped>

</style>
