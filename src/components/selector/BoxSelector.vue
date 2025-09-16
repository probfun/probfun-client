<script setup lang="ts">
import type { Subject } from '@/store';
import { computed, onMounted, ref } from 'vue';
import { subjectInfo, useConfigStore } from '@/store';

type FaceType = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

const props = withDefaults(defineProps<{
  immediate?: boolean;
  hintColor?: string;
}>(), {
  immediate: true,
  hintColor: 'text-primary-foreground',
});

const BASE_X = -25;
const BASE_Y = -25;

const rotateX = ref(BASE_X);
const rotateY = ref(BASE_Y);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const isExpanded = ref(false);
const expandTransition = ref(false);
const skipTransition = ref(false);
const isAnimating = ref(false);
const configStore = useConfigStore();

const currentIndex = ref(0);

const subjectInfoList = Object.values(subjectInfo);
const frontItem = ref<Subject | null>(subjectInfoList[0]);
const leftItem = ref<Subject | null>(null);
const rightItem = ref<Subject | null>(subjectInfoList[1] ?? null);

const TBA_COLOR = 'rgba(189,195,199,0.95)';
const currentSubject = computed(() => subjectInfoList[currentIndex.value] ?? null);

function setFaceSlots(i: number) {
  frontItem.value = subjectInfoList[i] ?? null;
  leftItem.value = i - 1 >= 0 ? subjectInfoList[i - 1] : null;
  rightItem.value = i + 1 < subjectInfoList.length ? subjectInfoList[i + 1] : null;
}

function updateConfigSubject() {
  if (currentSubject.value)
    configStore.currentSubjectId = currentSubject.value.id;
}

onMounted(() => {
  const savedIndex = localStorage.getItem('cube-current-index');
  if (savedIndex !== null) {
    const i = Number(savedIndex);
    if (!Number.isNaN(i) && i >= 0 && i < subjectInfoList.length) {
      currentIndex.value = i;
      setFaceSlots(i);
    }
  }
  if (props.immediate) {
    updateConfigSubject();
  }
});

function normalizeAngle(angle: number): number {
  angle = angle % 3600;
  return angle > 1800 ? angle - 3600 : angle < -1800 ? angle + 3600 : angle;
}

const faceToAngle: Record<FaceType, { x: number; y: number }> = {
  front: { x: BASE_X, y: BASE_Y },
  left: { x: BASE_X, y: 65 },
  back: { x: BASE_X, y: 155 },
  right: { x: BASE_X, y: -115 },
  top: { x: -115, y: BASE_Y },
  bottom: { x: 65, y: BASE_Y },
};

function handleMouseDown(e: MouseEvent) {
  if (isDragging.value || isAnimating.value || isExpanded.value)
    return;
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
}

function animateSwipe(step: -1 | 1) {
  if (isAnimating.value || isExpanded.value)
    return;

  const atLeftEdge = currentIndex.value === 0 && step === -1;
  const atRightEdge = currentIndex.value === subjectInfoList.length - 1 && step === 1;
  if (atLeftEdge || atRightEdge)
    return;

  isAnimating.value = true;
  const degree = step === 1 ? -90 : 90;
  rotateY.value += degree;

  setTimeout(() => {
    currentIndex.value += step;
    localStorage.setItem('cube-current-index', String(currentIndex.value));
    if (props.immediate) {
      updateConfigSubject();
    }
    setFaceSlots(currentIndex.value);
    skipTransition.value = true;
    rotateX.value = BASE_X;
    rotateY.value = BASE_Y;
    requestAnimationFrame(() => {
      skipTransition.value = false;
      isAnimating.value = false;
    });
  }, 135);
}

function handleMouseUp(e: MouseEvent) {
  if (!isDragging.value || isExpanded.value)
    return;
  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;
  const threshold = 50;
  if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0)
      animateSwipe(-1); // 右滑 => 上一
    else animateSwipe(1); // 左滑 => 下一
  }
  isDragging.value = false;
}

// 双击展开/收起
function handleDoubleClick() {
  if (isAnimating.value)
    return;
  if (isExpanded.value) {
    // 收起
    isExpanded.value = false;
    setTimeout(() => {
      expandTransition.value = false;
    }, 300);
  }
  else {
    skipTransition.value = true;
    rotateX.value = normalizeAngle(rotateX.value);
    rotateY.value = normalizeAngle(rotateY.value);
    requestAnimationFrame(() => {
      skipTransition.value = false;
      isAnimating.value = true;
      expandTransition.value = true;
      isExpanded.value = true;
      setTimeout(() => {
        isAnimating.value = false;
      }, 300);
    });
  }
}

function handleClose() {
  isExpanded.value = false;
  expandTransition.value = false;
}

function handleFaceClick(face: FaceType) {
  if (!isExpanded.value || isAnimating.value)
    return;

  const step = face === 'left' ? -1 : face === 'right' ? 1 : 0;
  const canGoLeft = currentIndex.value > 0;
  const canGoRight = currentIndex.value < subjectInfoList.length - 1;
  const allow = (step === -1 && canGoLeft) || (step === 1 && canGoRight);

  const targetAngle = faceToAngle[face];
  isAnimating.value = true;
  rotateX.value = targetAngle.x;
  rotateY.value = targetAngle.y;
  handleClose();

  setTimeout(() => {
    if (allow) {
      currentIndex.value += step as 1 | -1;
      localStorage.setItem('cube-current-index', String(currentIndex.value));
      if (props.immediate) {
        updateConfigSubject();
      }
      setFaceSlots(currentIndex.value);
    }
    skipTransition.value = true;
    rotateX.value = BASE_X;
    rotateY.value = BASE_Y;
    requestAnimationFrame(() => {
      skipTransition.value = false;
      isAnimating.value = false;
    });
  }, 300);
}

// 展开态：显示所有学科的网格，点击即可切换并收起
function selectFromGrid(i: number) {
  if (i < 0 || i >= subjectInfoList.length)
    return;
  currentIndex.value = i;
  localStorage.setItem('cube-current-index', String(currentIndex.value));
  if (props.immediate) {
    updateConfigSubject();
  }
  setFaceSlots(currentIndex.value);
  handleClose();
}

function faceBg(item: Subject | null, fallback = TBA_COLOR) {
  return item?.color ?? fallback;
}

defineExpose({
  currentSubject,
  updateConfigSubject,
});
</script>

<template>
  <div
    class="w-full relative flex flex-col justify-start items-center cursor-grab active:cursor-grabbing"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @dblclick="handleDoubleClick"
  >
    <div
      class="relative [transform-style:preserve-3d] origin-center transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="[
        isExpanded ? 'w-full max-w-2xl h-[500px]' : 'w-[300px] h-[400px] mt-16',
        skipTransition ? '!transition-none' : '',
      ]"
      :style="{
        transform: isExpanded ? 'rotateX(0deg) rotateY(0deg)' : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }"
    >
      <!-- 展开态：覆盖一层网格展示所有学科 -->
      <div v-if="isExpanded" class="absolute inset-0 z-10 p-4 overflow-auto">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            v-for="(item, i) in subjectInfoList"
            :key="item.id"
            class="rounded-xl border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] p-4 text-left text-white hover:ring-4 ring-muted/50 transition"
            :style="{ background: item.color }"
            @click="selectFromGrid(i)"
          >
            <div class="flex items-center gap-3 mb-2">
              <component :is="item.icon" class="size-8" />
              <h3 class="text-2xl font-bold drop-shadow">
                {{ item.name }}
              </h3>
            </div>
            <p class="text-[1.05em] drop-shadow">
              {{ item.description }}
            </p>
          </button>
        </div>
      </div>

      <!-- front -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? 'size-[300px] top-0 left-0 rounded-xl hover:ring-4 ring-muted/50' : 'size-[300px]'"
        :style="isExpanded ? { opacity: '0', pointerEvents: 'none' } : { transform: 'translateZ(150px)', background: faceBg(frontItem) }"
        @click="handleFaceClick('front')"
      >
        <span class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity text-shadow" :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'">
          <component :is="frontItem.icon" v-if="frontItem" class="size-20" />
          <span class="text-4xl">{{ frontItem ? frontItem.name : '敬请期待...' }}</span>
        </span>
      </div>

      <!-- right -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? 'size-[300px] top-0 right-0 rounded-xl hover:ring-4 ring-muted/50' : 'size-[300px]'"
        :style="isExpanded ? { opacity: '0', pointerEvents: 'none' } : { transform: 'translateX(150px) rotateY(90deg)', background: faceBg(rightItem) }"
        @click="handleFaceClick('right')"
      >
        <span class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity" :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'">
          <component :is="rightItem.icon" v-if="rightItem" class="size-20" />
          <span class="text-4xl">{{ rightItem ? rightItem.name : '敬请期待...' }}</span>
        </span>
      </div>

      <!-- left -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? '' : 'size-[300px]'"
        :style="isExpanded ? { opacity: '0', pointerEvents: 'none' } : { transform: 'translateX(-150px) rotateY(-90deg)', background: faceBg(leftItem) }"
        @click="handleFaceClick('left')"
      >
        <span class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity" :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'">
          <component :is="leftItem.icon" v-if="leftItem" class="size-20" />
          <span class="text-4xl">{{ leftItem ? leftItem.name : '敬请期待...' }}</span>
        </span>
      </div>

      <!-- top -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateY(-150px) rotateX(90deg)', background: 'rgba(189,195,199,0.95)' }"
        @click="handleFaceClick('top')"
      >
        <span class="text-2xl font-bold transition-opacity" :class="isExpanded ? 'opacity-0' : 'opacity-100'" />
      </div>

      <!-- back -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateZ(-150px) rotateY(180deg)', background: TBA_COLOR }"
        @click="handleFaceClick('back')"
      >
        <span class="text-4xl font-bold transition-opacity" :class="isExpanded ? 'opacity-0' : 'opacity-100'">敬请期待...</span>
      </div>

      <!-- bottom -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateY(150px) rotateX(-90deg)', background: 'rgba(44,62,80,0.95)' }"
        @click="handleFaceClick('bottom')"
      />
    </div>

    <div v-if="!isExpanded" class="mt-4 text-2xl font-semibold hint-fade select-none" :class="hintColor">
      - 左右滑动旋转，双击展开 -
    </div>
  </div>
</template>

<style scoped>
.text-shadow,
.drop-shadow {
  text-shadow: 2px 2px 4px rgba(0,0,0,.3);
}

.hint-fade {
  animation: hintPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes hintPulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
