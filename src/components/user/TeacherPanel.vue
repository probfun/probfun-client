<script setup lang="ts">
import { ref } from 'vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import Select from 'primevue/select';
import Avatar from 'primevue/avatar';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import { useUserStore } from '@/store'

const userStore = useUserStore();
const value = ref(`班级公告`);
const defaultValue = 'item-1'
const accordionItems = [
    { value: 'item-1', title: '10月10日班级公告', content: '用了三个组件库思密达，非常的混乱思密达' },
    { value: 'item-2', title: '10月8日班级公告', content: '马上就会成为超级大牛马' },
    { value: 'item-3', title: '10月6日班级公告', content: '真是令人激动捏' },
]
const products = ref([
    {
        expName: '正态分布',
        name: '小明',
        studentID: '2023001',
        time: '2023-10-01',
        comment: '真好。'
    },
    {
        expName: '正态分布',
        name: '小红',
        studentID: '2023002',
        time: '2023-10-02',
        comment: '非常好。'
    },
    {
        expName: '三门问题',
        name: '小兰',
        studentID: '2023003',
        time: '2023-10-03',
        comment: '非常好。'
    },
]);
const selectedClass = ref();
const classes = ref([
    { name: '2023215101' },
    { name: '2023215102' },
    { name: '2023215103' },
    { name: '2023215104' },
    { name: '2023215105' }
]);
const selectedTime = ref();
const time = ref([
    { name: '近两周' },
    { name: '近一个月' },
    { name: '本学期' },
])
const click = ref([
    {
        expName: '正态分布',
        times: 3
    },
    {
        expName: '三门问题',
        times: 2
    },
    {
        expName: '阳性检测',
        times: 5
    }
])
const browse = ref([
    {
        expName: '正态分布',
        times: 3
    },
    {
        expName: '三门问题',
        times: 2
    },
    {
        expName: '阳性检测',
        times: 5
    }
])
const comment = ref([
    {
        expName: '正态分布',
        times: 3
    },
    {
        expName: '三门问题',
        times: 2
    },
    {
        expName: '阳性检测',
        times: 5
    }
])
const star = ref([
    {
        expName: '正态分布',
        times: 3
    },
    {
        expName: '三门问题',
        times: 2
    },
    {
        expName: '阳性检测',
        times: 5
    }
])
</script>

<template>
    <div class="flex">
        <div class="flex flex-col flex-1 p-3">
            <span class="text-lg font-bold">2024年秋季学期</span>
            <div class="flex my-5">
                <Avatar label="头" class="mr-5" size="xlarge" />
                <div class="flex flex-col">
                    <span class="text-base font-semibold mb-3">教师姓名：{{ userStore.user?.nickname }}</span>
                    <span class="text-base font-semibold">教工号：{{ userStore.user?.studentId }}</span>
                </div>
            </div>
            <div class="card items-center">
                <Panel>
                    <template #header>
                        <div class="flex items-center gap-2">
                            <span class="font-bold">班级公告</span>
                        </div>
                    </template>
                    <template #footer>
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div class="flex items-center gap-2"></div>
                            <span class="text-surface-500 dark:text-surface-400">
                                <Button>发布公告</Button>
                            </span>
                        </div>
                    </template>
                    <Textarea v-model="value" rows="8" cols="72" style="resize: none" />
                </Panel>
            </div>
            <Panel header="已发布公告" class="mx-1 my-3 h-full overflow-auto">
                <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
                        <AccordionTrigger class="font-semibold">{{ item.title }}</AccordionTrigger>
                        <AccordionContent>
                            {{ item.content }}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Panel>
        </div>
        <Separator orientation="vertical" />
        <div class="flex flex-col flex-1 p-3">
            <Panel header="已精选评论" class="w-full h-[30%]">
                <DataTable :value="products" scrollable scrollHeight="150px" tableStyle="min-width: 30rem">
                    <Column field="expName" header="实验名称"></Column>
                    <Column field="name" header="学生昵称"></Column>
                    <Column field="studentID" header="学工号"></Column>
                    <Column field="time" header="评论时间"></Column>
                    <Column field="comment" header="评论内容"></Column>
                </DataTable>
            </Panel>
            <div class="mt-3 h-2/3">
                <div style="display: flex; justify-content: space-between;">
                    <Select v-model="selectedClass" :options="classes" optionLabel="name" placeholder="请选择班级"
                        class="w-full md:w-56" />
                    <Select v-model="selectedTime" :options="time" optionLabel="name" placeholder="请选择时间范围"
                        class="w-full md:w-56" />
                </div>
                <div class="flex my-2">
                    <Panel header="各实验点击次数排行榜" class="mr-4">
                        <DataTable :value="click" scrollable scrollHeight="160px" tableStyle="min-width: 17rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="点击次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                    <Panel header="各实验浏览时长排行榜">
                        <DataTable :value="browse" scrollable scrollHeight="160px" tableStyle="min-width: 17rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="time" header="浏览时长" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                </div>
                <div class="flex">
                    <Panel header="各实验评论次数排行榜" class="mr-4">
                        <DataTable :value="comment" scrollable scrollHeight="160px" tableStyle="min-width: 17rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="评论次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                    <Panel header="各实验收藏次数排行榜" class="">
                        <DataTable :value="star" scrollable scrollHeight="160px" tableStyle="min-width: 17rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="收藏次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                </div>
            </div>
        </div>
    </div>
</template>