<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="top">
      <div class="icon">
        <img src="@/components/32.png" alt="">
      </div>
      <div class="search">
        <InputText class="searchA" v-model="value1" placeholder="搜索" />
        <Button class="searchB" icon="pi pi-search" severity="contrast"></Button>
      </div>
      <div class="user">
        <p>请点击此处
          <Button class="log" label="登录" severity="secondary" />
          ，以获得更好的用户体验
        </p>
      </div>
    </div>
    <div class="flex flex-1">
      <div class="left h-full">
        <div class="content">
          <PanelMenu :model="items" multiple/>
        </div>
        <div class="themes">
          <i class="pi pi-sun" style="color: #8C9CB2; font-size: 1.3rem"></i>
          <ToggleSwitch class="switch custom-toggle" v-model="checked" />
        </div>
      </div>
      <div class="right">
        <div class="display flex h-full w-full">
          <HelloWorld/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import HelloWorld from '@/components/HelloWorld.vue';

const value1 = ref('');
const checked = ref(true);
const items = ref([
  {
    label: "目录",
    items: [
      {
        label: "第一章",
        items: [
          {label: "Buffon投针"}
        ]
      },
      {
        label: "第二章",
        items: [
          {label: "正态分布"}
        ]
      },
      {
        label: "第三章",
      },
      {
        label: "第四章",
      },
      {
        label: "第五章",
      },
    ]
  },
  {
    label: "聊天",
    icon: 'pi pi-comment',
  },
  {
    label: "设置",
    icon: 'pi pi-cog',
  },
  {
    label: "我的收藏",
    icon: 'pi pi-star'
  },
]);
</script>

<style>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  flex: 1;
  margin-left: 15px;
}

.search {
  flex: 2;
  display: flex;
  justify-content: center;
}

.user {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 15px;
}

img {
  height: 60px;
  margin-top: 10px;
}

.searchA {
  width: 400px;
  margin-right: 20px;
}

.left {
  flex: 1;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.right {
  flex: 4;
  padding: 10px;
}

.themes {
  display: flex;
  align-items: center;
  margin-top: 15px;
  margin-left: 19px;
}

.switch {
  margin-left: 5px;
}

.input,
.summary {
  margin-bottom: 20px;
}

.log {
  margin-left: 5px;
  margin-right: 5px;
}
</style>