<script setup lang="ts">
import { FlaskConical, SearchCheck } from 'lucide-vue-next';
import { ref } from 'vue';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const experiments = ref([
  {
    title: '正态分布',
    description: '正态分布是一种常见的分布。在正态分布中，大多数数据集中在平均值附近，这种分布经常出现在自然现象和日常生活中。',
    img: '/homePage/normalDistribution.png',
    path: '/dashboard/experiment/normal-distribution',
  },
  {
    title: '泊松分布',
    description: '泊松分布是一种预测在一定时间或空间内随机事件发生次数的统计方法，它基于一个参数λ，这个参数表示平均发生次数。',
    img: '/homePage/poissonDistribution.png',
    path: '/dashboard/experiment/poisson-distribution',
  },
  {
    title: '三门问题',
    description: '三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇门，选手可以选择换或不换门。',
    img: '/homePage/threeDoors.png',
    path: '/dashboard/experiment/three-doors',
  },
  {
    title: 'Buffon投针',
    description: 'Buffon投针问题是一个通过随机投掷针到平行线板上，通过针与线的相交数量来估算圆周率π的几何概率实验。',
    img: '/homePage/buffonNeedle.png',
    path: '/dashboard/experiment/buffon',
  },
]);

const mindMaps = ref([
  {
    title: '第一章',
    description: '第一章主要涉及概率相关的实验。包含的知识点有：概率的基本概念、大数定律、条件概率、事件独立性等。',
    img: '/homePage/C1.png',
    path: 'dashboard/mindmap/chapter-1',
  },
  {
    title: '分布（第二章与第三章）',
    description: '第二章主要涉及各种一维分布相关的实验。包括6种基本分布：二项、泊松、几何、均匀、指数、 正态分布以及分布的对比：二项分布与泊松、正态分布的近似，泊松分布与指数、正态分布的近似。第三章主要涉及各种高维分布相关的实验。',
    img: '/homePage/distribution.png',
    path: 'dashboard/mindmap/distribution',

  },
  {
    title: '第四章',
    description: '期望检验是统计学中的重要方法，用于分析样本数据与理论预期值之间的差异。通过分组检测，我们可以判断不同组别数据的期望值是否存在显著差异，这在医学研究、质量控制和社会调查等领域有广泛应用。',
    img: '/homePage/group.png',
    path: 'dashboard/mindmap/chapter-4',

  },
]);
</script>

<template>
  <div class="!overflow-y-auto overflow-x-hidden flex flex-col gap-6 p-3">
    <section>
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <FlaskConical class="h-4 w-4 text-primary" />
          </span>
          <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">热门实验</span>
        </div>
        <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <router-link
          v-for="(exp, index) in experiments"
          :key="index"
          :to="exp.path"
          class="group block h-full"
        >
          <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-base">
                {{ exp.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4 pt-0 space-y-3">
              <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40">
                <img
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  :src="exp.img"
                  :alt="exp.title"
                  loading="lazy"
                >
              </div>
              <Label class="line-clamp-2 leading-relaxed font-normal text-muted-foreground">
                {{ exp.description }}
              </Label>
            </CardContent>
          </Card>
        </router-link>
      </div>
    </section>

    <section>
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
            <SearchCheck class="h-4 w-4 text-primary" />
          </span>
          <span class="text-lg font-bold text-primary to-primary/60 bg-clip-text">思维导图</span>
        </div>
        <span class="ml-3 h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <router-link
          v-for="(map, index) in mindMaps"
          :key="index"
          :to="map.path"
          class="group block h-full"
        >
          <Card class="h-full flex flex-col transition-all hover:shadow-md hover:border-primary">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-base">
                {{ map.title }}
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4 pt-0 space-y-3">
              <div class="w-full aspect-[16/9] overflow-hidden rounded-md border border-primary/40">
                <img
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  :src="map.img"
                  :alt="map.title"
                  loading="lazy"
                >
              </div>
              <Label class="line-clamp-3 leading-relaxed font-normal text-muted-foreground">
                {{ map.description }}
              </Label>
            </CardContent>
          </Card>
        </router-link>
      </div>
    </section>
  </div>
</template>
