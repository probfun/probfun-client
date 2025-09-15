<script setup lang="ts">
import BoxSelector from '@/components/selector/BoxSelector.vue';
</script>

<template>
  <div class="h-full w-full flex">
    <div class="w-[61.8%] flex items-center justify-center bg-primary transition-color border-r select-none">
      <div class="w-full h-full flex flex-col items-center justify-center text-background">
        <BoxSelector />
      </div>
    </div>
    <div v-auto-animate class="flex-1 px-8 py-4 bg-background flex h-full items-center justify-center">
      <router-view />
    </div>
  </div>
</template>
