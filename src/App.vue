<script setup lang="ts">
import Toast from 'primevue/toast';
// import { onBeforeUnmount, onMounted, watch } from 'vue';
// import { useRouter } from 'vue-router';
import { Toaster } from '@/components/ui/toast';
// import { browseApi } from './api/track/trackApi';
//
// const router = useRouter();
//
// async function enterPage() {
//   try {
//     await browseApi('ENTER', window.location.href);
//     console.log('Entered');
//   }
//   catch (error) {
//     console.error('Error tracking page enter:', error);
//   }
// }
//
// async function leavePage() {
//   try {
//     await browseApi('LEAVE', window.location.href);
//     console.log('Leave');
//   }
//   catch (error) {
//     console.error('Error tracking page leave:', error);
//   }
// }
//
// onMounted(async () => {
//   await enterPage();
// });
//
// onBeforeUnmount(async () => {
//   await leavePage();
// });
//
// watch(
//   () => router.currentRoute.value,
//   async (to, from) => {
//     if (from) {
//       await leavePage(); // 离开之前的页面
//     }
//     if (to) {
//       await enterPage(); // 进入新的页面
//     }
//   },
// );
</script>

<template>
  <div v-auto-animate class="h-full w-full">
    <router-view />
    <Toast />
    <Toaster />
  </div>
</template>
