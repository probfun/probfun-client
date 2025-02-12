<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';

// 用于控制模拟开始与否
// const simulateGame = ref(false);
const bertrandDisplay = ref<any>({
  autoGameRound: [100], // 默认模拟轮数为100
  autoGaming: false, // 是否正在进行模拟
  simulateGame() {
  console.log('开始模拟！');
  let round = 0;
  const interval = setInterval(() => {
    if (round >= bertrandDisplay.value.autoGameRound[0]) {
      clearInterval(interval); // 停止模拟
      return;
    }
    // 确保每次更新的数据是响应式的
    generateRandomEndPoints();
    generateRadialMidpoint();
    generateRandomMidpoint();
    round++;
  }, 100); // 每 100ms 更新一次
}
,
 // 停止模拟并清除所有图像
 stopSimulation() {
  console.log("停止模拟！");
  // 清空所有弦数据
  chord1.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
  chord2.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
  chord3.value = { x1: 0, y1: 0, x2: 0, y2: 0 };
  chord1Color.value = 'blue';
  chord2Color.value = 'blue';
  chord3Color.value = 'blue';

  // 停止模拟
  bertrandDisplay.value.autoGaming = false;
}

});


function limitInput(e: { target: { value: string; }; }) {
  const value = parseInt(e.target.value);
  if (isNaN(value)) {
    bertrandDisplay.value.autoGameRound[0] = 1;
  } else if (value > 500) {
    bertrandDisplay.value.autoGameRound[0] = 500;
  } else if (value < 1) {
    bertrandDisplay.value.autoGameRound[0] = 1;
  } else {
    bertrandDisplay.value.autoGameRound[0] = value;
  }
}



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
  console.log('chord1:', chord1.value);  // 输出弦的坐标，检查是否更新
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
    y2: y0 - dy
  };
  const length = Math.sqrt((chord3.value.x1 - chord3.value.x2) ** 2 + (chord3.value.y1 - chord3.value.y2) ** 2);
  chord3Color.value = length > Math.sqrt(3) ? 'red' : 'blue';
}

onMounted(() => {
  generateRandomEndPoints();
  generateRadialMidpoint();
  generateRandomMidpoint();


});
// 切换模拟状态
function toggleSimulation() {
  if (bertrandDisplay.value.autoGaming) {
    bertrandDisplay.value.stopSimulation();
  } else {
    bertrandDisplay.value.simulateGame();
  }
  bertrandDisplay.value.autoGaming = !bertrandDisplay.value.autoGaming;
}



// 监听模拟状态变化
// watch(simulateGame, () => {
//   if (simulateGame.value) {
//     // 在模拟开始时更新需要的状态
//   }
// });
watch(() => bertrandDisplay.value.autoGaming, (newValue) => {
  if (newValue) {
    bertrandDisplay.value.simulateGame();
  } else {
    bertrandDisplay.value.stopSimulation();
  }
});



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
            <line :x1="80 + chord1.x1 * 80" :y1="80 + chord1.y1 * 80" :x2="80 + chord1.x2 * 80" :y2="80 + chord1.y2 * 80" stroke="chord1Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
        方法一<br>一端点固定，一端点随机选取
      </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 170 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <!-- 在此绘制第二种策略的弦 -->
            <line :x1="80 + chord2.x1 * 80" :y1="80 + chord2.y1 * 80" :x2="80 + chord2.x2 * 80" :y2="80 + chord2.y2 * 80" stroke="chord2Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
        方法二<br>弦的中点为任意直径上的任意点
      </div>
        </div>

        <div class="circle">
          <svg width="200" height="200" viewBox="0 -10 180 190">
            <circle cx="80" cy="80" r="80" fill="none" stroke="black" />
            <!-- 在此绘制第三种策略的弦 -->
            <line :x1="80 + chord3.x1 * 80" :y1="80 + chord3.y1 * 80" :x2="80 + chord3.x2 * 80" :y2="80 + chord3.y2 * 80" stroke="chord3Color" stroke-width="2" />

          </svg>
          <div class="circle-label">
        方法三<br>弦的中点在单位圆内随机选取
      </div>
        </div>
      </div>





    </template>

    <template #parameter>
      <div v-if="bertrandDisplay" class="p-2 grid grid-cols-2 gap-2">
        <!-- 配置区 -->
        <div class="flex flex-col gap-2">
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>模拟轮数</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center p-4 pt-0 flex-1">
              <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                <Input v-model="bertrandDisplay.autoGameRound[0]" class="" :min="1" :max="500" @input="limitInput" />
                <Slider v-model="bertrandDisplay.autoGameRound" class="":min="1" :max="500" />
              </div>
              <div class="flex justify-center gap-2 w-full">

                <Button
                  class="" @click="toggleSimulation"
                >
                  {{ bertrandDisplay.autoGaming ? '终止模拟' : '开始模拟' }}
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
                  方法一理论频率： {{  }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二实验频率： {{  }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  方法二理论频率： {{  }}
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
          </CardHeader>
          <CardContent class="flex flex-1 flex-col items-center justify-center">
            <!-- 显示实验详细内容 -->
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <!-- 结果总结区域 -->
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

.controls {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 20px;
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
