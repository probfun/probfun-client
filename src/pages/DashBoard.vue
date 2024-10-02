<script setup lang="ts">
import { fetchUserApi } from '@/api/user/userApi';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';
import { useUserStore } from '@/store';
import { vAutoAnimate } from '@formkit/auto-animate'
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const result = await fetchUserApi();
    result.user.gender = result.user.gender.toString();
    console.log('User:', result.user);
    userStore.user = result.user;
  }
  catch (error) {
    console.error('Error during fetching user:', error);
    await router.push('/login');
  }
})
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
