<script setup lang="ts">
import type {
  ActivityDistributionEntry,
  ChapterOverview,
  ChatKeyword,
  Class,
  ClassAnalytics,
  FrequentMistake,
  StudentDetail,
  StudentPerformance,
} from '@/api/class/classType';
import type { Question } from '@/api/do-question/doQuestion.ts';
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { Bar, Radar } from 'vue-chartjs';
import { fetchClassAnalyticsApi, fetchTeacherClassListApi } from '@/api/class/classApi';
import { fetchQuestionApi } from '@/api/do-question/doQuestion.ts';
import MarkdownDiv from '@/components/markdown-div/MarkdownDiv.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogHeader } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import 'chart.js/auto';

const loading = ref(false);
const error = ref<string | null>(null);
const analytics = ref<ClassAnalytics | null>(null);
const selectedStudent = ref<StudentDetail | null>(null);
const classList = ref<Class[]>([]);
const currentClassId = ref<string>('');

async function loadClassList() {
  try {
    const res = await fetchTeacherClassListApi();
    classList.value = res.teachingClasses.map(c => ({
      ...c,
      id: String(c.id),
    }));
    if (!currentClassId.value && classList.value.length > 0) {
      currentClassId.value = classList.value[0].id;
      await load();
    }
  }
  catch (e) {
    console.error('加载班级列表失败:', e);
  }
}

async function load() {
  if (!currentClassId.value)
    return;
  loading.value = true;
  error.value = null;
  try {
    analytics.value = await fetchClassAnalyticsApi(currentClassId.value);
  }
  catch (e) {
    error.value = '加载失败,请重试。';
    console.error(e);
  }
  finally {
    loading.value = false;
  }
}

function handleClassChange(classId: string) {
  currentClassId.value = classId;
  selectedStudent.value = null;
  load();
}

onMounted(async () => {
  await loadClassList();
  if (currentClassId.value) {
    load();
  }
});

// 计算指标
const overview = computed(() => analytics.value?.classOverview);
const students = computed<StudentPerformance[]>(() => overview.value?.studentPerformance ?? []);
const kps = computed<ChapterOverview[]>(() => overview.value?.chapters ?? []);
const kpsTotal = computed<ChapterOverview[]>(() => {
  const chapters = [
    { id: '65', name: '第一章 概率论的基本概念' },
    { id: '101', name: '第二章 一维随机变量' },
    { id: '118', name: '第三章 多维随机变量' },
    { id: '112', name: '第四章 数字特征' },
    { id: '108', name: '第五章 极限定理' },
    { id: '70', name: '第六章 随机过程' },
    { id: '68', name: '第七章 泊松过程' },
    { id: '69', name: '第八章 平稳过程' },
    { id: '67', name: '第九章 离散时间马氏链' },
  ];

  const agg = chapters.map(ch => ({
    chapterId: ch.id,
    chapterName: ch.name,
    studentCount: 0,
    averageAttempts: 0,
    totalAttempts: 0,
    averageAccuracy: 0,
    completionRate: 0,
    children: [] as ChapterOverview[],
  } as ChapterOverview));

  const correctSums = Array.from({ length: 9 }).fill(0) as number[];
  const avgAttemptsNum = Array.from({ length: 9 }).fill(0) as number[];
  const avgAttemptsDen = Array.from({ length: 9 }).fill(0) as number[];

  function getChapterIndex(name?: string): number | null {
    if (!name)
      return null;
    const m = name.match(/^(\d+)/);
    if (!m)
      return null;
    const n = Number.parseInt(m[1], 10);
    return n >= 1 && n <= 9 ? n - 1 : null;
  }

  for (const kp of overview.value?.chapters || []) {
    const idx = getChapterIndex(kp.chapterName);
    if (idx == null)
      continue;

    const total = kp.totalAttempts ?? 0;
    const acc = kp.averageAccuracy ?? 0;
    const sc = kp.studentCount ?? 0;
    const avgAtt = kp.averageAttempts ?? 0;

    agg[idx].children?.push(kp);
    agg[idx].totalAttempts += total;
    agg[idx].studentCount += sc;

    correctSums[idx] += total * acc;
    avgAttemptsNum[idx] += avgAtt * sc;
    avgAttemptsDen[idx] += sc;
  }

  for (let i = 0; i < agg.length; i++) {
    agg[i].averageAccuracy = agg[i].totalAttempts > 0 ? correctSums[i] / agg[i].totalAttempts : 0;
    agg[i].averageAttempts = avgAttemptsDen[i] > 0 ? avgAttemptsNum[i] / avgAttemptsDen[i] : 0;
  }

  return agg;
});
const activities = computed<ActivityDistributionEntry[]>(() => overview.value?.activityDistribution ?? []);
const studentDetails = computed<StudentDetail[]>(() => analytics.value?.studentDetails ?? []);
const insights = computed(() => analytics.value?.insights);

const tabValue = ref('overview');
const totalStudents = computed(() => overview.value?.totalStudents ?? 0);
const className = computed(() => overview.value?.teachingClassName || classList.value.find(c => c.id === currentClassId.value)?.name || '—');

const avgAccuracy = computed(() => {
  if (!students.value.length)
    return 0;
  const s = students.value.reduce((acc, s) => acc + (s.accuracy || 0), 0);
  return s / students.value.length;
});

const avgStudyDuration = computed(() => {
  if (!activities.value.length)
    return 0;
  const a = activities.value.reduce((acc, a) => acc + (a.totalTime || 0), 0);
  return a / activities.value.length;
});

const totalAttempts = computed(() => {
  if (!kps.value.length)
    return 0;
  return kps.value.reduce((acc, k) => acc + (k.totalAttempts || 0), 0);
});

// 知识点强/弱
const topStrongKps = computed(() =>
  [...kps.value].sort((a, b) => (b.averageAccuracy ?? 0) - (a.averageAccuracy ?? 0)).slice(0, 5),
);

const topWeakKps = computed(() =>
  [...kps.value].sort((a, b) => (a.averageAccuracy ?? 0) - (b.averageAccuracy ?? 0)).slice(0, 5),
);

// 学生表现
const topStudents = computed(() =>
  [...students.value].sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0)).slice(0, 10),
);

const bottomStudents = computed(() =>
  [...students.value].sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0)).slice(0, 10),
);

// 高频错题
const frequentMistakes = computed<FrequentMistake[]>(() => insights.value?.frequentMistakes ?? []);
const topMistakes = computed(() => frequentMistakes.value.slice(0, 10));

// 聊天关键词
const chatKeywords = computed<ChatKeyword[]>(() => insights.value?.chatKeywords.find(c => c.subjectName === '概率论')?.keywords ?? []);
console.log(chatKeywords.value);
const topKeywords = computed(() => chatKeywords.value.slice(0, 20));

// 活动分布
const activityKeys = ['answerQuestions', 'aiChat', 'browseResources', 'discussion'] as const;
const activityColors: Record<(typeof activityKeys)[number], string> = {
  answerQuestions: 'bg-blue-500',
  aiChat: 'bg-violet-500',
  browseResources: 'bg-emerald-500',
  discussion: 'bg-amber-500',
};

const activityLabels: Record<(typeof activityKeys)[number], string> = {
  answerQuestions: '答题',
  aiChat: 'AI对话',
  browseResources: '浏览资源',
  discussion: '讨论',
};

const radarTop5 = computed<ChapterOverview[]>(() =>
  [...kpsTotal.value].slice(0, 5),
);

const radarBottom4 = computed<ChapterOverview[]>(() =>
  [...kpsTotal.value].slice(5, 9),
);

const barChapter = ref<ChapterOverview[]>([]);

function buildRadarData(items: ChapterOverview[]) {
  return {
    labels: items.map(kp => kp.chapterName),
    datasets: [
      {
        label: '平均正确率',
        data: items.map(kp => kp.averageAccuracy ?? 0),
        backgroundColor: 'rgba(99,102,241,0.2)',
        borderColor: 'rgb(99,102,241)',
        pointBackgroundColor: 'rgb(99,102,241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99,102,241)',
      },
    ],
  };
}

function buildBarData(items: ChapterOverview[]) {
  return {
    labels: items.map(kp => kp.chapterName),
    datasets: [
      {
        label: '平均正确率',
        data: items.map(kp => kp.averageAccuracy ?? 0),
        backgroundColor: 'rgba(99,102,241,0.7)',
      },
    ],
  };
}

const radarDataTop5 = computed(() => buildRadarData(radarTop5.value));
const radarDataBottom2 = computed(() => buildRadarData(radarBottom4.value));
const barDataChapter = computed(() => buildBarData(barChapter.value));

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: { enabled: true },
  },
  scales: {
    r: {
      suggestedMin: 0,
      suggestedMax: 1,
      grid: { color: 'rgba(0,0,0,0.05)' },
      angleLines: { color: 'rgba(0,0,0,0.05)' },
      ticks: {
        backdropColor: 'transparent',
        showLabelBackdrop: false,
        callback: (val: any) => `${Number(val) * 100}%`,
      },
    },
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: (ctx: any) =>
          `${(Number((ctx.parsed as any)?.y ?? ctx.parsed ?? 0) * 100).toFixed(0)}%`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false, color: 'rgba(0,0,0,0.05)' },
      ticks: { color: '#6b7280' },
    },
    y: {
      suggestedMin: 0,
      suggestedMax: 1,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: {
        color: '#6b7280',
        callback: (val: any) => `${Number(val) * 100}%`,
      },
    },
  },
};

function fmtPct(x: number, digits = 0) {
  if (!Number.isFinite(x) || x <= 0)
    return '0%';
  return `${(x * 100).toFixed(digits)}%`;
}

function fmtNum(n: number) {
  return new Intl.NumberFormat().format(n || 0);
}

function fmtMin(x: number) {
  if (!x || x <= 0)
    return '0分钟';
  if (x < 60)
    return `${x.toFixed(0)}分钟`;
  const h = Math.floor(x / 60);
  const m = Math.round(x % 60);
  return `${h}小时${m}分钟`;
}

function selectStudent(studentId: string) {
  tabValue.value = 'students';
  selectedStudent.value = studentDetails.value.find(s => s.studentId === studentId) || null;
}

function clearSelection() {
  selectedStudent.value = null;
}

const selectedQuestion = ref<Question | null>(null);
const isQuestionDialogOpen = ref<boolean>(false);

async function clickQuestion(questionId: string) {
  try {
    const response = await fetchQuestionApi(questionId);
    const question = response.question;
    selectedQuestion.value = {
      ...question,
      choices: (question.choices || []).map(choice => ({
        ...choice,
        content: choice.content.replace(/^[A-Z]\.\s*/, ''),
      })),
      content: question.content.replace(/^\d+\.\s*/, ''),
    };
  }
  catch (error) {
    console.error('Error fetching question:', error);
  }
  isQuestionDialogOpen.value = true;
}

function textColor(accuracy: number) {
  if (accuracy >= 0.9)
    return 'text-green-500';
  if (accuracy >= 0.75)
    return 'text-yellow-500';
  if (accuracy >= 0.5)
    return 'text-orange-500';
  return 'text-red-600';
}

function bgColor(accuracy: number, heavy: boolean) {
  if (accuracy >= 0.9)
    return heavy ? 'bg-green-500' : 'bg-green-100';
  if (accuracy >= 0.75)
    return heavy ? 'bg-yellow-500' : 'bg-yellow-100';
  if (accuracy >= 0.5)
    return heavy ? 'bg-orange-500' : 'bg-orange-100';
  return heavy ? 'bg-red-500' : 'bg-red-100';
}

function borderColor(accuracy: number) {
  if (accuracy >= 0.9)
    return 'border-green-500';
  if (accuracy >= 0.75)
    return 'border-yellow-500';
  if (accuracy >= 0.5)
    return 'border-orange-500';
  return 'border-red-500';
}

defineExpose({ refresh: load });
</script>

<template>
  <div class="relative h-full bg-neutral-50 p-6">
    <div v-if="!loading && classList.length === 0" class="flex flex-col items-center justify-center py-20">
      <Icon icon="lucide:users-x" class="size-16 text-neutral-400 mb-4" />
      <h2 class="text-xl font-semibold text-neutral-700 mb-2">
        暂无班级
      </h2>
      <p class="text-neutral-500 text-sm mb-6">
        请先前往“班级管理”创建班级
      </p>
      <Button @click="loadClassList">
        <Icon icon="lucide:refresh-cw" class="mr-2 size-4" />
        刷新
      </Button>
    </div>
    <div v-else class="rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">
            班级学情分析
          </h1>
          <p class="mt-2 text-primary-foreground/90">
            {{ className }} · 共 {{ totalStudents }} 名学生
          </p>
        </div>
        <div class="flex items-center gap-4">
          <Select :model-value="currentClassId" @update:model-value="handleClassChange">
            <SelectTrigger class="w-48 bg-white/10 border-white/20 text-primary-foreground">
              <SelectValue placeholder="选择班级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cls in classList" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" class="bg-white/10 text-primary-foreground hover:bg-white/20 border-white/20" @click="load">
            <Icon icon="lucide:refresh-cw" class="mr-2 size-4" />
            刷新
          </Button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center space-y-4">
        <Icon icon="lucide:loader-2" class="size-12 animate-spin text-indigo-600 mx-auto" />
        <p class="text-neutral-600">
          加载中...
        </p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="rounded-xl bg-red-100 p-6 text-center">
      <Icon icon="lucide:alert-circle" class="size-12 text-red-500 mx-auto mb-4" />
      <p class="text-red-700 mb-4">
        {{ error }}
      </p>
      <Button @click="load">
        重试
      </Button>
    </div>

    <!-- Content -->
    <div v-else-if="analytics">
      <Tabs v-model="tabValue" class="space-y-6">
        <TabsList class="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            总览
          </TabsTrigger>
          <TabsTrigger value="students">
            学生详情
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            知识点分析
          </TabsTrigger>
          <TabsTrigger value="insights">
            洞察
          </TabsTrigger>
        </TabsList>

        <!-- 总览 -->
        <TabsContent value="overview" class="space-y-6">
          <!-- 统计卡片 -->
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader class="pb-6">
                <CardDescription>总学生数</CardDescription>
                <CardTitle class="text-3xl">
                  {{ totalStudents }}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader class="pb-6">
                <CardDescription>平均正确率</CardDescription>
                <CardTitle class="text-3xl">
                  {{ fmtPct(avgAccuracy) }}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader class="pb-6">
                <CardDescription>平均学习时长</CardDescription>
                <CardTitle class="text-3xl">
                  {{ fmtMin(avgStudyDuration) }}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader class="pb-6">
                <CardDescription>总答题次数</CardDescription>
                <CardTitle class="text-3xl">
                  {{ fmtNum(totalAttempts) }}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>章节正确率</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs default-value="1">
                  <TabsList class="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="1">
                      概率论
                    </TabsTrigger>
                    <TabsTrigger value="2">
                      随机过程
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="1">
                    <div v-if="radarTop5.length > 0" class="h-72">
                      <Radar :data="radarDataTop5" :options="radarOptions" />
                    </div>
                    <div v-else class="py-8 text-center text-neutral-400">
                      暂无知识点数据
                    </div>
                  </TabsContent>
                  <TabsContent value="2">
                    <div v-if="radarBottom4.length > 0" class="h-72">
                      <Radar :data="radarDataBottom2" :options="radarOptions" />
                    </div>
                    <div v-else class="py-8 text-center text-neutral-400">
                      暂无知识点数据
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>章节知识点正确率</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  @update:model-value="(value) => {
                    barChapter = kpsTotal.find(kp => kp.chapterId === value)?.children ?? [];
                  }"
                >
                  <SelectTrigger class="mb-4">
                    <SelectValue placeholder="选择一个章节" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="chapter in kpsTotal" :key="chapter.chapterId" :value="chapter.chapterId">
                        {{ chapter.chapterName }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-if="barChapter.length > 0" class="h-72">
                  <Bar :data="barDataChapter" :options="barOptions" />
                </div>
                <div v-else class="py-8 text-center text-neutral-400">
                  暂无知识点数据
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- 学生表现 -->
          <div class="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>优秀学生</CardTitle>
                <CardDescription>按正确率降序排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div v-if="topStudents.length > 0" class="space-y-3">
                  <div v-for="(s, i) in topStudents" :key="s.studentId" class="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" @click="selectStudent(s.studentId)">
                    <div class="flex items-center gap-3">
                      <div class="flex size-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                        {{ i + 1 }}
                      </div>
                      <span class="font-medium">{{ s.studentName }}</span>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-emerald-600">
                        {{ fmtPct(s.accuracy) }}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {{ s.completedQuestions }}题
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <Icon icon="lucide:users" class="size-12 mb-2" />
                  <p class="text-sm">
                    暂无学生数据
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>待提升学生</CardTitle>
                <CardDescription>按正确率升序排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div v-if="bottomStudents.length > 0" class="space-y-3">
                  <div v-for="s in bottomStudents" :key="s.studentId" class="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" @click="selectStudent(s.studentId)">
                    <span class="font-medium">{{ s.studentName }}</span>
                    <div class="text-right">
                      <div class="font-semibold text-red-600">
                        {{ fmtPct(s.accuracy) }}
                      </div>
                      <div class="text-xs text-neutral-500">
                        {{ s.completedQuestions }}题
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <Icon icon="lucide:users" class="size-12 mb-2" />
                  <p class="text-sm">
                    暂无学生数据
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>学习活动分布</CardTitle>
                <CardDescription>各类学习活动的时间占比</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div v-if="activities.length > 0" class="space-y-4">
                  <div v-for="act in activities.slice(0, 10)" :key="act.studentId" class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium">{{ act.studentName }}</span>
                      <span class="text-neutral-500">{{ fmtMin(act.totalTime) }}</span>
                    </div>
                    <div class="flex h-3 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div v-for="key in activityKeys" :key="key" :class="activityColors[key]" :style="{ width: fmtPct(act.timeDistribution[key]) }" class="transition-all" />
                    </div>
                    <div class="flex gap-4 text-xs text-neutral-600">
                      <div v-for="key in activityKeys" :key="key" class="flex items-center gap-1">
                        <div :class="activityColors[key]" class="size-2 rounded-full" />
                        {{ activityLabels[key] }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <Icon icon="lucide:activity" class="size-12 mb-2" />
                  <p class="text-sm">
                    暂无活动数据
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- 活动分布 -->
        </TabsContent>

        <!-- 学生详情 -->
        <TabsContent v-auto-animate value="students" class="space-y-6">
          <div v-if="!selectedStudent">
            <Card>
              <CardHeader>
                <CardTitle>选择学生查看详情</CardTitle>
                <CardDescription>点击学生姓名查看其学习轨迹和知识点掌握详情</CardDescription>
              </CardHeader>
              <CardContent>
                <div v-if="students.length > 0" class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
                  <div
                    v-for="s in students" :key="s.studentId"
                    class="cursor-pointer flex items-center rounded-lg border border-neutral-200 px-4 py-6 transition-all hover:border-indigo-500 hover:shadow-md"
                    :class="[borderColor(s.accuracy), bgColor(s.accuracy, false), textColor(s.accuracy)]"
                    @click="selectStudent(s.studentId)"
                  >
                    <div class="font-medium text-foreground">
                      {{ s.studentName }}
                    </div>
                    <div class="ml-auto text-md font-bold">
                      正确率：{{ fmtPct(s.accuracy) }}
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-400">
                  <Icon icon="lucide:user-x" class="size-16 mb-3" />
                  <p>暂无学生数据</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div v-else class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold">
                {{ selectedStudent.studentName }} 的学习详情
              </h2>
              <Button variant="outline" @click="clearSelection">
                <Icon icon="lucide:arrow-left" class="mr-2 size-4" />
                返回
              </Button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>学习轨迹</CardTitle>
                </CardHeader>
                <CardContent>
                  <div v-if="selectedStudent.learningTrajectory?.length > 0" class="space-y-3">
                    <div v-for="entry in selectedStudent.learningTrajectory" :key="entry.date" class="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div class="font-medium">
                          {{ entry.date }}
                        </div>
                        <div class="mt-1 text-sm text-neutral-600">
                          完成 {{ entry.completedQuestions }} 题 · {{ entry.totalAttempts }} 次尝试
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-lg font-semibold" :class="textColor(entry.accuracy)">
                          {{ fmtPct(entry.accuracy) }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                    <Icon icon="lucide:calendar-off" class="size-12 mb-2" />
                    <p class="text-sm">
                      暂无学习轨迹
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>知识点掌握详情</CardTitle>
                </CardHeader>
                <CardContent>
                  <div v-if="selectedStudent.chapters?.length > 0" class="space-y-4">
                    <div v-for="kp in selectedStudent.chapters" :key="kp.chapterId" class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="font-medium">{{ kp.chapterName }}</span>
                        <span class="text-sm text-neutral-600">{{ fmtPct(kp.accuracy) }}</span>
                      </div>
                      <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div class="h-full transition-all" :class="bgColor(kp.accuracy, true)" :style="{ width: fmtPct(kp.accuracy) }" />
                      </div>
                      <div class="text-xs text-neutral-500">
                        平均尝试 {{ kp.averageAttempts.toFixed(1) }} 次 · 共 {{ kp.totalAttempts }} 次
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                    <Icon icon="lucide:book-open" class="size-12 mb-2" />
                    <p class="text-sm">
                      暂无知识点数据
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <!-- 知识点分析 -->
        <TabsContent value="knowledge" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>掌握较好的知识点 Top 5</CardTitle>
                <CardDescription>按平均正确率排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div v-if="topStrongKps.length > 0" class="space-y-4">
                  <div v-for="kp in topStrongKps" :key="kp.chapterId" class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ kp.chapterName }}</span>
                      <span class="text-sm font-semibold" :class="textColor(kp.averageAccuracy)">{{ fmtPct(kp.averageAccuracy) }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full transition-all" :class="bgColor(kp.averageAccuracy, true)" :style="{ width: fmtPct(kp.averageAccuracy) }" />
                    </div>
                    <div class="text-xs text-neutral-500">
                      {{ kp.studentCount }} 名学生 · 共 {{ kp.totalAttempts }} 次尝试
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <Icon icon="lucide:trophy" class="size-12 mb-2" />
                  <p class="text-sm">
                    暂无知识点数据
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>需加强的知识点 Top 5</CardTitle>
                <CardDescription>按平均正确率排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div v-if="topWeakKps.length > 0" class="space-y-4">
                  <div v-for="kp in topWeakKps" :key="kp.chapterId" class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ kp.chapterName }}</span>
                      <span class="text-sm font-semibold" :class="textColor(kp.averageAccuracy)">{{ fmtPct(kp.averageAccuracy) }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full transition-all" :class="bgColor(kp.averageAccuracy, true)" :style="{ width: fmtPct(kp.averageAccuracy) }" />
                    </div>
                    <div class="text-xs text-neutral-500">
                      {{ kp.studentCount }} 名学生 · 共 {{ kp.totalAttempts }} 次尝试
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <Icon icon="lucide:alert-circle" class="size-12 mb-2" />
                  <p class="text-sm">
                    暂无知识点数据
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>所有知识点概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div v-if="kps.length > 0" class="space-y-3">
                <div v-for="kp in kps" :key="kp.chapterId" class="flex items-center justify-between rounded-lg border p-4">
                  <div class="flex-1">
                    <div class="font-medium">
                      {{ kp.chapterName }}
                    </div>
                    <div class="mt-2 flex items-center gap-4 text-sm text-neutral-600">
                      <span>{{ kp.studentCount }} 名学生</span>
                      <span>平均 {{ kp.averageAttempts.toFixed(1) }} 次尝试</span>
                      <span>共 {{ kp.totalAttempts }} 次</span>
                    </div>
                  </div>
                  <div class="ml-4 text-right">
                    <div class="text-lg font-semibold" :class="textColor(kp.averageAccuracy)">
                      {{ fmtPct(kp.averageAccuracy) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-400">
                <Icon icon="lucide:book-x" class="size-16 mb-3" />
                <p>暂无知识点数据</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- 洞察 -->
        <TabsContent value="insights" class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>高频错题 Top 10</CardTitle>
              <CardDescription>班级中出错最多的题目</CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="topMistakes.length > 0" class="space-y-4">
                <div v-for="(m, i) in topMistakes" :key="m.questionId" class="rounded-lg border p-4 cursor-pointer hover:bg-muted transition-all group" @click="clickQuestion(m.questionId)">
                  <div class="flex items-start gap-4">
                    <div class="flex size-8 mt-1.5 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                      {{ i + 1 }}
                    </div>
                    <div class="flex-1">
                      <MarkdownDiv :text="m.questionContent" />
                      <div class="mt-2 flex items-center gap-4 text-sm text-neutral-600">
                        <span v-if="m.chapter" class="rounded-full bg-neutral-100 px-2 py-1">{{ m.chapter }} </span>
                        <span>{{ m.studentCount }} 名学生出错</span>
                        <span>共 {{ m.mistakeCount }} 次</span>
                      </div>
                    </div>
                    <Icon icon="lucide:chevron-right" class="size-5 text-muted-foreground group-hover:opacity-100 opacity-0 transition-all my-auto" />
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-400">
                <Icon icon="lucide:circle-check" class="size-16 mb-3" />
                <p>暂无错题数据</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI对话关键词</CardTitle>
              <CardDescription>学生最常询问的内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="topKeywords.length > 0" class="flex flex-wrap gap-2">
                <div v-for="kw in topKeywords" :key="kw.keyword" class="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                  {{ kw.keyword }}
                  <span class="ml-2 text-indigo-500">{{ kw.frequency }}</span>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-neutral-400">
                <Icon icon="lucide:message-square-off" class="size-16 mb-3" />
                <p>暂无对话数据</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

    <Dialog v-model:open="isQuestionDialogOpen">
      <DialogContent class="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>题目详情</DialogTitle>
        </DialogHeader>
        <div v-if="selectedQuestion" class="">
          <div class="flex items-start gap-3">
            <MarkdownDiv :text="selectedQuestion.content" />
          </div>
          <div class="mt-4 grid gap-2">
            <RadioGroup
              v-if="selectedQuestion?.questionType === 'SC' && selectedQuestion?.choices"
              orientation="vertical"
              :model-value="(selectedQuestion.choices.find(c => c.isCorrect) || {}).id ?? null"
            >
              <label
                v-for="(choice, index) in selectedQuestion.choices"
                :key="choice.id"
                :for="choice.id"
                class="group border rounded-xl p-3 flex items-center justify-start transition-all h-auto cursor-pointer"
                :class="{
                  'border-green-500 bg-green-50': choice.isCorrect,
                }"
              >
                <RadioGroupItem
                  :id="choice.id.toString()"
                  v-auto-animate="{ duration: 100 }"
                  :value="choice.id"
                  class="mr-3 text-foreground"
                  :disabled="selectedQuestion.answerRecords.length > 0"
                  @click="choice.isChosen && selectedQuestion.choices.forEach(c => (c.isChosen = false))"
                />
                <label class="mr-2"> {{ String.fromCharCode(65 + index) }}. </label>
                <MarkdownDiv class="" :text="choice.content" />
              </label>
            </RadioGroup>
          </div>
        </div>
        <div v-if="selectedQuestion" class="rounded-xl border p-4 transition-all">
          <div class="font-semibold mb-1">
            答案解析
          </div>
          <MarkdownDiv :text="selectedQuestion.fullAnswer" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
