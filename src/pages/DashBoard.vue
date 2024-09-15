<template>
  <div class="w-screen h-screen flex" >
    <side-bar />
    <div class="w-screen h-screen flex flex-col relative transition-all overflow-y-hidden" v-auto-animate>
      <nav-bar />
      <router-view class="flex-1 overflow-y-hidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import SideBar from "@/components/SideBar.vue";
import { vAutoAnimate } from '@formkit/auto-animate'

</script>

<style></style>