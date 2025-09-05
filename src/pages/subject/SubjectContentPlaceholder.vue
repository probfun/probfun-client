<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const type = computed(() => route.path.includes('/experiment/') ? '实验内容' : (route.path.includes('/question/') ? '练习内容' : '学情数据'));
</script>

<template>
  <div class="p-8 space-y-4 overflow-y-auto h-full">
    <h2 class="text-2xl font-bold">
      {{ route.params.subject }} - {{ type }} 占位
    </h2>
    <p class="text-muted-foreground">
      这里将展示 {{ type }} 具体内容。当前 slug: <strong>{{ route.params.slug }}</strong>（若为空则为概览）。
    </p>
    <div class="border rounded-lg p-4">
      <p class="text-sm">
        占位：后续会加入真实的章节树、交互式实验或题目列表。请参照概率论模块的实现方式进行扩展。
      </p>
    </div>
  </div>
</template>

<style scoped></style>
