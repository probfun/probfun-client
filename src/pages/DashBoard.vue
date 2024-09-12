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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';
import NavBar from "@/components/NavBar.vue";
import Container from "@/components/Container.vue";
import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";
import SideBar from "@/components/SideBar.vue";
import { vAutoAnimate } from '@formkit/auto-animate'
const store = useStore();
const useritems = ref([
  {
    label: '修改个人信息',
    icon: 'pi pi-server',
  },
  {
    label: '登出',
    icon: 'pi pi-sign-out',
    command: () => { store.dispatch('logout'); }
  },
]);
</script>

<style></style>