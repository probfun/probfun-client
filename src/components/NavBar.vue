<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const sideBarItems = ref([
  {
    label: "目录",
    bold: true,
    items: [
      {
        label: "第一章",
        items: [
          {
            label: "Buffon投针",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/chapter1/buffon')
          },
          {
            label: "三门问题",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/chapter1/three-doors')
          }
        ],
        icon: 'pi pi-bookmark'
      },
      {
        label: "第二章",
        items: [
          {
            label: "二项分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/binomialDistribution'),
          },
          {
            label: "泊松分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/poissonDistribution'),
          },
          {
            label: "几何分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/geometricDistribution'),
          },
          {
            label: "均匀分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/evenDistribution'),
          },
          {
            label: "指数分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/exponentialDistribution'),
          },
          {
            label: "正态分布",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/normalDistribution'),
          }
        ],
        icon: 'pi pi-bookmark'
      },
      {
        label: "第三章",
        icon: 'pi pi-bookmark'
      },
      {
        label: "第四章",
        icon: 'pi pi-bookmark'
      },
      {
        label: "第五章",
        icon: 'pi pi-bookmark'
      },
    ],
    icon: 'pi pi-book',
  },
  {
    label: "聊天",
    bold: true,
    icon: 'pi pi-comment',
    command: () => router.push('/dashboard/chat'),
  },
  {
    label: "设置",
    bold: true,
    icon: 'pi pi-cog',
    command: () => router.push('/dashboard/setting'),
  },
  {
    label: "我的收藏",
    bold: true,
    icon: 'pi pi-star',
    command: () => router.push('/dashboard/favorite'),
  },
]);
</script>

<template>
<nav class="sticky top-0 w-full min-w-screen-md py-3 px-5 z-50">
  <div class="flex w-full items-justify justify-between">
    <div class="flex items-center gap-2">
      <div class="drawer-content">
        <label for="my-drawer" class="btn btn-square btn-outline btn-primary btn-sm tooltip tooltip-bottom drawer-button flex items-center justify-center" data-tip="展开面板">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </label>
      </div>
      <img src="/logo.png" class="size-10" alt=""/>
      <img src="/logo-title.png" class="h-5" alt="" />
<!--      <label class="text-xl text-base-content"> 邮趣概率 </label>-->
    </div>

    <div class="flex items-center gap-3">
      <button class="btn btn-square btn-sm btn-primary btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
      <button class="btn btn-square btn-sm btn-primary btn-outline">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      </button>
      <label class="swap swap-rotate btn btn-sm btn-primary btn-outline btn-square">
        <input type="checkbox" class="theme-controller" value="light" />
        <svg
            class="swap-on size-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
          <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
        <svg
            class="swap-off size-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
          <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
      <div class="avatar">
        <div class="w-8 rounded-full cursor-pointer">
          <img src="/default-avatar.png" alt="" />
        </div>
      </div>
    </div>
  </div>

  <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm flex items-center gap-2">
    <input class="input input-bordered input-sm grow input-primary transition-all" placeholder="请输入要搜索的实验" />
    <button class="btn btn-sm btn-square btn-outline btn-primary">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </button>
  </div>
  <div>  </div>

  <div class="drawer">
    <input id="my-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-side">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4 z-[100]">
        <PanelMenu :model="sideBarItems" />
      </ul>
    </div>
  </div>

</nav>
</template>

<style scoped>

</style>