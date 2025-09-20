<!-- LearningAnalyticsDashboard.vue (shadcn-vue 版) -->
<script setup lang="ts">
import type { Analysis } from '@/api/do-question/doQuestion.ts';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  AlertCircleIcon,
  AwardIcon,
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  LightbulbIcon,
  MessageCircleIcon,
  TargetIcon,
  TrendingUpIcon,
} from 'lucide-vue-next';

import { computed, ref } from 'vue';
import { Bar, Radar } from 'vue-chartjs';
import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/chart-bar';
import { Separator } from '@/components/ui/separator';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InsightCard from './InsightCard.vue';
import MetricCard from './MetricCard.vue';
import RecommendationCard from './RecommendationCard.vue';

const props = defineProps<{ data: Analysis }>();

ChartJS.register(
  ChartDataLabels,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
);

const activeTab = ref('overview');
const hoveredCard = ref<string | null>(null);

const tabs = [
  { id: 'overview', label: '学情总览', icon: TrendingUpIcon },
  { id: 'dialogue', label: '对话分析', icon: MessageCircleIcon },
  { id: 'learning', label: '学习分析', icon: BrainIcon },
  { id: 'cognitive', label: '认知分析', icon: LightbulbIcon },
  { id: 'plan', label: '学习计划', icon: TargetIcon },
];

const objectiveMetrics = computed(() => props.data?.objective_analysis?.metrics || []);
const dialogueMetrics = computed(() => props.data?.dialogue_analysis?.metrics || []);
const learningMetrics = computed(() => props.data?.learning_analysis?.metrics || []);
const cognitiveMetrics = computed(() => props.data?.cognitive_analysis?.metrics || []);

function getMetricTitle(name: string) {
  return name;
}
function getDialogueMetricTitle(name: string) {
  return name;
}
function getLearningMetricTitle(name: string) {
  return name;
}
function getCognitiveMetricTitle(name: string) {
  return name;
}

function getMetricIcon(index: number) {
  const icons = [TargetIcon, BookOpenIcon, TrendingUpIcon, ClockIcon];
  return icons[index] || TargetIcon;
}

function getMetricColor(index: number) {
  const colors = ['blue', 'green', 'purple', 'orange'];
  return colors[index] || 'blue';
}

const commonDatalabels = {
  color: '#000',
  font: { size: 14 }, // 比默认更大
  formatter: (v: number) => `${Number(v.toFixed(2))}%`,
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false, labels: { color: '#000', font: { size: 14 } } },
    tooltip: {
      intersect: false,
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      footerFont: { size: 14 },
      callbacks: { label: (ctx: any) => `${ctx.dataset.label || ''} ${Number(ctx.parsed.y.toFixed(2))}%` },
    },
    datalabels: commonDatalabels, // ← 若希望全部柱都生效
  },
  scales: {
    x: {
      ticks: { color: '#000', font: { size: 14 } },
      grid: { color: 'rgba(0,0,0,0.1)' },
    },
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        color: '#000',
        font: { size: 14 },
        stepSize: 20,
        callback: (v: any) => `${Number(v.toFixed(2))}%`,
      },
      grid: { color: 'rgba(0,0,0,0.1)' },
    },
  },
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#000', font: { size: 14 } } },
    tooltip: {
      titleColor: '#000',
      bodyColor: '#000',
      titleFont: { size: 14 },
      bodyFont: { size: 14 },
      callbacks: { label: (ctx: any) => `${ctx.dataset.label || ''} ${Number(ctx.parsed.r.toFixed(2))}%` },
    },
  },
  scales: {
    r: {
      angleLines: { color: 'rgba(0,0,0,0.1)' },
      grid: { color: 'rgba(0,0,0,0.1)' },
      pointLabels: { color: '#000', font: { size: 14 } }, // 维度名称
      ticks: {
        color: '#000',
        backdropColor: 'transparent',
        font: { size: 12 },
        stepSize: 20,
        max: 100,
        callback: (v: any) => `${Number(v.toFixed(2))}%`,
      },
    },
  },
};

const objectiveBarData = computed(() => {
  return props.data.objective_analysis.metrics.map((d) => {
    return {
      'name': d.name,
      '能力值(%)': d.value * 100,
    };
  });
});

// const objectiveBarData = computed(() => ({
//   return props.data.objective_analysis.metrics.map(d => return {
//     name: d.name;
//         total: d.value * 100
//   });
//   labels: props.data.objective_analysis.metrics.map(d => d.name),
//   datasets: [
//     {
//       label: '能力值(%)',
//       data: props.data.objective_analysis.metrics.map(d => d.value * 100),
//       backgroundColor: 'rgba(59,130,246,0.6)',
//       borderColor: 'rgba(30,64,175,1)',
//       borderWidth: 1,
//       borderRadius: 4,
//     },
//   ],
// }));

const dialogueBarData = computed(() => ({
  labels: props.data.dialogue_analysis.metrics.map(d => d.name),
  datasets: [
    { data: props.data.dialogue_analysis.metrics.map(d => d.value * 100), backgroundColor: 'rgba(16,185,129,0.6)', borderColor: 'rgba(4,120,87,1)', borderWidth: 1, borderRadius: 4 },
  ],
}));

const cognitiveBarData = computed(() => ({
  labels: props.data.cognitive_analysis.metrics.map(d => d.name),
  datasets: [
    { data: props.data.cognitive_analysis.metrics.map(d => d.value * 100), backgroundColor: 'rgba(99,102,241,0.6)', borderColor: 'rgba(67,56,202,1)', borderWidth: 1, borderRadius: 4 },
  ],
}));

const radarChartData = computed(() => ({
  labels: props.data.learning_analysis.metrics.map(d => d.name),
  datasets: [
    {
      label: '能力值',
      data: props.data.learning_analysis.metrics.map(d => d.value),
      borderColor: 'rgba(136,132,216,1)',
      backgroundColor: 'rgba(136,132,216,0.3)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(136,132,216,1)',
      fill: true,
    },
  ],
}));
</script>

<template>
  <div class="h-full p-8 pt-4">
    <div class="mx-auto w-full max-w-7xl">
      <CardHeader class="text-center space-y-2">
        <div class="text-4xl font-bold tracking-tight">
          个人学情报告
        </div>
        <CardDescription class="text-base">
          基于数据驱动的深度学习分析
        </CardDescription>
      </CardHeader>

      <!-- 选项卡导航：与 activeTab 双向绑定，保证原有逻辑 -->
      <Tabs v-model="activeTab" class="w-full">
        <div class="flex justify-center mb-8">
          <TabsList class="flex flex-wrap gap-1 sm:gap-2 rounded-2xl">
            <TabsTrigger
              v-for="tab in tabs"
              :key="tab.id"
              :value="tab.id"
              class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl px-6 py-3 text-base"
            >
              <div class="flex items-center gap-2">
                <component :is="tab.icon" class="size-4" />
                {{ tab.label }}
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <!-- 总览 -->
        <TabsContent value="overview" class="space-y-6 transition-all">
          <!-- 指标概览 -->
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card
              v-if="objectiveMetrics.length === 0"
              class="shadow"
            >
              <CardHeader>
                <CardTitle
                  class="text-bas
                </CardTitle>e"
                >
                  暂无指标
                  <CardDescription>等待数据加载或请检查数据源。</CardDescription>
                </cardtitle>
              </CardHeader>
            </Card>

            <MetricCard
              v-for="(metric, index) in objectiveMetrics"
              :key="index"
              :title="getMetricTitle(metric.name)"
              :value="metric.value"
              :explanation="metric.explanation"
              :icon="getMetricIcon(index)"
              :color="getMetricColor(index)"
              @hover="hoveredCard = metric.name"
              @leave="hoveredCard = null"
            />
          </section>

          <!-- 图表区 -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card class="overflow-hidden group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  能力指标分布
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="relative h-[300px]">
                  <!--                  <Bar :data="objectiveBarData" :options="barOptions" /> -->
                  <BarChart
                    :data="objectiveBarData"
                    index="name"
                    :categories="['能力值(%)']"
                    :y-formatter="(tick, i) => {
                      return typeof tick === 'number' ? `${Number(tick.toFixed(2))}%` : '';
                    }"
                  />
                </div>
              </CardContent>
            </Card>

            <Card class="overflow-hidden group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  综合能力雷达图
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="relative h-[300px]">
                  <Radar :data="radarChartData" :options="radarOptions" />
                </div>
              </CardContent>
            </Card>
          </section>

          <!-- 关键洞察 -->
          <section class="space-y-4">
            <div class="flex items-center gap-2">
              <BrainIcon class="w-6 h-6 text-primary" />
              <h2 class="text-xl sm:text-2xl font-semibold">
                关键洞察
              </h2>
              <Badge variant="secondary" class="rounded-full">
                {{ (props.data?.objective_analysis?.insights || []).length }}
              </Badge>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <InsightCard
                v-for="(insight, index) in props.data?.objective_analysis?.insights || []"
                :key="index"
                :insight="insight"
              />
            </div>
          </section>

          <!-- 里程碑 -->
          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader class="flex flex-row items-center justify-between">
                <div class="flex items-center gap-2">
                  <AwardIcon class="w-5 h-5 text-yellow-500" />
                  <CardTitle class="text-lg group-hover:text-primary transition-all">
                    学习里程碑
                  </CardTitle>
                </div>
                <Badge variant="outline" class="rounded-full">
                  {{ (props.data?.objective_analysis?.milestones || []).length }}
                </Badge>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="(milestone, index) in props.data?.objective_analysis?.milestones || []"
                    :key="index"
                    class="flex items-center gap-3 p-3 rounded-xl border bg-muted/30"
                  >
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center shadow">
                      <AwardIcon class="w-4 h-4 text-white" />
                    </div>
                    <span class="text-sm sm:text-base text-muted-foreground">{{ milestone }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <!-- 对话分析 -->
        <TabsContent value="dialogue" class="space-y-6 transition-all">
          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <MetricCard
              v-for="(metric, index) in dialogueMetrics"
              :key="index"
              :title="getDialogueMetricTitle(metric.name)"
              :value="metric.value"
              :explanation="metric.explanation"
              icon="MessageCircle"
              color="emerald"
            />
          </section>

          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  对话能力分析
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="relative h-[300px]">
                  <Bar :data="dialogueBarData" :options="barOptions" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-semibold">
              对话模式洞察
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <InsightCard
                v-for="(insight, index) in props.data?.dialogue_analysis?.insights || []"
                :key="index"
                :insight="insight"
              />
            </div>
          </section>

          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  代表性对话
                </CardTitle>
                <CardDescription>从对话数据中抽取具有代表性的片段。</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="space-y-6">
                  <div
                    v-for="(dialogue, index) in props.data?.dialogue_analysis?.representative_dialogues || []"
                    :key="index"
                    class="p-4 rounded-xl bg-muted/30 border"
                  >
                    <pre class="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{{ dialogue }}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <!-- 学习分析 -->
        <TabsContent value="learning" class="space-y-6 transition-all">
          <section>
            <Card class="text-center h-64">
              <CardHeader class="mt-8">
                <CardTitle class="text-2xl">
                  学习风格画像
                </CardTitle>
                <CardDescription>基于历史学习行为与表现的聚类标签</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge class="text-2xl px-4 py-2 rounded-full" variant="default">
                  {{ props.data?.learning_analysis?.profile_label }}
                </Badge>
              </CardContent>
            </Card>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard
              v-for="(metric, index) in learningMetrics"
              :key="index"
              :title="getLearningMetricTitle(metric.name)"
              :value="metric.value"
              :explanation="metric.explanation"
              icon="Brain"
              color="purple"
            />
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-semibold">
              学习模式分析
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <InsightCard
                v-for="(insight, index) in props.data?.learning_analysis?.insights || []"
                :key="index"
                :insight="insight"
              />
            </div>
          </section>

          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  典型学习路径
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="(path, index) in props.data?.learning_analysis?.sample_paths || []"
                    :key="index"
                    class="p-4 rounded-xl border bg-primary/5"
                  >
                    <h4 class="font-medium mb-2 text-foreground/90">
                      路径 {{ index + 1 }}
                    </h4>
                    <div class="space-y-2">
                      <div
                        v-for="(step, stepIndex) in path"
                        :key="stepIndex"
                        class="flex items-center gap-2"
                      >
                        <div class="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {{ stepIndex + 1 }}
                        </div>
                        <span class="text-sm text-muted-foreground">{{ step }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <!-- 认知分析 -->
        <TabsContent value="cognitive" class="space-y-6 transition-all">
          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  思维风格
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="flex flex-wrap gap-2 sm:gap-3">
                  <Badge
                    v-for="(style, index) in props.data?.cognitive_analysis?.thinking_styles || []"
                    :key="index"
                    class="rounded-full text-base"
                  >
                    {{ style }}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard
              v-for="(metric, index) in cognitiveMetrics"
              :key="index"
              :title="getCognitiveMetricTitle(metric.name)"
              :value="metric.value"
              :explanation="metric.explanation"
              icon="Brain"
              color="indigo"
            />
          </section>

          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  认知能力分析
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="relative h-[300px]">
                  <Bar :data="cognitiveBarData" :options="barOptions" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-semibold">
              认知模式洞察
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <InsightCard
                v-for="(insight, index) in props.data?.cognitive_analysis?.insights || []"
                :key="index"
                :insight="insight"
              />
            </div>
          </section>
        </TabsContent>

        <!-- 学习计划 -->
        <TabsContent value="plan" class="space-y-6 transition-all">
          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  整体学习策略
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <p class="leading-relaxed text-muted-foreground">
                  {{ props.data?.study_plan?.overall_strategy }}
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card class="group hover:border-destructive/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-destructive transition-all flex items-center gap-2">
                  <AlertCircleIcon class="size-5 mt-1 text-destructive" />
                  待改进领域
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div
                    v-for="(weakness, index) in props.data?.study_plan?.weaknesses || []"
                    :key="index"
                    class="flex items-start gap-3 p-3 rounded-xl border bg-destructive/5"
                  >
                    <AlertCircleIcon class="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span class="text-sm text-destructive">{{ weakness }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card class="group hover:border-primary/30 cursor-pointer transition-all">
              <CardHeader>
                <CardTitle class="text-lg group-hover:text-primary transition-all">
                  学习风格适配建议
                </CardTitle>
              </CardHeader>
              <Separator />
              <CardContent class="pt-6">
                <p class="leading-relaxed text-muted-foreground">
                  {{ props.data?.study_plan?.style_adaptation }}
                </p>
              </CardContent>
            </Card>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl sm:text-2xl font-semibold">
              个性化学习建议
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:gap-6">
              <RecommendationCard
                v-for="(recommendation, index) in props.data?.study_plan?.personalized_recommendations || []"
                :key="index"
                :recommendation="recommendation"
              />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
