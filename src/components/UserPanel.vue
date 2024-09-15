<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from "vuex";

const store = useStore();
</script>

<template>
  <div class="w-full h-full p-5" v-if="store.getters.isAuthenticated">
    <div class="flex flex-col w-full gap-10">
      <h1 class="text-xl font-bold"> 个人资料 </h1>
      <div class="flex gap-6">
        <div class="flex-1 max-w-sm">
          <label>昵称：</label>
          <Input placeholder="昵称" v-model="store.getters.getUser.nickname" />
        </div>
        <div class="flex-1 max-w-sm">
          <label>学号：</label>
          <Input placeholder="学号" v-model="store.getters.getUser.studentId" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>