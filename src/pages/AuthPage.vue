<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import { Dices } from 'lucide-vue-next';
</script>

<template>
  <div class="h-full w-full flex">
    <div class="w-1/2 lg:flex items-center justify-center bg-primary border-r hidden">
      <div class="w-full h-full flex flex-col items-center justify-center text-background">
        <!--        <img src="/src/assets/Frame%208.svg" alt="logo" class="w-48 mb-12" /> -->
        <Dices class="size-28 mb-4 hover:scale-105 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] transition-all" />
        <span class="font-semibold text-3xl tracking-widest hover:scale-105 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] transition-all">邮趣概率</span>
      </div>
    </div>
    <div v-auto-animate class="flex-1 px-8 py-4 bg-background flex h-full items-center justify-center">
      <router-view />
    </div>
  </div>
</template>
