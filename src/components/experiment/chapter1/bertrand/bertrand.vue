<script setup lang="ts">
import ExperimentBoard from '../../ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import { onMounted, ref, watch } from 'vue';
import { toMarkdown } from '@/utils/markdown';


const conclusionContent = `

`
// 组件的逻辑和响应式数据
const displayNUM = ref({
  autoGameRound: [1],
  autoGaming: false,
  simulateGame: () => {
    console.log('模拟游戏开始');
    // 模拟贝特朗悖论的逻辑
  }
});

// 模拟贝特朗悖论的函数
const simulateBertrandParadox = () => {
  const methods = [
    { name: '弦中点随机选取', func: simulateMethod1 },
    { name: '固定一个端点随机选取', func: simulateMethod2 },
    { name: '任选一个直径的垂直弦', func: simulateMethod3 }
  ];

  methods.forEach(method => {
    const trials = 10000; // 模拟次数
    let count = 0;
    for (let i = 0; i < trials; i++) {
      if (method.func()) {
        count++;
      }
    }
    const probability = count / trials;
    console.log(`${method.name} 模拟结果: ${probability}`);
  });
};

// 三种模拟方法
const simulateMethod1 = (): boolean => {
  const x = Math.random() * 2 - 1; // 随机生成 x 坐标 (-1 到 1)
  const y = Math.random() * 2 - 1; // 随机生成 y 坐标 (-1 到 1)
  if (x * x + y * y > 1) return false; // 确保点在单位圆内
  const distance = Math.sqrt(1 - x * x - y * y); // 弦长的计算
  return distance > Math.sqrt(3);
};

const simulateMethod2 = (): boolean => {
  const theta1 = Math.random() * Math.PI * 2; // 随机选择第一个端点的角度
  const theta2 = Math.random() * Math.PI * 2; // 随机选择第二个端点的角度
  const x1 = Math.cos(theta1);
  const y1 = Math.sin(theta1);
  const x2 = Math.cos(theta2);
  const y2 = Math.sin(theta2);
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); // 计算两端点的弦长
  return distance > Math.sqrt(3);
};

const simulateMethod3 = (): boolean => {
  const y = Math.random() * 2 - 1; // 随机选择中点的 y 坐标 (-1 到 1)
  if (y < -0.5 || y > 0.5) return false; // 确保弦的中点在直径上
  const distance = Math.sqrt(1 - y * y); // 计算弦长的一半
  return distance > Math.sqrt(3) / 2;
};
</script>


<!-- <template>
  <div>
    <button @click="simulateBertrandParadox">开始模拟</button>
  </div> -->






<!-- 
<template>
    <ExperimentBoard title="贝特朗悖论" >
      <template #experiment>
        
      </template>
      <template #parameter>
        <div v-if="displayNUM" class="p-2 grid grid-cols-2 w-full h-full gap-2">
          <div class="flex flex-col gap-2">
            <Card class="flex-1 flex flex-col">
              <CardHeader class="p-4">
                <CardTitle>
                  模拟轮数
                </CardTitle>
              </CardHeader>
              <CardContent class="flex flex-col items-center p-4 pt-0 flex-1">
                <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                  <Input v-model="displayNUM.autoGameRound[0]" class="" :min="1" :max="500" />
                  <Slider v-model="displayNUM.autoGameRound" class="" />
                </div>
                <div class="flex justify-center gap-2 w-full">
                  <Button
                    class="" @click="() => {
                      if (displayNUM === null)
                        return;
                        displayNUM.autoGaming ? displayNUM.autoGaming = false : displayNUM.simulateGame();
                    }"
                  >
                    {{ displayNUM.autoGaming ? '终止模拟' : '开始模拟' }}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card class="flex-1">
              <CardHeader class="p-4">
                <CardTitle>
                  实验结果
                </CardTitle>
              </CardHeader>
              <CardContent class="flex items-center flex-col">
                <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
                  <Label class="flex items-center flex-shrink-0">
                    方法一实际频率： {{ threeDoorsDisplay.changeWinNum }}
                  </Label>
                  <Label class="flex items-center flex-shrink-0">
                    方法一理论频率： {{ threeDoorsDisplay.changeLoseNum }}
                  </Label>
                  <Label class="flex items-center flex-shrink-0">
                    方法二实际频率： {{ threeDoorsDisplay.notChangeWinNum }}
                  </Label>
                  <Label class="flex items-center flex-shrink-0">
                    方法二理论频率： {{ threeDoorsDisplay.notChangeLoseNum }}
                  </Label>
                  <Label class="flex items-center flex-shrink-0">
                    方法三实际频率： {{ (threeDoorsDisplay.notChangeWinNum / (threeDoorsDisplay.notChangeWinNum + threeDoorsDisplay.notChangeLoseNum)).toFixed(2) }}
                  </Label>
                  <Label class="flex items-center flex-shrink-0">
                    方法三理论频率： {{ (threeDoorsDisplay.changeWinNum / (threeDoorsDisplay.changeWinNum + threeDoorsDisplay.changeLoseNum)).toFixed(2) }}
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card class="h-full flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                实验结果
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-1 flex-col  items-center justify-center">

            </CardContent>
          </Card>
        </div>
      </template>
  
      <template #conclusion>
        <div class="w-full h-full p-3">
          <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)" />
        </div>
      </template>
  
      <template #change>
        <div class="w-full h-full p-3">
        </div>
      </template>
      <template #discuss>
        <div class="w-full h-full p-3">
        </div>
      </template>
      <template #comment>
        <CommentPanel exp-id="three-doors" />
      </template>
    </ExperimentBoard>
  </template> -->