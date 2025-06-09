<template>
  <div class="w-screen h-screen flex">
    <SideBar class="z-50" />
    <div v-auto-animate class="w-screen h-screen flex flex-col relative transition-all overflow-y-hidden">
      <NavBar />
      <!-- <router-view class="flex-1 overflow-y-hidden" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.dashboard-linear-root {
  display: flex;
  min-height: 100vh;
  background: rgb(142, 68, 173);
}
</style>