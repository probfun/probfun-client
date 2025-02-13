<script setup lang="ts">
import type { Feedback } from '@/api/feedback/feedbackType';

import { fetchFeedbackApi, postFeedbackApi } from '@/api/feedback/feedbackApi';
import { clickApi } from '@/api/track/trackApi';
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
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store';
import { logout } from '@/utils/auth';
import { Book, Bot, CircleHelp, Dices, Home, LogOut, Star, Sun, User } from 'lucide-vue-next';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const toast = useToast();
const userStore = useUserStore();

interface SideBarItem {
  label: string
  icon: any
  route?: string
  command?: () => void
}

const route = useRoute();
const seeFeedback = ref(false);
const isFeedback = ref(false);
const showIndex = ref(false);

async function toggleDrawer() {
  showIndex.value = !showIndex.value;
}

function isActiveRoute(itemRoute: string) {
  return route.path === itemRoute;
}

const router = useRouter();
const sideBarItem = ref<SideBarItem[]>([
  {
    label: '主页',
    icon: Home,
    route: '/dashboard',
  },
  {
    label: '目录',
    icon: Book,
    route: '/dashboard/experiment',
    command: toggleDrawer,
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

const chapter1Items = [
  {
    label: 'Buffon投针',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/buffon',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', 'Buffon投针', window.location.href);
        console.log('Buffon投针');
        await router.push('/dashboard/experiment/buffon');
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
        await router.push('/dashboard/experiment/three-doors');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
    route: '/dashboard/experiment/three-doors',
  },
  {
    label: '贝特朗悖论',
    icon: 'pi pi-chart-bar',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '贝特朗悖论', window.location.href);
        console.log('贝特朗悖论');
        await router.push('/dashboard/experiment/bertrand');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
    route: '/dashboard/experiment/bertrand',
  },
  {
    label: '生日问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/birthday-problem',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '生日问题', window.location.href);
        console.log('生日问题');
        await router.push('/dashboard/experiment/birthday-problem');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '生日攻击问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/birthday-attack',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '生日攻击问题', window.location.href);
        console.log('生日攻击问题');
        await router.push('/dashboard/experiment/birthday-attack');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '阳性检测',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/positive-test',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '阳性检测', window.location.href);
        console.log('阳性检测');
        await router.push('/dashboard/experiment/positive-test');
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
    route: '/dashboard/experiment/binomial-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布', window.location.href);
        console.log('二项分布');
        await router.push('/dashboard/experiment/binomial-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poisson-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布', window.location.href);
        console.log('泊松分布');
        await router.push('/dashboard/experiment/poisson-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '几何分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/geometric-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '几何分布', window.location.href);
        console.log('几何分布');
        await router.push('/dashboard/experiment/geometric-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '均匀分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/uniform-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '均匀分布', window.location.href);
        console.log('均匀分布');
        await router.push('/dashboard/experiment/uniform-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/exponential-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '指数分布', window.location.href);
        console.log('指数分布');
        await router.push('/dashboard/experiment/exponential-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/normal-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '正态分布', window.location.href);
        console.log('正态分布');
        await router.push('/dashboard/experiment/normal-distribution');
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
    route: '/dashboard/experiment/binomial-poisson',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布与泊松分布', window.location.href);
        console.log('二项分布与泊松分布');
        await router.push('/dashboard/experiment/binomial-poisson');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '二项分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/binomial-normal',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二项分布与正态分布', window.location.href);
        console.log('二项分布与正态分布');
        await router.push('/dashboard/experiment/binomial-normal');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布与指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poisson-exponential',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布与指数分布', window.location.href);
        console.log('泊松分布与指数分布');
        router.push('/dashboard/experiment/poisson-exponential');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '泊松分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poisson-normal',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '泊松分布与正态分布', window.location.href);
        console.log('泊松分布与正态分布');
        router.push('/dashboard/experiment/poisson-normal');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
];

const chapter3Items = [
  {
    label: '二维均匀分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/2d-uniform-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二维均匀分布', window.location.href);
        console.log('二维均匀分布');
        await router.push('/dashboard/experiment/2d-uniform-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '二维正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/2d-normal-distribution',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '二维正态分布', window.location.href);
        console.log('二维正态分布');
        await router.push('/dashboard/experiment/2d-normal-distribution');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  // {
  //   label: '中心极限定理',
  //   icon: 'pi pi-chart-bar',
  //   route: '/dashboard/experiment/centralLimitTheorem',
  //   command: async () => {
  //     try {
  //       await clickApi('CLICK', 'catalogue', '中心极限定理', window.location.href);
  //       console.log('中心极限定理');
  //       await router.push('/dashboard/experiment/centralLimitTheorem');
  //     }
  //     catch (error) {
  //       console.error('Error tracking button click:', error);
  //     }
  //   },
  // },
]
const chapter4Items = [
  {
    label: '期望检验',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/expectation-test',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '期望检验', window.location.href);
        await router.push('/dashboard/experiment/expectation-test');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
]
const chapter5Items = [
  {
    label: '中心极限定理',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/central-limit-theorem',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '中心极限定理', window.location.href);
        await router.push('/dashboard/experiment/central-limit-theorem');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
  {
    label: '各种分布的中心极限定理',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/distribution-clt',
    command: async () => {
      try {
        await clickApi('CLICK', 'catalogue', '各种分布的中心极限定理', window.location.href);
        await router.push('/dashboard/experiment/distribution-clt');
      }
      catch (error) {
        console.error('Error tracking button click:', error);
      }
    },
  },
]
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

function goHome() {
  router.push('/dashboard')
}
</script>

<template>
  <div class="h-full">
    <aside class="h-full border-r flex flex-col relative bg-background z-40 items-center gap-4 px-2 sm:py-3">
      <Button
        size="icon"
        class="group rounded-full size-9 bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        @click="goHome()"
      >
        <Dices class="size-5 group-hover:scale-110" />
      </Button>
      <!--      <a -->
      <!--        href="#" -->
      <!--        class="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base" -->
      <!--      > -->
      <!--        <Package2 class="h-4 w-4 transition-all group-hover:scale-110" /> -->
      <!--        <span class="sr-only">Acme Inc</span> -->
      <!--      </a> -->
      <div class="">
        <ul class="space-y-2 flex flex-col items-center">
          <li v-for="(item, index) in sideBarItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon" variant="ghost"
                    :class="cn('size-9 rounded-lg text-muted-foreground', isActiveRoute(item.route ?? '') && '!bg-muted text-foreground')"
                    @click="() => {
                      if (item.command) item.command();
                      else if (item.route) router.push(item.route);
                      if (item.label !== '目录') showIndex = false;
                    }"
                  >
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
      <div class="mt-auto">
        <ul class="space-y-2">
          <li v-for="(item, index) in sideBarBottomItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon" variant="ghost" class="size-9 text-muted-foreground" @click="() => {
                      if (item.route) router.push(item.route);
                      else if (item.command) item.command();
                      showIndex = false;
                    }"
                  >
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
        <div class="bg-background min-h-full w-80 max-w-full p-2 ml-12 pt-14">
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
                <ul class="sapce-y-1">
                  <li v-for="(item, index) in chapter1Items" :key="item.label">
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }"
                    >
                      <i :class="item.icon" />
                      1.{{ index + 1 }}-{{ item.label }}
                      <Star
                        v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                        :style="{
                          fill: '#FFA500',
                          stroke: '#FFA500',
                        }"
                      />
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- 第二章 -->
            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第二章
                </summary>
                <ul class="sapce-y-1">
                  <li v-for="(item, index) in chapter2Items" :key="item.label">
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }"
                    >
                      <i :class="item.icon" />
                      2.{{ index + 1 }}-{{ item.label }}
                      <Star
                        v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                        :style="{
                          fill: '#FFA500',
                          stroke: '#FFA500',
                        }"
                      />
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary><i class="pi pi-chart-bar" />2.7-分布的对比</summary>
                      <ul class="sapce-y-1">
                        <li v-for="(item, index) in comparisonOfDistributions" :key="item.label">
                          <a
                            :class="{ active: isActiveRoute(item.route) }"
                            @click="() => { item.command(); toggleDrawer(); }"
                          >
                            <i />
                            2.7.{{ index + 1 }}-{{ item.label }}
                            <Star
                              v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                              :style="{
                                fill: '#FFA500',
                                stroke: '#FFA500',
                              }"
                            />
                          </a>
                        </li>
                      </ul>
                    </details>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第三章
                </summary>
                <ul class="sapce-y-1">
                  <li v-for="(item, index) in chapter3Items" :key="item.label">
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }"
                    >
                      <i :class="item.icon" />
                      3.{{ index + 1 }}-{{ item.label }}
                      <Star
                        v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                        :style="{
                          fill: '#FFA500',
                          stroke: '#FFA500',
                        }"
                      />
                    </a>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第四章
                </summary>
                <ul class="sapce-y-1">
                  <li v-for="(item, index) in chapter4Items" :key="item.label">
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }"
                    >
                      <i :class="item.icon" />
                      4.{{ index + 1 }}-{{ item.label }}
                      <Star
                        v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                        :style="{
                          fill: '#FFA500',
                          stroke: '#FFA500',
                        }"
                      />
                    </a>
                  </li>
                </ul>
              </details>
            </li>

            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark" /> 第五章
                </summary>
                <ul class="sapce-y-1">
                  <li v-for="(item, index) in chapter5Items" :key="item.label">
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { item.command(); toggleDrawer(); }"
                    >
                      <i :class="item.icon" />
                      5.{{ index + 1 }}-{{ item.label }}
                      <Star
                        v-if="userStore.favoriteExperiments.map(item_ => item_.expId).includes(item.route.substring(item.route.lastIndexOf('/') + 1) || item.route)" class="size-4 ml-auto"
                        :style="{
                          fill: '#FFA500',
                          stroke: '#FFA500',
                        }"
                      />
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
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
