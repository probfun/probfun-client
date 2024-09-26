<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import Toast from 'primevue/toast';

import { onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './store';
import { browseApi } from './api/track/trackApi'; // 导入 API 调用

const router = useRouter();
const userStore = useUserStore();
const id = userStore.user?.uid;

// 页面加载时触发埋点
onMounted(async () => {
  if (id) {
    try {
      await browseApi('ENTER', window.location.href);
      console.log('Page entered');
    } catch (error) {
      console.error('Error tracking page enter:', error);
    }
  }
});

// 页面卸载时触发埋点
onBeforeUnmount(async () => {
  if (id) {
    try {
      await browseApi('LEAVE', window.location.href);
      console.log('Page left');
    } catch (error) {
      console.error('Error tracking page leave:', error);
    }
  }
});

// 监听路由变化，进入和离开页面时分别发送埋点
watch(() => router.currentRoute.value, async (to, from) => {
  if (id) {
    if (from) {
      try {
        await browseApi('LEAVE', from.fullPath);
        console.log('Left page:', from.fullPath);
      } catch (error) {
        console.error('Error tracking page leave:', error);
      }
    }

    if (to) {
      try {
        await browseApi('ENTER', to.fullPath);
        console.log('Entered page:', to.fullPath);
      } catch (error) {
        console.error('Error tracking page enter:', error);
      }
    }
  }
});
</script>

<template>
  <div v-auto-animate class="h-full w-full">
    <router-view />
    <Toast />
  </div>
</template>
