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
import Chart from 'primevue/chart';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { fetchCommentsApi, fetchClickCountApi, fetchCommentCountApi, fetchFavoriteCountApi, fetchTimeApi } from '@/api/class/teacher/teacherApi';
import { Comment } from '@/api/comment/commentType';
import type { ClickCount, CommentCount, FavoriteCount, Time } from '@/api/class/classType'

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

const classes = ref([
  { name: '2023215101' },
  { name: '2023215102' },
  { name: '2023215103' },
  { name: '2023215104' },
  { name: '2023215105' },
]);
const selectedClass = ref(classes.value[0]);
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
const isTablet = ref(true);
const toast = useToast();
const title = ref(`${new Date().toLocaleDateString()} 班级公告`);
const content = ref('');

function toggleTable() {
  isTablet.value = !isTablet.value;
}

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
const commentList = ref<Comment[] | null>(null);
const clickList = ref<ClickCount[] | null>(null);
const favoriteList = ref<FavoriteCount[] | null>(null);
const timeList = ref<Time[] | null>(null);
const commentCountList = ref<CommentCount[] | null>(null);

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
    classes.value = result.filter(item => item).map(item => ({ name: item }));
    selectedClass.value = classes.value[0];
  }
  catch (error) {
    console.error('Error during fetching classes:', error);
  }
}

async function getComments() {
  try {
    const result = await fetchCommentsApi(selectedClass.value.name, 'ALL_TIME');
    commentList.value = result.comments;
    console.log('pinglun', commentList.value);
    commentList.value.forEach(comment => {
      products.value.push({
        expName: comment.expId,
        name: comment.user.nickname,
        studentID: comment.user.studentId,
        time: comment.timestamp,
        comment: comment.content
      });
    });
  }
  catch (error) {
    console.error('Error during fetching comments:', error);
  }
}

async function getClickCount() {
  try {
    const result = await fetchClickCountApi(selectedClass.value.name, 'ALL_TIME');
    clickList.value = result.clicks;
    console.log('dianji', clickList.value);
    clickList.value.forEach(clickCount => {
      click.value.push({
        expName: clickCount.experiment.expName,
        times: clickCount.clickCount
      })
    });
  }
  catch (error) {
    console.error('Error during fetching click count:', error);
  }
}
async function getFavoriteCount() {
  try {
    const result = await fetchFavoriteCountApi(selectedClass.value.name, 'ALL_TIME');
    favoriteList.value = result.favorites;
    console.log('shoucang', favoriteList.value);
    favoriteList.value.forEach(favoriteCount => {
      star.value.push({
        expName: favoriteCount.experiment.expName,
        times: favoriteCount.favoriteCount
      })
    })
  }
  catch (error) {
    console.error('Error during fetching favorite count:', error);
  }
}
async function getTime() {
  try {
    const result = await fetchTimeApi(selectedClass.value.name, 'ALL_TIME');
    timeList.value = result.times;
    console.log('liulan', timeList.value);
    timeList.value.forEach(time => {
      browse.value.push({
        expName: time.experiment.expName,
        times: time.time
      })
    })
  }
  catch (error) {
    console.error('Error during fetching time:', error);
  }
}
async function getCommentCount() {
  try {
    const result = await fetchCommentCountApi(selectedClass.value.name, 'ALL_TIME');
    commentCountList.value = result.comments;
    console.log('pinglunshu', commentCountList.value);
    commentCountList.value.forEach(comments => {
      comment.value.push({
        expName: comments.experiment.expName,
        times: comments.commentCount
      })
    })
  }
  catch (error) {
    console.error('Error during fetching comment count:', error);
  }
}

onMounted(async () => {
  await getClasses();
  await getPost();
  await getComments();
  await getClickCount();
  await getFavoriteCount();
  await getTime();
  await getCommentCount();
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
          <Select v-model="selectedClass" :options="classes" option-label="name" filter placeholder="请选择班级"
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
        <div class="ml-auto">
          <Button v-if="isTablet" @click="toggleTable()">点击切换图展示</Button>
          <Button v-else @click="toggleTable()">点击切换表展示</Button>
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
        <span class="text-surface-500 dark:text-surface-400 block mb-8">请输入公告内容后，点击发布按钮发布公告。</span>
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
      <div v-if="isTablet" class="h-full">
        <div class="flex my-2">
          <Panel header="各实验点击次数排行榜" class="w-full mr-2">
            <DataTable :value="click" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="times" header="点击次数" sortable style="width: 25%" />
            </DataTable>
          </Panel>
          <Panel header="各实验浏览时长排行榜" class="ml-auto w-full">
            <DataTable :value="browse" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="time" header="浏览时长" sortable style="width: 25%" />
            </DataTable>
          </Panel>
        </div>
        <div class="flex">
          <Panel header="各实验评论次数排行榜" class="w-full mr-2">
            <DataTable :value="comment" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 50%" />
              <Column field="times" header="评论次数" sortable style="width: 50%" />
            </DataTable>
          </Panel>
          <Panel header="各实验收藏次数排行榜" class="ml-auto w-full">
            <DataTable :value="star" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 50%" />
              <Column field="times" header="收藏次数" sortable style="width: 50%" />
            </DataTable>
          </Panel>
        </div>
      </div>
      <div v-if="!isTablet" class="h-full">
        <div class="flex my-2">
          <Panel header="各实验点击次数排行榜" class="w-full mr-2">
            <DataTable :value="click" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="times" header="点击次数" sortable style="width: 25%" />
            </DataTable>
          </Panel>
          <Panel header="各实验浏览时长排行榜" class="ml-auto w-full">
            <DataTable :value="browse" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 25%" />
              <Column field="time" header="浏览时长" sortable style="width: 25%" />
            </DataTable>
          </Panel>
        </div>
        <div class="flex">
          <Panel header="各实验评论次数排行榜" class="w-full mr-2">
            <DataTable :value="comment" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 50%" />
              <Column field="times" header="评论次数" sortable style="width: 50%" />
            </DataTable>
          </Panel>
          <Panel header="各实验收藏次数排行榜" class="ml-auto w-full">
            <DataTable :value="star" scrollable table-style="min-width: 18rem">
              <Column field="expName" header="实验名称" sortable style="width: 50%" />
              <Column field="times" header="收藏次数" sortable style="width: 50%" />
            </DataTable>
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>
