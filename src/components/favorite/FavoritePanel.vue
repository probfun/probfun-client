<script setup lang="ts">
import { Bot, Star } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { fetchFavoriteExperimentsApi, toggleFavoriteApi } from '@/api/experiment/experimentApi.ts';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';
import { success } from '@/utils/toast.ts';

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
  <div class="min-h-full w-full mx-auto max-w-6xl py-8 px-6">
    <!-- 头部 -->
    <div class="mb-8 flex items-center gap-4">
      <div class="p-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
        <Star class="size-8 text-white" :style="{ fill: 'currentColor', stroke: 'currentColor' }" />
      </div>
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          我的收藏
        </h1>
        <p class="text-sm text-muted-foreground mt-1">
          {{ userStore.user?.nickname }} · 收藏了 {{ userStore.favoriteExperiments.length }} 个实验
        </p>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="userStore.favoriteExperiments.length" v-auto-animate class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(experiment, index) in userStore.favoriteExperiments"
        :key="experiment.expId"
        class="group relative rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4 flex flex-col shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/20 flex items-center justify-center text-orange-600 font-semibold">
            {{ index + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <Button
              variant="ghost"
              class="p-0 h-auto w-full justify-start text-left hover:bg-transparent"
              @click="router.push(`/dashboard/experiment/${experiment.expId}`)"
            >
              <span class="font-medium truncate text-base group-hover:text-orange-600 transition-colors">
                {{ experiment.expName }}
              </span>
            </Button>
          </div>
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    variant="ghost"
                    class="size-8 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20"
                    @click="toggleFavorite(experiment.expId)"
                  >
                    <Star
                      class="size-5"
                      :style="{
                        fill: userStore.isFavorite(experiment.expId) ? '#f97316' : 'none',
                        stroke: userStore.isFavorite(experiment.expId) ? '#f97316' : '#6b7280',
                      }"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>取消收藏</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    size="icon"
                    variant="ghost"
                    class="size-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    @click="router.push({ path: '/dashboard/ai', query: { query: `请介绍一下${experiment.expName}` } })"
                  >
                    <Bot class="size-5 text-blue-600 dark:text-blue-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>AI介绍</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="py-24 text-center">
      <div class="mx-auto mb-6 w-24 h-24 rounded-full bg-muted/40 flex items-center justify-center">
        <Star class="size-12 text-muted-foreground/50" />
      </div>
      <p class="text-lg font-medium text-muted-foreground mb-2">
        暂无收藏实验
      </p>
      <p class="text-sm text-muted-foreground/80">
        快去浏览并收藏一些感兴趣的实验吧
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
