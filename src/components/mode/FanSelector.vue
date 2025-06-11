<script setup lang="ts">
import { ref } from 'vue'
import { Dice3, Infinity, MoveUpRight } from 'lucide-vue-next';
import { useThemeStore } from '@/store';
import router from '@/router';
const modes = [
  { name: "邮趣高数", icon: Infinity, color: 'rgb(34, 168, 109)' },
  { name: "邮趣线代", icon: MoveUpRight, color: 'rgb(142, 68, 173)' },
  { name: "邮趣概率", icon: Dice3, color: 'rgb(36, 96, 226)' },
]
const showFan = ref(false)
const showSectorShadow = ref(false)
const themeStore = useThemeStore()
const btnRef = ref<HTMLElement | null>(null)
const btnCenter = ref({ left: 0, top: 0 })
const colorRouteMap: Record<string, string> = {
  'rgb(36, 96, 226)': '-prob',
  'rgb(34, 168, 109)': '-advmath',
  'rgb(142, 68, 173)': '-linalg',
};

function updateBtnCenter() {
  if (btnRef.value) {
    const rect = btnRef.value.getBoundingClientRect()
    btnCenter.value = {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
    }
  }
}

function toggleFan() {
  updateBtnCenter()
  showFan.value = !showFan.value
  showSectorShadow.value = false
}
function selectMode(color: string) {
  themeStore.currentColor = color
  router.push('/dashboard' + colorRouteMap[themeStore.currentColor]);
  showFan.value = false
  showSectorShadow.value = false
}
function showShadow() {
  updateBtnCenter()
  showSectorShadow.value = !showSectorShadow.value
  showFan.value = showSectorShadow.value
}
</script>

<template>
  <div class="relative flex items-center justify-center">
    <!-- 主按钮 -->
    <button
      ref="btnRef"
      class="w-12 h-12 rounded-full text-white flex items-center justify-center shadow-lg"
      :style="{backgroundColor: themeStore.currentColor}"
      @click="() => { showShadow(); }"
    >
      <component
        :is="modes.find(m => m.color === themeStore.currentColor)?.icon"
        class="w-6 h-6"
      />
    </button>
    <!-- 扇形阴影和模式按钮弧线展开，使用 Teleport 到 body -->
    <teleport to="body">
      <!-- 扇形阴影 -->
      <transition name="fan-shadow">
        <svg
          v-if="showSectorShadow"
          @click="() => { showSectorShadow = false; showFan = false; }"
          :style="{
            position: 'fixed',
            left: '0px',
            top: '0px',
            zIndex: 9998,
            pointerEvents: 'auto',
            cursor: 'pointer'
          }"
          width="250"
          height="250"
        >
          <path
            d="M0,0 L250,0 A250,250 0 0,1 0,250 Z"
            fill="rgba(0,0,0,0.2)"
          />
        </svg>
      </transition>
      <transition-group name="fan">
        <button
          v-for="(mode, i) in modes"
          v-if="showSectorShadow"
          :key="mode.color"
          class="fixed w-14 h-14 rounded-full text-white border-2 flex items-center justify-center shadow"
          :style="{
            backgroundColor: mode.color,
            left: `${btnCenter.left + 120 * Math.cos(i * Math.PI / 4)}px`,
            top: `${btnCenter.top + 120 * Math.sin(i * Math.PI / 4)}px`,
            transition: 'all 0.3s',
            zIndex: 9999,
          }"
          @click="selectMode(mode.color)"
        >
          <component :is="modes[i].icon" class="w-7 h-7" />
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
</style>