<script setup lang="ts">
import type BoxSelector from '@/components/selector/BoxSelector.vue';
import { vAutoAnimate } from '@formkit/auto-animate';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchFavoriteExperimentsApi } from '@/api/experiment/experimentApi.ts';
import { fetchUserApi } from '@/api/user/userApi';
import NavBar from '@/components/navbar/NavBar.vue';
import CardSelector from '@/components/selector/CardSelector.vue';
import SideBar from '@/components/sidebar/SideBar.vue';
import { Button } from '@/components/ui/button';
import { useConfigStore, useUserStore } from '@/store';
import { isVisitor } from '@/utils/auth.ts';

const router = useRouter();
const route = useRoute();
const hideSideBar = computed(() => route.path.startsWith('/subjects'));
const userStore = useUserStore();

const subjectSelector = ref<typeof BoxSelector | null>(null);
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

const configStore = useConfigStore();

function updateSubject() {
  subjectSelector.value?.updateConfigSubject();
}
</script>

<template>
  <div v-auto-animate class="w-screen h-screen flex flex-col p-2 gap-2">
    <NavBar />
    <div v-if="configStore.currentSubject" v-auto-animate class="flex-1 gap-2 flex relative transition-all overflow-hidden">
      <SideBar v-if="!hideSideBar" />
      <router-view class="flex-1 overflow-y-auto" />
    </div>
    <div v-else class="flex-1 grid grid-cols-[2fr_1fr] overflow-hidden items-center justify-center border rounded-xl shadow-md">
      <div class="border-r overflow-y-auto overflow-x-hidden h-full">
        <CardSelector ref="subjectSelector" :immediate="false" hint-color="text-muted-foreground" />
      </div>
      <div class="flex flex-col items-center justify-center p-6 gap-4 h-full">
        <div
          v-auto-animate
          class="w-full h-full rounded-xl border bg-muted/40 p-4 flex flex-col"
        >
          <div class="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <span class="px-2 py-0.5 rounded-full bg-muted">即将进入</span>
          </div>

          <div class="mt-4 flex flex-col items-center justify-center flex-1 gap-3">
            <div
              class="size-16 rounded-full flex items-center justify-center ring-2"
              :style="{
                color: subjectSelector?.currentSubject.color || '#000000',
                boxShadow: `0 0 0 4px color-mix(in oklab, ${subjectSelector?.currentSubject.color || '#000000'} 20%, transparent)`,
              }"
            >
              <component
                :is="subjectSelector?.currentSubject.icon"
                class="size-8"
              />
            </div>

            <div
              class="text-3xl font-bold tracking-wide"
              :style="{ color: subjectSelector?.currentSubject.color || '#000000' }"
            >
              {{ subjectSelector?.currentSubject.name || '未选择科目' }}
            </div>

            <p class="text-base text-muted-foreground">
              {{ subjectSelector?.currentSubject.description }}
            </p>
          </div>
        </div>

        <Button
          class="mr-2 w-full"
          :style="{
            backgroundColor: subjectSelector?.currentSubject.color || 'hsl(var(--primary))',
            borderColor: subjectSelector?.currentSubject.color || 'hsl(var(--primary))',
            color: '#fff',
          }"
          @click="updateSubject"
        >
          确认
        </Button>
      </div>
    </div>
  </div>
</template>

<style></style>
