<script setup lang="ts">
import type { Mathematician } from '@/api/trand/trand.ts';
import { Icon } from '@iconify/vue';
import { FlaskConical, Lightbulb, SearchCheck } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { fetchMathematicianList } from '@/api/trand/trand.ts';
import WeeklyThoughtCard from '@/components/home/WeeklyThoughtCard.vue';
import { homeConfigs } from '@/components/subject/configs.ts';
// import { mathematicians } from '@/components/subject/mathematician.ts';
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

const mathematicians = ref<Mathematician[]>([]);

const currentMathematicianIndex = ref(0);
const currentMathematician = computed(() => mathematicians.value[currentMathematicianIndex.value]);

function nextMathematician() {
  if (!mathematicians.value.length)
    return;
  currentMathematicianIndex.value = (currentMathematicianIndex.value + 1) % mathematicians.value.length;
}
function prevMathematician() {
  if (!mathematicians.value.length)
    return;
  currentMathematicianIndex.value
    = (currentMathematicianIndex.value - 1 + mathematicians.value.length) % mathematicians.value.length;
}
onMounted(async () => {
  if (configStore.currentSubjectId !== 'probability') {
    return;
  }
  try {
    const response = await fetchMathematicianList();
    mathematicians.value = response.mathematicians;
    if (mathematicians.value.length) {
      currentMathematicianIndex.value = Math.floor(Math.random() * mathematicians.value.length);
    }
  }
  catch (e) {
    console.error('Error fetching mathematicians:', e);
  }
});

function yearOf(date?: string): string {
  if (!date)
    return '';
  const m = date.match(/\d{4}/);
  return m ? m[0] : date;
}

function formatLifespan(m: Mathematician): string {
  const birth = yearOf(m.birthDate);
  const death = m.deathDate ? yearOf(m.deathDate) : '至今';
  return `${birth} - ${death}`;
}
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
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <section class="h-full flex flex-col">
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
          class="grid gap-3 flex-1"
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
                <div class="w-full max-h-60 overflow-hidden rounded-md border border-primary/40 flex items-center justify-center">
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
          class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 text-muted-foreground min-h-60 h-full"
        >
          <div class="flex items-center gap-2">
            <Icon icon="lucide:info" class="h-4 w-4" />
            <span>本课程的思维导图还在开发中哦</span>
          </div>
        </div>
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

        <template v-if="mathematicians.length > 0">
          <Card class="flex flex-1 flex-col transition-all hover:shadow-md hover:border-primary">
            <CardContent class="p-0 space-y-3 flex-1">
              <div v-if="mathematicians.length > 0" class="w-full overflow-hidden rounded-md flex h-full">
                <!-- 左侧人像 -->
                <div class="relative bg-muted/30 border-r border-primary/20 p-4 flex items-center justify-center">
                  <img
                    v-if="currentMathematician?.portraits"
                    class="object-cover border rounded-lg h-72 w-56"
                    :src="currentMathematician.portraits"
                    :alt="currentMathematician.fullName"
                    loading="lazy"
                  >
                  <div v-else class="h-full w-full grid place-items-center text-muted-foreground text-xs">
                    无人像
                  </div>
                  <!-- 左右切换按钮 -->
                  <button
                    class="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-7 w-7 rounded-full bg-background/80 backdrop-blur ring-1 ring-primary/30 hover:ring-primary transition"
                    @click.stop="prevMathematician"
                  >
                    <Icon icon="lucide:chevron-left" class="h-4 w-4 text-primary" />
                  </button>
                  <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-7 w-7 rounded-full bg-background/80 backdrop-blur ring-1 ring-primary/30 hover:ring-primary transition"
                    @click.stop="nextMathematician"
                  >
                    <Icon icon="lucide:chevron-right" class="h-4 w-4 text-primary" />
                  </button>
                </div>

                <!-- 右侧信息区 -->
                <div class="flex-1 p-4 flex flex-col">
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <div class="text-xl font-semibold text-primary">
                        {{ currentMathematician.fullName }}
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 space-y-2 text-sm">
                    <div>
                      <span class="font-medium">国籍：</span>
                      <span class="text-muted-foreground">{{ currentMathematician && currentMathematician.birthPlace }}</span>
                    </div>
                    <div>
                      <span class="font-medium">生卒：</span>
                      <span class="text-muted-foreground">{{ currentMathematician && formatLifespan(currentMathematician) }}</span>
                    </div>
                    <div>
                      <span class="font-medium">简介：</span>
                      <Label class="block text-muted-foreground line-clamp-5 leading-relaxed">
                        {{ currentMathematician.summary }}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
        <template v-else>
          <div class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 text-muted-foreground min-h-60 h-full">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:info" class="h-4 w-4" />
              <span>本课程还没有数学家哦</span>
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
            <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">每周一思</span>
          </div>
          <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </div>
        <template v-if="weeklyThoughts && weeklyThoughts.length">
          <router-link to="/week-thinking" class="block flex-1">
            <WeeklyThoughtCard
              class="h-full transition-all hover:shadow-md hover:border-primary group [&_.prose]:max-h-48 [&_.prose]:overflow-hidden"
              :title="weeklyThoughts[0].title"
              :description="weeklyThoughts[0].description"
              :docx-url="weeklyThoughts[0].docxUrl"
            />
          </router-link>
        </template>
        <template v-else>
          <div class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 text-muted-foreground min-h-60 h-full">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:info" class="h-4 w-4" />
              <span>本周还没有内容哦</span>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>
