<template>
  <div class="w-screen h-screen flex flex-col relative bg-base-100 transition-all overflow-y-hidden">
    <nav-bar />
    <router-view class="flex-1 overflow-y-hidden" />
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