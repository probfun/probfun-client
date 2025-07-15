<script setup lang="ts">
import Chart from 'chart.js/auto';
import * as Plotly from 'plotly.js-dist';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// 响应式数据
const sampleCount = ref([100]);
const prevalence = ref([0.05]);
const groupSize = ref([5]);
const testError = ref([0.02]);
const costRatio = ref([0.3]);

// 计算属性
const sampleCountValue = computed(() => sampleCount.value[0]);
const prevalenceValue = computed(() => prevalence.value[0]);
const groupSizeValue = computed(() => groupSize.value[0]);
const testErrorValue = computed(() => testError.value[0]);
const costRatioValue = computed(() => costRatio.value[0]);

// 分组可视化数据
const groupVisualizationData = ref<any[]>([]);

// 结果数据
const results = ref({
  individualTests: 100,
  groupTests: 34.6,
  variance: 28.4,
  savings: 65.4,
});

// 图表引用
const expectationChartRef = ref<HTMLCanvasElement>();
const heatmapChartRef = ref<HTMLCanvasElement>();
const threeDChartRef = ref<HTMLDivElement>();

let expectationChart: Chart | null = null;
let heatmapChart: Chart | null = null;

// 限制分组大小的最大值
const maxGroupSize = computed(() => Math.min(20, Math.floor(sampleCountValue.value / 2)));

watch(sampleCount, () => {
  if (groupSizeValue.value > maxGroupSize.value) {
    groupSize.value = [maxGroupSize.value];
  }
});

// 计算期望检测次数
function calculateExpectedTests(N: number, k: number, p: number): number {
  const groups = Math.ceil(N / k);
  const probAllNegative = (1 - p) ** k;
  const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
  return groups * expectedPerGroup;
}

// 计算方差
function calculateVariance(N: number, k: number, p: number): number {
  const groups = Math.ceil(N / k);
  const probAllNegative = (1 - p) ** k;

  const E_Tg = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
  const E_Tg2 = probAllNegative * 1 ** 2 + (1 - probAllNegative) * (1 + k) ** 2;
  const varPerGroup = E_Tg2 - E_Tg ** 2;

  return groups * varPerGroup;
}

// 计算节省率
function calculateSavings(N: number, k: number, p: number, costRatio: number): number {
  const individualCost = N;
  const groupCost = calculateExpectedTests(N, k, p) * costRatio;
  return (1 - groupCost / individualCost) * 100;
}

// 生成分组可视化数据
function generateGroupsVisualization(N: number, k: number, p: number) {
  const groups = Math.ceil(N / k);
  const groupData = [];

  for (let i = 0; i < groups; i++) {
    const startIndex = i * k;
    const endIndex = Math.min(startIndex + k, N);
    const samplesInGroup = endIndex - startIndex;

    const samples = [];
    let hasPositive = false;

    for (let j = 0; j < samplesInGroup; j++) {
      const isPositive = Math.random() < p;
      if (isPositive)
        hasPositive = true;
      samples.push({ isPositive });
    }

    groupData.push({
      id: i + 1,
      samples,
      hasPositive,
      result: hasPositive ? '阳性组 (需进一步检测)' : '阴性组',
    });
  }

  groupVisualizationData.value = groupData;
}

// 更新期望图表
function updateExpectationChart(N: number, p: number) {
  if (!expectationChart)
    return;

  const labels = [];
  const expectationData = [];
  const individualData = [];

  for (let k = 1; k <= maxGroupSize.value; k++) {
    labels.push(k);
    expectationData.push(calculateExpectedTests(N, k, p));
    individualData.push(N);
  }

  expectationChart.data.labels = labels;
  expectationChart.data.datasets[0].data = expectationData;
  expectationChart.data.datasets[1].data = individualData;
  expectationChart.update();
}

// 生成3D图表
function generate3DPlot(N: number, costRatio: number) {
  if (!threeDChartRef.value)
    return;

  const kValues = [];
  const pValues = [];
  const zData = [];

  for (let k = 1; k <= 20; k++) {
    kValues.push(k);
  }

  for (let p = 0.01; p <= 0.3; p += 0.01) {
    pValues.push(p);
  }

  for (let i = 0; i < pValues.length; i++) {
    const row = [];
    for (let j = 0; j < kValues.length; j++) {
      const savings = calculateSavings(N, kValues[j], pValues[i], costRatio);
      row.push(savings);
    }
    zData.push(row);
  }

  const data = [{
    type: 'surface',
    x: kValues,
    y: pValues,
    z: zData,
    colorscale: 'Viridis',
    contours: {
      z: {
        show: true,
        usecolormap: true,
        highlightcolor: '#42f462',
        project: { z: true },
      },
    },
  }];

  const layout = {
    title: `分组检测成本节省率 (N=${N})`,
    scene: {
      xaxis: { title: '分组大小 (k)' },
      yaxis: { title: '阳性率 (p)' },
      zaxis: { title: '成本节省率 (%)' },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 },
      },
    },
    margin: { l: 0, r: 0, b: 0, t: 50 },
    autosize: true,
  };

  Plotly.newPlot(threeDChartRef.value, data, layout, { responsive: true });
}

// 生成热力图
function generateHeatmap(N: number, p: number, costRatio: number) {
  if (!heatmapChart)
    return;

  const kValues = [];
  const pValues = [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
  const savingsData: any[] = [];

  for (let k = 1; k <= 15; k++) {
    kValues.push(k);
  }

  for (let i = 0; i < pValues.length; i++) {
    const row = [];
    for (let j = 0; j < kValues.length; j++) {
      const savings = calculateSavings(N, kValues[j], pValues[i], costRatio);
      row.push(savings);
    }
    savingsData.push(row);
  }

  const datasets = pValues.map((pVal, idx) => {
    const colors = [
      'rgba(34, 197, 94, 0.7)', // green
      'rgba(59, 130, 246, 0.7)', // blue
      'rgba(168, 85, 247, 0.7)', // purple
      'rgba(245, 158, 11, 0.7)', // yellow
      'rgba(249, 115, 22, 0.7)', // orange
      'rgba(239, 68, 68, 0.7)', // red
      'rgba(220, 38, 127, 0.7)', // pink
    ];

    return {
      label: `p = ${pVal}`,
      data: savingsData[idx],
      backgroundColor: colors[Math.min(idx, 6)],
    };
  });

  heatmapChart.data.labels = kValues;
  heatmapChart.data.datasets = datasets;
  heatmapChart.update();
}

// 主要模拟函数
function simulate() {
  const N = sampleCountValue.value;
  const k = groupSizeValue.value;
  const p = prevalenceValue.value;
  const cost = costRatioValue.value;

  // 更新结果
  results.value.individualTests = N;
  results.value.groupTests = Number(calculateExpectedTests(N, k, p).toFixed(1));
  results.value.variance = Number(calculateVariance(N, k, p).toFixed(1));
  results.value.savings = Number(calculateSavings(N, k, p, cost).toFixed(1));

  // 生成可视化
  generateGroupsVisualization(N, k, p);
  updateExpectationChart(N, p);
  generate3DPlot(N, cost);
  generateHeatmap(N, p, cost);
}

// 初始化图表
function initCharts() {
  nextTick(() => {
    // 期望图表
    if (expectationChartRef.value) {
      const ctx = expectationChartRef.value.getContext('2d');
      if (ctx) {
        expectationChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: '期望检测次数',
              data: [],
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.3,
            }, {
              label: '个体检测次数',
              data: [],
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '不同分组大小下的期望检测次数',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
              legend: {
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: '分组大小 (k)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: '期望检测次数',
                },
                beginAtZero: true,
              },
            },
          },
        });
      }
    }

    // 热力图
    if (heatmapChartRef.value) {
      const ctx = heatmapChartRef.value.getContext('2d');
      if (ctx) {
        heatmapChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: '分组检测效率热力图',
              },
              tooltip: {
                callbacks: {
                  label(context: any) {
                    return `节省率: ${context.raw.toFixed(1)}%`;
                  },
                },
              },
              legend: {
                position: 'top',
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: '分组大小 (k)',
                },
              },
              y: {
                title: {
                  display: true,
                  text: '阳性率 (p)',
                },
              },
            },
          },
        });
      }
    }

    simulate();
  });
}

// 监听参数变化
watch([sampleCount, prevalence, groupSize, testError, costRatio], simulate, { deep: true });

onMounted(() => {
  initCharts();
});
</script>

<template>
  <div class="container mx-auto p-6 max-w-7xl">
    <!-- 标题 -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-primary mb-4">
        分组检测
      </h1>
      <p class="text-lg text-muted-foreground max-w-3xl mx-auto">
        探索分组检测策略的效率和成本优化
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 参数设置面板 -->
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>参数设置</CardTitle>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="space-y-4">
              <div class="space-y-2">
                <Label>样本总数 (N): {{ sampleCountValue }}</Label>
                <Slider
                  v-model="sampleCount"
                  :min="10"
                  :max="200"
                  :step="1"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <Label>阳性率 (p): {{ prevalenceValue.toFixed(2) }}</Label>
                <Slider
                  v-model="prevalence"
                  :min="0.01"
                  :max="0.3"
                  :step="0.01"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <Label>分组大小 (k): {{ groupSizeValue }}</Label>
                <Slider
                  v-model="groupSize"
                  :min="1"
                  :max="maxGroupSize"
                  :step="1"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <Label>检测错误率: {{ testErrorValue.toFixed(2) }}</Label>
                <Slider
                  v-model="testError"
                  :min="0"
                  :max="0.1"
                  :step="0.01"
                  class="w-full"
                />
              </div>

              <div class="space-y-2">
                <Label>检测成本比例 (分组:个体): {{ costRatioValue.toFixed(1) }}</Label>
                <Slider
                  v-model="costRatio"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                  class="w-full"
                />
              </div>
            </div>

            <Button class="w-full" @click="simulate">
              运行模拟
            </Button>
          </CardContent>
        </Card>

        <!-- 结果统计 -->
        <Card>
          <CardHeader>
            <CardTitle>结果统计</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-2xl font-bold text-primary">
                  {{ results.individualTests }}
                </div>
                <div class="text-sm text-muted-foreground">
                  个体检测总次数
                </div>
              </div>

              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-2xl font-bold text-primary">
                  {{ results.groupTests }}
                </div>
                <div class="text-sm text-muted-foreground">
                  分组检测期望次数
                </div>
              </div>

              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-2xl font-bold text-primary">
                  {{ results.variance }}
                </div>
                <div class="text-sm text-muted-foreground">
                  检测次数方差
                </div>
              </div>

              <div class="text-center p-4 bg-muted rounded-lg">
                <div class="text-2xl font-bold text-primary">
                  {{ results.savings }}%
                </div>
                <div class="text-sm text-muted-foreground">
                  成本节省率
                </div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <span class="font-semibold">优化提示：</span>当
                <span class="font-semibold">阳性率较低</span>且使用
                <span class="font-semibold">适当的分组大小</span>时，分组检测策略最为有效。
              </p>
              <p class="text-sm text-blue-800 mt-1">
                当前参数下，分组检测比个体检测节省
                <span class="font-semibold">{{ results.savings }}%</span>的成本。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 可视化区域 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 分组可视化 -->
        <Card>
          <CardHeader>
            <CardTitle>分组检测过程可视化</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              <div
                v-for="group in groupVisualizationData"
                :key="group.id"
                class="border-2 border-primary/20 rounded-lg p-3 flex flex-col items-center bg-card"
              >
                <div class="font-semibold text-primary text-sm mb-2">
                  组 {{ group.id }}
                </div>
                <div class="flex gap-1 flex-wrap justify-center mb-2">
                  <div
                    v-for="(sample, idx) in group.samples"
                    :key="idx"
                    class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" :class="[
                      sample.isPositive
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white',
                    ]"
                  >
                    {{ sample.isPositive ? '+' : '-' }}
                  </div>
                </div>
                <div
                  class="text-xs font-semibold text-center" :class="[
                    group.hasPositive ? 'text-red-600' : 'text-green-600',
                  ]"
                >
                  {{ group.result }}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- 图表分析 -->
        <Card>
          <CardHeader>
            <CardTitle>图表分析</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs default-value="2d" class="w-full">
              <TabsList class="grid w-full grid-cols-3">
                <TabsTrigger value="2d">
                  二维分析
                </TabsTrigger>
                <TabsTrigger value="3d">
                  三维曲面
                </TabsTrigger>
                <TabsTrigger value="heatmap">
                  柱状图
                </TabsTrigger>
              </TabsList>

              <TabsContent value="2d" class="space-y-4">
                <h3 class="text-lg font-semibold">
                  期望检测次数分析
                </h3>
                <div class="h-80">
                  <canvas ref="expectationChartRef" />
                </div>
              </TabsContent>

              <TabsContent value="3d" class="space-y-4">
                <h3 class="text-lg font-semibold">
                  三维曲面分析
                </h3>
                <div ref="threeDChartRef" class="h-96" />
              </TabsContent>

              <TabsContent value="heatmap" class="space-y-4">
                <h3 class="text-lg font-semibold">
                  效率柱状图
                </h3>
                <div class="h-80">
                  <canvas ref="heatmapChartRef" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式可以在这里添加 */
</style>
