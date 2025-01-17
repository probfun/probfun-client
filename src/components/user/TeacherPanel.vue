<script setup lang="ts">
import type { Post } from '@/api/class/classType';
import { fetchClassListApi, fetchPostApi, postPostApi } from '@/api/class/classApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store'
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import MultiSelect from 'primevue/multiselect';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { log } from 'console';

const userStore = useUserStore();
const defaultValue = 'item-1'
const products = ref([
  {
    expName: '正态分布',
    name: '小明',
    studentID: '2023001',
    time: '2023-10-01',
    comment: '真好。你在写什么知识时法随风倒十分士大夫',
  },
  {
    expName: '正态分布',
    name: '小红',
    studentID: '2023002',
    time: '2023-10-02',
    comment: '非常好。',
  },
  {
    expName: '三门问题',
    name: '小兰',
    studentID: '2023003',
    time: '2023-10-03',
    comment: '非常好。',
  },
]);

const classesA = ref([
  { name: '2023215101' },
  { name: '2023215102' },
  { name: '2023215103' },
  { name: '2023215104' },
  { name: '2023215105' },
]);
const selectedClass = ref(classesA.value[0]);
const selectedTime = ref();
const time = ref([
  { name: '近两周' },
  { name: '近一个月' },
  { name: '本学期' },
])
const click = ref([
  {
    expName: '正态分布',
    times: 3,
  },
  {
    expName: '三门问题',
    times: 2,
  },
  {
    expName: '阳性检测',
    times: 5,
  },
])
const browse = ref([
  {
    expName: '正态分布',
    times: 3,
  },
  {
    expName: '三门问题',
    times: 2,
  },
  {
    expName: '阳性检测',
    times: 5,
  },
])
const comment = ref([
  {
    expName: '正态分布',
    times: 3,
  },
  {
    expName: '三门问题',
    times: 2,
  },
  {
    expName: '阳性检测',
    times: 5,
  },
])
const star = ref([
  {
    expName: '正态分布',
    times: 3,
  },
  {
    expName: '三门问题',
    times: 2,
  },
  {
    expName: '阳性检测',
    times: 5,
  },
])

const visible = ref(false);
const toast = useToast();
const title = ref(`${new Date().toLocaleDateString()} 班级公告`);
const content = ref('');

function cancel() {

}

async function sendPost() {
  if (content.value === '') {
    toast.add({ severity: 'warn', summary: '提示', detail: '班级公告不能为空', life: 3000 });
    return;
  }
  try {
    await postPostApi(title.value, content.value, [selectedClass.value.name]);
    await getPost();
    toast.add({ severity: 'success', summary: '成功', detail: '发布班级公告成功！', life: 3000 });
    content.value = '';
    visible.value = false;
  }
  catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: '错误', detail: error, life: 3000 });
  }
}

const postList = ref<Post[] | null>(null);
async function getPost() {
  try {
    const result = await fetchPostApi(selectedClass.value.name);
    postList.value = result.posts;
  }
  catch (error) {
    console.error('Error during fetching posts:', error);
  }
}

async function getClasses() {
  try {
    const result = await fetchClassListApi();
    classesA.value = result.filter(item => item).map(item => ({ name: item }));
    selectedClass.value = classesA.value[0];
  }
  catch (error) {
    console.error('Error during fetching classes:', error);
  }
}

onMounted(async () => {
  await getClasses();
  await getPost();
})
watch([selectedClass], () => {
  getPost();
})
</script>

<template>
  <div class="flex">
    <div class="flex flex-col flex-1 w-1/2 p-3">
      <div class="flex mb-[-10px]">
        <span class="text-lg font-bold">2024年秋季学期</span>
        <div class="ml-auto">
          <Select v-model="selectedClass" :options="classesA" option-label="name" filter placeholder="请选择班级"
            class="w-full md:w-56" />
        </div>
      </div>
      <div class="flex my-5 items-center">
        <Avatar class="mr-3">
          <div>
            <AvatarImage :src="userStore.user?.avatarUrl || ''" alt="@radix-vue" />
            <AvatarFallback>{{ userStore.user?.nickname }}</AvatarFallback>
          </div>
        </Avatar>
        <div class="flex flex-col">
          <span class="text-base font-semibold mb-3">教师姓名：{{ userStore.user?.nickname }}</span>
          <span class="text-base font-semibold">教工号：{{ userStore.user?.studentId }}</span>
        </div>
      </div>
      <Panel header="已发布公告" class="mx-1 mt-3 mb-5 h-full overflow-auto">
        <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
          <AccordionItem v-for="item in postList" :key="item.timestamp" :value="item.timestamp">
            <AccordionTrigger class="font-semibold">
              {{ item.title }}
            </AccordionTrigger>
            <AccordionContent>
              {{ item.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Panel>
      <Button label="Show" class="my-3" @click="visible = true">
        发布班级公告
      </Button>
      <Dialog v-model:visible="visible" modal header="发布班级公告" :style="{ width: '50rem' }">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">请选择一个或多个班级，点击发布按钮发布公告。</span>
        <div class="flex items-center gap-4 mb-4">
          <label for="title">公告标题</label>
          <InputText id="title" v-model="title" />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <Textarea v-model="content" auto-resize rows="10" class="w-full" placeholder="请输入班级公告" />
        </div>
        <div class="flex justify-end gap-2">
          <Button @click="sendPost()">
            发布公告
          </Button>
        </div>
      </Dialog>
    </div>
    <Separator orientation="vertical" />
    <div class="flex flex-col flex-1 w-1/2 p-3 overflow-auto">
      <div style="display: flex; justify-content: space-between;" class="mb-3 ml-auto">
        <Select v-model="selectedTime" :options="time" option-label="name" placeholder="请选择时间范围"
          class="w-full md:w-56" />
      </div>
      <Panel header="已精选评论" class="w-full h-full">
        <DataTable :value="products" scrollable table-style="min-width: 60rem">
          <Column field="expName" header="实验名称" />
          <Column field="name" header="学生昵称" />
          <Column field="studentID" header="学工号" />
          <Column field="time" header="评论时间" />
          <Column field="comment" header="评论内容" />
          <Column class="w-24 !text-end">
            <template #body>
              <Button @click="cancel">
                取消精选
              </Button>
            </template>
          </Column>
        </DataTable>
      </Panel>
      <div class="h-full">
        <div class="flex my-2">
          <Panel header="各实验点击次数排行榜">
            <DataTable :value="click" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="times" header="点击次数" sortable style="width: 25%" />
            </DataTable>
          </Panel>
          <Panel header="各实验浏览时长排行榜" class="ml-auto">
            <DataTable :value="browse" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="time" header="浏览时长" sortable style="width: 25%" />
            </DataTable>
          </Panel>
        </div>
        <div class="flex">
          <Panel header="各实验评论次数排行榜">
            <DataTable :value="comment" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="times" header="评论次数" sortable style="width: 25%" />
            </DataTable>
          </Panel>
          <Panel header="各实验收藏次数排行榜" class="ml-auto">
            <DataTable :value="star" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="times" header="收藏次数" sortable style="width: 25%" />
            </DataTable>
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>
