<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchFavoriteExperimentsApi } from '@/api/experiment/experimentApi.ts';
import { fetchUserApi } from '@/api/user/userApi';
import NavBar from '@/components/NavBar.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import { useUserStore } from '@/store';
import { isVisitor } from '@/utils/auth.ts';

const router = useRouter();
const route = useRoute();
const hideSideBar = computed(() => route.path.startsWith('/subjects'));
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
  <div class="w-screen h-screen flex p-2 gap-2">
    <SideBar v-if="!hideSideBar" />
    <div v-auto-animate class="h-full flex-1 gap-2 flex flex-col relative transition-all overflow-y-hidden">
      <NavBar />
      <router-view class="flex-1 overflow-y-hidden" />
    </div>
  </div>
</template>

<style></style>
