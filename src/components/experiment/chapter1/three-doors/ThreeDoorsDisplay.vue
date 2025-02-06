<script setup lang="ts">
import type { ThreeDoorsArgs } from '@/api/ai/aiType';
import { Button } from '@/components/ui/button';
import { onMounted, type Ref, ref, watch } from 'vue';

const props = defineProps<{ args: ThreeDoorsArgs }>();

const changeWinNum = ref(0);
const changeLoseNum = ref(0);
const notChangeWinNum = ref(0);
const notChangeLoseNum = ref(0);
const autoGameRound = ref([500]);
const autoGaming = ref(false);

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
    if (props.args.selectedStrategy === 'never') {
      change = false;
    }
    else if (props.args.selectedStrategy === 'always') {
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

function resetData() {
  changeWinNum.value = 0;
  changeLoseNum.value = 0;
  notChangeWinNum.value = 0;
  notChangeLoseNum.value = 0;
}

defineExpose({
  startGame,
  selectDoor,
  gameResult,
  simulateGame,
  resetData,
  changeWinNum,
  changeLoseNum,
  notChangeWinNum,
  notChangeLoseNum,
  autoGameRound,
  autoGaming,
});

onMounted(() => {
  console.log('ThreeDoorsDisplay mounted');
});
</script>

<template>
  <div class="h-full w-full p-4 relative flex flex-col items-center justify-center">
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
  </div>
</template>

<style scoped>

</style>
