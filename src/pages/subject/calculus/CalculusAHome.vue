<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// 选取部分重要实验，提供跳转入口
const experiments = ref([
  {
    title: '函数极限',
    description: '通过交互探索函数在点处与区间内的极限概念，理解ε-δ语言和直观图像之间的对应。',
    path: '/subject/calculusA/experiment/function-limit',
    img: '/calculusA/function-limit.png',
  },
  {
    title: '导数的几何意义',
    description: '可视化切线与割线，理解导数作为瞬时变化率与切线斜率的几何含义。',
    path: '/subject/calculusA/experiment/derivative-geometry',
    img: '/calculusA/derivative-geometry.png',
  },
  {
    title: '泰勒展开',
    description: '通过泰勒多项式近似函数，观察展开阶数对近似精度的影响。',
    path: '/subject/calculusA/experiment/taylor-expansion',
    img: '/calculusA/taylor-expansion.png',
  },
  {
    title: '可积条件',
    description: '从分割与上、下和出发，直观理解黎曼可积与不连续点集合的关系。',
    path: '/subject/calculusA/experiment/integrability-conditions',
    img: '/calculusA/integrability-conditions.png',
  },
]);
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col">
    <div class="p-3">
      <div class="mb-2 text-lg font-bold">
        🔥 重点实验
      </div>
      <div class="flex gap-3 overflow-x-auto">
        <Card
          v-for="(exp, index) in experiments" :key="index"
          class="min-w-44 flex-col flex hover:border-primary transition-all"
        >
          <CardHeader class="p-4 space-y-1">
            <CardTitle>{{ exp.title }}</CardTitle>
            <div class="h-32 w-full flex items-center justify-center border rounded-lg border-primary overflow-hidden bg-white">
              <img v-if="exp.img" :src="exp.img" alt="" class="object-cover h-full w-full" style="aspect-ratio: 4/3;">
            </div>
          </CardHeader>
          <CardContent class="flex-1">
            <Label class="line-clamp-3 leading-normal font-normal">
              {{ exp.description }}
            </Label>
          </CardContent>
          <CardFooter>
            <router-link class="w-full" :to="exp.path">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
      </div>
    </div>

    <!-- 思维导图（暂无数据，留空占位） -->
    <div class="p-3">
      <div class="mb-2 text-lg font-bold">
        🔍 思维导图
      </div>
      <div class="text-muted-foreground text-sm">
        思维导图内容暂缺，后续补充。
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
