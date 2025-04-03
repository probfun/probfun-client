<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';
import { onMounted, ref, watch } from 'vue';
import { conclusionContent } from './content';

import diameterMidpointGif from '/public/Bertrand/diameter_midpoint.gif';
import randomEndpointGif from '/public/Bertrand/random_endpoint.gif';
import randomMidpointGif from '/public/Bertrand/random_midpoint.gif';

// 用于控制模拟开始与否
// const simulateGame = ref(false);
const autoGaming = ref(false);

// 定义弦端点对象的类型
interface ChordEndPoints {
  x1: number
  y1: number
  x2: number
  y2: number
}

// 创建响应式的弦端点对象和颜色对象
const chord1 = ref<ChordEndPoints>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord1Color = ref<string>('blue');

// 记录生成弦的总数
const totalChords = ref(0);
// 记录长度大于根号三的弦的数量
const longChords = ref(0);
// 记录占比
const longChordRatio = ref(0);

/**
 * 在单位圆上随机生成一个点
 * @returns 包含该点横、纵坐标的数组
 */
function generatePointOnUnitCircle(): [number, number] {
  // 生成 0 到 2π 之间的随机极角
  const theta = Math.random() * 2 * Math.PI;
  // 根据三角函数计算单位圆上点的坐标
  const x = Math.cos(theta);
  const y = Math.sin(theta);
  return [x, y];
}

/**
 * 计算两点之间的弦长
 * @param p1 第一个点的坐标 [x1, y1]
 * @param p2 第二个点的坐标 [x2, y2]
 * @returns 弦长
 */
function calculateChordLength(p1: [number, number], p2: [number, number]): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  // 根据两点间距离公式计算弦长
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

/**
 * 生成圆上的随机端点并更新弦的信息
 */
function generateRandomEndPoints() {
  // 生成两个单位圆上的随机点
  const point1 = generatePointOnUnitCircle();
  const point2 = generatePointOnUnitCircle();

  // 更新弦的端点坐标
  chord1.value = {
    x1: point1[0],
    y1: point1[1],
    x2: point2[0],
    y2: point2[1],
  };

  console.log('chord1:', chord1.value); // 输出弦的坐标，检查是否更新
  console.log(`line 1: x1=${chord1.value.x1}, y1=${chord1.value.y1}, x2=${chord1.value.x2}, y2=${chord1.value.y2}`);

  // 计算弦长
  const length = calculateChordLength(point1, point2);
  // 根据弦长更新弦的颜色
  chord1Color.value = length > Math.sqrt(3) ? 'red' : 'blue';

  // 生成弦的总数加 1
  totalChords.value++;
  if (length > Math.sqrt(3)) {
    // 如果弦长大于根号三，长弦数量加 1
    longChords.value++;
  }
  // 计算长弦的占比
  longChordRatio.value = totalChords.value > 0 ? longChords.value / totalChords.value : 0;
  console.log(`长弦占比: ${(longChordRatio.value * 100).toFixed(2)}%`);
}

// 方法二相关变量
const chord2 = ref<ChordEndPoints>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord2Color = ref('blue');
// 记录方法二生成弦的总数
const totalChords2 = ref(0);
// 记录方法二长度大于根号三的弦的数量
const longChords2 = ref(0);
// 记录方法二长弦的占比
const longChordRatio2 = ref(0);

/**
 * 计算两点之间的弦长
 * @param p1 第一个点的坐标 [x1, y1]
 * @param p2 第二个点的坐标 [x2, y2]
 * @returns 弦长
 */

function calculateChordLength2(p1: [number, number], p2: [number, number]): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
/**
 * 生成弦（直径中点法）
 */
function generateRadialMidpoint() {
  // 生成随机直径
  const theta = Math.random() * 2 * Math.PI;
  const x1 = Math.cos(theta);
  const y1 = Math.sin(theta);
  // const x2 = -x1;
  // const y2 = -y1;

  // 在直径上随机选一个点
  const distanceFromCenter = Math.random(); // 生成 0 到 1 之间的随机距离
  const side = Math.random() < 0.5 ? -1 : 1; // 随机选择直径的哪一半边
  const midX = side * distanceFromCenter * x1;
  const midY = side * distanceFromCenter * y1;

  // 根据中点到圆心的距离计算弦长
  const halfChordLength = Math.sqrt(1 - distanceFromCenter ** 2);
  // const chordLength = 2 * halfChordLength;

  let dx, dy;
  if (distanceFromCenter === 0) {
    // 中点为圆心，随机选方向
    const angle = Math.random() * 2 * Math.PI;
    dx = halfChordLength * Math.cos(angle);
    dy = halfChordLength * Math.sin(angle);
  }
  else {
    // 中点不为圆心
    const perpendicularX = -midY;
    const perpendicularY = midX;
    const perpendicularLength = Math.sqrt(perpendicularX ** 2 + perpendicularY ** 2);
    dx = (perpendicularX / perpendicularLength) * halfChordLength;
    dy = (perpendicularY / perpendicularLength) * halfChordLength;
  }

  // 计算弦的端点坐标
  const chordX1 = midX + dx;
  const chordY1 = midY + dy;
  const chordX2 = midX - dx;
  const chordY2 = midY - dy;

  chord2.value = {
    x1: chordX1,
    y1: chordY1,
    x2: chordX2,
    y2: chordY2,
  };

  console.log('chord2:', chord2.value);

  const length = calculateChordLength2([chordX1, chordY1], [chordX2, chordY2]);
  chord2Color.value = length > Math.sqrt(3) ? 'red' : 'blue';

  totalChords2.value++;
  if (length > Math.sqrt(3)) {
    longChords2.value++;
  }
  longChordRatio2.value = totalChords2.value > 0 ? longChords2.value / totalChords2.value : 0;
  console.log(`方法二长弦占比: ${(longChordRatio2.value * 100).toFixed(2)}%`);
}

/// 方法三相关变量
const chord3 = ref<ChordEndPoints>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord3Color = ref('blue');
// 记录方法三生成弦的总数
const totalChords3 = ref(0);
// 记录方法三长度大于根号三的弦的数量
const longChords3 = ref(0);
// 记录方法三长弦的占比
const longChordRatio3 = ref(0);

/**
 * 生成弦（随机中点法）
 */
function generateRandomMidpoint() {
  let x0, y0;
  // 生成在单位圆内的中点
  while (true) {
    x0 = Math.random() * 2 - 1;
    y0 = Math.random() * 2 - 1;
    if (x0 * x0 + y0 * y0 <= 1) {
      break;
    }
  }

  // 计算中点到圆心的距离
  const d = Math.sqrt(x0 * x0 + y0 * y0);
  // 计算弦长的一半
  const L = Math.sqrt(1 - d ** 2);

  let dx, dy;
  if (d === 0) {
    // 中点为圆心，随机选方向
    const theta = Math.random() * 2 * Math.PI;
    dx = L * Math.cos(theta);
    dy = L * Math.sin(theta);
  }
  else {
    // 中点不为圆心
    dx = (-y0 / d) * L;
    dy = (x0 / d) * L;
  }

  // 计算弦的端点坐标
  chord3.value = {
    x1: x0 + dx,
    y1: y0 + dy,
    x2: x0 - dx,
    y2: y0 - dy,
  };

  // 计算弦长
  const length = Math.sqrt((chord3.value.x1 - chord3.value.x2) ** 2 + (chord3.value.y1 - chord3.value.y2) ** 2);
  // 根据弦长更新颜色
  chord3Color.value = length > Math.sqrt(3) ? 'red' : 'blue';

  // 更新统计数据
  totalChords3.value++;
  if (length > Math.sqrt(3)) {
    longChords3.value++;
  }
  longChordRatio3.value = totalChords3.value > 0 ? longChords3.value / totalChords3.value : 0;
  console.log(`方法三长弦占比: ${(longChordRatio3.value * 100).toFixed(2)}%`);
}

const bertrandDisplay = ref<{
  autoGameRound: number[]
  simulationInterval: number | null
  simulateGame: () => void
  stopSimulation: () => void
}>({
  autoGameRound: [], // 默认模拟轮数为100
  simulationInterval: null, // 用于存储定时器 ID
  simulateGame() {
    console.log('开始模拟！');
    let round = 0;
    this.simulationInterval = setInterval(() => {
      if (round >= this.autoGameRound[0] || !autoGaming.value) {
        if (this.simulationInterval) {
          clearInterval(this.simulationInterval);
        }
        this.simulationInterval = null;
        return;
      }
      // 确保每次更新的数据是响应式的
      generateRandomEndPoints();
      generateRadialMidpoint();
      generateRandomMidpoint();
      round++;
    }, 100) as unknown as number; // 强制类型转换
  },
  // 停止模拟并清除所有图像
  stopSimulation() {
    console.log('停止模拟！');
    // 清空所有弦数据
    chord1.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
    chord2.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
    chord3.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
    chord1Color.value = 'blue';
    chord2Color.value = 'blue';
    chord3Color.value = 'blue';
    totalChords.value = 0;
    longChords.value = 0;
    longChordRatio.value = 0;
    totalChords2.value = 0;
    longChords2.value = 0;
    longChordRatio2.value = 0;
    totalChords3.value = 0;
    longChords3.value = 0;
    longChordRatio3.value = 0;

    // 停止模拟
    autoGaming.value = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  },
});

// function limitInput(e: { target: { value: string } }) {
//   const value = Number.parseInt(e.target.value);
//   if (Number.isNaN(value)) {
//     bertrandDisplay.value.autoGameRound[0] = 1;
//   }
//   else if (value > 500) {
//     bertrandDisplay.value.autoGameRound[0] = 500;
//   }
//   else if (value < 1) {
//     bertrandDisplay.value.autoGameRound[0] = 1;
//   }
//   else {
//     bertrandDisplay.value.autoGameRound[0] = value;
//   }
// }
// 限制输入值的方法
function limitInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value, 10);
  if (isNaN(value) || value < 1) {
    bertrandDisplay.value.autoGameRound[0] = 1; // 如果输入无效或小于1，设置为1
  } else if (value > 500) {
    bertrandDisplay.value.autoGameRound[0] = 500; // 如果大于500，设置为500
  } else {
    bertrandDisplay.value.autoGameRound[0] = value; // 否则，设置为输入值
  }
}

onMounted(() => {
  generateRandomEndPoints();
  generateRadialMidpoint();
  generateRandomMidpoint();
});
// // 切换模拟状态
// function toggleSimulation() {
//   if (bertrandDisplay.value.autoGaming) {
//     bertrandDisplay.value.stopSimulation();
//   } else {
//     bertrandDisplay.value.simulateGame();
//   }
//   bertrandDisplay.value.autoGaming = !bertrandDisplay.value.autoGaming;
// }
// 切换模拟状态
function toggleSimulation() {
  autoGaming.value = !autoGaming.value;
  if (autoGaming.value) {
    bertrandDisplay.value.simulateGame();
  }
  else {
    console.log('停止模拟，调用 stopSimulation 函数');
    bertrandDisplay.value.stopSimulation();
  }
}

// 监听模拟状态变化
// watch(simulateGame, () => {
//   if (simulateGame.value) {
//     // 在模拟开始时更新需要的状态
//   }
// });
watch(() => autoGaming.value, (newValue) => {
  if (newValue) {
    bertrandDisplay.value.simulateGame();
  }
  else {
    bertrandDisplay.value.stopSimulation();
  }
});

// 定义不同方法的数据
const methodsData = {
  randomEndpoint: {
    name: '随机端点法',
    image: randomEndpointGif, // 替换为实际的图片路径
    description: '随机端点法指固定弦的一个端点，另一个端点在圆周上随机选取，即 $P(A) = \\frac{小圆面积}{大圆面积} = \\frac{1}{4}$。',
  },
  randomMidpoint: {
    name: '随机中点法',
    image: randomMidpointGif, // 替换为实际的图片路径
    description: '随机中点法指弦的中点在单位圆内随机选取，即 $$P(A) = \\frac{\\frac{1}{3}弧长}{周长} = \\frac{1}{3}$$',
  },
  diameterMidpoint: {
    name: '直径中点法',
    image: diameterMidpointGif, // 替换为实际的图片路径
    description: '直径中点法指任选一直径，垂直于该直径的弦的中点在该直径上随机选取，即 <br><br> $P(A) = \\frac{\\frac{1}{2}直径}{直径} = \\frac{1}{2}$',
  },
};

// 定义方法名称的联合类型
type MethodName = keyof typeof methodsData;

// 当前展示的方法
const currentMethod = ref(methodsData.randomEndpoint);

// 切换方法的函数
function toggleMethod(methodName: MethodName) {
  currentMethod.value = methodsData[methodName];
}
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <!-- 三个单位圆展示 -->
      <div class="circles-container flex justify-around mb-6">
        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <!-- 添加内部圆 -->
            <circle cx="80" cy="80" r="40" fill="yellow" stroke="" stroke-width="2" />
            <!-- 在此绘制第一种策略的弦 -->
            <line :x1="80 + chord1.x1 * 80" :y1="80 + chord1.y1 * 80" :x2="80 + chord1.x2 * 80"
              :y2="80 + chord1.y2 * 80" :stroke="chord1Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
            方法一: 随机端点法<br>一端点固定，一端点随机选取
          </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <circle cx="80" cy="80" r="40" fill="yellow" stroke="" stroke-width="2" />
            <!-- 在此绘制第二种策略的弦 -->
            <line :x1="80 + chord2.x1 * 80" :y1="80 + chord2.y1 * 80" :x2="80 + chord2.x2 * 80"
              :y2="80 + chord2.y2 * 80" :stroke="chord2Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
            方法二：直径中点法<br>弦的中点为任意直径上的任意点
          </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 180 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <circle cx="80" cy="80" r="40" fill="yellow" stroke="" stroke-width="2" />
            <!-- 在此绘制第三种策略的弦 -->
            <line :x1="80 + chord3.x1 * 80" :y1="80 + chord3.y1 * 80" :x2="80 + chord3.x2 * 80"
              :y2="80 + chord3.y2 * 80" :stroke="chord3Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
            方法三：随机中点法<br>弦的中点在单位圆内随机选取
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div v-if="bertrandDisplay" class="p-2 grid grid-cols-2 gap-2 h-full overflow-y-hidden unselectable">
        <!-- 配置区 -->
        <div class="flex flex-col gap-2">
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <!-- <CardTitle>模拟轮数</CardTitle> -->
            </CardHeader>
            <CardContent class="flex flex-row items-center p-4  flex-1">
              <!-- <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                <Input v-model="bertrandDisplay.autoGameRound[0]" class="" :min="1" :max="500" @input="limitInput" />
                <Slider v-model="bertrandDisplay.autoGameRound" class="" :min="1" :max="500" />
              </div> -->
              <div class="font-bold w-full justify-center items-center mb-4 gap-3 flex flex-row">
                <div class="mb-3" v-html="toMarkdown('模拟轮数$$=$$')" />
                <div class="max-w-lg space-y-3 flex flex-col  mb-2">
                  <Input v-model="bertrandDisplay.autoGameRound" type="text" placeholder="1~500" @input="limitInput"/>
                </div>
                <!-- <Slider v-model="bertrandDisplay.autoGameRound" class="" :min="1" :max="500" /> -->
              </div>

              <div class="flex justify-center gap-2 mb-6 w-1/3">
                <Button class="" @click="toggleSimulation">
                  {{ autoGaming ? '终止模拟' : '开始模拟' }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- 实验结果显示 -->
          <Card class="flex-1 h-2/3">
            <CardHeader class="p-4">
              <CardTitle>实验结果</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center flex-col">
              <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
                <Label class="flex items-center flex-shrink-0">
                  方法一实验频率： {{ longChordRatio ? `${(longChordRatio * 100).toFixed(2)}%` : '0.00%' }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法一理论频率： {{ (0.333).toFixed(3) }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二实验频率： {{ longChordRatio2 ? `${(longChordRatio2 * 100).toFixed(2)}%` : '0.00%' }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二理论频率： {{ (0.500).toFixed(3) }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法三实验频率：{{ longChordRatio3 ? `${(longChordRatio3 * 100).toFixed(2)}%` : '0.00%' }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法三理论频率： {{ (0.250).toFixed(3) }}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- 实验详情 -->
        <Card class="h-full flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>方法详解</CardTitle>
            <!-- 下拉按钮 -->
            <div class="dropdown ">
              <Button tabindex="0" role="button" class="m-1">
                点我切换
              </Button>
              <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li @click="toggleMethod('randomEndpoint')">
                  <a>随机端点法</a>
                </li>
                <li @click="toggleMethod('randomMidpoint')">
                  <a>随机中点法</a>
                </li>
                <li @click="toggleMethod('diameterMidpoint')">
                  <a>直径中点法</a>
                </li>
              </ul>
            </div>
          </CardHeader>
          <CardContent class="flex flex-1 flex-col items-center justify-center">
            <!-- 显示实验详细内容 -->
            <img v-if="currentMethod.name === '随机端点法'" :src="randomEndpointGif" alt="随机端点法动图" style="width: 40%;">
            <img v-if="currentMethod.name === '随机中点法'" :src="randomMidpointGif" alt="随机中点法动图" style="width: 40%;">
            <img v-if="currentMethod.name === '直径中点法'" :src="diameterMidpointGif" alt="直径中点法动图" style="width: 40%;">
            <!--            <p>{{ currentMethod.description }}</p> -->
            <div class="prose text-sm font-medium mt-4" v-html="toMarkdown(currentMethod.description)" />
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="bertrand" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.circles-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.circle {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
}

/* .circle1 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
} */

.circle-label {
  position: absolute;
  bottom: -20px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.controls button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background-color: #0056b3;
}

div,
label {
  user-select: none;
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
}
</style>
