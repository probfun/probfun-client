<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Avatar from 'primevue/avatar';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const defaultValue = 'item-1'
const accordionItems = [
    { value: 'item-1', title: '10月10日班级公告', content: '用了三个组件库思密达，非常的混乱思密达' },
    { value: 'item-2', title: '10月8日班级公告', content: '马上就会成为超级大牛马' },
    { value: 'item-3', title: '10月6日班级公告', content: '真是令人激动捏' },
]
</script>

<template>
    <div class="flex">
        <div class="classInfo flex flex-col flex-1 p-3">
            <span class="text-lg font-bold">2024年秋季学期</span>
            <span class="my-1 text-base font-semibold">任课教师：张丽华</span>
            <span class="mb-2 text-base font-semibold">班级：2023215101</span>
            <div class="card h-[47%] border-2 p-3 overflow-auto">
                <span class="font-semibold">班级公告</span>
                <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
                        <AccordionTrigger class="font-semibold">{{ item.title }}</AccordionTrigger>
                        <AccordionContent>
                            {{ item.content }}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div class="exp flex mt-2">
                <Card class="w-1/2 grid mr-2">
                    <CardHeader class="p-4">
                        <CardTitle>近一个月点击次数最多的实验</CardTitle>
                        <CardDescription>正态分布</CardDescription>
                    </CardHeader>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>
                <Card class="w-1/2 grid">
                    <CardHeader class="p-4">
                        <CardTitle>正态分布</CardTitle>
                        <CardDescription>近一个月获得评论最多的实验</CardDescription>
                    </CardHeader>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>
            </div>
            <div class="exp flex mt-2">
                <Card class="w-1/2 grid mr-2">
                    <CardHeader class="p-4">
                        <CardTitle>正态分布</CardTitle>
                        <CardDescription>近一个月浏览时间最长的实验</CardDescription>
                    </CardHeader>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>
                <Card class="w-1/2 grid">
                    <CardHeader class="p-4">
                        <CardTitle>正态分布</CardTitle>
                        <CardDescription>近一个月班级收藏最多的实验</CardDescription>
                    </CardHeader>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>
            </div>
        </div>
        <Separator orientation="vertical" />
        <div class="selfInfo flex flex-col flex-1 p-3 mt-2">
            <div class="flex mb-5">
                <Avatar label="头" class="mr-5" size="xlarge" />
                <div class="flex flex-col">
                    <span class="text-base font-semibold mb-3">昵称：{{ userStore.user?.nickname }}</span>
                    <span class="text-base font-semibold">学工号：{{ userStore.user?.studentId }}</span>
                </div>
            </div>

            <div class="stats stats-vertical lg:stats-horizontal shadow mb-3">
                <div class="stat">
                    <div class="stat-figure text-pink-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                            </path>
                        </svg>
                    </div>
                    <div class="stat-title">总获赞数</div>
                    <div class="stat-value text-pink-500">12</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>

                <div class="stat">
                    <div class="stat-figure text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4">
                            </path>
                        </svg>
                    </div>
                    <div class="stat-title">总评论数</div>
                    <div class="stat-value text-blue-600">10</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>
            </div>

            <div class="stats stats-vertical lg:stats-horizontal shadow">
                <div class="stat">
                    <div class="stat-figure text-purple-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div class="stat-title">被评论数</div>
                    <div class="stat-value text-purple-500">3</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>

                <div class="stat">
                    <div class="stat-figure text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="inline-block h-8 w-8 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="stat-title">被精选数</div>
                    <div class="stat-value text-yellow-400">1</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>
            </div>

            <div class="flex mt-5 h-1/2">
                <Card class="w-1/2 grid mr-3">
                    <CardHeader class="p-4">
                        <CardTitle>正态分布</CardTitle>
                        <CardDescription>近一个月您点击最多的实验</CardDescription>
                        <img src="/public/homePage/normalDistribution.png">
                    </CardHeader>
                    <CardContent class="grid gap-2 p-3">
                        正态分布是一种常见的分布。在正态分布中，大多数据都集中在平均值附近，这种分布经常出现在自然现象和日常生活中。
                    </CardContent>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>

                <Card class="w-1/2 flex-col mr-2 grid">
                    <CardHeader class="p-4">
                        <CardTitle>三门问题</CardTitle>
                        <CardDescription>近一个月您浏览时间最长的实验</CardDescription>
                        <img src="/public/homePage/threeDoors.png">
                    </CardHeader>
                    <CardContent class="grid gap-2 p-3">
                        三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇无奖的门，选手可以选择换或不换门。
                    </CardContent>
                    <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                        <router-link class="w-full" to="/dashboard/experiment/chapter1/three-doors">
                            <Button class="w-full">进入实验</Button>
                        </router-link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
