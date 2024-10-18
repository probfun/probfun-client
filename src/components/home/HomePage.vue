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
            <Card class="w-1/4 grid">
                <CardHeader class="p-4">
                    <CardTitle>正态分布</CardTitle>
                    <img src="/public/homePage/normalDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3">
                    正态分布是一种常见的分布。在正态分布中，大多数数据都集中在平均值附近，这种分布经常出现在自然现象和日常生活中。
                </CardContent>
                <CardFooter class="flex items-center justify-between gap-2 p-3 pt-0">
                    <router-link class="w-full" to="/dashboard/experiment/normalDistribution">
                        <Button class="w-full">进入实验</Button>
                    </router-link>
                </CardFooter>
            </Card>

            <Card class="w-1/4 flex-col mx-2 grid">
                <CardHeader class="p-4">
                    <CardTitle>泊松分布</CardTitle>
                    <img src="/public/homePage/poissonDistribution.png">
                </CardHeader>
                <CardContent class="grid gap-2 p-3">
                    泊松分布是一种用来预测在一定时间或空间内随机事件发生次数的统计方法，它基于一个参数λ，这个参数表示平均发生次数。
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
                <CardContent class="grid gap-2 p-3">
                    三门问题是一个概率游戏，选手在三扇门中选一扇，选对得奖。主持人会揭示另一扇无奖的门，选手可以选择换或不换门。
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
                <CardContent class="grid gap-2 p-3">
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
    </div>
</template>