<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import Avatar from 'primevue/avatar';
import Panel from 'primevue/panel';
import Textarea from 'primevue/textarea';
import MultiSelect from 'primevue/multiselect';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import { useUserStore } from '@/store'
import { fetchMessagesApi, postPostApi } from '@/api/message/messageApi';
import { Message } from '@/api/message/messageType';
import { useToast } from 'primevue/usetoast';

const userStore = useUserStore();
const placeholderText = '请输入公告内容...'
const defaultValue = 'item-1'
const accordionItems = [
    { value: 'item-1', title: '10月10日班级公告', content: 'bjgg' },
    { value: 'item-2', title: '10月8日班级公告', content: 'bjgg' },
    { value: 'item-3', title: '10月6日班级公告', content: 'bjgg' },
]
const products = ref([
    {
        expName: '正态分布',
        name: '小明',
        studentID: '2023001',
        time: '2023-10-01',
        comment: '真好。你在写什么知识时法随风倒十分士大夫'
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
const selectedClassA = ref();
const classesA = ref([
    { name: '2023215101' },
    { name: '2023215102' },
    { name: '2023215103' },
    { name: '2023215104' },
    { name: '2023215105' }
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

const visible = ref(false);
const toast = useToast();
const title = ref('');
const content = ref('');
const messageList = ref<Message[] | null>(null);

const cancel = () => {

}

async function sendPost() {
    if (content.value === '') {
        toast.add({ severity: 'warn', summary: '提示', detail: '班级公告不能为空', life: 3000 });
        return;
    }
    if (selectedClass.value.length === 0) { // 检查是否选择了班级
        toast.add({ severity: 'warn', summary: '提示', detail: '请选择班级', life: 3000 });
        return;
    }
    title.value = selectedClass.value.join(', ');
    try {
        await postPostApi(title.value, content.value);
        toast.add({ severity: 'success', summary: '成功', detail: '发布班级公告成功！', life: 3000 });
        content.value = '';
    }
    catch (error) {
        console.error(error);
        toast.add({ severity: 'error', summary: '错误', detail: error, life: 3000 });
    }
}
</script>

<template>
    <div class="flex">
        <div class="flex flex-col flex-1 w-1/2 p-3">
            <div class="flex mb-[-10px]">
                <span class="text-lg font-bold">2024年秋季学期</span>
                <div class="ml-auto">
                    <Select v-model="selectedClassA" :options="classesA" optionLabel="name" filter placeholder="请选择班级"
                        class="w-full md:w-56" />
                </div>
            </div>
            <div class="flex my-5">
                <Avatar label="头" class="mr-5" size="xlarge" />
                <div class="flex flex-col">
                    <span class="text-base font-semibold mb-3">教师姓名：{{ userStore.user?.nickname }}</span>
                    <span class="text-base font-semibold">教工号：{{ userStore.user?.studentId }}</span>
                </div>
            </div>
            <!-- <div class="card w-full items-center">
                <Panel>
                    <template #header>
                        <div class="flex justify-center gap-2">
                            <span class="font-bold">班级公告</span>
                        </div>
                    </template>
<template #footer>
                        <div class="flex flex-wrap items-center justify-between gap-4">
                            <div class="flex items-center gap-2"></div>
                            <span class="text-surface-500 dark:text-surface-400">
                                <Button @click="sendPost()">发布公告</Button>
                            </span>
                        </div>
                    </template>
<Textarea v-model="content" rows="8" cols="1000" style="resize: none" class="w-full" :placeholder="placeholderText" />
</Panel>
</div> -->
            <Panel header="已发布公告" class="mx-1 mt-3 mb-5 h-full overflow-auto">
                <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                    <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
                        <AccordionTrigger class="font-semibold">{{ item.title }}</AccordionTrigger>
                        <AccordionContent>
                            {{ item.content }}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Panel>
            <Button label="Show" class="my-3" @click="visible = true">发布班级公告</Button>
            <Dialog v-model:visible="visible" modal header="发布班级公告" :style="{ width: '50rem' }">
                <span class="text-surface-500 dark:text-surface-400 block mb-8">请选择一个或多个班级，点击发布按钮发布公告。</span>
                <div class="flex items-center gap-4 mb-4">
                    <MultiSelect v-model="selectedClass" :options="classes" optionLabel="name" filter placeholder="请选择班级"
                        class="w-full md:w-56" />
                </div>
                <div class="flex items-center gap-4 mb-8">
                    <Textarea v-model="content" autoResize rows="10" class="w-full" placeholder="请输入班级公告"/>
                </div>
                <div class="flex justify-end gap-2">
                    <Button @click="sendPost()">发布公告</Button>
                </div>
            </Dialog>
        </div>
        <Separator orientation="vertical" />
        <div class="flex flex-col flex-1 w-1/2 p-3 overflow-auto">
            <div style="display: flex; justify-content: space-between;" class="mb-3 ml-auto">
                <Select v-model="selectedTime" :options="time" optionLabel="name" placeholder="请选择时间范围"
                    class="w-full md:w-56" />
            </div>
            <Panel header="已精选评论" class="w-full h-full">
                <DataTable :value="products" scrollable tableStyle="min-width: 60rem">
                    <Column field="expName" header="实验名称"></Column>
                    <Column field="name" header="学生昵称"></Column>
                    <Column field="studentID" header="学工号"></Column>
                    <Column field="time" header="评论时间"></Column>
                    <Column field="comment" header="评论内容"></Column>
                    <Column class="w-24 !text-end">
                        <template #body>
                            <Button @click="cancel">取消精选</Button>
                        </template>
                    </Column>
                </DataTable>
            </Panel>
            <div class="h-full">
                <div class="flex my-2">
                    <Panel header="各实验点击次数排行榜">
                        <DataTable :value="click" scrollable tableStyle="min-width: 18rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="点击次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                    <Panel header="各实验浏览时长排行榜" class="ml-auto">
                        <DataTable :value="browse" scrollable tableStyle="min-width: 18rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="time" header="浏览时长" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                </div>
                <div class="flex">
                    <Panel header="各实验评论次数排行榜">
                        <DataTable :value="comment" scrollable tableStyle="min-width: 18rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="评论次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                    <Panel header="各实验收藏次数排行榜" class="ml-auto">
                        <DataTable :value="star" scrollable tableStyle="min-width: 18rem">
                            <Column field="expName" header="实验名称" sortable style="width: 25%"></Column>
                            <Column field="times" header="收藏次数" sortable style="width: 25%"></Column>
                        </DataTable>
                    </Panel>
                </div>
            </div>
        </div>
    </div>
</template>