<script setup lang="ts">
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-vue-next'
const store = useStore();

const router = useRouter();
const route = useRoute();

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

const isDrawerOpen = ref(false);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const isActiveRoute = (itemRoute: string) => {
  return route.path === itemRoute;
};

const isAuthenticated = computed(() => store.getters.isAuthenticated);

const user = ref({
  nickname: 'cheng',
  studentId: '2022213665',
  gender: 'secret',
  school: '',
  avatarUrl: '/default-avatar.png',
});

function submitForm() {

}

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;
  if (files && files.length > 0) {
    const file: File = files[0];
    user.value.avatarUrl = URL.createObjectURL(file);
  }
};

</script>

<template>
  <div>
    <nav class="navbar w-full py-3 px-5 z-50">
      <div class="flex items-center gap-3 navbar-start">
        <div class="drawer-content">
          <label for="my-drawer"
            class="btn btn-square btn-outline btn-primary btn-sm tooltip tooltip-bottom drawer-button flex items-center justify-center"
            data-tip="展开面板">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
        </div>
        <img src="/logo.png" class="size-10" alt="" />
        <img src="/logo-title.png" class="h-5" alt="" />
        <!--      <label class="text-xl text-base-content"> 邮趣概率 </label>-->
      </div>

      <div class="navbar-center w-full max-w-sm flex items-center gap-2">
        <input class="input input-bordered input-sm grow input-primary transition-all" placeholder="请输入要搜索的实验" />
        <button class="btn btn-sm btn-square btn-outline btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-3 navbar-end">
        <button class="btn btn-square btn-sm btn-primary btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
        <button class="btn btn-square btn-sm btn-primary btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        </button>
        <label class="swap swap-rotate btn btn-sm btn-primary btn-outline btn-square">
          <input type="checkbox" class="theme-controller" value="dark" />
          <svg class="swap-off size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>
          <svg class="swap-on size-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>

        <Dialog v-if="isAuthenticated">
          <DialogTrigger as-child>
            <Button variant="ghost" size="icon" class="rounded-full">
              <img :src="store.getters.getUser.avatarUrl" class="w-8 rounded-full" alt="" />
            </Button>
          </DialogTrigger>
          <DialogContent class="overflow-y-auto p-10 max-w-none w-auto">
            <DialogHeader>
              <DialogTitle>个人资料</DialogTitle>
              <DialogDescription>
                在此更改您的个人资料。完成后单击“保存”。
              </DialogDescription>
            </DialogHeader>

            <div class="flex">
              <form @submit="submitForm" class="w-64 space-y-3">
                <div class="space-y-2">
                  <label class="text-sm">学工号</label>
                  <Input v-model="user.studentId" disabled />
                </div>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>昵称</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入昵称" v-model="user.nickname" v-slot="componentField" class="transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="gender">
                  <FormItem>
                    <FormLabel>性别</FormLabel>
                    <FormControl>
                      <Select v-model="user.gender" v-slot="componentField">
                        <SelectTrigger>
                          <SelectValue placeholder="请选择性别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="secret">
                              保密
                            </SelectItem>
                            <SelectItem value="male">
                              男
                            </SelectItem>
                            <SelectItem value="female">
                              女
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>学院</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入学院" v-model="user.school" v-slot="componentField" class="transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>专业</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入专业" v-model="user.school" v-slot="componentField" class="transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>邮箱</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入邮箱" v-model="user.school" v-slot="componentField" class="transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>手机号</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="请输入手机号" v-model="user.school" v-slot="componentField" class="transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </form>

              <div class="flex justify-center pl-10">
                <Avatar class="size-48 relative">
                  <AvatarImage :src="user.avatarUrl" alt="avatar" />
                  <Button variant="ghost"
                          class="absolute top-0 left-0 size-48 rounded-full opacity-0 transition-all hover:opacity-100 hover:bg-opacity-30 hover:bg-black"
                          @click="triggerFileUpload">
                    <div class="flex flex-col items-center text-background">
                      <Plus class="size-6" />
                      <div class="font-semibold"> 上传图片 </div>
                    </div>
                  </Button>
                </Avatar>
              </div>

              <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  @change="handleFileUpload"
                  accept="image/*"
              />
            </div>

            <DialogFooter>
              <Button type="submit" form="dialogForm">
                保存设置
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div class="flex items-center gap-1" v-else>
          <button class="btn btn-sm btn-ghost text-base" @click="router.push('/register')">注册</button>
          或
          <button class="btn btn-sm btn-ghost text-base" @click="router.push('/login')">登录</button>
        </div>
      </div>
    </nav>
    <div class="drawer z-50">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <div class="bg-base-100 min-h-full w-96 max-w-full p-4">
          <div class="flex justify-between p-3 pb-5 border-b border-base-300">
            <label class="font-bold text-2xl">
              实验
            </label>
            <div>
              <button class="btn btn-ghost btn-circle btn-sm" for="my-drawer" @click="toggleDrawer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <ul class="menu rounded-box w-full menu-lg">
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

<style scoped></style>