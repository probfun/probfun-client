<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { logout } from '@/utils/auth';
import { Book, Bot, CircleHelp, Dices, LogOut, Star, Sun, User } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clickApi } from '@/api/track/trackApi';
import { fetchFeedbackApi } from '@/api/feedback/feedbackApi';
import { postFeedbackApi } from '@/api/feedback/feedbackApi';
import { Feedback } from '@/api/feedback/feedbackType';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

interface SideBarItem {
  label: string
  icon: any
  route?: string
  command?: () => void
}

const route = useRoute();
const isFeedback = ref(false);
const showIndex = ref(false);

async function toggleDrawer() {
  showIndex.value = !showIndex.value;
}

function isActiveRoute(itemRoute: string) {
  return route.path.startsWith(itemRoute);
}

const router = useRouter();
const sideBarItem = ref<SideBarItem[]>([
  {
    label: '目录',
    icon: Book,
    route: '/dashboard/experiment',
    command: toggleDrawer,
  },
  {
    label: '收藏',
    icon: Star,
    route: '/dashboard/star',
  },
  {
    label: '大模型回答',
    icon: Bot,
    route: '/dashboard/ai',
  },
  {
    label: '个人资料',
    icon: User,
    route: '/dashboard/info',
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
    label: '意见反馈',
    icon: CircleHelp,
    command: () => {
      isFeedback.value = true;
    }
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
      router.push('/login');
    },
  },
]);

const chapter1Items = [
  {
    label: 'Buffon投针',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/buffon',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', 'Buffon投针', window.location.href);
        console.log('Buffon投针');
        router.push('/dashboard/experiment/chapter1/buffon');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '三门问题',
    icon: 'pi pi-chart-bar',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '三门问题', window.location.href);
        console.log('三门问题');
        router.push('/dashboard/experiment/chapter1/three-doors');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
    route: '/dashboard/experiment/chapter1/three-doors',
  },
  {
    label: '生日问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-problem',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '生日问题', window.location.href);
        console.log('生日问题');
        router.push('/dashboard/experiment/chapter1/birthday-problem');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '生日攻击问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-attack',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '生日攻击问题', window.location.href);
        console.log('生日攻击问题');
        router.push('/dashboard/experiment/chapter1/birthday-attack');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '阳性检测',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/positive-test',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '阳性检测', window.location.href);
        console.log('阳性检测');
        router.push('/dashboard/experiment/chapter1/positive-test');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
];

const chapter2Items = [
  {
    label: '二项分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/binomialDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布', window.location.href);
        console.log('二项分布');
        router.push('/dashboard/experiment/binomialDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poissonDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布', window.location.href);
        console.log('泊松分布');
        router.push('/dashboard/experiment/poissonDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '几何分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/geometricDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '几何分布', window.location.href);
        console.log('几何分布');
        router.push('/dashboard/experiment/geometricDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '均匀分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/evenDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '均匀分布', window.location.href);
        console.log('均匀分布');
        router.push('/dashboard/experiment/evenDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/exponentialDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '指数分布', window.location.href);
        console.log('指数分布');
        router.push('/dashboard/experiment/exponentialDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/normalDistribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '正态分布', window.location.href);
        console.log('正态分布');
        router.push('/dashboard/experiment/normalDistribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
];

const comparisonOfDistributions = [
  {
    label: '二项分布与泊松分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialPoisson',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布与泊松分布', window.location.href);
        console.log('二项分布与泊松分布');
        router.push('/dashboard/experiment/comparison/binomialPoisson');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '二项分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialNormal',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布与正态分布', window.location.href);
        console.log('二项分布与正态分布');
        router.push('/dashboard/experiment/comparison/binomialNormal');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布与指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonExponential',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布与指数分布', window.location.href);
        console.log('泊松分布与指数分布');
        router.push('/dashboard/experiment/comparison/poissonExponential');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonNormal',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布与正态分布', window.location.href);
        console.log('泊松分布与正态分布');
        router.push('/dashboard/experiment/comparison/poissonNormal');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
];

const feedback = ref('improvement');
const content = ref('');
const feedbackList = ref<Feedback[] | null>(null);

async function refreshFeedback() {
  try {
    const result = await fetchFeedbackApi();
    feedbackList.value = result.feedback;
    feedbackList.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  catch (error) {
    console.error('Error during fetching feedbacks:', error);
  }
}
onMounted(() => {
  refreshFeedback();
});

async function sendFeedback() {
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

function goHome(){
  router.push('/dashboard/home')
}
</script>

<template>
  <div>
    <aside class="h-full border-r flex flex-col relative bg-background z-40">
      <div class="p-2 border-b flex">
        <Button size="icon" @click="goHome()">
          <Dices class="size-5" />
        </Button>
      </div>
      <div class="p-2">
        <ul class="space-y-1">
          <li v-for="(item, index) in sideBarItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button size="icon" variant="ghost" :class="cn(isActiveRoute(item.route ?? '') && 'bg-muted')" @click="() => {
                    if (item.command) item.command();
                    else if (item.route) router.push(item.route);
                  }">
                    <component :is="item.icon" class="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{{ item.label }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
      <div class="mt-auto p-2">
        <ul class="space-y-1">
          <li v-for="(item, index) in sideBarBottomItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button size="icon" variant="ghost" @click="() => {
                    if (item.route) router.push(item.route);
                    else if (item.command) item.command();
                  }">
                    <component :is="item.icon" class="size-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{{ item.label }}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </div>
    </aside>
    <div class="drawer z-30">
      <input id="my-drawer" v-model="showIndex" type="checkbox" class="drawer-toggle">
      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />
        <div class="bg-background min-h-full w-72 max-w-full p-2 ml-12 pt-14">
          <!--          <div class="flex justify-between p-3 pb-5 border-b"> -->
          <!--            <label class="font-bold text-2xl"> -->
          <!--              实验 -->
          <!--            </label> -->
          <!--            <div> -->
          <!--              <button class="btn btn-ghost btn-circle btn-sm" for="my-drawer" @click="toggleDrawer"> -->
          <!--                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" -->
          <!--                     stroke="currentColor" class="size-6"> -->
          <!--                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /> -->
          <!--                </svg> -->
          <!--              </button> -->
          <!--            </div> -->
          <!--          </div> -->

          <ul class="menu rounded-box w-full">
            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第一章
                </summary>
                <ul>
                  <li v-for="item in chapter1Items" :key="item.label">
                    <a :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }">
                      <i :class="item.icon" /> {{ item.label }}
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- 第二章 -->
            <li>
              <details>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第二章
                </summary>
                <ul>
                  <li v-for="item in chapter2Items" :key="item.label">
                    <a :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }">
                      <i :class="item.icon" /> {{ item.label }}
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary><i class="pi pi-chart-bar" />分布的对比</summary>
                      <ul>
                        <li v-for="item in comparisonOfDistributions" :key="item.label">
                          <a :class="{ active: isActiveRoute(item.route) }"
                            @click="() => { item.command(); toggleDrawer(); }">
                            <i :class="item.icon" /> {{ item.label }}
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Dialog v-model:open="isFeedback">
      <DialogContent class="overflow-y-auto p-10 max-w-xl">
        <DialogHeader>
          <DialogTitle>意见反馈</DialogTitle>
          <DialogDescription>
            感谢您对邮趣概率的支持！我们非常重视您的意见和建议，以便不断改进我们的服务。欢迎您分享以下内容：<br>
            1. <strong>功能建议：</strong>您希望我们增加哪些新功能或改进现有功能？<br>
            2. <strong>遇到的错误：</strong>在使用过程中，您是否遇到了任何技术或内容错误？<br>
            3. <strong>其他建议：</strong>任何其他您觉得有价值的意见和建议，我们都欢迎您告诉我们！
          </DialogDescription>
        </DialogHeader>
        <div class="flex flex-wrap gap-4 mt-5">
          <div class="flex items-center">
            <RadioButton v-model="feedback" inputId="feedback1" value="improvement" />
            <label for="feedback1" class="ml-2">功能建议</label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="feedback" inputId="feedback2" value="bug" />
            <label for="feedback2" class="ml-2">遇到的错误</label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="feedback" inputId="feedback3" value="other" />
            <label for="feedback3" class="ml-2">其他建议</label>
          </div>
        </div>
        <FloatLabel>
          <Textarea v-model="content" autoResize rows="10" cols="30" placeholder="请在这里输入您的意见！" />
        </FloatLabel>
        <DialogFooter>
          <DialogClose>
            <Button @click="sendFeedback">提交意见</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped></style>
