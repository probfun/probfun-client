<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils';
import { logout } from '@/utils/auth';
import { Book, Bot, CircleHelp, Dices, LogOut, Star, Sun, User } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface SideBarItem {
  label: string
  icon: any
  route?: string
  command?: () => void
}

const route = useRoute();

const showIndex = ref(false);

function toggleDrawer() {
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
    command: () => {
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
    route: '/dashboard',
  },
  {
    label: '登出',
    icon: LogOut,
    command: () => {
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
  },
  {
    label: '三门问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/three-doors',
  },
  {
    label: '生日问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-problem',
  },
  {
    label: '生日攻击问题',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-attack',
  },
  {
    label: '阳性检测',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/positive-test',
  },
];

const chapter2Items = [
  {
    label: '二项分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/binomialDistribution',
  },
  {
    label: '泊松分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poissonDistribution',
  },
  {
    label: '几何分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/geometricDistribution',
  },
  {
    label: '均匀分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/evenDistribution',
  },
  {
    label: '指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/exponentialDistribution',
  },
  {
    label: '正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/normalDistribution',
  },
];

const comparisonOfDistributions = [
  {
    label: '二项分布与泊松分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialPoisson',
  },
  {
    label: '二项分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialNormal',
  },
  {
    label: '泊松分布与指数分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonExponential',
  },
  {
    label: '泊松分布与正态分布',
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonNormal',
  },
];
</script>

<template>
  <div>
    <aside class="h-full border-r flex flex-col relative bg-background z-40">
      <div class="p-2 border-b flex">
        <Button size="icon">
          <Dices class="size-5" />
        </Button>
      </div>
      <div class="p-2">
        <ul class="space-y-1">
          <li v-for="(item, index) in sideBarItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon" variant="ghost" :class="cn(isActiveRoute(item.route) && 'bg-muted')"
                    @click="() => {
                      if (item.command) item.command();
                      else if (item.route) router.push(item.route);
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
      <div class="mt-auto p-2">
        <ul class="space-y-1">
          <li v-for="(item, index) in sideBarBottomItem" :key="index">
            <TooltipProvider :delay-duration="0">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon" variant="ghost" @click="() => {
                      if (item.route) router.push(item.route);
                      else if (item.command) item.command();
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
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { router.push(item.route); toggleDrawer(); }"
                    >
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
                    <a
                      :class="{ active: isActiveRoute(item.route) }"
                      @click="() => { router.push(item.route); toggleDrawer(); }"
                    >
                      <i :class="item.icon" /> {{ item.label }}
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary><i class="pi pi-chart-bar" />分布的对比</summary>
                      <ul>
                        <li v-for="item in comparisonOfDistributions" :key="item.label">
                          <a
                            :class="{ active: isActiveRoute(item.route) }"
                            @click="() => { router.push(item.route); toggleDrawer(); }"
                          >
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
  </div>
</template>

<style scoped>
</style>
