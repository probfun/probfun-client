<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { FlaskConical, Lightbulb, SearchCheck } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { homeConfigs } from '@/components/subject/configs.ts';
import { mathematicians } from '@/components/subject/mathematician.ts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
const experiments = configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].experiments : null;
const mindMaps = configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].mindMaps : null;
const weeklyThoughts = configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].thinking : null;

const currentMathematicianIndex = ref(mathematicians.length ? Math.floor(Math.random() * mathematicians.length) : 0);
const currentMathematician = computed(() => mathematicians[currentMathematicianIndex.value]);
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col gap-6 p-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <section class="h-full flex flex-col">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Lightbulb class="h-4 w-4 text-primary" />
            </span>
            <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">每周一思</span>
          </div>
          <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
        <template v-if="weeklyThoughts && weeklyThoughts.length">
          <router-link to="/week-thinking" class="block flex-1">
            <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary group">
              <CardHeader class="p-4 pb-2">
                <CardTitle class="text-base">
                  {{ weeklyThoughts[0].title }}
                </CardTitle>
              </CardHeader>
              <CardContent class="px-4 pb-4 pt-2 flex-1 flex flex-col">
                <div v-for="(item, i) in weeklyThoughts[0].description?.slice(0, 4)" :key="i" class="flex items-start gap-2">
                  <Label class="line-clamp-1 leading-relaxed font-normal text-muted-foreground cursor-auto">{{ item }}</Label>
                </div>
                <div class="mt-auto text-right group-hover:opacity-100 opacity-0 transition-all">
                  <span class="inline-flex items-center gap-1 text-sm text-primary">
                    查看详情
                    <Icon icon="lucide:arrow-right" class="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </router-link>
        </template>
        <template v-else>
          <div class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 text-muted-foreground h-full">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:info" class="h-4 w-4" />
              <span>本周还没有内容哦</span>
            </div>
          </div>
        </template>
      </section>
      <section class="h-full flex flex-col">
        <div class="mb-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <Lightbulb class="h-4 w-4 text-primary" />
            </span>
            <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">数学家</span>
          </div>
          <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
        <Card class="flex flex-1 flex-col transition-all hover:shadow-md hover:border-primary">
          <CardHeader class="p-2" />
          <CardContent class="px-4 pb-4 pt-0 space-y-3 flex-1">
            <div class="w-full overflow-hidden rounded-md border border-primary/40 flex h-full">
              <!-- 左侧预留图片占位（约 1/3） -->
              <div class="w-32 bg-muted/30 border-r border-primary/20 flex items-center justify-center text-xs text-muted-foreground">
                待补图
              </div>
              <!-- 右侧基础信息（当前轮播中的数学家） -->
              <div class="flex-1 p-3">
                <div class="flex items-center gap-2 text-primary">
                  <span class="font-medium">{{ currentMathematician.name }}<span v-if="currentMathematician.enName"> ({{ currentMathematician.enName }})</span>（{{ currentMathematician.lifespan }}）</span>
                </div>
                <div class="mt-2 space-y-1 text-sm text-muted-foreground">
                  <div class="font-semibold">
                    <span>{{ currentMathematician.name }}</span>
                    <span v-if="currentMathematician.enName" class="ml-1 text-xs text-muted-foreground">({{ currentMathematician.enName }})</span>
                  </div>
                  <div>
                    <span class="font-medium">生卒：</span>{{ currentMathematician.lifespan }}
                  </div>
                  <div>
                    <span class="font-medium">国家：</span>{{ currentMathematician.country }}
                  </div>
                  <div>
                    <span class="font-medium">领域：</span>{{ currentMathematician.field }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <FlaskConical class="h-4 w-4 text-primary" />
          </span>
          <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">热门实验</span>
        </div>
        <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>
      <div
        v-if="experiments && experiments.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        <router-link
          v-for="(exp, index) in experiments"
          :key="index"
          :to="exp.path"
          class="group block h-full"
        >
          <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-base">
                {{ exp.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4 pt-0 space-y-3">
              <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40">
                <img
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  :src="exp.img"
                  :alt="exp.title"
                  loading="lazy"
                >
              </div>
              <Label class="line-clamp-2 leading-relaxed font-normal text-muted-foreground">
                {{ exp.description }}
              </Label>
            </CardContent>
          </Card>
        </router-link>
      </div>
      <div
        v-else
        class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 h-60 text-muted-foreground"
      >
        <div class="flex items-center gap-2">
          <Icon icon="lucide:info" class="h-4 w-4" />
          <span>本课程的实验还在开发中哦</span>
        </div>
      </div>
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <SearchCheck class="h-4 w-4 text-primary" />
          </span>
          <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">思维导图</span>
        </div>
        <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>
      <div
        v-if="mindMaps && mindMaps.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <router-link
          v-for="(map, index) in mindMaps"
          :key="index"
          :to="map.path"
          class="group block h-full"
        >
          <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-base">
                {{ map.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4 pt-0 space-y-3">
              <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40">
                <img
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  :src="map.img"
                  :alt="map.title"
                  loading="lazy"
                >
              </div>
              <Label class="line-clamp-3 leading-relaxed font-normal text-muted-foreground">
                {{ map.description }}
              </Label>
            </CardContent>
          </Card>
        </router-link>
      </div>
      <div
        v-else
        class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 h-60 text-muted-foreground"
      >
        <div class="flex items-center gap-2">
          <Icon icon="lucide:info" class="h-4 w-4" />
          <span>本课程的思维导图还在开发中哦</span>
        </div>
      </div>
    </section>
  </div>
</template>
