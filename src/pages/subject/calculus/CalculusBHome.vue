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
    title: '邻域',
    description: '交互探索邻域的几何形态，观察半径变化对范围的影响，理解点与邻域的包含关系及数学表达。',
    path: '/subject/calculusB/experiment/neighborhood',
    img: '/calculusB/neighborhood.png',
  },
  {
    title: '偏导数',
    description: '可视化多元函数的截面曲线，观察固定变量时的切线斜率，理解偏导数的方向变化率含义。',
    path: '/subject/calculusB/experiment/partial-derivative',
    img: '/calculusB/partial-derivative.png',
  },
  {
    title: '全微分',
    description: '通过切平面近似曲面，对比全微分与函数增量的差异，直观理解局部线性近似的精度特征。',
    path: '/subject/calculusB/experiment/total-derivative',
    img: '/calculusB/total-derivative.png',
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
