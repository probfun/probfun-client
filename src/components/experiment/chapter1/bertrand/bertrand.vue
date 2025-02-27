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

// 随机端点法
const chord1 = ref<{ x1: number, y1: number, x2: number, y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord1Color = ref('blue');

function generateRandomEndPoints() {
  const theta1 = Math.random() * 2 * Math.PI;
  const theta2 = Math.random() * 2 * Math.PI;

  chord1.value = {
    x1: Math.cos(theta1),
    y1: Math.sin(theta1),
    x2: Math.cos(theta2),
    y2: Math.sin(theta2),
  };
  console.log('chord1:', chord1.value); // 输出弦的坐标，检查是否更新
  console.log(`line 1: x1=${chord1.value.x1}, y1=${chord1.value.y1}, x2=${chord1.value.x2}, y2=${chord1.value.y2}`);

  const length = Math.sqrt((chord1.value.x1 - chord1.value.x2) ** 2 + (chord1.value.y1 - chord1.value.y2) ** 2);
  chord1Color.value = length > Math.sqrt(3) ? 'red' : 'blue';
}

// 半径中点法
const chord2 = ref<{ x1: number, y1: number, x2: number, y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord2Color = ref('blue');

function generateRadialMidpoint() {
  const theta = Math.random() * 2 * Math.PI; // 随机选择一个角度

  // 半径的端点
  const x1 = Math.cos(theta);
  const y1 = Math.sin(theta);

  // 垂直于半径的弦的另一端点
  const x2 = -x1;
  const y2 = -y1;

  chord2.value = { x1, y1, x2, y2 };
  const length = Math.sqrt((chord2.value.x1 - chord2.value.x2) ** 2 + (chord2.value.y1 - chord2.value.y2) ** 2);
  chord2Color.value = length > Math.sqrt(3) ? 'red' : 'blue';
}

// 随机中点法
const chord3 = ref<{ x1: number, y1: number, x2: number, y2: number }>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const chord3Color = ref('blue');

function generateRandomMidpoint() {
  // 修正随机中点法，确保弦端点在圆上
  const theta = Math.random() * 2 * Math.PI;
  const d = Math.random();
  const x0 = d * Math.cos(theta);
  const y0 = d * Math.sin(theta);
  const L = Math.sqrt(1 - d ** 2);
  const dx = -Math.sin(theta) * L;
  const dy = Math.cos(theta) * L;

  chord3.value = {
    x1: x0 + dx,
    y1: y0 + dy,
    x2: x0 - dx,
    y2: y0 - dy,
  };
  const length = Math.sqrt((chord3.value.x1 - chord3.value.x2) ** 2 + (chord3.value.y1 - chord3.value.y2) ** 2);
  chord3Color.value = length > Math.sqrt(3) ? 'red' : 'blue';
}

const bertrandDisplay = ref<{
  autoGameRound: number[]
  simulationInterval: number | null
  simulateGame: () => void
  stopSimulation: () => void
}>({
      autoGameRound: [100], // 默认模拟轮数为100
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

        // 停止模拟
        autoGaming.value = false;
        if (this.simulationInterval) {
          clearInterval(this.simulationInterval);
          this.simulationInterval = null;
        }
      },
    });

function limitInput(e: { target: { value: string } }) {
  const value = Number.parseInt(e.target.value);
  if (Number.isNaN(value)) {
    bertrandDisplay.value.autoGameRound[0] = 1;
  }
  else if (value > 500) {
    bertrandDisplay.value.autoGameRound[0] = 500;
  }
  else if (value < 1) {
    bertrandDisplay.value.autoGameRound[0] = 1;
  }
  else {
    bertrandDisplay.value.autoGameRound[0] = value;
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
            <!-- 在此绘制第一种策略的弦 -->
            <line
              :x1="80 + chord1.x1 * 80" :y1="80 + chord1.y1 * 80" :x2="80 + chord1.x2 * 80"
              :y2="80 + chord1.y2 * 80" :stroke="chord1Color" stroke-width="2"
            />

          </svg>
          <div class="circle-label">
            方法一: 随机端点法<br>一端点固定，一端点随机选取
          </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <!-- 在此绘制第二种策略的弦 -->
            <line
              :x1="80 + chord2.x1 * 80" :y1="80 + chord2.y1 * 80" :x2="80 + chord2.x2 * 80"
              :y2="80 + chord2.y2 * 80" :stroke="chord2Color" stroke-width="2"
            />

          </svg>
          <div class="circle-label">
            方法二：直径中点法<br>弦的中点为任意直径上的任意点
          </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 180 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <!-- 在此绘制第三种策略的弦 -->
            <line
              :x1="80 + chord3.x1 * 80" :y1="80 + chord3.y1 * 80" :x2="80 + chord3.x2 * 80"
              :y2="80 + chord3.y2 * 80" :stroke="chord3Color" stroke-width="2"
            />

          </svg>
          <div class="circle-label">
            方法三：随机中点法<br>弦的中点在单位圆内随机选取
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div v-if="bertrandDisplay" class="p-2 grid grid-cols-2 gap-2 h-full">
        <!-- 配置区 -->
        <div class="flex flex-col gap-2">
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>模拟轮数</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center p-4 pt-0 flex-1">
              <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                <Input v-model="bertrandDisplay.autoGameRound[0]" class="" :min="1" :max="500" @input="limitInput" />
                <Slider v-model="bertrandDisplay.autoGameRound" class="" :min="1" :max="500" />
              </div>
              <div class="flex justify-center gap-2 w-full">
                <Button class="" @click="toggleSimulation">
                  {{ autoGaming ? '终止模拟' : '开始模拟' }}
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- 实验结果显示 -->
          <Card class="flex-1">
            <CardHeader class="p-4">
              <CardTitle>实验结果</CardTitle>
            </CardHeader>
            <CardContent class="flex items-center flex-col">
              <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
                <Label class="flex items-center flex-shrink-0">
                  方法一实验频率： {{ }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法一理论频率： {{ }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二实验频率： {{ }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二理论频率： {{ }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法三实验频率： {{ }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法三理论频率： {{ }}
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
</style>
