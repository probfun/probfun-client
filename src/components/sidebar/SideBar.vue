<script setup lang="ts">
import type { Chapter } from '@/api/do-question/doQuestion.ts';

import type { DrawerItem } from '@/components/subject/configs.ts';
import { Icon } from '@iconify/vue';
import { Book, Bot, Codepen, FlaskConical, Home, Star, User } from 'lucide-vue-next';
import { TreeItem, TreeRoot } from 'radix-vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchChapterListApi, fetchSubjectListApi } from '@/api/do-question/doQuestion.ts';
import BoxSelector from '@/components/selector/BoxSelector.vue';
import { experimentConfigs } from '@/components/subject/configs.ts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useConfigStore, useUserStore } from '@/store';
import { isVisitor } from '@/utils/auth.ts';

interface SideBarItem {
  label: string;
  icon: any;
  route?: string;
  command?: () => void;
}

const route = useRoute();
const openSubjectSelector = ref(false);
const openExperimentDrawer = ref(false);
const openQuestionDrawer = ref(false);
const subjectSelector = ref<typeof BoxSelector | null>(null);

function toggleExperimentDrawer() {
  openExperimentDrawer.value = !openExperimentDrawer.value;
  openQuestionDrawer.value = false;
}

function toggleQuestionDrawer() {
  openQuestionDrawer.value = !openQuestionDrawer.value;
  openExperimentDrawer.value = false;
}

function isActiveRoute(itemRoute: string, restrict = false): boolean {
  return route.path === itemRoute || (!restrict && route.path.startsWith(`${itemRoute}/`));
}

const router = useRouter();
const vistorAllowedItem = [
  '主页',
  '实验目录',
  '做题目录',
];
const sideBarItem = ref<SideBarItem[]>([
  {
    label: '主页',
    icon: Home,
    route: '/',
  },
  {
    label: '实验目录',
    icon: FlaskConical,
    route: '/experiment',
    command: toggleExperimentDrawer,
  },
  {
    label: '做题目录',
    icon: Book,
    route: '/question',
    command: toggleQuestionDrawer,
  },
  {
    label: '收藏',
    icon: Star,
    route: '/favorite',
  },
  {
    label: '大模型回答',
    icon: Bot,
    route: '/ai',
  },
]);

const configStore = useConfigStore();
const experimentItems = configStore.currentSubjectId ? experimentConfigs[configStore.currentSubjectId].experiments : null;
const questionItems = ref<DrawerItem[]>([]);

function toItemTree(root: Chapter): DrawerItem {
  interface AnyNode { id: string; name: string; children?: AnyNode[] }
  const project = (node: any): AnyNode => ({
    id: node.id,
    name: node.name,
    children: node.children?.map(project) ?? [],
  });

  const rootProjected = project(root);

  const mapNode = (node: AnyNode): DrawerItem => {
    const isLeaf = !node.children || node.children.length === 0;
    const item: DrawerItem = {
      title: node.name,
      icon: isLeaf ? 'lucide:notebook' : 'lucide:folder',
    };
    if (isLeaf) {
      item.chapterId = node.id;
    }
    else {
      item.children = node.children!.map(mapNode);
    }
    return item;
  };

  const chapter = mapNode(rootProjected);
  chapter.children?.unshift({
    title: '思维导图',
    icon: 'lucide:chart-pie',
    chapterId: root.id,
  });

  return chapter;
}

async function refreshQuestionList() {
  if (!configStore.currentSubject)
    return;
  try {
    const response = await fetchChapterListApi(configStore.currentSubject.id_);
    const chapterList = response.chapters;
    questionItems.value = chapterList.map(chapter => toItemTree(chapter));
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
}

async function refreshSubjectList() {
  try {
    await fetchSubjectListApi();
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
}

onMounted(() => {
  // TODO: 先获取所有subject，根据subjectId获取所有chapter，用chapterId获取章节内所有question
  refreshSubjectList();
  refreshQuestionList();

  const role = useUserStore().user?.role ?? 0;
  if (role > 1) {
    sideBarItem.value.push({
      label: '班级学情',
      icon: Codepen,
      route: '/class-analysis',
    });
  }
  else if (role === 1) {
    sideBarItem.value.push({
      label: '学情面板',
      icon: User,
      route: '/analysis',
    });
  }
});

function updateSubject() {
  subjectSelector.value?.updateConfigSubject();
  window.location.reload();
}
</script>

<template>
  <div class="relative">
    <aside class="h-full border rounded-xl flex flex-col relative bg-background z-50 items-center gap-4 p-3 shadow-lg">
      <!--      <Button -->
      <!--        size="icon" -->
      <!--        class="group rounded-full bg-primary text-lg font-semibold text-primary-foreground size-10 md:text-base" -->
      <!--        @click="goHome()" -->
      <!--      > -->
      <!--        <component -->
      <!--          :is="useConfigStore().currentSubject.icon" class="size-6 group-hover:scale-110 transition-all" @click="() => { -->
      <!--            openSubjectSelector = true; -->
      <!--          }" -->
      <!--        /> -->
      <!--      </Button> -->

      <!--      <img src="/logo-math.svg" alt="" class="size-10"> -->
      <div class="space-y-2 flex flex-col items-center">
        <div v-for="(item, index) in sideBarItem" :key="index">
          <TooltipProvider v-if="!isVisitor() || vistorAllowedItem.includes(item.label)" :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon" variant="ghost"
                  class="size-11 rounded-lg text-muted-foreground"
                  :class="(isActiveRoute(item.route ?? '', true) || (item.label === '实验目录' && isActiveRoute('/experiment')) || (item.label === '做题目录' && (isActiveRoute('/question') || isActiveRoute('/mindmap/question')))) && '!bg-muted !text-primary'"
                  @click="() => {
                    if (item.command) item.command();
                    else if (item.route) router.push(item.route);
                    if (item.label !== '实验目录') openExperimentDrawer = false;
                    if (item.label !== '做题目录') openQuestionDrawer = false;
                  }"
                >
                  <component :is="item.icon" class="size-6" :stroke-width="2" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{{ item.label }}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>

    <!-- experiment drawer -->
    <div class="absolute left-full ml-2 top-0 z-50 transition-all bottom-0 rounded-xl overflow-y-auto border w-96 bg-background shadow-xl" :class="!openExperimentDrawer && 'opacity-0 pointer-events-none'">
      <TreeRoot
        v-if="experimentItems && experimentItems.length"
        v-slot="{ flattenItems }"
        v-auto-animate
        class="list-none select-none w-full rounded-lg px-3 py-2 text-base font-medium"
        :items="experimentItems"
        :get-key="(item) => item.title"
        :default-expanded="['components']"
      >
        <TreeItem
          v-for="item in flattenItems"
          v-slot="{ isExpanded }"
          :key="item._id"
          :style="{ 'padding-left': `${item.level - 0.5}rem` }"
          v-bind="item.bind"
          class="flex items-center p-2 cursor-pointer my-0.5 rounded outline-none focus:ring-primary focus:ring-2 data-[selected]:bg-muted"
          @click="() => {
            if (item.value.route) {
              router.push(item.value.route);
              openExperimentDrawer = false;
            }
          }"
        >
          <template v-if="item.hasChildren">
            <Icon
              v-if="!isExpanded"
              icon="lucide:folder"
              class="h-4 w-4"
            />
            <Icon
              v-else
              icon="lucide:folder-open"
              class="h-4 w-4"
            />
          </template>
          <Icon
            v-else
            :icon="item.value.icon || 'lucide:file'"
            class="h-4 w-4"
          />
          <div class="pl-2">
            {{ item.value.title }}
          </div>
        </TreeItem>
      </TreeRoot>

      <div v-else class="px-4 py-3 text-sm text-muted-foreground h-full flex justify-center items-center">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:info" class="h-4 w-4" />
          <span>本课程的实验还在开发中哦</span>
        </div>
      </div>
    </div>
    <div v-if="openExperimentDrawer" class="left-full top-0 h-full absolute z-40" @click="openExperimentDrawer = false" />

    <!-- question drawer -->
    <div class="absolute left-full ml-2 top-0 z-50 transition-all bottom-0 rounded-xl overflow-y-auto border w-96 bg-background shadow-xl" :class="!openQuestionDrawer && 'opacity-0 pointer-events-none'">
      <TreeRoot
        v-if="questionItems && questionItems.length"
        v-slot="{ flattenItems }"
        v-auto-animate
        class="list-none select-none w-full rounded-lg px-3 py-2 text-base font-medium"
        :items="questionItems"
        :get-key="(item) => item.title"
        :default-expanded="['components']"
      >
        <TreeItem
          v-for="item in flattenItems"
          v-slot="{ isExpanded }"
          :key="item._id"
          :style="{ 'padding-left': `${item.level - 0.5}rem` }"
          v-bind="item.bind"
          class="flex items-center p-2 cursor-pointer my-0.5 rounded outline-none focus:ring-primary focus:ring-2 data-[selected]:bg-muted"
          @click="() => {
            if (item.value.chapterId) {
              router.push({
                name: item.value.title === '思维导图' ? 'QuestionDiagram' : 'DoQuestion',
                params: { chapterId: item.value.chapterId },
              });
              openQuestionDrawer = false;
            }
          }"
        >
          <template v-if="item.hasChildren">
            <Icon
              v-if="!isExpanded"
              icon="lucide:folder"
              class="h-4 w-4"
            />
            <Icon
              v-else
              icon="lucide:folder-open"
              class="h-4 w-4"
            />
          </template>
          <Icon
            v-else
            :icon="item.value.icon || 'lucide:file'"
            class="h-4 w-4"
          />
          <div class="pl-2">
            {{ item.value.title }}
          </div>
        </TreeItem>
      </TreeRoot>
      <div v-else class="px-4 py-3 text-sm text-muted-foreground h-full flex justify-center items-center">
        <div class="flex items-center gap-2">
          <Icon icon="lucide:info" class="h-4 w-4" />
          <span>本课程暂时还没有题目哦</span>
        </div>
      </div>
    </div>
    <div v-if="openQuestionDrawer" class="left-full top-0 h-full absolute w-screen z-40" @click="openQuestionDrawer = false" />

    <Dialog v-model:open="openSubjectSelector">
      <DialogContent class="max-w-4xl p-0 overflow-hidden">
        <DialogHeader class="px-6 pt-6">
          <DialogTitle>选择科目</DialogTitle>
          <DialogDescription>请选择您想要学习的科目。</DialogDescription>
        </DialogHeader>

        <div class="grid grid-cols-[3fr_1fr] gap-6 p-6 pt-2">
          <div class="space-y-3 md:pr-6 md:border-r">
            <BoxSelector ref="subjectSelector" :immediate="false" hint-color="text-muted-foreground" />
          </div>

          <div class="flex flex-col items-center justify-center gap-4">
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
                  class="text-2xl font-bold tracking-wide"
                  :style="{ color: subjectSelector?.currentSubject.color || '#000000' }"
                >
                  {{ subjectSelector?.currentSubject.name || '未选择科目' }}
                </div>

                <p class="text-sm text-muted-foreground">
                  将为您切换到所选科目的学习空间与题库。
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="px-6 pb-6">
          <DialogClose>
            <Button
              class="mr-2"
              :style="{
                backgroundColor: subjectSelector?.currentSubject.color || 'hsl(var(--primary))',
                borderColor: subjectSelector?.currentSubject.color || 'hsl(var(--primary))',
                color: '#fff',
              }"
              @click="updateSubject"
            >
              确认
            </Button>
            <Button variant="outline">
              取消
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped></style>
