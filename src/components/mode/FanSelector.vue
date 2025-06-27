<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/store';
import router from '@/router';
import { MODES } from '@/constants/modes';

const showFan = ref(false)
const themeStore = useThemeStore()
const btnRef = ref<HTMLElement | null>(null)
const btnCenter = ref({ left: 0, top: 0 })

function updateBtnCenter() {
  if (btnRef.value) {
    const rect = btnRef.value.getBoundingClientRect()
    btnCenter.value = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
    }
  }
}

// 只在组件挂载时更新一次
onMounted(() => {
  updateBtnCenter()
})

// 监听窗口大小变化，重新计算按钮位置
let resizeTimeout: number
function handleResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(updateBtnCenter, 100) // 防抖
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
})

function toggleFan() {
  showFan.value = !showFan.value
}

function selectMode(color: string) {
  themeStore.currentColor = color
  const selectedMode = MODES.find(mode => mode.color === color)
  if (selectedMode) {
    router.push(selectedMode.route)
  }
  showFan.value = false
}

</script>

<template>
  <div class="relative flex items-center justify-center">
    <!-- 主按钮 -->
    <button
      ref="btnRef"
      class="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg"
      :style="{backgroundColor: themeStore.currentColor}"
      @click="() => toggleFan()"
    >
      <component
        :is="MODES.find(m => m.color === themeStore.currentColor)?.icon"
        class="w-6 h-6"
      />
    </button>
    <!-- 扇形阴影和模式按钮弧线展开，使用 Teleport 到 body -->
    <teleport to="body">
      <!-- 扇形阴影 -->
      <transition name="fan-shadow">
        <svg
          v-if="showFan"
          @click="() => toggleFan()"
          :style="{
            position: 'fixed',
            left: '0px',
            top: '0px',
            zIndex: 9998,
            pointerEvents: 'auto',
            cursor: 'pointer'
          }"
          width="300"
          height="300"
        >
          <path
            d="M0,0 L300,0 A300,300 0 0,1 0,300 Z"
            fill="rgba(0,0,0,0.3)"
          />
        </svg>
      </transition>
      <transition-group name="fan-btn" tag="div">
        <button
          v-for="(mode, i) in MODES"
          v-if="showFan"
          :key="mode.color"
          class="fixed w-14 h-14 rounded-full text-white border-2 flex items-center justify-center shadow"
          :style="{
            backgroundColor: mode.color,
            left: `${btnCenter.left + (showFan ? 150 * Math.cos(i * Math.PI / 4) : 0)}px`,
            top: `${btnCenter.top + (showFan ? 150 * Math.sin(i * Math.PI / 4) : 0)}px`,
            transition: showFan
              ? `left 0.5s cubic-bezier(.22,1.5,.36,1) ${i * 80}ms, top 0.5s cubic-bezier(.22,1.5,.36,1) ${i * 80}ms, opacity 0.5s ${i * 80}ms, transform 0.5s ${i * 80}ms`
              : `opacity 0.25s, transform 0.25s`,
            zIndex: 9999,
          }"
          @click="selectMode(mode.color)"
        >
          <component :is="mode.icon" class="w-7 h-7" />
        </button>
      </transition-group>
    </teleport>
  </div>
</template>

<style scoped>
.fan-enter-active, .fan-leave-active {
  transition: all 0.3s;
}
.fan-enter-from, .fan-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
.fan-shadow-enter-active, .fan-shadow-leave-active {
  transition: opacity 0.3s;
}
.fan-shadow-enter-from, .fan-shadow-leave-to {
  opacity: 0;
}
.fan-shadow-enter-to, .fan-shadow-leave-from {
  opacity: 1;
}
.fan-sector-enter-active, .fan-sector-leave-active {
  transition: transform 0.35s cubic-bezier(.4,2,.6,1);
}
.fan-sector-enter-from, .fan-sector-leave-to {
  transform: scale(0.2);
}
.fan-sector-enter-to, .fan-sector-leave-from {
  transform: scale(1);
}

.fan-btn-enter-active {
  transition: left 0.5s cubic-bezier(.22,1.5,.36,1), top 0.5s cubic-bezier(.22,1.5,.36,1), opacity 0.5s, transform 0.5s;
}
.fan-btn-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fan-btn-enter-from {
  left: var(--center-x, 0px) !important;
  top: var(--center-y, 0px) !important;
  opacity: 0;
  transform: scale(0.5);
}
.fan-btn-enter-to {
  opacity: 1;
  transform: scale(1);
}
.fan-btn-leave-from {
  opacity: 1;
  transform: scale(1);
}
.fan-btn-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>