<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { Lightbulb, SearchCheck, User } from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { homeConfigs } from '@/components/subject/configs.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { mathematicians as mathematicianData } from '@/data/mathematicians';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
const mindMaps = homeConfigs[configStore.currentSubjectId].mindMaps;
const experiments = homeConfigs[configStore.currentSubjectId].experiments;

// 每周一思（正式内容）
const weeklyThoughts = ref([
  {
    title: '第1周 每周一思',
    description: [
      '1）柯尔莫哥洛夫的公理化体系将概率定义为满足非负性、规范性和可列可加性的测度，现实中的不确定性是否都可以用这一框架描述？',
      '2）概率是客观存在还是主观建构？',
    ],
  },
]);

// 数学家轮播（示例占位）
type Mathematician = typeof mathematicianData[number];
const mathematicians = ref<Mathematician[]>(mathematicianData);

const currentMathematicianIndex = ref(0);
const currentMathematician = computed(() => mathematicians.value[currentMathematicianIndex.value]);

let timer: number | undefined;
function startMathematicianTimer() {
  if (timer) {
    window.clearInterval(timer);
  }
  timer = window.setInterval(() => {
    currentMathematicianIndex.value = (currentMathematicianIndex.value + 1) % mathematicians.value.length;
  }, 4000);
}
function stopMathematicianTimer() {
  if (timer) {
    window.clearInterval(timer);
    timer = undefined;
  }
}
onMounted(() => {
  startMathematicianTimer();
});
onUnmounted(() => {
  stopMathematicianTimer();
});

// 判断是否替换为“数学家”方块：匹配第四章思维导图
function isMathBlock(map: any) {
  if (typeof map?.path !== 'string') {
    return false;
  }
  // 兼容有无前导斜杠的路径
  const normalized = map.path.startsWith('/') ? map.path.slice(1) : map.path;
  return normalized.includes('dashboard/mindmap/chapter-4');
}
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col gap-6 p-3">
    <!-- 热门实验 + 右侧每周一思（第1周） -->
    <section>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <!-- 左侧：热门实验 -->
        <div class="lg:col-span-3">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Icon icon="lucide:flask-conical" class="h-4 w-4 text-primary" />
              </span>
              <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">热门实验</span>
            </div>
            <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <div
            v-if="experiments && experiments.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <router-link
              v-for="(exp, i) in experiments.slice(0, 3)"
              :key="i"
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
                  <Label class="line-clamp-3 leading-relaxed font-normal text-muted-foreground">
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
        </div>

        <!-- 右侧：每周一思（仅第1周） -->
        <div class="lg:col-span-1">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                <Lightbulb class="h-4 w-4 text-primary" />
              </span>
              <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">每周一思</span>
            </div>
            <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <Card v-if="weeklyThoughts && weeklyThoughts.length" class="h-full flex flex-col">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-base">
                {{ weeklyThoughts[0].title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4 pt-0 space-y-3">
              <div v-for="(item, i) in weeklyThoughts[0].description" :key="i">
                <Label class="leading-relaxed font-normal text-muted-foreground">{{ item }}</Label>
              </div>
            </CardContent>
          </Card>
          <div v-else class="flex items-center justify-center rounded-md border border-dashed border-primary/30 bg-muted/20 h-40 text-muted-foreground">
            <div class="flex items-center gap-2">
              <Icon icon="lucide:info" class="h-4 w-4" />
              <span>本周还没有内容哦</span>
            </div>
          </div>
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
        <template v-for="(map, index) in mindMaps" :key="index">
          <!-- 数学家方块（替换第四章） -->
          <router-link v-if="isMathBlock(map)" class="group block h-full cursor-pointer" to="/dashboard/mathematicians">
            <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary">
              <CardHeader class="p-4 pb-2">
                <CardTitle class="text-base">
                  数学家
                </CardTitle>
              </CardHeader>
              <CardContent class="px-4 pb-4 pt-0 space-y-3">
                <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40 flex">
                  <!-- 左侧预留图片占位（约 1/3） -->
                  <div class="w-1/3 bg-muted/30 border-r border-primary/20 flex items-center justify-center text-xs text-muted-foreground">
                    待补图
                  </div>
                  <!-- 右侧基础信息（当前轮播中的数学家） -->
                  <div class="flex-1 p-3">
                    <div class="flex items-center gap-2 text-primary">
                      <User class="h-5 w-5" />
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
          </router-link>

          <!-- 常规思维导图卡片 -->
          <router-link v-else :to="map.path" class="group block h-full">
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
        </template>
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

  <!-- 取消小窗弹窗，改为跳转列表页/详情页 -->
</template>
