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
const themeStore = useThemeStore()
const btnRef = ref<HTMLElement | null>(null)
const btnCenter = ref({ left: 0, top: 0 })
const colorRouteMap: Record<string, string> = {
  'rgb(36, 96, 226)': '-prob', // 邮趣概率
  'rgb(34, 168, 109)': '-advmath', // 邮趣高数
  'rgb(142, 68, 173)': '-linalg', // 邮趣线代
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
}
function selectMode(color: string) {
  themeStore.currentColor = color
    router.push('/dashboard' + colorRouteMap[themeStore.currentColor]);
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
      @click="toggleFan"
    >
      <component :is="modes.find(m => m.color === themeStore.currentColor)?.icon" class="w-6 h-6" />
    </button>
    <!-- 模式按钮弧线展开，使用 Teleport 到 body -->
    <teleport to="body">
      <transition-group name="fan">
        <button
          v-for="(mode, i) in modes"
          v-if="showFan"
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
    <!-- 当前模式显示 -->
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
</style>