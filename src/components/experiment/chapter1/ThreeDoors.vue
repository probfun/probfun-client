<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';
import {toMarkDown} from "@/utils/markdown";
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

const content = `
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
`

</script>

<template>
  <experiment-board title="三门问题" :tags="['条件概率', '贝叶斯定理']">
    <template #experiment>
      <div ref="container" class="h-full w-full relative flex flex-col">
        <div class="relative p-5 flex flex-col items-center rounded-lg border-2 mb-3">
          <div
              class="h-full w-full absolute top-0 left-0 bg-black bg-opacity-70 flex justify-center items-center z-10"
              v-if="gameState === 'End'">
            <Button @click="startGame">开始游戏</Button>
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
            <Button :disabled="Door.selectedDoor.value == null" @click="selectDoor"
                    v-if="gameState === 'Select'">选择</Button>
            <div class="w-full flex space-x-5 justify-center" v-if="gameState === 'Reveal'">
              <Button @click="gameResult(false)">不换门</Button>
              <Button @click="gameResult(true)">换门</Button>
            </div>
            <Button @click="startGame" v-if="gameState === 'Win' || gameState === 'Lose'">重新开始</Button>
          </div>
        </div>
        <div class="p-5 items-center flex flex-1 justify-center border-2 rounded-lg space-x-3">
          <div class="flex flex-col items-center justify-center">
            <div class="flex">
              <p class="mt-2"> 模拟轮数： </p>
              <div class="flex flex-col w-24 space-y-3 mr-3">
                <InputText :min="1" :max="1000" v-model.number="autoGameRound" />
                <Slider :min="1" :max="1000" v-model="autoGameRound" />
              </div>
              <Button @click="() => {
                autoGaming ? autoGaming = false : simulateGame();
              }"> {{ autoGaming ? '终止模拟' : '开始模拟' }}</Button>
            </div>
            <div class="mt-3">
              <div class="mb-2 text-lg font-bold">实验结果:</div>
              <div class="grid grid-cols-2 gap-4 justify-between">
                <div class="flex items-center">
                  <p>换门胜利次数：</p>
                  <p>{{ changeWinNum }}</p>
                </div>
                <div class="flex items-center">
                  <p>换门失败次数：</p>
                  <p>{{ changeLoseNum }}</p>
                </div>
                <div class="flex items-center">
                  <p>不换门胜利次数：</p>
                  <p>{{ notChangeWinNum }}</p>
                </div>
                <div class="flex items-center">
                  <p>不换门失败次数：</p>
                  <p>{{ notChangeLoseNum }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center">
            <Chart type="bar" :data="data" :options="options" class="flex-1 w-full"></Chart>
            <Button @click="resetData" class="mt-3">重置数据</Button>
          </div>
        </div>
      </div>
    </template>
    <template #hint>
      <h1 class="my-2 font-semibold">实验思路</h1>
      <div class="markdown-format w-full" v-html="toMarkDown(content)"></div>
      <h1 class="my-2 font-semibold">结论</h1>
      <div class="markdown-format" v-html="toMarkDown('综上所述,我们可以得到在假设最初选择A门,主持人打开B门的前提下,汽车在C门的概率最高,概率为2/3.故此时参赛者应该选择换成C门.')"></div>
    </template>
  </experiment-board>
</template>

<style scoped></style>