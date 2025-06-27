<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import BoxSelector from '@/components/mode/BoxSelector.vue'
import { useThemeStore } from '@/store';

const themeStore = useThemeStore();

// function handleColorChange(color: string) {
//   themeStore.setColor(color);
// }
</script>

<template>
  <div class="h-full w-full flex">
    <div 
      class="w-[61.8%] lg:flex items-center justify-center border-r hidden select-none transition-colors duration-800"
      :style="{ backgroundColor: themeStore.currentColor }"
    >
      <div class="w-full h-full flex flex-col items-center justify-center text-background">
        <BoxSelector />
      </div>
    </div>
    <div v-auto-animate class="flex-1 px-8 py-4 bg-background flex h-full items-center justify-center">
      <router-view />
    </div>
  </div>
</template>