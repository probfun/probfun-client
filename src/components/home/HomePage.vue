<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { FlaskConical, SearchCheck } from 'lucide-vue-next';
import { homeConfigs } from '@/components/subject/configs.ts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
const experiments = homeConfigs[configStore.currentSubjectId].experiments;
const mindMaps = homeConfigs[configStore.currentSubjectId].mindMaps;
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col gap-6 p-3">
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
