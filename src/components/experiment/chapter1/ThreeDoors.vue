<script setup lang="ts">
import { computed, ref, Ref, watch } from 'vue';
import {toMarkdown} from "@/utils/markdown";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";
import {GraduationCap, MessagesSquare, Lightbulb} from "lucide-vue-next";
import {cn} from "@/lib/utils";
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { clickApi } from '@/api/track/trackApi';

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

// 新增一个状态变量来存储用户选择的策略
const selectedStrategy = ref<'never' | 'always' | 'random'>('never');


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
  const waitTime = 1000 / autoGameRound.value[0];
  for (let i = 0; i < autoGameRound.value[0]; i++) {
    if (!autoGaming.value) return;
    startGame();
    await wait(waitTime);
    Door.selectedDoor.value = doors.value[Math.floor(Math.random() * 3)] as unknown as Door;
    await wait(waitTime);
    selectDoor();
    await wait(waitTime);

    let change: boolean;
    if (selectedStrategy.value === "never") {
      change = false;
    } else if (selectedStrategy.value === "always") {
      change = true;
    } else {
      change = Math.random() < 0.5;
    }

    gameResult(change);
    await wait(waitTime);
  }
  autoGaming.value = false;
}

const autoGameRound = ref([500]);
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
      icon: GraduationCap
    },
    {
      id: 1,
      label: '相关讨论',
      name: 'discuss',
      icon: Lightbulb
    },
    {
      id: 2,
      label: '讨论区',
      name: 'PeopleDiscuss',
      icon: MessagesSquare
    }
];

const conclusionContent = `
### **问题简述**

这是一个猜奖问题，游戏规则和过程如下：

有三扇关闭着的门，主持人将两只羊和一台车随机地放门后。选择一扇门，门后的奖品归你。

首先你选择一扇门，确定选择后点击“选择”按钮，然后主持人会打开未被选择的门中后面有羊的一扇，替你排除一扇门。现在你可以选择换门或者不换门。假如你想赢得车，你会选择换门还是不换门呢？


### **实验思路**
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

### **结论**
综上所述,我们可以得到在假设最初选择A门,主持人打开B门的前提下,汽车在C门的概率最高,概率为2/3.故此时参赛者应该选择换成C门.
`

const explanationContent = `
`;

const discussContent = ` 
### **换门争议**

关于三门问题，两种答案（换门还是不换门获得车的概率更大）争执已久。归纳起来，可以是：

既然主持人排除了一个错误选项，那么原始问题就变成了二选一的新问题，此时选哪个都一样，中奖概率都是 $\\frac{1}{2}$。因此答案是「否」。

三扇门的中奖概率都是 $\\frac{1}{3}$，参赛者选中的门的中奖概率自然也是 $\\frac{1}{3}$；而主持人选择的门打开后，$\\frac{1}{3}$就「跑到」另一扇门上去了，所以另一扇门的中奖概率是$\\frac{2}{3}$ 。因此答案是「是」。



根据贝叶斯公式，目标后验概率为$$P(\\text{A}|{B'})$$ = $\\frac{1}{3P({B'})}$。因此，以上两种答案对应边缘概率$$P({B'})$$分别是$\\frac{2}{3}$和1。这又对应了两种假设：

主持人并不知道门后的情况，随机选择后恰好门后是羊；特别地，主持人不知道参赛者选择的门后的情况，因而主持人的选择没有带来新的信息量,即$$P({B'}) ={\\frac{2}{3}}$$。

主持人知道门后的情况，因此选择的门后边必然是羊；特别地，主持人知道参赛者选择的门后的情况，因而主持人的选择带来了新的信息量。即$$P({B'}) = 1 $$。

这两种假设即是长期持续的争论是因为「节目主持人开启剩下两扇门的其中一扇」，并没有体现出主持人事先是否知道门后的情况；因而两种理解都算是可以接受的。

---

### **争议理解**

尽管在原始问题中，有「文字游戏」的嫌疑，但由于「露出其中一只山羊」的保证，事实上主持人的选择就变成了确定性的结论，因而带来了信息量。以概率论的角度来描述，即是 $$P({B'}) = 1 $$。

因此，三门问题的答案，应当是「换另一扇门会增加参赛者赢得汽车的机会（概率从$\\frac{1}{3}$增加到 $\\frac{2}{3}$）」。

此外，也可以使用枚举法来理解：

根据题目，参赛者需要在三扇门中进行选择，而门后共有一台汽车和两只羊。不妨将其设为汽车和羊A 及羊B。那么，若参赛者在主持人展示一只羊之后更改选择，则获胜的概率为 $\\frac{2}{3}$（失败的概率则是 $\\frac{1}{3}$）。所有可能的情况枚举如下：

当参赛者一开始选择汽车时（$\\frac{1}{3}$概率），不论主持人选择羊A 还是羊B，若参赛者更换选择，都不能赢得汽车。

当参赛者一开始选择羊A时（$\\frac{1}{3}$概率），主持人必然选择羊B，若参赛者更换选择，则必然赢得汽车。

当参赛者一开始选择羊B时（$\\frac{1}{3}$概率），主持人必然选择羊A，若参赛者更换选择，则必然赢得汽车。

`;

</script>

<template>
  <experiment-board title="三门问题" :tags="['条件概率', '贝叶斯定理']" :discuss-tab-list="discussTabList" >
    <template #experiment>
      <div ref="container" class="h-full w-full relative flex flex-col items-center justify-center">
<!--        <div class="relative p-5 flex flex-col items-center rounded-lg border-2 mb-3">-->
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
<!--        </div>-->
      </div>
    </template>

    <template #parameter>
      <div class="p-5 items-center flex min-w-full min-h-full overflow-x-auto justify-center gap-3">
        <div class="flex flex-col items-center flex-1">
          <div class="font-bold h-full justify-center items-center mb-4 gap-3 flex flex-col">
            <Label class="flex w-full font-bold text-left">模拟轮数</Label>
            <Input class="" :min="1" :max="1000" v-model="autoGameRound[0]" />

            <Slider class="" v-model="autoGameRound" />
          </div>
          <div class="flex justify-center gap-2 w-full">
            <Button class="" @click="() => {
              autoGaming ? autoGaming = false : simulateGame();
            }"> {{ autoGaming ? '终止模拟' : '开始模拟' }}</Button>
          </div>

          <div class="flex flex-col mt-5">
            <Label class="font-bold mb-2 justify-center">选择换门策略：</Label>
            <div class="flex space-x-3">
              <Button
                  :class="cn('transition-all', selectedStrategy !== 'never' && 'opacity-60')"
                  @click="selectedStrategy = 'never'">
                每次都不换门
              </Button>
              <Button
                  :class="cn('transition-all', selectedStrategy !== 'always' && 'opacity-60')"
                  @click="selectedStrategy = 'always'">
                  每次都换门
              </Button>
              <Button
                  :class="cn('transition-all', selectedStrategy !== 'random' && 'opacity-60')"
                  @click="selectedStrategy = 'random'">
                随机换门
              </Button>
            </div>
        </div>
          <div class="mt-5 flex flex-col">
            <Label class="mb-2 font-bold">实验结果:</Label>
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
          </div>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center">
          <Chart type="bar" :data="data" :options="options" class="flex-1 w-full"></Chart>
          <Button @click="resetData" class="mt-3">重置数据</Button>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)"></div>
      </div>
    </template>

    <template #change>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(explanationContent)"></div>
      </div>
    </template>
    <template #discuss>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(discussContent)"></div>
      </div>
    </template>
  </experiment-board>
</template>

<style scoped></style>