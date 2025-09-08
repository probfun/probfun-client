<script setup lang="ts">
import type { Chapter } from '@/api/do-question/doQuestion.ts';

import type { Feedback } from '@/api/feedback/feedbackType';
import type { DrawerItem } from '@/components/sidebar/DrawerItem.ts';
import vAutoAnimate from '@formkit/auto-animate';
import { Icon } from '@iconify/vue';
import { Book, Bot, CircleHelp, Dices, FlaskConical, Home, LogOut, Star, Sun, User } from 'lucide-vue-next';
import { useToast } from 'primevue/usetoast';
import { TreeItem, TreeRoot } from 'radix-vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchChapterListApi, fetchSubjectListApi } from '@/api/do-question/doQuestion.ts';
import { fetchFeedbackApi, postFeedbackApi } from '@/api/feedback/feedbackApi.ts';
import { clickApi } from '@/api/track/trackApi.ts';
import { experimentItems, questionItems } from '@/components/sidebar/DrawerItem.ts';
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
import { cn } from '@/lib/utils.ts';
import { useUserStore } from '@/store';
import { isVisitor, logout } from '@/utils/auth.ts';

const toast = useToast();
const userStore = useUserStore();

interface SideBarItem {
  label: string;
  icon: any;
  route?: string;
  command?: () => void;
}

const route = useRoute();
const seeFeedback = ref(false);
const isFeedback = ref(false);
const openExperimentDrawer = ref(false);
const openQuestionDrawer = ref(false);

function toggleExperimentDrawer() {
  openExperimentDrawer.value = !openExperimentDrawer.value;
  openQuestionDrawer.value = false;
}

function toggleQuestionDrawer() {
  openQuestionDrawer.value = !openQuestionDrawer.value;
  openExperimentDrawer.value = false;
}

function isActiveRoute(itemRoute: string) {
  return route.path === itemRoute;
}

const router = useRouter();
const vistorAllowedItem = [
  '主页',
  '目录',
];
const sideBarItem = ref<SideBarItem[]>([
  {
    label: '主页',
    icon: Home,
    route: '/dashboard',
  },
  {
    label: '实验目录',
    icon: FlaskConical,
    route: '/dashboard/experiment',
    command: toggleExperimentDrawer,
  },
  {
    label: '做题目录',
    icon: Book,
    route: '/dashboard/experiment',
    command: toggleQuestionDrawer,
  },
  {
    label: '收藏',
    icon: Star,
    route: '/dashboard/favorite',
  },
  {
    label: '大模型回答',
    icon: Bot,
    route: '/dashboard/ai',
  },
  {
    label: '个人资料',
    icon: User,
    route: userStore.user?.role === 0 ? '/dashboard/info0' : '/dashboard/info1',
  },
]);

const sideBarBottomItem = ref<SideBarItem[]>([
  {
    label: '切换主题',
    icon: Sun,
    command: async () => {
      try {
        await clickApi('CLICK', 'sideBar', '切换主题', window.location.href);
        console.log('切换主题');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
      }
      else {
        document.documentElement.classList.toggle('dark');
      }
    },
  },
  {
    label: '问题反馈',
    icon: CircleHelp,
    command: () => {
      isFeedback.value = true;
    },
  },
  {
    label: '登出',
    icon: LogOut,
    command: async () => {
      try {
        await clickApi('CLICK', 'sideBar', '登出', window.location.href);
        console.log('登出');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
      logout();
      await router.push('/login');
    },
  },
]);

const feedback = ref('improvement');
const content = ref('');
const feedbackList = ref<Feedback[] | null>(null);

async function refreshFeedback() {
  if (isVisitor()) {
    return;
  }
  try {
    const result = await fetchFeedbackApi();
    feedbackList.value = result.feedback;
    feedbackList.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  catch (error) {
    console.error('Error during fetching feedbacks:', error);
  }
}

function toItemTree(root: Chapter): DrawerItem {
  interface AnyNode { id: number; name: string; children?: AnyNode[] }
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
    route: `/dashboard/mindmap/${root.name}`,
  });

  return chapter;
}

async function refreshQuestionList() {
  try {
    const response = await fetchChapterListApi('5'); // 传subjectId
    const chapterList = response.chapters;
    questionItems.value = chapterList.map(chapter => toItemTree(chapter));
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
}

async function refreshSubjectList() {
  try {
    // TODO: 与页面关联
    await fetchSubjectListApi();
  }
  catch (error) {
    console.error('Error tracking button click:', error);
  }
}

onMounted(() => {
  // TODO: 先获取所有subject，根据subjectId获取所有chapter，用chapterId获取章节内所有question
  refreshSubjectList();
  refreshFeedback();
  refreshQuestionList();
});

async function sendFeedback() {
  if (isVisitor()) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请先登录', life: 3000 });
    return;
  }
  if (content.value === '') {
    toast.add({ severity: 'warn', summary: '提示', detail: '意见反馈不能为空', life: 3000 });
    return;
  }
  try {
    await postFeedbackApi(feedback.value, content.value);
    await refreshFeedback();
    toast.add({ severity: 'success', summary: '成功', detail: '反馈成功，感谢您的支持！', life: 3000 });
    content.value = '';
  }
  catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: '错误', detail: error, life: 3000 });
  }
}

function goHome() {
  router.push('/dashboard');
}
</script>

<template>
  <div class="relative">
    <aside class="h-full border rounded-xl flex flex-col relative bg-background z-50 items-center gap-4 p-3 shadow-lg">
      <Button
        size="icon"
        class="group rounded-full bg-primary text-lg font-semibold text-primary-foreground size-10 md:text-base"
        @click="goHome()"
      >
        <Dices class="size-6 group-hover:scale-110 transition-all" />
      </Button>
      <div class="space-y-2 flex flex-col items-center">
        <div v-for="(item, index) in sideBarItem" :key="index">
          <TooltipProvider v-if="!isVisitor() || vistorAllowedItem.includes(item.label)" :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon" variant="ghost"
                  :class="cn('size-11 rounded-lg text-muted-foreground', isActiveRoute(item.route ?? '') && '!bg-muted !text-primary')"
                  @click="() => {
                    if (item.command) item.command();
                    else if (item.route) router.push(item.route);
                    if (item.label !== '实验目录') openExperimentDrawer = false;
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
      <div class="mt-auto space-y-2">
        <div v-for="(item, index) in sideBarBottomItem" :key="index">
          <TooltipProvider v-if="!isVisitor() || item.label === '切换主题'" :delay-duration="0">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon" variant="ghost" class="size-10 text-muted-foreground" @click="() => {
                    if (item.route) router.push(item.route);
                    else if (item.command) item.command();
                    openExperimentDrawer = false;
                    openQuestionDrawer = false;
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
    <div class="absolute left-full ml-2 top-[4rem] z-50 transition-all bottom-0 rounded-xl overflow-y-auto border w-96 bg-background shadow-xl" :class="!openExperimentDrawer && 'opacity-0 pointer-events-none'">
      <TreeRoot
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
    </div>
    <div v-if="openExperimentDrawer" class="left-full top-0 h-full absolute w-screen z-40" @click="openExperimentDrawer = false" />

    <!-- question drawer -->
    <div class="absolute left-full ml-2 top-[4rem] z-50 transition-all bottom-0 rounded-xl overflow-y-auto border w-96 bg-background shadow-xl" :class="!openQuestionDrawer && 'opacity-0 pointer-events-none'">
      <TreeRoot
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
                name: 'DoQuestion',
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
    </div>
    <div v-if="openQuestionDrawer" class="left-full top-0 h-full absolute w-screen z-40" @click="openQuestionDrawer = false" />

    <Dialog v-model:open="isFeedback" class="overflow-y-auto h-2/3">
      <DialogContent class="overflow-y-auto h-2/3">
        <DialogHeader>
          <DialogTitle>
            问题反馈
            <button
              v-if="userStore.user?.role === 1 && seeFeedback === false" class="mr-5 underline"
              @click="seeFeedback = true"
            >
              (查看所有意见反馈)
            </button>
            <button
              v-if="userStore.user?.role === 1 && seeFeedback === true" class="mr-5 underline"
              @click="seeFeedback = false"
            >
              (返回)
            </button>
          </DialogTitle>
          <DialogDescription v-if="seeFeedback === false">
            <!--            感谢您对邮趣概率的支持！我们非常重视您的意见和建议，以便不断改进我们的服务。欢迎您分享以下内容：<br> -->
            <!--            1. <strong>功能建议：</strong>您希望我们增加哪些新功能或改进现有功能？<br> -->
            <!--            2. <strong>遇到的错误：</strong>在使用过程中，您是否遇到了任何技术或内容错误？<br> -->
            <!--            3. <strong>其他建议：</strong>任何其他您觉得有价值的意见和建议，我们都欢迎您告诉我们！ -->
            <!--            感谢您对概率论学习和本软件的支持！<br> -->
            如果您在学习概率论时遇到了任何问题，或者有任何希望改进本软件的建议，请随时告诉我们。
            课堂上您提出的学习问题会由老师统一答复，而关于软件的反馈，我们的开发团队会及时调整和优化，确保更好地满足您的需求！期待您的宝贵意见！
          </DialogDescription>
        </DialogHeader>
        <!--        <div class="flex flex-wrap gap-4 mt-5"> -->
        <!--          <div class="flex items-center"> -->
        <!--            <RadioButton v-model="feedback" input-id="feedback1" value="improvement" /> -->
        <!--            <label for="feedback1" class="ml-2">功能建议</label> -->
        <!--          </div> -->
        <!--          <div class="flex items-center"> -->
        <!--            <RadioButton v-model="feedback" input-id="feedback2" value="bug" /> -->
        <!--            <label for="feedback2" class="ml-2">遇到的错误</label> -->
        <!--          </div> -->
        <!--          <div class="flex items-center"> -->
        <!--            <RadioButton v-model="feedback" input-id="feedback3" value="other" /> -->
        <!--            <label for="feedback3" class="ml-2">其他建议</label> -->
        <!--          </div> -->
        <!--        </div> -->
        <FloatLabel v-if="seeFeedback === false">
          <Textarea v-model="content" class="resize-none" :rows="15" placeholder="请在这里输入您的问题反馈！" />
        </FloatLabel>
        <div v-if="seeFeedback === true">
          <div v-for="feed in feedbackList" :key="feed.feedbackID">
            <div class="border py-3">
              {{ feed.content }}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button v-if="seeFeedback === false" @click="sendFeedback">
              提交
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped></style>
