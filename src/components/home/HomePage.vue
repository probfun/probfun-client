<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { useRouter } from 'vue-router';

const router = useRouter();

</script>

<template>
    <div class="m-3">
        <div class="mb-2 text-xl font-bold">💥热门实验</div>
        <div class="flex">
            <Card class="w-1/4 flex-col mr-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>正态分布</CardTitle>
                    <img src="/public/homePage/normalDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    正态分布是一种常见的分布。在正态分布中，大多数数据集中在平均值附近，这种分布经常出现在自然现象和日常生活中。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                        <Button class="w-full">进入实验</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col mr-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>泊松分布</CardTitle>
                    <img src="/public/homePage/poissonDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    泊松分布是一种预测在一定时间或空间内随机事件发生次数的统计方法，它基于一个参数λ，这个参数表示平均发生次数。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/poissonDistribution">
                        <Button class="w-full">进入实验</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col mr-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>三门问题</CardTitle>
                    <img src="/public/homePage/threeDoors.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇门，选手可以选择换或不换门。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/chapter1/three-doors">
                        <Button class="w-full">进入实验</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col grid">
                <CardHeader class="p-4">
                    <CardTitle>Buffon投针</CardTitle>
                    <img src="/public/homePage/buffonNeedle.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    Buffon投针问题是一个通过随机投掷针到平行线板上，通过针与线的相交数量来估算圆周率π的几何概率实验。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/chapter1/buffon">
                        <Button class="w-full">进入实验</Button>
                    </router-link>
                </CardFooter>
            </Card>
        </div>      
    </div>

    <div class="m-3">
        <div class="mb-2 text-xl font-bold">🔍思维导图</div>
        <div class="flex">
            <Card class="w-1/4 flex-col mr-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>第一章</CardTitle>
                    <img src="/public/homePage/normalDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    第一章主要涉及概率相关的实验。包含的知识点有：概率的基本概念、大数定律、条件概率、事件独立性等。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                        <Button class="w-full">查看思维导图</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col mr-2 grid ">
                <CardHeader class="p-4">
                    <CardTitle>第二章</CardTitle>
                    <img src="/public/homePage/poissonDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3 text-sm">
                    第二章主要涉及各种一维分布相关的实验。包括6种基本分布：二项、泊松、几何、均匀、指数、 正态分布以及分布的对比：二项分布与泊松、正态分布的近似，泊松分布与指数、正态分布的近似。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/poissonDistribution">
                        <Button class="w-full">查看思维导图</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col mr-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>第三章</CardTitle>
                    <img src="/public/homePage/threeDoors.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3">
                    第三章主要涉及各种高维分布相关的实验
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/chapter1/three-doors">
                        <Button class="w-full">查看思维导图</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col grid">
                <CardHeader class="p-4">
                    <CardTitle>第四章</CardTitle>
                    <img src="/public/homePage/buffonNeedle.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3">
                    第四章主要涉及xxx相关的实验。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/chapter1/buffon">
                        <Button class="w-full">查看思维导图</Button>
                    </router-link>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>