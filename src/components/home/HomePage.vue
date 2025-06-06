<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { ref } from 'vue';

const experiments = ref([
  {
    title: '正态分布',
    description: '正态分布是一种常见的分布。在正态分布中，大多数数据集中在平均值附近，这种分布经常出现在自然现象和日常生活中。',
    img: '/homePage/normalDistribution.png',
    path: '/dashboard-prob/experiment/normal-distribution',
  },
  {
    title: '泊松分布',
    description: '泊松分布是一种预测在一定时间或空间内随机事件发生次数的统计方法，它基于一个参数λ，这个参数表示平均发生次数。',
    img: '/homePage/poissonDistribution.png',
    path: '/dashboard-prob/experiment/poisson-distribution',
  },
  {
    title: '三门问题',
    description: '三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇门，选手可以选择换或不换门。',
    img: '/homePage/threeDoors.png',
    path: '/dashboard-prob/experiment/three-doors',
  },
  {
    title: 'Buffon投针',
    description: 'Buffon投针问题是一个通过随机投掷针到平行线板上，通过针与线的相交数量来估算圆周率π的几何概率实验。',
    img: '/homePage/buffonNeedle.png',
    path: '/dashboard-prob/experiment/buffon',
  },
]);

const mindMaps = ref([
  {
    title: '第一章',
    description: '第一章主要涉及概率相关的实验。包含的知识点有：概率的基本概念、大数定律、条件概率、事件独立性等。',
    img: '/homePage/C1.png',
    path: 'dashboard-prob/mindmap/chapter-1',
  },
  {
    title: '分布（第二章与第三章）',
    description: '第二章主要涉及各种一维分布相关的实验。包括6种基本分布：二项、泊松、几何、均匀、指数、 正态分布以及分布的对比：二项分布与泊松、正态分布的近似，泊松分布与指数、正态分布的近似。第三章主要涉及各种高维分布相关的实验。',
    img: '/homePage/distribution.png',
    path: 'dashboard-prob/mindmap/distribution',

  },
  {
    title: '第四章',
    description: '期望检验是统计学中的重要方法，用于分析样本数据与理论预期值之间的差异。通过分组检测，我们可以判断不同组别数据的期望值是否存在显著差异，这在医学研究、质量控制和社会调查等领域有广泛应用。',
    img: '/homePage/group.png',
    path: 'dashboard-prob/mindmap/chapter-4',

  },
  // {
  //   title: '其他',
  //   description: '第四章主要涉及xxx相关的实验。',
  //   img: '/homePage/buffonNeedle.png',
  // },
]);

// const router = useRouter();
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col">
    <div class="p-3">
      <div class="mb-2 text-lg font-bold">
        💥 热门实验
      </div>
      <div class="flex gap-3 overflow-x-auto">
        <Card
          v-for="(exp, index) in experiments" :key="index"
          class="min-w-44 flex-col flex hover:border-primary transition-all"
        >
          <CardHeader class="p-4 space-y-1">
            <CardTitle>{{ exp.title }}</CardTitle>
            <img class="border rounded-lg border-primary" :src="exp.img" alt="">
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
    <div class="p-3">
      <div class="mb-2 text-lg font-bold">
        🔍 思维导图
      </div>
      <div class="flex gap-3 overflow-x-auto">
        <Card
          v-for="(map, index) in mindMaps" :key="index"
          class="min-w-44 flex-col flex hover:border-primary transition-all basis-1/3"
        >
          <CardHeader class="p-4 space-y-1">
            <CardTitle>{{ map.title }}</CardTitle>
            <div class="h-32 w-full flex items-center justify-center border rounded-lg border-primary overflow-hidden">
              <img class="object-cover h-full w-full" :src="map.img" alt="">
            </div>
          </CardHeader>
          <CardContent class="flex-1">
            <Label class="line-clamp-5 leading-normal font-normal">
              {{ map.description }}
            </Label>
          </CardContent>
          <CardFooter>
            <router-link class="w-full" :to="map.path">
              <Button class="w-full">
                进入思维导图
              </Button>
            </router-link>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
