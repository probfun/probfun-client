<template>
  <div class="w-full h-full flex flex-col overflow-y-hidden max-h-full">
    <div class="top-0 w-full flex justify-center items-center p-4 border-b">
      <div class="absolute left-6">
        <img class="h-8" src="../assets/logo.svg" alt="">
      </div>

      <div class="flex gap-2">
        <InputText class="w-96 !rounded-full" placeholder="搜索" />
        <Button icon="pi pi-search" rounded />
      </div>

      <div class="absolute right-6">
        <div v-if="!isAuthenticated" class="flex items-center justify-center">
          请点击此处<Button as="router-link" to="/login" label="登录" class="ml-2" />
        </div>
        <div v-else class="flex items-center justify-center">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2" size="large"
            shape="circle" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu" />
          <TieredMenu ref="menu" id="overlay_tmenu" :model="useritems" popup />
          <span class="text-xl ml-2">{{ userName }}</span>
        </div>
      </div>

      <!--      <template #end> <SplitButton label="Save" :model="items"></SplitButton></template>-->
    </div>
    <div class="flex flex-1 overflow-y-hidden">
      <div class="w-1/4 max-w-xs h-full sticky p-3">
        <PanelMenu :model="sideBarItems" class="w-full">
          <template #item="{ item }">
            <a v-ripple class="flex items-center px-4 py-2 cursor-pointer group">
              <span :class="[item.icon, 'text-primary group-hover:text-inherit']" />
              <span :class="['ml-2', { 'font-semibold': item.bold }]">{{ item.label }}</span>
              <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
              <span v-if="item.shortcut"
                class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut
                }}</span>
            </a>
          </template>
        </PanelMenu>

        <SpeedDial :model="speedDialItems" :radius="80" type="linear" direction="up"
          style="position: absolute; left: calc(50% - 2rem); bottom: 2rem" />
      </div>
      <div class="flex-1 w-3/4 pl-0 py-3 overflow-y-hidden">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isAuthenticated = computed(() => store.getters.isAuthenticated);
const userName = computed(() => store.getters.getUser?.username); // 根据实际存储的用户信息字段
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
          },
          {
            label: "阳性检测",
            icon: 'pi pi-chart-bar',
            command: () => router.push('/dashboard/experiment/chapter1/positive-test')
          },
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

const speedDialItems = ref([
  {
    icon: 'pi pi-sun',
    label: '切换主题'
  },
  {
    icon: 'pi pi-comment',
    label: '聊天'
  },
  {
    icon: 'pi pi-cog',
    label: '设置'
  },
  {
    icon: 'pi pi-star',
    label: '我的收藏'
  }
]);

const menu = ref();
const useritems = ref([
  {
    label: '修改个人信息',
    icon: 'pi pi-server',
  },
  {
    label: '登出',
    icon: 'pi pi-sign-out',
    command: () => { store.dispatch('logout'); }
  },
]);
const toggle = (event: any) => {
  menu.value.toggle(event);
};
</script>

<style></style>