<script setup lang="ts">
import { Dice3, Infinity as Infty, MoveUpRight } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { useConfigStore } from '@/store';
// import { useThemeStore } from '@/store';

type FaceType = 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom';

// const themeStore = useThemeStore();
const rotateX = ref(-25);
const rotateY = ref(-25);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const isExpanded = ref(false);
const expandTransition = ref(false);
const skipTransition = ref(false);
const isAnimating = ref(false);
const configStore = useConfigStore();

function normalizeAngle(angle: number): number {
  angle = angle % 360;
  return angle > 180 ? angle - 360 : angle < -180 ? angle + 360 : angle;
}

const faceToAngle: Record<FaceType, { x: number; y: number }> = {
  front: { x: -25, y: -25 },
  left: { x: -25, y: 65 },
  back: { x: -25, y: 155 },
  right: { x: -25, y: -115 },
  top: { x: -115, y: -25 },
  bottom: { x: 65, y: -25 },
};

const currentFace = computed<FaceType>(() => {
  const y = normalizeAngle(rotateY.value);
  for (const [face, angle] of Object.entries(faceToAngle)) {
    if (y === angle.y)
      return face as FaceType;
  }
  return 'top';
});

// 监听当前面的变化并发出颜色改变事件
watch(currentFace, () => {
  if (currentFace.value === 'left') {
    configStore.setSubject('linear-algebra');
  }
  else if (currentFace.value === 'right') {
    configStore.setSubject('advanced-math');
  }
  else if (currentFace.value === 'front') {
    configStore.setSubject('probability');
  }
});

function handleMouseDown(e: MouseEvent) {
  if (isDragging.value)
    return;
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
}

function handleMouseUp(e: MouseEvent) {
  if (!isDragging.value || isExpanded.value)
    return;
  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;
  const threshold = 50;
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const degree = deltaX > 0 ? 90 : -90;
      if (rotateY.value + degree !== 155 && rotateY.value + degree !== -205) {
        rotateY.value += degree;
      }
    }
    isDragging.value = false;
  }
}

// 双击用于展开、收起立方体
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
    // 展开
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

// 处理展开状态下的点击
function handleFaceClick(face: FaceType) {
  if (!isExpanded.value || isAnimating.value)
    return;
  // 开始收缩动画
  isAnimating.value = true;
  const targetAngle = faceToAngle[face];
  rotateX.value = targetAngle.x;
  rotateY.value = targetAngle.y;
  handleClose();
  // themeStore.setColor(faceColors[face]);

  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
}

// 初始化时恢复旋转角度
const savedX = localStorage.getItem('cube-rotate-x');
const savedY = localStorage.getItem('cube-rotate-y');
if (savedX !== null && savedY !== null) {
  rotateX.value = Number(savedX);
  rotateY.value = Number(savedY);
}

// 拖动或旋转后保存
watch([rotateX, rotateY], ([x, y]) => {
  localStorage.setItem('cube-rotate-x', String(x));
  localStorage.setItem('cube-rotate-y', String(y));
});
</script>

<template>
  <div
    class="w-full relative flex flex-col justify-start  items-center cursor-grab active:cursor-grabbing"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @dblclick="handleDoubleClick"
  >
    <div
      class="relative [transform-style:preserve-3d] origin-center transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
      :class="[
        isExpanded ? 'w-full max-w-2xl h-[650px]' : 'w-[300px] h-[400px]',
      ]"
      :style="{
        transform: isExpanded
          ? 'rotateX(0deg) rotateY(0deg)'
          : `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }"
    >
      <!-- front -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? 'size-[300px] top-0 left-0 rounded-xl hover:ring-4 ring-muted/50' : 'size-[300px]'"
        :style="isExpanded
          ? { background: 'rgba(36,96,226,0.85)', opacity: '1' }
          : { transform: 'translateZ(150px)', background: 'rgba(36,96,226,0.85)' }"
        @click="handleFaceClick('front')"
      >
        <span
          class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity text-shadow"
          :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
        >
          <Dice3 class="size-20" />
          <span class="text-5xl">邮趣概率</span>
        </span>
        <div
          v-if="isExpanded"
          class="absolute inset-0 flex flex-col items-center justify-center text-center p-5"
        >
          <div class="flex items-center mb-3 gap-2">
            <Dice3 class="size-12" />
            <h3 class="text-4xl font-bold drop-shadow">
              邮趣概率
            </h3>
          </div>
          <p class="text-[1.2em] my-2 drop-shadow">
            探索不确定世界的规律
          </p>
          <p class="text-[1.2em] my-2 drop-shadow">
            适合喜欢逻辑和建模的你
          </p>
        </div>
      </div>

      <!-- right -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? 'size-[300px] top-0 right-0 rounded-xl hover:ring-4 ring-muted/50' : 'size-[300px]'"
        :style="isExpanded
          ? { background: 'rgba(22,163,74,0.85)', opacity: '1' }
          : { transform: 'translateX(150px) rotateY(90deg)', background: 'rgba(22,163,74,0.85)' }"
        @click="handleFaceClick('right')"
      >
        <span
          class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity"
          :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
        >
          <Infty class="size-20" />
          <span class="text-5xl">邮趣高数</span>
        </span>
        <div
          v-if="isExpanded"
          class="absolute inset-0 flex flex-col items-center justify-center text-center p-5"
        >
          <div class="flex items-center mb-3 gap-2">
            <Infty class="size-12" />
            <h3 class="text-4xl font-bold drop-shadow">
              邮趣高数
            </h3>
          </div>
          <p class="text-[1.2em] my-2 drop-shadow">
            微积分，函数与极限的艺术
          </p>
          <p class="text-[1.2em] my-2 drop-shadow">
            适合喜欢挑战和推理的你
          </p>
        </div>
      </div>

      <!-- left -->
      <div
        class="absolute flex flex-col items-center justify-center text-white select-none p-5 box-border transition-all ease-[cubic-bezier(0.4,0,0.2,1)] border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] cursor-pointer"
        :class="isExpanded ? 'size-[300px] bottom-0 left-1/2 -translate-x-1/2  rounded-xl hover:ring-4 ring-muted/50' : 'size-[300px]'"
        :style="isExpanded
          ? { background: 'rgba(124,58,237,0.85)', opacity: '1' }
          : { transform: 'translateX(-150px) rotateY(-90deg)', background: 'rgba(124,58,237,0.85)' }"
        @click="handleFaceClick('left')"
      >
        <span
          class="flex flex-col items-center justify-center gap-2 text-2xl font-bold transition-opacity"
          :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
        >
          <MoveUpRight class="size-20" />
          <span class="text-5xl">邮趣线代</span>
        </span>
        <div
          v-if="isExpanded"
          class="absolute inset-0 flex flex-col items-center justify-center text-center p-5"
        >
          <div class="flex items-center mb-3 gap-2">
            <MoveUpRight class="size-12" />
            <h3 class="text-4xl font-bold drop-shadow">
              邮趣线代
            </h3>
          </div>
          <p class="text-[1.2em] my-2 drop-shadow">
            空间与向量的语言
          </p>
          <p class="text-[1.2em] my-2 drop-shadow">
            适合喜欢抽象思维和结构分析的你
          </p>
        </div>
      </div>

      <!-- top -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { transform: 'translateY(-150px) rotateX(90deg) scale(0.5)', background: 'rgba(189,195,199,0.85)', opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateY(-150px) rotateX(90deg)', background: 'rgba(189,195,199,0.85)' }"
        @click="handleFaceClick('top')"
      >
        <span
          class="text-2xl font-bold transition-opacity"
          :class="isExpanded ? 'opacity-0' : 'opacity-100'"
        />
      </div>

      <!-- back -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { transform: 'translateZ(-150px) rotateY(180deg) scale(0.5)', background: 'rgba(243,156,18,0.85)', opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateZ(-150px) rotateY(180deg)', background: 'rgba(243,156,18,0.85)' }"
        @click="handleFaceClick('back')"
      >
        <span
          class="text-5xl font-bold transition-opacity"
          :class="isExpanded ? 'opacity-0' : 'opacity-100'"
        >敬请期待...</span>
      </div>

      <!-- bottom -->
      <div
        class="absolute size-[300px] flex items-center justify-center text-white select-none p-5 box-border border-[7px] border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all ease-[cubic-bezier(0.4,0,0.2,1)]"
        :style="isExpanded
          ? { transform: 'translateY(150px) rotateX(-90deg) scale(0.5)', background: 'rgba(44,62,80,0.85)', opacity: '0', pointerEvents: 'none' }
          : { transform: 'translateY(150px) rotateX(-90deg)', background: 'rgba(44,62,80,0.85)' }"
        @click="handleFaceClick('bottom')"
      />
    </div>
    <div v-if="!isExpanded" class="mt-4 text-primary-foreground text-2xl hint-fade select-none">
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
  animation: hintPulse 3s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
