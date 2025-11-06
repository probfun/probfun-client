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
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { fetchClassAnalyticsApi, fetchTeacherClassListApi } from '@/api/class/classApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
const chatKeywords = computed<ChatKeyword[]>(() => insights.value?.chatKeywords ?? []);
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

function selectStudent(studentId: number) {
  tabValue.value = 'students';
  selectedStudent.value = studentDetails.value.find(s => s.studentId === studentId) || null;
}

function clearSelection() {
  selectedStudent.value = null;
}

// 格式化学生显示名称：学号 - 姓名
function formatStudentName(student: { studentName: string; studentUsername?: string }) {
  if (student.studentUsername) {
    return `${student.studentUsername} - ${student.studentName}`;
  }
  return student.studentName;
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

          <!-- 学生表现 -->
          <div class="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>优秀学生 Top 10</CardTitle>
                <CardDescription>按正确率排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div v-if="topStudents.length > 0" class="space-y-3">
                  <div v-for="(s, i) in topStudents" :key="s.studentId" class="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" @click="selectStudent(s.studentId)">
                    <div class="flex items-center gap-3">
                      <div class="flex size-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                        {{ i + 1 }}
                      </div>
                      <span class="font-medium">{{ formatStudentName(s) }}</span>
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
                <CardTitle>待提升学生 Top 10</CardTitle>
                <CardDescription>按正确率排序</CardDescription>
              </CardHeader>
              <CardContent class="space-y-3">
                <div v-if="bottomStudents.length > 0" class="space-y-3">
                  <div v-for="s in bottomStudents" :key="s.studentId" class="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer" @click="selectStudent(s.studentId)">
                    <span class="font-medium">{{ formatStudentName(s) }}</span>
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
          </div>

          <!-- 活动分布 -->
          <Card>
            <CardHeader>
              <CardTitle>学习活动分布</CardTitle>
              <CardDescription>各类学习活动的时间占比</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-if="activities.length > 0" class="space-y-4">
                <div v-for="act in activities.slice(0, 10)" :key="act.studentId" class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium">{{ formatStudentName(act) }}</span>
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
        </TabsContent>

        <!-- 学生详情 -->
        <TabsContent value="students" class="space-y-6">
          <div v-if="!selectedStudent">
            <Card>
              <CardHeader>
                <CardTitle>选择学生查看详情</CardTitle>
                <CardDescription>点击学生姓名查看其学习轨迹和知识点掌握详情</CardDescription>
              </CardHeader>
              <CardContent>
                <div v-if="students.length > 0" class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <div v-for="s in students" :key="s.studentId" class="cursor-pointer rounded-lg border border-neutral-200 p-4 transition-all hover:border-indigo-500 hover:shadow-md" @click="selectStudent(s.studentId)">
                    <div class="flex items-center justify-between">
                      <div class="font-medium pr-3">
                        {{ formatStudentName(s) }}
                      </div>
                      <div class="flex flex-col items-center text-sm text-neutral-600">
                        <div>
                          做题总量: {{ s.completedQuestions }}题
                        </div>
                        <div class="mt-1">
                          正确率: {{ fmtPct(s.accuracy) }}
                        </div>
                      </div>
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
                {{ formatStudentName(selectedStudent) }} 的学习详情
              </h2>
              <Button variant="outline" @click="clearSelection">
                <Icon icon="lucide:arrow-left" class="mr-2 size-4" />
                返回
              </Button>
            </div>

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
                      <div class="text-lg font-semibold" :class="entry.accuracy >= 0.6 ? 'text-emerald-600' : 'text-red-600'">
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
                <div v-if="selectedStudent.chapterDetails?.length > 0" class="space-y-4">
                  <div v-for="kp in selectedStudent.chapterDetails" :key="kp.chapterId" class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ kp.chapterName }}</span>
                      <span class="text-sm text-neutral-600">{{ fmtPct(kp.accuracy) }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full transition-all" :class="kp.accuracy >= 0.6 ? 'bg-emerald-500' : 'bg-red-500'" :style="{ width: fmtPct(kp.accuracy) }" />
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
                      <span class="text-sm font-semibold text-emerald-600">{{ fmtPct(kp.averageAccuracy) }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full bg-emerald-500 transition-all" :style="{ width: fmtPct(kp.averageAccuracy) }" />
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
                      <span class="text-sm font-semibold text-red-600">{{ fmtPct(kp.averageAccuracy) }}</span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full bg-red-500 transition-all" :style="{ width: fmtPct(kp.averageAccuracy) }" />
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
                    <div class="text-lg font-semibold" :class="kp.averageAccuracy >= 0.6 ? 'text-emerald-600' : 'text-red-600'">
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
                <div v-for="(m, i) in topMistakes" :key="m.questionId" class="rounded-lg border p-4">
                  <div class="flex items-start gap-4">
                    <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">
                      {{ i + 1 }}
                    </div>
                    <div class="flex-1">
                      <div class="font-medium line-clamp-2">
                        {{ m.questionContent }}
                      </div>
                      <div class="mt-2 flex items-center gap-4 text-sm text-neutral-600">
                        <span v-if="m.chapter" class="rounded-full bg-neutral-100 px-2 py-1">{{ m.chapter }} </span>
                        <span>{{ m.studentCount }} 名学生出错</span>
                        <span>共 {{ m.mistakeCount }} 次</span>
                      </div>
                    </div>
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
  </div>
</template>
