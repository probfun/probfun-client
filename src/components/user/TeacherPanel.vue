<script setup lang="ts">
import type { Class, ClickCount, CommentCount, FavoriteCount, Post, Time } from '@/api/class/classType';
import type { Comment } from '@/api/comment/commentType';
import Chart from 'primevue/chart';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { fetchClassListApi, fetchPostApi, postPostApi } from '@/api/class/classApi';
import { fetchClickCountApi, fetchCommentCountApi, fetchCommentsApi, fetchFavoriteCountApi, fetchTimeApi } from '@/api/class/teacher/teacherApi';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const defaultValue = 'item-1';
const products = ref([
  {
    expName: '正态分布',
    name: '李明',
    username: '2023001',
    time: '2023-10-01',
    comment: '图像非常清晰，实验内容也很有趣。',
  },
  {
    expName: '正态分布',
    name: '刘红',
    username: '2023002',
    time: '2023-10-02',
    comment: '我学会了很多知识，非常感谢老师。',
  },
  {
    expName: '三门问题',
    name: '王小兰',
    username: '2023003',
    time: '2023-10-03',
    comment: '这个游戏激发了我的学习兴趣。',
  },
]);

const classes = ref([
  {
    name: '2023215101',
    id: '0',
  },
]);
const selectedClass = ref(classes.value[0]);
const click = ref([
  {
    expName: '正态分布',
    times: 10,
  },
  {
    expName: '三门问题',
    times: 2,
  },
  {
    expName: '阳性检测',
    times: 5,
  },
  {
    expName: '贝特朗悖论',
    times: 7,
  },
]);
const browse = ref([
  {
    expName: '正态分布',
    time: 3,
  },
  {
    expName: '三门问题',
    time: 2,
  },
  {
    expName: '阳性检测',
    time: 5,
  },
  {
    expName: '贝特朗悖论',
    time: 7,
  },
]);
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
  {
    expName: '贝特朗悖论',
    times: 7,
  },
]);
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
  {
    expName: '贝特朗悖论',
    times: 7,
  },
]);

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
    await postPostApi(title.value, content.value, [selectedClass.value.id]);
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
    const result = await fetchPostApi(selectedClass.value.id);
    postList.value = result.posts;
  }
  catch (error) {
    console.error('Error during fetching posts:', error);
  }
}

async function getClasses() {
  try {
    const result = await fetchClassListApi();
    classes.value = result.classes.map((item: Class) => {
      return {
        name: item.className,
        id: item.classId,
      };
    });
    selectedClass.value = classes.value[0];
  }
  catch (error) {
    console.error('Error during fetching classes:', error);
  }
}

async function getComments() {
  try {
    const result = await fetchCommentsApi(selectedClass.value.id, 'ALL_TIME');
    commentList.value = result.comments;
    console.log('pinglun', commentList.value);
    commentList.value.forEach((comment) => {
      products.value.push({
        expName: comment.expId,
        name: comment.user.nickname,
        username: comment.user.username,
        time: comment.timestamp,
        comment: comment.content,
      });
    });
  }
  catch (error) {
    console.error('Error during fetching comments:', error);
  }
}

async function getClickCount() {
  try {
    const result = await fetchClickCountApi(selectedClass.value.id, 'ALL_TIME');
    clickList.value = result.clicks;
    console.log('dianji', clickList.value);
    clickList.value.forEach((clickCount) => {
      click.value.push({
        expName: clickCount.experiment.expName,
        times: clickCount.clickCount,
      });
    });
  }
  catch (error) {
    console.error('Error during fetching click count:', error);
  }
}
async function getFavoriteCount() {
  try {
    const result = await fetchFavoriteCountApi(selectedClass.value.id, 'ALL_TIME');
    favoriteList.value = result.favorites;
    console.log('shoucang', favoriteList.value);
    favoriteList.value.forEach((favoriteCount) => {
      star.value.push({
        expName: favoriteCount.experiment.expName,
        times: favoriteCount.favoriteCount,
      });
    });
  }
  catch (error) {
    console.error('Error during fetching favorite count:', error);
  }
}
async function getTime() {
  try {
    const result = await fetchTimeApi(selectedClass.value.id, 'ALL_TIME');
    timeList.value = result.times;
    console.log('liulan', timeList.value);
    timeList.value.forEach((time) => {
      browse.value.push({
        expName: time.experiment.expName,
        time: time.time,
      });
    });
  }
  catch (error) {
    console.error('Error during fetching time:', error);
  }
}
async function getCommentCount() {
  try {
    const result = await fetchCommentCountApi(selectedClass.value.id, 'ALL_TIME');
    commentCountList.value = result.comments;
    console.log('pinglunshu', commentCountList.value);
    commentCountList.value.forEach((comments) => {
      comment.value.push({
        expName: comments.experiment.expName,
        times: comments.commentCount,
      });
    });
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
});
watch([selectedClass], () => {
  getPost();
});

const chartDataClick = ref();
const chartDataBrowse = ref();
const chartDataComment = ref();
const chartDataStar = ref();
const chartOptionsClick = ref();
const chartOptionsBrowse = ref();
const chartOptionsComment = ref();
const chartOptionsStar = ref();

onMounted(() => {
  chartDataClick.value = setChartDataClick();
  chartDataBrowse.value = setChartDataBrowse();
  chartDataComment.value = setChartDataComment();
  chartDataStar.value = setChartDataStar();
  chartOptionsClick.value = setChartOptionsClick();
  chartOptionsBrowse.value = setChartOptionsBrowse();
  chartOptionsComment.value = setChartOptionsComment();
  chartOptionsStar.value = setChartOptionsStar();
});

function generateRandomColor(alpha = 0.7) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setChartDataClick() {
  return {
    labels: click.value.map(item => item.expName),
    datasets: [
      {
        label: '各实验点击次数',
        data: click.value.map(item => item.times),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };
}
function setChartOptionsClick() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
}

function setChartDataStar() {
  // const documentStyle = getComputedStyle(document.body);

  return {
    labels: browse.value.map(item => item.expName),
    datasets: [
      {
        data: browse.value.map(item => item.time),
        backgroundColor: browse.value.map(() => generateRandomColor(0.7)), // 随机生成背景颜色
      },
    ],
  };
}
function setChartOptionsStar() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
}

function setChartDataComment() {
  // const documentStyle = getComputedStyle(document.body);
  return {
    labels: comment.value.map(item => item.expName),
    datasets: [
      {
        data: comment.value.map(item => item.times),
        backgroundColor: browse.value.map(() => generateRandomColor(0.7)), // 随机生成背景颜色
      },
    ],
  };
}

function setChartOptionsComment() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor,
        },
      },
    },
  };
}

function setChartDataBrowse() {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: star.value.map(item => item.expName),
    datasets: [
      {
        label: '各实验收藏次数',
        data: star.value.map(item => item.times),
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.6,
      },
    ],
  };
}
function setChartOptionsBrowse() {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
}
</script>

<template>
  <div class="flex">
    <div class="flex flex-col flex-1 w-1/2 p-3 overflow-auto">
      <div class="flex mb-[-10px]">
        <span class="text-lg font-bold">2024年秋季学期</span>
        <div class="ml-auto">
          <Select
            v-model="selectedClass" :options="classes" option-label="name" filter placeholder="请选择班级"
            class="w-full md:w-56"
          />
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
          <span class="text-base font-semibold">教工号：{{ userStore.user?.username }}</span>
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
      <Panel header="已精选评论" class=" w-full">
        <DataTable :value="products" scrollable table-style="min-width: 60rem">
          <Column class="w-24 !text-end">
            <template #body>
              <Button @click="cancel">
                取消精选
              </Button>
            </template>
          </Column>
          <Column field="expName" header="实验名称" />
          <Column field="name" header="学生昵称" />
          <Column field="username" header="学工号" />
          <Column field="time" header="评论时间" />
          <Column field="comment" header="评论内容" />
        </DataTable>
      </Panel>
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
      <div class="flex items-center gap-5 mb-4">
        <h2 class="text-lg font-semibold">
          数据展示与分析
        </h2>
        <Button v-if="isTablet" label="Show" @click="toggleTable()">
          点击切换图展示
        </Button>
        <Button v-else label="Show" @click="toggleTable()">
          点击切换表展示
        </Button>
      </div>
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
          <Panel header="各实验点击次数" class="w-1/2 mr-2">
            <Chart type="bar" :data="chartDataClick" :options="chartOptionsClick" />
          </Panel>
          <Panel header="各实验浏览时长" class="ml-auto w-1/2 justify-center items-center">
            <Chart type="line" :data="chartDataBrowse" :options="chartOptionsBrowse" />
          </Panel>
        </div>
        <div class="flex my-2">
          <Panel header="各实验评论次数" class="w-1/2 mr-2">
            <Chart type="doughnut" :data="chartDataComment" :options="chartOptionsComment" />
          </Panel>
          <Panel header="各实验收藏次数" class="ml-auto w-1/2">
            <Chart type="pie" :data="chartDataStar" :options="chartOptionsStar" />
          </Panel>
        </div>
      </div>
    </div>
  </div>
</template>
