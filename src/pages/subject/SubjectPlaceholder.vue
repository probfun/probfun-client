<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const map: Record<string, string> = {
  calculusA: '高等数学上',
  calculusB: '高等数学下',
  linearAlgebra: '线性代数',
  numberTheory: '数论',
  bayes: '统计决策与贝叶斯分析',
};

const subjectName = computed(() => map[route.params.subject as string] || '未知科目');
</script>

<template>
  <div class="flex flex-col w-full h-full overflow-y-auto p-8 gap-6">
    <h2 class="text-2xl font-bold">
      {{ subjectName }} - 占位主页
    </h2>
    <p class="text-muted-foreground leading-relaxed">
      这里将展示 {{ subjectName }} 的特色实验、练习与思维导图。目前为占位内容，结构将参考概率论主页。
    </p>
    <div class="grid gap-4 md:grid-cols-2">
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-2">
          实验
        </h3>
        <ul class="list-disc ml-5 space-y-1">
          <li>第一章（占位）</li>
          <li>第二章（占位）</li>
        </ul>
      </div>
      <div class="border rounded-lg p-4">
        <h3 class="font-semibold mb-2">
          练习
        </h3>
        <ul class="list-disc ml-5 space-y-1">
          <li>第一章（占位）</li>
          <li>第二章（占位）</li>
        </ul>
      </div>
      <div class="border rounded-lg p-4 col-span-full">
        <h3 class="font-semibold mb-2">
          学情数据
        </h3>
        <p class="text-sm text-muted-foreground">
          学情数据展示占位。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
