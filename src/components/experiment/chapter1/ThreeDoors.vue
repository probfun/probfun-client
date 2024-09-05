<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';
import {toMarkdown} from "@/utils/markdown";
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";

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
    if (this.open.value || gameState.value !== 'Select') return;
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

const gameState = ref<'End' | 'Select' | 'Reveal' | 'Win' | 'Lose'>('End');

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
  const revealDoorId = shuffle([1, 2, 3].filter((id) => id !== correctDoor && id !== Door.selectedDoor.value!.id))[0];
  doors.value[revealDoorId - 1].openDoor();
}

const changeWinNum = ref(0);
const changeLoseNum = ref(0);
const notChangeWinNum = ref(0);
const notChangeLoseNum = ref(0);

function gameResult(change: boolean) {
  if (change) {
    Door.selectedDoor.value = doors.value.find((door) => !door.open && door.id !== Door.selectedDoor.value!.id) as unknown as Door;
  }
  Door.selectedDoor.value?.openDoor();
  if (Door.selectedDoor.value!.correct) {
    gameState.value = 'Win';
    change ? changeWinNum.value++ : notChangeWinNum.value++;
  } else {
    gameState.value = 'Lose';
    change ? changeLoseNum.value++ : notChangeLoseNum.value++;
  }
  Door.selectedDoor.value = null;
}

async function simulateGame() {
  const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  autoGaming.value = true;
  const waitTime = 1000 / autoGameRound.value;
  for (let i = 0; i < autoGameRound.value; i++) {
    if (!autoGaming.value) return;
    startGame();
    await wait(waitTime);
    Door.selectedDoor.value = doors.value[Math.floor(Math.random() * 3)] as unknown as Door;
    await wait(waitTime);
    selectDoor();
    await wait(waitTime);
    const change = Math.random() < 0.5;
    gameResult(change);
    await wait(waitTime);
  }
  autoGaming.value = false;
}

const autoGameRound = ref(500);
const autoGaming = ref(false);

const data = computed(() => ({
  labels: ['换门胜率', '不换门胜率'],
  datasets: [
    {
      label: '胜率',
      data: [changeWinNum.value / (changeWinNum.value + changeLoseNum.value), notChangeWinNum.value / (notChangeWinNum.value + notChangeLoseNum.value)],
      backgroundColor: ['#FF6384', '#36A2EB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB'],
    },
  ],
}));

const options = ref({
  animation: {
    duration: 0
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 1
    },
  }
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
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
                <path stroke-linecap='round' stroke-linejoin='round' d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5' />
               </svg>`
    },
    {
      id: 1,
      label: '换门争议',
      name: 'change',
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
                  <path stroke-linecap='round' stroke-linejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' />
                 </svg>`
    },
    {
      id: 2,
      label: '讨论区',
      name: 'discuss',
      icon: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' class='size-5 text-blue-600'>
                <path stroke-linecap='round' stroke-linejoin='round' d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' />
               </svg>`
    }
];

const content = `
### 实验思路
我们假设三扇门分别是 A、B、C，选手最初的选择是门 A，主持人打开的是门 B，那么问题就变成了求解：

$$
P(\\text{汽车在A门}∣\\text{最初选择A门，主持人打开B门})
$$

$$
P(\\text{汽车在C门}∣\\text{最初选择A门，主持人打开B门})
$$

$$
P(\\text{汽车在B门}∣\\text{最初选择A门，主持人打开B门})
$$

接下来，由贝叶斯公式可得：

$$
P(\\text{汽车在A门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{P(\\text{最初选择A门，主持人打开B门}∣\\text{汽车在A门})P(\\text{汽车在A门})}{P(\\text{最初选择A门，主持人打开B门})}
$$

$$
P(\\text{汽车在B门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{P(\\text{最初选择A门，主持人打开B门}∣\\text{汽车在B门})P(\\text{汽车在B门})}{P(\\text{最初选择A门，主持人打开B门})}
$$

$$
P(\\text{汽车在C门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{P(\\text{最初选择A门，主持人打开B门}∣\\text{汽车在C门})P(\\text{汽车在C门})}{P(\\text{最初选择A门，主持人打开B门})}
$$

接下来让我们逐步求解，首先易得：

$$
P(\\text{汽车在A门}) = P(\\text{汽车在B门}) = P(\\text{汽车在C门}) = \\frac{1}{3}
$$

至此，我们计算一下最终结果：

$$
P(\\text{汽车在A门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{\\frac{1}{2} \\cdot \\frac{1}{3}}{\\frac{1}{2}} = \\frac{1}{3}
$$

$$
P(\\text{汽车在B门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{0 \\cdot \\frac{1}{3}}{\\frac{1}{2}} = 0
$$

$$
P(\\text{汽车在C门}∣\\text{最初选择A门，主持人打开B门}) =
\\frac{1 \\cdot \\frac{1}{3}}{\\frac{1}{2}} = \\frac{2}{3}
$$

---

这部分内容推导了在选择门 A 后，主持人打开门 B 时，汽车在各个门后的概率。最终结果显示，汽车在门 C 后的概率是最高的，即 $\\frac{2}{3}$，而在门 A 后的概率是 $\\frac{1}{3}$。

### 结论
综上所述,我们可以得到在假设最初选择A门,主持人打开B门的前提下,汽车在C门的概率最高,概率为2/3.故此时参赛者应该选择换成C门.
`

</script>

<template>
  <experiment-board title="三门问题" :tags="['条件概率', '贝叶斯定理']" :discuss-tab-list="discussTabList" >
    <template #experiment>
      <div ref="container" class="h-full w-full relative flex flex-col items-center justify-center">
<!--        <div class="relative p-5 flex flex-col items-center rounded-lg border-2 mb-3">-->
          <div
              class="h-full w-full absolute top-0 left-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
              v-if="gameState === 'End'">
            <button class="btn btn-primary" @click="startGame">开始游戏</button>
          </div>
          <div class="font-bold text-xl mb-6 h-8 text-center flex items-center">
            <p v-if="gameState === 'Select'">请选择一扇门！</p>
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
            <div v-for="door in doors" :key="door.id" class="relative cursor-pointer -mx-5"
                 @click="door.toggleSelect">
              <img :src="`/three-doors/door_${door.open ? 'open' : 'close_2'}.png`" alt=""
                   class="hover:scale-[101%] hover:drop-shadow-[0_0_10px_rgba(155,155,138,1)] transition-all" />
              <div
                  class="absolute w-full h-full top-0 left-0 flex justify-center items-center pointer-events-none text-gray-200"
                  v-if="door.selected">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" class="size-16">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div
                  class="absolute w-full h-full top-0 left-0 flex justify-center items-center pointer-events-none z-10"
                  v-if="door.open">
                <img src="/three-doors/car_kaizousya.png" alt="" v-if="door.correct" />
                <img src="/three-doors/animal_markhor.png" alt="" v-else />
              </div>
            </div>
          </div>
          <div class="h-8">
            <button class="btn btn-primary" :disabled="Door.selectedDoor.value == null" @click="selectDoor"
                    v-if="gameState === 'Select'">选择</button>
            <div class="w-full flex space-x-5 justify-center" v-if="gameState === 'Reveal'">
              <button class="btn btn-primary" @click="gameResult(false)">不换门</button>
              <button class="btn btn-primary" @click="gameResult(true)">换门</button>
            </div>
            <button class="btn btn-primary" @click="startGame" v-if="gameState === 'Win' || gameState === 'Lose'">重新开始</button>
          </div>
<!--        </div>-->
      </div>
    </template>

    <template #parameter>
      <div class="p-5 items-center flex w-full h-full justify-center gap-3">
        <div class="flex flex-col items-center flex-1">
          <div class="flex">
            <label class="mt-3 flex-shrink-0"> 模拟轮数： </label>
            <div class="flex flex-col gap-3 mr-3 min-w-0 flex-1">
              <input class="input input-rounded input-primary" :min="1" :max="1000" v-model="autoGameRound" />
              <input class="range range-primary range-xs" type="range" :min="1" :max="1000" v-model="autoGameRound" />
            </div>
            <button class="btn btn-primary" @click="() => {
              autoGaming ? autoGaming = false : simulateGame();
            }"> {{ autoGaming ? '终止模拟' : '开始模拟' }}</button>
          </div>
          <div class="mt-5">
            <div class="mb-2 text-lg font-bold">实验结果:</div>
            <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
              <div class="flex items-center flex-shrink-0">
                换门胜利次数： {{ changeWinNum }}
              </div>
              <div class="flex items-center flex-shrink-0">
                换门失败次数： {{ changeLoseNum }}
              </div>
              <div class="flex items-center flex-shrink-0">
                不换门胜利次数： {{ notChangeWinNum }}
              </div>
              <div class="flex items-center flex-shrink-0">
                不换门失败次数： {{ notChangeLoseNum }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center">
          <Chart type="bar" :data="data" :options="options" class="flex-1 w-full"></Chart>
          <button @click="resetData" class="btn btn-primary mt-3">重置数据</button>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none text-base-content" v-html="toMarkdown(content)"></div>
      </div>
    </template>

    <template #change>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none text-base-content" v-html="toMarkdown(content)"></div>
      </div>
    </template>
  </experiment-board>
</template>

<style scoped></style>