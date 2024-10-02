<script setup lang="ts">
import { clickApi } from '@/api/track/trackApi';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, registerables, Tooltip } from 'chart.js';

import { GraduationCap, Lightbulb, MessagesSquare, NotebookPen } from 'lucide-vue-next';
import { computed, defineProps, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  title: string
  tags: string[]
  discussTabList: string[]
}>();

let hasClickedStart = false;

console.log(props);

const discussTabList = [
  {
    id: 0,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,

  },
  {
    id: 1,
    label: '相关讨论',
    name: 'discuss',
    icon: Lightbulb,
  },

  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
  {
    id: 3,
    label: '拓展训练',
    name: 'exercise',
    icon: NotebookPen,
  },

];

const conclusionContent = `
### **实验思路**
$Buffon$投针问题是经典的概率问题之一，用于计算圆周率π。其基本思想是通过随机投掷针，看针与平行线是否相交，从中推导出一个与$π$相关的概率表达式。

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

### **结论**

当横线数目固定时，随着投针次数增加，针与横线相交的概率起初有较大波动；
但当投针次数达到一定值时，平均相交概率 $p_1$ 逐渐趋近于 $0.31831$。
由辛钦大数定理可知，当投针次数不断增加直至无穷时，
随机变量 $p$ 的算术平均值 $p'$ 不断趋向于其数学期望 $E(p)  0.31831$，
而 $E(p)$ 的倒数，即圆周率 $pi$ 的估计值趋近于 $3.14159$。
`;

const discussContent = `
### **相交判断**
此处将提到的三种不同的判定方式来计算针与线的相交情况。我们将分别讨论这些方法，并详细比较。

### **方法1：随机生成针的中点与角度，用积分计算**
步骤：

**1. 中点位置**：在垂直于平行线的距离范围 $[0, \\frac{d}{2}]$ 中随机生成针的中点位置，其中 $d$ 是平行线之间的间距。

**2.夹角**：针与平行线的夹角从 $[0, pi]$ 随机生成。

**3. 相交条件**：如果针的两端跨越了一条平行线，则认为针与线相交。用三角函数描述，针的半长为  $\\frac{l}{2}$ ，相交的条件是：
    $\\frac{l}{2} sin(θ) ≥ x$
   其中 $x$ 是针的中点到最近的平行线的距离，$θ$ 是针与平行线的夹角。

理解：
此方法通过将中点和夹角的随机分布作为独立变量，构造出针的位置和方向。最终相交的概率可以通过在$[0, \\frac{d}{2}]$ 和 $[0, pi]$ 范围上进行积分得到。积分公式表达如下：
$
P = \\frac{2l}{dπ}
$



### **方法2：随机生成针的起点和夹角，通过计算结束点判断**
步骤：

**1.起点坐标**：随机生成针的起点的横坐标和纵坐标。

**2. 夹角**：在  $[0, pi]$ 范围内随机生成针与水平线的夹角。

**3. 终点计算**：使用三角函数计算针的终点坐标。设针的长度为 $l$，起点坐标为 $P(x)$，针的夹角为 $θ$，终点坐标 $\Q(x_1, y_1)$ 可以通过以下公式计算：

$
   x_1 = x_0 + l \\cdot cos(θ)
   $，
   $
   y_1 = y_0 + l \\cdot sin(θ)
  $

**4. 相交判定**：如果针的起点和终点处于两条平行线之间，则认为针与线相交。

理解：
这种方法强调针的起点和终点的坐标生成，通过几何计算可以准确确定针是否跨越了某条平行线。与方法1不同的是，这里直接通过针的实际位置（起点和终点）来计算。



### **方法3：针的两端$P$、$Q$都在直线的同一半平面内则不相交**
步骤：

**1. 两端点在半平面内的判断**：针的两端点 $P$ 和 $Q$ 若都在某一平行线的同一侧（同一半平面内），则针不与这条线相交。具体判断是通过检查针的端点是否落在平行线的两侧。

**2. 相交条件**：如果 $P$ 和 $Q$ 处于平行线的两侧，则针与平行线相交；否则，不相交。


理解：
该方法的核心思想是用几何的半平面概念来判断针是否相交平行线。如果针的两端位于不同半平面，则相交。此方法是几何上比较简化的方式，因为只需要判断针的两个端点的相对位置。


---



`
  ;

const discussContentt = `
### **抛针？抛圆环？Barbier的巧妙证明**

抛一根任意的针，可长可短，则产生的交点数的数学期望是：$E = p_1 +2 p_2 + 3 p_3+···$，其中$p_1$是针落下后刚好有$1$个交点的概率，$p3$是刚好有$3$个交点的概率，
是刚好有$3$个交点的概率，等等。 蒲丰问题所问的是得到至少一个交点的概率： $E = p_1 + p_2 +  p_3+···$(针恰好落在某横线之上的事件，以及一个端点在某横线上的事件的概率都是
 ，所以在我们的讨论中将它们忽略不计)。
如果针是短的，则得到多于一个交点的概率为零，$p_1 = p_2 = p_3 = ··· = 0$ ，则有$E = p$,即所求的概率正是交点数的期望。如此表述极为重要，因为我们就可以用到期望的线性性了。

事实上，记抛掷一根长为$l$的针所产生的交点数的期望为$E(l)$。若 $l = x + y$，则可考虑长为$x$的“前端”，与长为$y$的“后端”，因为交点数总是恰好等于前端产生的那些加上后端产生的那些，所以可得：$E(x+y) = E(x)+ E(y)$ 。
这个函数方程就是大名鼎鼎的$Cauchy$方程(柯西方程)。因此该方程的解为 $E(x) = cx$
 ，其中$c = E(1)$是一个常数，那么在当下情况这个常数是什么呢?

 为此我们用一些不同形状的针。事实上，让我们抛一根“多边形”的针；它包含几个直线段，总长度也是$l$，那么其产生的交点数(以 $1$
 的概率)就是各个直线段产生的交点数之和。所以，由期望的线性性交点数的期望再次有： $E = cl$
 (直线段的组合方式规则或者不规则并不重要！)。

 $Barbier$解决$Buffon$投针问题的关键是考察了一根直径为 $d$
 ，即长度为 $x = dπ$
 的圆形针 $C$。 这样一根针如果掷到横纹纸上会产生刚好两个交点，且总是如此。
 这个圆可以由多边形逼近。想象一下，在抛圆针 $C$
 的同时我们抛一个内接的多边形针 $P_n$
 ，以及一个外切的多边形针 $P^n$
 . 每条与$P_n$
 相交的横线也必与 $C$
 相交，同时若横线与 $C$
 相交也必与  $P^n$
 相交。
 因此，交点数的期望满足： $E(P_n)≤E(C)≤E(P^n)$。
 现在 $P_n$
 和  $P^n$
 都是多边形，故两者交点数的期望都是“ $c$
 倍的长度”，对
 的期望则是 $2$
 ，代回上式得到：$cl(P_n)≤2≤cl(P^n)$。
 当 $n→∞$
 ， $P_n$
 和 $P^n$
 都逼近 $C$
 。特别地，$lim_{n→∞}l(P_n)≤dπ≤lim_{n→∞}l(P^n)$。于是当$n→∞$,由$cl(P_n)≤2≤cl(P^n)$得：$cdπ≤2≤cdπ$,从而：$c = \\frac{2}{π} \\cdot \\frac{1}{d}$

**拓展：把投掷细针改为规则的三角形，也可以由该实验得到π的近似值。此外利用坐标系变换、几何概率方法，通过计算向矩阵网格上随机投掷椭圆，该椭圆恰好包含在某个矩阵中的概率并将结果拓展到了平行四边形网格的情形下也可以计算获得π。同学们可以自己尝试推论，此处不多赘述。**
`;

const isSimulating = ref(false);

async function resetData() {
  try {
    await clickApi('CLICK', 'button', '重置数据', window.location.href);
    console.log('重置数据');
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
  // hits.value = 0;
  // estimatedPi.value = 0;
  // historyEstimatedPi.value = [];
}

async function startSimulate() {
  if (!isSimulating.value && !hasClickedStart) {
    hasClickedStart = true;
    try {
      await clickApi('CLICK', 'button', '自动模拟', window.location.href);
      console.log('自动模拟');
    }
    catch (error) {
      console.error('Error tracking button click:', error);
    }
  }

  isSimulating.value = true;
  while (true) {
    if (!isSimulating.value) {
      break;
    }
    await addNeedles();
  }
  hasClickedStart = false;
}

async function endSimulate() {
  try {
    await clickApi('CLICK', 'button', '停止模拟', window.location.href);
    console.log('停止模拟');
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
  isSimulating.value = false;
}

const container = ref<HTMLDivElement | null>(null);
const needleAmount = ref(1000);
const hits = ref(0);
const estimatedPi = ref(0);
const historyEstimatedPi = ref<number[]>([]);

const documentStyle = getComputedStyle(document.documentElement);

const chartData = computed(() => {
  const kValues = Array.from({ length: historyEstimatedPi.value.length }, (_, i) => i + 1);

  // let sum = 0;
  // const cnt = 0;
  // for (let i = 0; i < historyEstimatedPi.value.length; i++) {
  //   if (Number.isFinite(historyEstimatedPi.value[i])) {
  //     sum += historyEstimatedPi.value[i];
  //   }
  // }

  return ({
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
        label: 'Pi = 3.14152', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 3.14152 : 3.14152), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },

    ],
  });
});

const chartDataAver = computed(() => {
  const kValues = Array.from({ length: historyEstimatedPi.value.length }, (_, i) => i + 1);
  const averagePi = [];
  let sum = 0;
  let cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      averagePi[i] = sum / ++cnt;
    }
  }

  return ({
    labels: kValues,
    datasets: [
      {
        label: '平均估算的 Pi 值',
        data: averagePi,
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // 蓝色
        tension: 0.4,
      },
      {
        label: 'Pi = 3.14152', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 3.14152 : 3.14152), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
});
// import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(...registerables);
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

const textColor = documentStyle.getPropertyValue('--p-text-color');
const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

const chartOptions = ref({
  animation: {
    duration: 0, // 禁用所有动画效果
  },
  maintainAspectRatio: false,
  aspectRatio: 0.6,
  plugins: {
    legend: {
      labels: {
        color: textColor,
      },
    },
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 3.14152,
          yMax: 3.14152,
          borderColor: 'orange', // 橘红色
          borderWidth: 2,
          borderDash: [10, 5], // 虚线样式
          label: {
            content: 'π ≈ 3.14152',
            position: 'top',
            backgroundColor: 'orange',
            color: 'black',
            padding: 4,
          },
        },
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
});

const isCalculating = ref(false);

const canvas = ref<HTMLCanvasElement | null>(null);

const needleLength = ref(30); // 默认针的长度
const floorLineSpacing = ref(60); // 默认线的间距

function runSimulation() {
  if (!canvas.value)
    return;
  const ctx = canvas.value.getContext('2d');
  if (!ctx)
    return;
  hits.value = 0;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.strokeStyle = 'black';
  for (let y = floorLineSpacing.value; y < canvas.value.height; y += floorLineSpacing.value) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.value.width, y);
    ctx.stroke();
  }

  for (let i = 0; i < needleAmount.value; i++) {
    const xCenter = Math.random() * canvas.value.width;
    const yCenter = Math.random() * canvas.value.height;
    const theta = Math.random() * Math.PI;
    const x1 = xCenter - (needleLength.value / 2) * Math.cos(theta);
    const x2 = xCenter + (needleLength.value / 2) * Math.cos(theta);
    const y1 = yCenter - (needleLength.value / 2) * Math.sin(theta);
    const y2 = yCenter + (needleLength.value / 2) * Math.sin(theta);

    // 检查是否与线相交
    if (Math.floor(y1 / floorLineSpacing.value) !== Math.floor(y2 / floorLineSpacing.value)) {
      hits.value++;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'red';
      ctx.stroke();
    }
    else {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = 'blue';
      ctx.stroke();
    }
  }

  estimatedPi.value = (2 * needleLength.value * needleAmount.value) / (hits.value * floorLineSpacing.value);
  historyEstimatedPi.value = historyEstimatedPi.value.concat(estimatedPi.value);
}

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
    // addNeedles();
  }
}

function getAverageEstimatedPi() {
  if (historyEstimatedPi.value.length === 0)
    return 0; // 防止数组为空时出现除以零的情况
  let sum = 0;
  let cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      ++cnt;
    }
  }
  return sum / cnt;
}

let running = false;
async function addNeedles() {
  if (!hasClickedStart) {
    try {
      await clickApi('CLICK', 'button', '抛针', window.location.href);
      console.log('抛针');
    }
    catch (error) {
      console.error('Error tracking button click:', error);
    }
  }
  if (running)
    return;
  running = true;
  runSimulation();
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
  running = false;
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

<template>
  <ExperimentBoard title="Buffon投针" :tags="['辛钦大数定律', '蒙特卡罗方法']" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div ref="container" class="h-full overflow-hidden">
        <div class="bg-background">
          <canvas ref="canvas" class="w-full h-full" />
        </div>
        <!-- wait 1 sec -->
      </div>
    </template>

    <template #parameter>
      <div class="flex w-full h-full">
        <div class="w-1/3 flex flex-col items-start p-4">
          <div class="flex items-center mb-4 w-full">
            <label for="floorLineSpacing" class="text-left w-1/2 font-bold">针的长度</label>
            <Input
              id="needleLength" v-model="needleLength" type="number" class="w-1/2 border p-2 rounded-lg" min="20"
              max="40" @input="runSimulation"
            />
          </div>
          <div class="flex items-center mb-4 w-full">
            <label for="floorLineSpacing" class="text-left w-1/2 font-bold">线的间距</label>
            <Input
              id="floorLineSpacing" v-model="floorLineSpacing" type="number" class="w-1/2 border p-2 rounded-lg"
              min="20" max="80" @input="runSimulation"
            />
          </div>

          <div class="flex items-center mb-4 w-full">
            <label for="needleAmount" class="text-left w-1/2 font-bold">抛针数量</label>
            <Input
              id="needleAmount" v-model="needleAmount" type="number" class="w-1/2 border p-2 rounded-lg"
              :max="5000"
            />
          </div>

          <div class="flex justify-between gap-4  mb-6 w-full">
            <Button class="flex-1" :disabled="isCalculating || isSimulating" @click="addNeedles">
              抛针
            </Button>
            <Button class="flex-1 gap-3" @click="isSimulating ? endSimulate() : startSimulate()">
              {{ isSimulating ? '停止模拟' : '自动模拟' }}
            </Button>
          </div>
          <div class="flex flex-col w-full gap-3">
            <Label class="mb-2 font-bold">实验结果:</Label>
            <div class="text-start w-full flex flex-col mb-4">
              <Label>和线相交的针的数量：{{ hits }}</Label>
              <div>
                <Label class="text-start w-full h-full py-5">
                  <p class="mb-1">估算的 Pi 值:</p>
                  <div
                    class="prose w-full text-base-content"
                    v-html="toMarkdown(`$\\pi = \\frac{2l}{Pd} = $ ${estimatedPi.toFixed(5)}`)"
                  />
                </Label>
                <Label>历史估算 Pi 值的平均值：{{ getAverageEstimatedPi().toFixed(5) }}</Label>
              </div>
            </div>
          </div>
        </div>

        <!-- 右边部分：图表 -->
        <div class="w-2/3 flex flex-col items-center p-4">
          <div class="flex-1 flex flex-col items-center justify-center w-full">
            <chart type="line" :data="chartData" class="flex-1 w-full" :options="chartOptions" />
            <chart type="line" :data="chartDataAver" class="flex-1 w-full" :options="chartOptions" />

            <Button class="mt-3" @click="resetData">
              重置数据
            </Button>
          </div>
        </div>
        <!-- <div>
          <div class="flex items-center mb-4">
            <label for="needleLength" class="text-left w-1/3 font-bold">针的长度</label>
            <input
              type="number"
              id="needleLength"
              v-model="needleLength"
              class="w-2/3 border p-2 rounded-lg"
              min="20"
              max="40"
              @input="runSimulation"
            />
          </div>

          <div class="flex items-center mb-4">
            <label for="floorLineSpacing" class="text-left w-1/3 font-bold">线的间距</label>
            <input
              type="number"
              id="floorLineSpacing"
              v-model="floorLineSpacing"
              class="w-2/3 border p-2 rounded-lg"
              min="20"
              max="80"
              @input="runSimulation"
            />
          </div>

          <div class="flex items-center mb-4">
            <label for="needleAmount" class="text-left w-1/3 font-bold">抛针数量</label>
            <input
              type="number"
              id="needleAmount"
              v-model="needleAmount"
              class="w-2/3 border p-2 rounded-lg"
              :max="5000"
            />
          </div>

          <div class="flex justify-between gap-2 w-full">
            <Button
              class="flex-1"
              @click="addNeedles"
              :disabled="isCalculating || isSimulating"
            >
              抛针
            </Button>
            <Button
              class="flex-1"
              @click="isSimulating ? endSimulate() : startSimulate()"
            >
              {{ isSimulating ? '停止模拟' : '自动模拟' }}
            </Button>
          </div>
        </div>

        <div class="mt-5 flex flex-col">
          <Label class="mb-2 font-bold">实验结果:</Label>
          <div class="text-start w-full flex flex-col">
            <Label>和线相交的针的数量：{{ hits }}</Label>
            <div>
              <Label class="text-start w-full h-full py-5">
                <p class="mb-1">估算的 Pi 值:</p>
                <div
                  v-html="toMarkdown(`$\\pi = \\frac{2l}{Pd} = $ ${estimatedPi.toFixed(5)}`)"
                  class="prose w-full text-base-content"
                ></div>
              </Label>
              <Label>历史估算 Pi 值的平均值：{{ getAverageEstimatedPi().toFixed(5) }}</Label>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col items-center justify-center">
          <chart type="line" :data="chartData" class="flex-1 w-full" :options="chartOptions" />
          <Button @click="resetData" class="mt-3">重置数据</Button>
        </div> -->
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(conclusionContent)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="12345" />
    </template>

    <template #discuss>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(discussContent)" />
        <table class="mb-5">
          <thead>
            <tr>
              <th>方法</th>
              <th>优点</th>
              <th>缺点</th>
              <th>适用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>方法1</strong></td>
              <td>数学上严密，形式上直观，尤其是通过概率密度函数和积分可以清晰地描述针与线相交的概率从而推导出π的表达式</td>
              <td>理论上复杂，实际操作时需要积分</td>
              <td>适合理论分析或推导π的公式</td>
            </tr>
            <tr>
              <td><strong>方法2</strong></td>
              <td>通过起点、角度生成终点，几何描述清晰直观</td>
              <td>计算量大，特别是每次都要生成起点和终点</td>
              <td>适合模拟或者编程实现复杂的几何问题</td>
            </tr>
            <tr>
              <td><strong>方法3</strong></td>
              <td>仅需检查两端点是否位于同一半平面，算法简洁，计算量较小，几何描述清晰直观</td>
              <td>不容易直接推导出π的表达式</td>
              <td>适合需要简化计算或者快速判断相交情况的场景，但不利于进一步推导π的公式</td>
            </tr>
          </tbody>
        </table>
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(discussContentt)" />
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
