<script setup lang="ts">
import { Book, MessageSquareMore, Star, Bot, User, Sun, LogOut, CircleHelp, Dices } from 'lucide-vue-next';
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import { vAutoAnimate } from "@formkit/auto-animate";
import {Input} from "@/components/ui/input";

interface SideBarItem {
  label: string;
  icon: any;
  route?: string;
  command?: () => void;
}

const route = useRoute();

function toggleDrawer() {
  showIndex.value = !showIndex.value;
}

const isActiveRoute = (itemRoute: string) => {
  return route.path === itemRoute;
};

const showIndex = ref(false);

const router = useRouter();
const sideBarItem = ref<SideBarItem[]>([
  {
    label: '目录',
    icon: Book,
    command: toggleDrawer
  },
  {
    label: '发帖交流',
    icon: MessageSquareMore,
    route: '/dashboard'
  },
  {
    label: '收藏',
    icon: Star ,
    route: '/dashboard'
  },
  {
    label: '大模型回答',
    icon: Bot ,
    route: '/dashboard'
  },
  {
    label: '个人资料',
    icon: User ,
    route: '/dashboard'
  },
  {
    label: '页面主题',
    icon: Sun,
    route: '/dashboard'
  }
]);

const sideBarBottomItem = ref<SideBarItem[]>([
  {
    label: '意见反馈',
    icon: CircleHelp,
    route: '/dashboard'
  },
  {
    label: '登出',
    icon: LogOut,
    route: '/dashboard'
  }
]);

const chapter1Items = [
  {
    label: "Buffon投针",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/buffon'
  },
  {
    label: "三门问题",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/three-doors'
  },
  {
    label: "生日问题",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-problem'
  },
  {
    label: "生日攻击问题",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/birthday-attack'
  },
  {
    label: "阳性检测",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/chapter1/positive-test'
  }
];

const chapter2Items = [
  {
    label: "二项分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/binomialDistribution'
  },
  {
    label: "泊松分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/poissonDistribution'
  },
  {
    label: "几何分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/geometricDistribution'
  },
  {
    label: "均匀分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/evenDistribution'
  },
  {
    label: "指数分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/exponentialDistribution'
  },
  {
    label: "正态分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/normalDistribution'
  },
];

const comparisonOfDistributions = [
  {
    label: "二项分布与泊松分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialPoisson'
  },
  {
    label: "二项分布与正态分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/binomialNormal'
  },
  {
    label: "泊松分布与指数分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonExponential'
  },
  {
    label: "泊松分布与正态分布",
    icon: 'pi pi-chart-bar',
    route: '/dashboard/experiment/comparison/poissonNormal'
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
                  <Button @click="() => {
                  if (item.route) router.push(item.route);
                  else if (item.command) item.command();
                }" size="icon" variant="ghost">
                    <component :is="item.icon" class="size-5"></component>
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
                  <Button @click="() => {
                 if (item.route) router.push(item.route);
                 else if (item.command) item.command();
               }" size="icon" variant="ghost">
                    <component :is="item.icon" class="size-5"></component>
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
      <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="showIndex" />
      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="bg-background min-h-full w-72 max-w-full p-2 ml-12 pt-14">
<!--          <div class="flex justify-between p-3 pb-5 border-b">-->
<!--            <label class="font-bold text-2xl">-->
<!--              实验-->
<!--            </label>-->
<!--            <div>-->
<!--              <button class="btn btn-ghost btn-circle btn-sm" for="my-drawer" @click="toggleDrawer">-->
<!--                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"-->
<!--                     stroke="currentColor" class="size-6">-->
<!--                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />-->
<!--                </svg>-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->

          <ul class="menu rounded-box w-full">
            <li>
              <details open>
                <summary class="font-bold">
                  <i class="pi pi-bookmark"></i> 第一章
                </summary>
                <ul>
                  <li v-for="item in chapter1Items" :key="item.label">
                    <a @click="() => { router.push(item.route); toggleDrawer(); }"
                       :class="{ 'active': isActiveRoute(item.route) }">
                      <i :class="item.icon"></i> {{ item.label }}
                    </a>
                  </li>
                </ul>
              </details>
            </li>
            <!-- 第二章 -->
            <li>
              <details>
                <summary class="font-bold">
                  <i class="pi pi-bookmark"></i> 第二章
                </summary>
                <ul>
                  <li v-for="item in chapter2Items" :key="item.label">
                    <a @click="() => { router.push(item.route); toggleDrawer(); }"
                       :class="{ 'active': isActiveRoute(item.route) }">
                      <i :class="item.icon"></i> {{ item.label }}
                    </a>
                  </li>
                  <li>
                    <details open>
                      <summary><i class="pi pi-chart-bar"></i>分布的对比</summary>
                      <ul>
                        <li v-for="item in comparisonOfDistributions" :key="item.label">
                          <a @click="() => { router.push(item.route); toggleDrawer(); }"
                             :class="{ 'active': isActiveRoute(item.route) }">
                            <i :class="item.icon"></i> {{ item.label }}
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
  transition-timing-function: ease-in-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>