<script setup lang="ts">
import { fetchFavoriteExperimentsApi, toggleFavoriteApi } from '@/api/experiment/experimentApi.ts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils.ts';
import { useUserStore } from '@/store';
import { success } from '@/utils/toast.ts';
import { Bot, Star } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

async function toggleFavorite(expId: string) {
  try {
    const response = await toggleFavoriteApi(expId);
    await refreshFavorite();
    success(response.isFavorite ? '已收藏' : '已取消收藏');
  }
  catch (error) {
    console.error('Error during toggle favorite:', error);
  }
}

async function refreshFavorite() {
  try {
    const response = await fetchFavoriteExperimentsApi();
    userStore.favoriteExperiments = response.experiments;
  }
  catch (error) {
    console.error('Error during fetching favorite experiments:', error);
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="max-w-screen-xl h-full w-full p-10 flex gap-8">
      <div class="max-w-sm flex-1">
        <div class="bg-card rounded-xl flex flex-col p-6 shadow gap-4">
          <div class="rounded-lg p-5 bg-secondary size-20 flex items-center justify-center">
            <Star
              class="size-full"
              :style="{
                fill: '#FFA500',
                stroke: '#FFA500',
              }"
            />
          </div>
          <Label class="text-3xl"> 我的收藏 </Label>
          <Label class="font-normal">
            {{ userStore.user?.nickname }}·{{ userStore.favoriteExperiments.length }} 个实验
          </Label>
          <Separator />
          <div class="flex flex-col">
            <Label class="font-normal mb-4"> 数据分析 </Label>
            <div class="flex flex-col gap-2 h-52 bg-secondary rounded-lg" />
          </div>
        </div>
      </div>
      <div v-auto-animate class="flex-1 h-full overflow-y-auto flex flex-col min-w-lg">
        <div v-for="(experiment, index) in userStore.favoriteExperiments" :key="experiment.expId" class="flex items-center">
          <Button
            :variant="index % 2 ? 'secondary' : 'ghost'" :class="cn('justify-start h-12 text-base font-normal flex-1', index % 2 && 'bg-secondary/70')" @click="() => {
              router.push(`/dashboard-prob/experiment/${experiment.expId}`);
            }"
          >
            {{ index + 1 }}. {{ experiment.expName }}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button size="icon" variant="ghost" class="p-1 size-8 ml-2 rounded-full" @click="toggleFavorite(experiment.expId)">
                  <Star
                    class="size-5 transition-all" :style="{
                      fill: userStore.isFavorite(experiment.expId) ? '#FFA500' : 'none',
                      stroke: userStore.isFavorite(experiment.expId) ? '#FFA500' : '#999',
                    }"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>取消收藏</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon" variant="ghost" class="p-1 size-8 ml-1 rounded-full" @click="() => {
                    router.push({
                      path: '/dashboard-prob/ai',
                      query: {
                        query: `请介绍一下${experiment.expName}`,
                      },
                    });
                  }"
                >
                  <Bot
                    class="size-5 transition-all"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI介绍</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
