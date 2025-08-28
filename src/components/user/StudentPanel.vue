<script setup lang="ts">
import type { Post } from '@/api/class/classType';
import { onMounted, ref } from 'vue';
import { fetchPostApi } from '@/api/class/classApi';
import { fetchMydataApi } from '@/api/class/student/studentApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const postList = ref<Post[] | null>(null);
const myData = ref();

async function getPost() {
  try {
    if (!userStore.user?.classId)
      return;
    const result = await fetchPostApi(userStore.user.classId);
    postList.value = result.posts;
    console.log('公告', postList);
  }
  catch (error) {
    console.error('Error during fetching posts:', error);
  }
}

async function getMydata() {
  try {
    if (userStore.user?.classId) {
      const result = await fetchMydataApi(userStore.user.classId);
      myData.value = result.mydata;
      console.log('用户信息', myData);
    }
  }
  catch (error) {
    console.error('Error during fetching personal data:', error);
  }
}

onMounted(() => {
  getPost();
  getMydata();
});
</script>

<template>
  <div class="flex">
    <div class="classInfo flex flex-col flex-1 p-3">
      <span class="text-lg font-bold">2024年秋季学期</span>
      <span class="my-1 text-base font-semibold">任课教师：张丽华</span>
      <span class="mb-2 text-base font-semibold">班级：2023215101</span>
      <div class="card h-[47%] border-2 p-3 overflow-auto">
        <span class="font-semibold">班级公告</span>
        <Accordion type="single" class="w-full" collapsible>
          <AccordionItem v-for="item in postList" :key="item.timestamp" :value="item.timestamp">
            <AccordionTrigger class="font-semibold">
              {{ item.title }}
            </AccordionTrigger>
            <AccordionContent>
              {{ item.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div class="exp flex mt-2">
        <Card class="w-1/2 grid mr-2">
          <CardHeader class="p-4">
            <CardTitle class="text-l text-black-500">
              近一个月点击次数最多的实验
            </CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              正态分布
            </CardDescription>
          </CardHeader>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
        <Card class="w-1/2 grid">
          <CardHeader class="p-4">
            <CardTitle class="text-l text-black-500">
              近一个月获得评论最多的实验
            </CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              正态分布
            </CardDescription>
          </CardHeader>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
      </div>
      <div class="exp flex mt-2">
        <Card class="w-1/2 grid mr-2">
          <CardHeader class="p-4">
            <CardTitle class="text-l text-black-500">
              近一个月浏览时间最长的实验
            </CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              正态分布
            </CardDescription>
          </CardHeader>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
        <Card class="w-1/2 grid">
          <CardHeader class="p-4">
            <CardTitle class="text-l text-black-500">
              近一个月班级收藏最多的实验
            </CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              正态分布
            </CardDescription>
          </CardHeader>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
      </div>
    </div>
    <Separator orientation="vertical" />
    <div class="selfInfo flex flex-col flex-1 p-3 mt-2">
      <div class="flex mb-5 items-center">
        <Avatar class="mr-3">
          <div>
            <AvatarImage :src="userStore.user?.avatarUrl || ''" alt="@radix-vue" />
            <AvatarFallback>{{ userStore.user?.nickname }}</AvatarFallback>
          </div>
        </Avatar>
        <div class="flex flex-col">
          <span class="text-base font-semibold mb-3">昵称：{{ userStore.user?.nickname }}</span>
          <span class="text-base font-semibold">学工号：{{ userStore.user?.username }}</span>
        </div>
      </div>

      <div class="stats stats-vertical lg:stats-horizontal shadow mb-3">
        <div class="stat">
          <div class="stat-figure text-pink-500">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <div class="stat-title">
            本月获赞数
          </div>
          <div class="stat-value text-pink-500">
            <!-- {{ myData?.likeCount }} -->21
          </div>
          <!-- <div class="stat-desc">
            总获赞数：21
          </div> -->
        </div>

        <div class="stat">
          <div class="stat-figure text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </div>
          <div class="stat-title">
            本月评论数
          </div>
          <div class="stat-value text-blue-600">
            <!-- {{ myData?.commentCount }} -->20
          </div>
          <!-- <div class="stat-desc">
            总评论数：20
          </div> -->
        </div>
      </div>

      <div class="stats stats-vertical lg:stats-horizontal shadow">
        <div class="stat">
          <div class="stat-figure text-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="stat-title">
            本月被评论数
          </div>
          <div class="stat-value text-purple-500">
            <!-- {{ myData?.replyCount }} -->5
          </div>
          <!-- <div class="stat-desc">
            总被评论数：5
          </div> -->
        </div>

        <div class="stat">
          <div class="stat-figure text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="stat-title">
            本月被精选数
          </div>
          <div class="stat-value text-yellow-400">
            <!-- {{ myData?.pinCount }} -->2
          </div>
          <!-- <div class="stat-desc">
            总被精选数：2
          </div> -->
        </div>
      </div>

      <div class="flex mt-5 h-1/2">
        <Card class="w-1/2 grid mr-3">
          <CardHeader class="p-4">
            <CardTitle>近一个月您点击最多的实验</CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              正态分布
            </CardDescription>
            <img src="/public/homePage/normalDistribution.png" alt="">
          </CardHeader>
          <CardContent class="grid gap-2 p-3">
            正态分布是一种常见的分布。在正态分布中，大多数据都集中在平均值附近，这种分布经常出现在自然现象和日常生活中。
          </CardContent>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/normal-distribution">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>

        <Card class="w-1/2 flex-col mr-2 grid">
          <CardHeader class="p-4">
            <CardTitle>近一个月您浏览时间最长的实验</CardTitle>
            <CardDescription class="text-lg text-blue-600 font-bold">
              三门问题
            </CardDescription>
            <img src="/public/homePage/threeDoors.png" alt="">
          </CardHeader>
          <CardContent class="grid gap-2 p-3">
            三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇无奖的门，选手可以选择换或不换门。
          </CardContent>
          <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
            <router-link class="w-full" to="/dashboard/experiment/three-doors">
              <Button class="w-full">
                进入实验
              </Button>
            </router-link>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
