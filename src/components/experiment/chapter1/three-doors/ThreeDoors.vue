<script setup lang="ts">
import type { Ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toMarkdown } from '@/utils/markdown';
import { GraduationCap, Lightbulb, MessagesSquare } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { conclusionContent, discussContent, explanationContent } from './content';

const gameState = ref<'End' | 'Select' | 'Reveal' | 'Win' | 'Lose'>('End');
class Door {
  id: number;
  open: Ref<boolean>;
  selected: Ref<boolean> = ref(false);
  correct: boolean = false;
  static selectedDoor: Ref<Door | null> = ref(null);

  constructor(id: number, open: boolean, correct: boolean) {
    this.id = id;
    this.open = ref(open);
    this.correct = correct;
    watch(Door.selectedDoor, (value) => {
      this.selected.value = value?.id === this.id;
    });
  }

  toggleSelect = () => {
    if (this.open.value || gameState.value !== 'Select')
      return;
    Door.selectedDoor.value = this.selected.value ? null : this;
  }

  openDoor = () => {
    this.open.value = true;
  }
}

let correctDoor = 0;
const doors = ref<Door[]>([
  new Door(1, false, correctDoor === 1),
  new Door(2, false, correctDoor === 2),
  new Door(3, false, correctDoor === 3),
]);

function startGame() {
  gameState.value = 'Select';
  Door.selectedDoor.value = null;
  correctDoor = Math.floor(Math.random() * 3) + 1;
  doors.value = [
    new Door(1, false, correctDoor === 1),
    new Door(2, false, correctDoor === 2),
    new Door(3, false, correctDoor === 3),
  ];
}

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function selectDoor() {
  gameState.value = 'Reveal';
  const revealDoorId = shuffle([1, 2, 3].filter(id => id !== correctDoor && id !== Door.selectedDoor.value!.id))[0];
  doors.value[revealDoorId - 1].openDoor();
}

// 新增一个状态变量来存储用户选择的策略
const selectedStrategy = ref<'never' | 'always' | 'random'>('random');

const changeWinNum = ref(0);
const changeLoseNum = ref(0);
const notChangeWinNum = ref(0);
const notChangeLoseNum = ref(0);

function gameResult(change: boolean) {
  if (change) {
    Door.selectedDoor.value = doors.value.find(door => !door.open && door.id !== Door.selectedDoor.value!.id) as unknown as Door;
  }
  Door.selectedDoor.value?.openDoor();
  if (Door.selectedDoor.value!.correct) {
    gameState.value = 'Win';
    change ? changeWinNum.value++ : notChangeWinNum.value++;
  }
  else {
    gameState.value = 'Lose';
    change ? changeLoseNum.value++ : notChangeLoseNum.value++;
  }
  Door.selectedDoor.value = null;
}

const autoGameRound = ref([500]);
const autoGaming = ref(false);

async function simulateGame() {
  const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  autoGaming.value = true;
  const waitTime = 1000 / autoGameRound.value[0];
  for (let i = 0; i < autoGameRound.value[0]; i++) {
    if (!autoGaming.value)
      return;
    startGame();
    await wait(waitTime);
    Door.selectedDoor.value = doors.value[Math.floor(Math.random() * 3)] as unknown as Door;
    await wait(waitTime);
    selectDoor();
    await wait(waitTime);

    let change: boolean;
    if (selectedStrategy.value === 'never') {
      change = false;
    }
    else if (selectedStrategy.value === 'always') {
      change = true;
    }
    else {
      change = Math.random() < 0.5;
    }

    gameResult(change);
    await wait(waitTime);
  }
  autoGaming.value = false;
}

// const dataC = ref();
// const dataNC = ref();
const historyC = ref<number[]>([]);
const historyNC = ref<number[]>([]);
const chartDataC = ref();
const chartDataNC = ref();

const documentStyle = getComputedStyle(document.documentElement);

function setdataC() {
  const kValues = Array.from({ length: historyC.value.length }, (_, i) => i + 1);
  // 使用 historyC 生成返回数据
  console.log(historyC);

  return ({
    labels: kValues,
    datasets: [
      {
        label: ['换门胜率'],
        data: historyC.value,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        tension: 0.4,
      },
      {
        label: '0.66', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 0.66 : 0.66), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

function setdataNC() {
  const kValues = Array.from({ length: historyC.value.length }, (_, i) => i + 1);
  historyNC.value = historyNC.value.concat(notChangeWinNum.value / (notChangeLoseNum.value + notChangeWinNum.value));
  historyC.value = historyC.value.concat(changeWinNum.value / (changeWinNum.value + changeLoseNum.value));
  console.log(historyC);

  return ({
    labels: kValues,
    datasets: [
      {
        label: ['不换门胜率'],
        data: historyNC.value,
        fill: false,
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        tension: 0.4,
      },
      {
        label: '0.33', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 0.33 : 0.33), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

watch([changeWinNum, changeLoseNum, notChangeWinNum, notChangeLoseNum], () => {
  chartDataC.value = setdataC();
  chartDataNC.value = setdataNC();
});

onMounted(() => {
  chartDataC.value = setdataC();
  chartDataNC.value = setdataNC()
});

const options = ref({
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 1,
    },
  },
});

function resetData() {
  changeWinNum.value = 0;
  changeLoseNum.value = 0;
  notChangeWinNum.value = 0;
  notChangeLoseNum.value = 0;
}

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
];
</script>

<template>
  <ExperimentBoard title="三门问题" :tags="['条件概率', '贝叶斯定理']" :discuss-tab-list="discussTabList">
    <template #experiment>
      <div class="h-full w-full relative flex flex-col items-center justify-center">
        <div
          v-if="gameState === 'End'"
          class="h-full w-full absolute top-0 left-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
        >
          <Button @click="startGame">
            开始游戏
          </Button>
        </div>
        <div class="font-bold text-xl mb-6 h-8 text-center flex items-center">
          <p v-if="gameState === 'Select'">
            请选择一扇门！
          </p>
          <p v-if="gameState === 'Reveal'">
            主持人打开了一扇错误的门！<br>
            你是否选择换一扇门？
          </p>
          <p v-if="gameState === 'Win'">
            恭喜你，你赢得了汽车！
          </p>
          <p v-if="gameState === 'Lose'">
            很遗憾，你没有赢得汽车。
          </p>
        </div>

        <div class="w-full flex justify-rounded mb-3 max-w-lg">
          <div
            v-for="door in doors" :key="door.id" class="relative cursor-pointer -mx-5"
            @click="door.toggleSelect"
          >
            <img
              :src="`/three-doors/door_${door.open ? 'open' : 'close_2'}.png`" alt=""
              class="hover:scale-[101%] hover:drop-shadow-[0_0_10px_rgba(155,155,138,1)] transition-all"
            >
            <div
              v-if="door.selected"
              class="absolute w-full h-full top-0 left-0 flex justify-center items-center pointer-events-none text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-16"
              >
                <path
                  stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <div
              v-if="door.open"
              class="absolute w-full h-full top-0 left-0 flex justify-center items-center pointer-events-none z-10"
            >
              <img v-if="door.correct" class="size-36" src="/three-doors/car_kaizousya.png" alt="">
              <img v-else class="size-36" src="/three-doors/animal_markhor.png" alt="">
            </div>
          </div>
        </div>
        <div class="h-8">
          <Button
            v-if="gameState === 'Select'" :disabled="Door.selectedDoor.value == null"
            @click="selectDoor"
          >
            选择
          </Button>
          <div v-if="gameState === 'Reveal'" class="w-full flex space-x-5 justify-center">
            <Button @click="gameResult(false)">
              不换门
            </Button>
            <Button @click="gameResult(true)">
              换门
            </Button>
          </div>
          <Button v-if="gameState === 'Win' || gameState === 'Lose'" @click="startGame">
            重新开始
          </Button>
        </div>
        <!--        </div> -->
      </div>
    </template>

    <template #parameter>
      <div class="p-2 grid grid-cols-2 w-full h-full gap-2">
        <div class="flex flex-col gap-2">
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                模拟轮数
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col items-center p-4 pt-0 flex-1">
              <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
                <Input v-model="autoGameRound[0]" class="" :min="1" :max="1000" />
                <Slider v-model="autoGameRound" class="" />
              </div>
              <div class="flex justify-center gap-2 w-full">
                <Button
                  class="" @click="() => {
                    autoGaming ? autoGaming = false : simulateGame();
                  }"
                >
                  {{ autoGaming ? '终止模拟' : '开始模拟' }}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                换门策略
              </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-wrap justify-around gap-2 items-center flex-1">
              <Button
                :class="cn('transition-all', selectedStrategy !== 'never' && 'opacity-60')"
                @click="selectedStrategy = 'never'"
              >
                每次都不换门
              </Button>
              <Button
                :class="cn('transition-all', selectedStrategy !== 'always' && 'opacity-60')"
                @click="selectedStrategy = 'always'"
              >
                每次都换门
              </Button>
              <Button
                :class="cn('transition-all', selectedStrategy !== 'random' && 'opacity-60')"
                @click="selectedStrategy = 'random'"
              >
                随机换门
              </Button>
            </CardContent>
          </card>
          <Card class="flex-1">
            <CardHeader class="p-4">
              <CardTitle>
                实验结果
              </CardTitle>
            </CardHeader>
            <CardContent class="flex items-center flex-col">
              <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
                <Label class="flex items-center flex-shrink-0">
                  换门胜利次数： {{ changeWinNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  换门失败次数： {{ changeLoseNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门胜利次数： {{ notChangeWinNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门失败次数： {{ notChangeLoseNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门胜率： {{ (notChangeWinNum / (notChangeWinNum + notChangeLoseNum)).toFixed(2) }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  换门胜率： {{ (changeWinNum / (changeWinNum + changeLoseNum)).toFixed(2) }}
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
            <Chart type="line" :data="chartDataC" :options="options" class="flex-1 w-full" />
            <Chart type="line" :data="chartDataNC" :options="options" class="flex-1 w-full" />
            <Button class="mt-3" @click="resetData">
              重置数据
            </Button>
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
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(explanationContent)" />
      </div>
    </template>
    <template #discuss>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(discussContent)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="three-doors" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
