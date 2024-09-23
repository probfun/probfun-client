<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';
import { vAutoAnimate } from '@formkit/auto-animate'
</script>

<template>
  <div class="w-screen h-screen flex">
    <SideBar />
    <div v-auto-animate class="w-screen h-screen flex flex-col relative transition-all overflow-y-hidden">
      <NavBar />
      <router-view class="flex-1 overflow-y-hidden" />
    </div>
  </div>
</template>

<style></style>
