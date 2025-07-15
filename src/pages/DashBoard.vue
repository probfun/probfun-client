<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchFavoriteExperimentsApi } from '@/api/experiment/experimentApi.ts';
import { fetchUserApi } from '@/api/user/userApi';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/SideBar.vue';
import { useUserStore } from '@/store';
import { isVisitor } from '@/utils/auth.ts';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  if (isVisitor()) {
    return;
  }
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
  try {
    const response = await fetchFavoriteExperimentsApi();
    userStore.favoriteExperiments = response.experiments;
  }
  catch (error) {
    console.error('Error during fetching favorite experiments:', error);
  }
});
</script>

<template>
  <div class="w-screen h-screen flex">
    <SideBar class="z-50" />
    <div v-auto-animate class="w-screen h-screen flex flex-col relative transition-all overflow-y-hidden">
      <NavBar />
      <router-view class="flex-1 overflow-y-hidden" />
    </div>
  </div>
</template>

<style></style>
