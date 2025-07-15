<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

// Chart.js 和 Plotly.js 需要在全局引入或通过CDN加载
// 这里假设已经全局可用，如果没有，需要先安装并导入

// 响应式变量
const sampleCount = ref(100);
const prevalence = ref(0.05);
const groupSize = ref(5);
const testError = ref(0.02);
const costRatio = ref(0.3);
const activeTab = ref('analysis');

// 图表引用
const analysisChart = ref(null);
const surfaceChart = ref(null);
const efficiencyChart = ref(null);

// 图表实例
let expectationChartInstance = null;
let efficiencyChartInstance = null;
let plotlyChart = null;

// 数据
const groups = ref([]);

const tabs = [
  { id: 'analysis', name: '二维分析' },
  { id: 'surface', name: '三维曲面' },
  { id: 'efficiency', name: '柱状图' },
];

const content = ref(`
## **分组检测原理与应用**

分组检测（Group Testing）是一种统计检测策略，通过将多个样本合并检测来提高检测效率，在阳性率较低的情况下可以显著降低检测成本。

**核心思想：**

将N个样本分成若干组，每组包含k个样本。首先对每组进行合并检测：
- 如果组检测结果为阴性，则该组所有样本均为阴性，只需1次检测
- 如果组检测结果为阳性，则需要对该组内所有k个样本进行个体检测，总共需要1+k次检测

**数学模型：**

假设阳性率为p，分组大小为k，则：
- 组内全部阴性的概率：$(1-p)^k$
- 组内至少一个阳性的概率：$1-(1-p)^k$

每组期望检测次数：
$$E[T_g] = (1-p)^k \\cdot 1 + [1-(1-p)^k] \\cdot (1+k)$$

总期望检测次数：
$$E[T] = \\lceil N/k \\rceil \\cdot E[T_g]$$

**优化策略：**

最优分组大小可通过最小化期望检测次数获得：
$$k^* = \\arg\\min_k E[T]$$

当阳性率较低时，较大的分组可以获得更好的效率；当阳性率较高时，较小的分组更为合适。

**应用场景：**

1. **医学检测**：大规模疾病筛查，如COVID-19检测
2. **质量控制**：工业产品批量检验
3. **网络安全**：恶意软件检测
4. **生物信息学**：基因序列分析

分组检测的效果很大程度上取决于阳性率的估计和分组策略的选择。
`);

// 防抖定时器
let updateChartsTimer = null;

// 计算属性
const maxGroupSize = computed(() => Math.min(20, Math.floor(sampleCount.value / 2)));

// 格式化显示的计算属性
const formattedPrevalence = computed(() => prevalence.value.toFixed(3));
const formattedTestError = computed(() => testError.value.toFixed(3));
const formattedCostRatio = computed(() => costRatio.value.toFixed(1));

const expectedTests = computed(() => {
  const groups = Math.ceil(sampleCount.value / groupSize.value);
  const probAllNegative = (1 - prevalence.value) ** groupSize.value;
  const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + groupSize.value);
  return groups * expectedPerGroup;
});

const variance = computed(() => {
  const groupCount = Math.ceil(sampleCount.value / groupSize.value);
  const probAllNegative = (1 - prevalence.value) ** groupSize.value;

  const E_Tg = probAllNegative * 1 + (1 - probAllNegative) * (1 + groupSize.value);
  const E_Tg2 = probAllNegative * 1 ** 2 + (1 - probAllNegative) * (1 + groupSize.value) ** 2;
  const varPerGroup = E_Tg2 - E_Tg ** 2;

  return groupCount * varPerGroup;
});

const savings = computed(() => {
  const individualCost = sampleCount.value;
  const groupCost = expectedTests.value * costRatio.value;
  return Math.max(0, (1 - groupCost / individualCost) * 100);
});

// 工具函数
function generateGroups() {
  const groupCount = Math.ceil(sampleCount.value / groupSize.value);
  const newGroups = [];

  for (let i = 0; i < groupCount; i++) {
    const startIndex = i * groupSize.value;
    const endIndex = Math.min(startIndex + groupSize.value, sampleCount.value);
    const samplesInGroup = endIndex - startIndex;

    const samples = [];
    let hasPositive = false;

    for (let j = 0; j < samplesInGroup; j++) {
      const isPositive = Math.random() < prevalence.value;
      samples.push(isPositive);
      if (isPositive)
        hasPositive = true;
    }

    newGroups.push({
      samples,
      hasPositive,
    });
  }

  groups.value = newGroups;
}

// 计算期望检测次数
function calculateExpectedTests(N, k, p) {
  const groups = Math.ceil(N / k);
  const probAllNegative = (1 - p) ** k;
  const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
  return groups * expectedPerGroup;
}

// 计算成本节省率
function calculateSavings(N, k, p, costRatio) {
  const individualCost = N;
  const groupCost = calculateExpectedTests(N, k, p) * costRatio;
  return Math.max(0, (1 - groupCost / individualCost) * 100);
}

// 确保Chart.js已加载
function ensureChartJs() {
  return new Promise((resolve, reject) => {
    if (window.Chart) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 确保Plotly已加载
function ensurePlotly() {
  return new Promise((resolve, reject) => {
    if (window.Plotly) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.plot.ly/plotly-2.24.1.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 创建期望检测次数分析图表
async function createAnalysisChart() {
  if (!analysisChart.value || !window.Chart)
    return;

  // 销毁现有图表
  if (expectationChartInstance) {
    expectationChartInstance.destroy();
  }

  const ctx = analysisChart.value.getContext('2d');

  // 计算数据
  const labels = [];
  const expectationData = [];
  const individualData = [];

  const maxSize = Math.min(20, Math.floor(sampleCount.value / 2));

  for (let k = 1; k <= maxSize; k++) {
    labels.push(k);
    expectationData.push(calculateExpectedTests(sampleCount.value, k, prevalence.value));
    individualData.push(sampleCount.value);
  }

  expectationChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '期望检测次数',
        data: expectationData,
        borderColor: '#4a6fa5',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
      }, {
        label: '个体检测次数',
        data: individualData,
        borderColor: '#e74c3c',
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

// 创建三维曲面图
async function createSurfaceChart() {
  if (!surfaceChart.value || !window.Plotly)
    return;

  // 生成数据
  const kValues = [];
  const pValues = [];
  const zData = [];

  // 生成k值（分组大小）从1到20
  for (let k = 1; k <= 20; k++) {
    kValues.push(k);
  }

  // 生成p值（阳性率）从0.01到0.3
  for (let p = 0.01; p <= 0.3; p += 0.01) {
    pValues.push(p);
  }

  // 计算z值（成本节省率）
  for (let i = 0; i < pValues.length; i++) {
    const row = [];
    for (let j = 0; j < kValues.length; j++) {
      const savingsValue = calculateSavings(sampleCount.value, kValues[j], pValues[i], costRatio.value);
      row.push(savingsValue);
    }
    zData.push(row);
  }

  // 创建三维曲面图
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
    title: `分组检测成本节省率 (N=${sampleCount.value})`,
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

  // 清除现有图表
  surfaceChart.value.innerHTML = '';

  Plotly.newPlot(surfaceChart.value, data, layout, { responsive: true });
  plotlyChart = surfaceChart.value;
}

// 创建效率柱状图
async function createEfficiencyChart() {
  if (!efficiencyChart.value || !window.Chart)
    return;

  // 销毁现有图表
  if (efficiencyChartInstance) {
    efficiencyChartInstance.destroy();
  }

  const ctx = efficiencyChart.value.getContext('2d');

  // 计算数据
  const kValues = [];
  const pValues = [0.01, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];

  // 生成k值（分组大小）从1到15
  for (let k = 1; k <= 15; k++) {
    kValues.push(k);
  }

  // 为每个阳性率创建数据集
  const datasets = pValues.map((pVal, idx) => {
    const data = [];
    for (let k = 1; k <= 15; k++) {
      const savingsValue = calculateSavings(sampleCount.value, k, pVal, costRatio.value);
      data.push(savingsValue);
    }

    const colors = [
      'rgba(46, 204, 113, 0.7)', // green
      'rgba(52, 152, 219, 0.7)', // blue
      'rgba(155, 89, 182, 0.7)', // purple
      'rgba(241, 196, 15, 0.7)', // yellow
      'rgba(230, 126, 34, 0.7)', // orange
      'rgba(231, 76, 60, 0.7)', // red
      'rgba(192, 57, 43, 0.7)', // dark red
    ];

    return {
      label: `p = ${pVal}`,
      data,
      backgroundColor: colors[idx] || colors[colors.length - 1],
      borderColor: colors[idx]?.replace('0.7', '1') || colors[colors.length - 1].replace('0.7', '1'),
      borderWidth: 1,
    };
  });

  efficiencyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: kValues,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: '不同阳性率下的成本节省效果',
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
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
            text: '成本节省率 (%)',
          },
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

// 更新图表
async function updateCharts() {
  await nextTick();

  try {
    if (activeTab.value === 'analysis') {
      await createAnalysisChart();
    }
    else if (activeTab.value === 'surface') {
      await createSurfaceChart();
    }
    else if (activeTab.value === 'efficiency') {
      await createEfficiencyChart();
    }
  }
  catch (error) {
    console.error('Error updating charts:', error);
  }
}

function _debounceUpdateCharts() {
  if (updateChartsTimer) {
    clearTimeout(updateChartsTimer);
  }
  updateChartsTimer = setTimeout(() => {
    updateCharts();
  }, 300);
}

// 事件处理函数
function runSimulation() {
  generateGroups();
  updateCharts();
}

// 清理函数
function cleanup() {
  if (updateChartsTimer) {
    clearTimeout(updateChartsTimer);
    updateChartsTimer = null;
  }

  if (expectationChartInstance) {
    expectationChartInstance.destroy();
    expectationChartInstance = null;
  }

  if (efficiencyChartInstance) {
    efficiencyChartInstance.destroy();
    efficiencyChartInstance = null;
  }

  if (plotlyChart) {
    try {
      window.Plotly?.purge(plotlyChart);
    }
    catch (e) {
      console.warn('Error purging Plotly chart:', e);
    }
    plotlyChart = null;
  }
}

// 监听器
watch(groupSize, (newVal) => {
  if (newVal > maxGroupSize.value) {
    groupSize.value = maxGroupSize.value;
  }
});

watch(activeTab, () => {
  nextTick(() => {
    setTimeout(() => {
      updateCharts();
    }, 100);
  });
});

// 生命周期
onMounted(async () => {
  try {
    // 加载Chart.js和Plotly.js
    await Promise.all([ensureChartJs(), ensurePlotly()]);

    generateGroups();

    await nextTick();
    setTimeout(() => {
      updateCharts();
    }, 300);
  }
  catch (error) {
    console.error('Failed to load chart libraries:', error);
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <ExperimentBoard :layout="1" :panel-size="50">
    <template #experiment>
      <div class="max-w-4xl mx-auto p-5">
        <!-- 结果显示 -->
        <div class="grid grid-cols-2 gap-4 mb-5">
          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              个体检测总次数
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ sampleCount }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              分组检测期望次数
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ expectedTests.toFixed(1) }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              检测次数方差
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ variance.toFixed(1) }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              成本节省率
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ savings.toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- 分组检测过程可视化 -->
        <div class="my-5">
          <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
            分组检测过程可视化
          </h3>
          <div class="flex flex-wrap gap-2.5 justify-center max-h-96 overflow-y-auto p-2.5 bg-white/85 rounded-xl shadow-lg">
            <div v-for="(group, index) in groups" :key="index" class="border-2 border-blue-500 rounded-xl p-2.5 flex flex-col items-center w-30 bg-white/90">
              <div class="font-bold mb-1 text-blue-700 text-sm">
                组 {{ index + 1 }}
              </div>
              <div class="flex gap-1 flex-wrap justify-center">
                <div
                  v-for="(sample, sIndex) in group.samples"
                  :key="sIndex"
                  class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" :class="[sample ? 'bg-red-500 text-white' : 'bg-green-500 text-white']"
                >
                  {{ sample ? '+' : '-' }}
                </div>
              </div>
              <div class="mt-1 text-xs font-bold text-center leading-tight" :class="[group.hasPositive ? 'text-red-500' : 'text-green-500']">
                {{ group.hasPositive ? '阳性组 (需进一步检测)' : '阴性组' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 图表展示 -->
        <div class="my-5">
          <div class="flex mb-4 border-b border-gray-300">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              class="py-2.5 px-4 cursor-pointer bg-gray-100 border border-gray-300 border-b-0 rounded-t-md mr-1 text-sm transition-all duration-200 hover:bg-gray-200" :class="[activeTab === tab.id ? 'bg-white border-b border-white -mb-px font-bold text-blue-700' : '']"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </div>
          </div>

          <div class="bg-white/85 rounded-r-xl rounded-bl-xl shadow-lg">
            <div v-if="activeTab === 'analysis'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                期望检测次数分析
              </h3>
              <div class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden">
                <canvas ref="analysisChart" class="w-full h-full block" />
              </div>
            </div>

            <div v-if="activeTab === 'surface'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                三维曲面分析
              </h3>
              <div ref="surfaceChart" class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden" />
            </div>

            <div v-if="activeTab === 'efficiency'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                效率柱状图
              </h3>
              <div class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden">
                <canvas ref="efficiencyChart" class="w-full h-full block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="max-w-4xl mx-auto p-5">
        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">样本总数 (N):</label>
          <input
            v-model.number="sampleCount"
            type="range"
            min="10"
            max="200"
            step="1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ sampleCount }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">阳性率 (p):</label>
          <input
            v-model.number="prevalence"
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedPrevalence }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">分组大小 (k):</label>
          <input
            v-model.number="groupSize"
            type="range"
            min="1"
            :max="maxGroupSize"
            step="1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ groupSize }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">检测错误率:</label>
          <input
            v-model.number="testError"
            type="range"
            min="0"
            max="0.1"
            step="0.01"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedTestError }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">检测成本比例 (分组:个体):</label>
          <input
            v-model.number="costRatio"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedCostRatio }}</span>
        </div>

        <button class="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded cursor-pointer font-bold text-base my-5 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg" @click="runSimulation">
          运行模拟
        </button>

        <div class="mt-5 p-4 bg-blue-50 rounded-xl text-sm">
          <p class="mb-2 leading-relaxed">
            优化提示：当<span class="font-bold text-red-500">阳性率较低</span>且使用<span class="font-bold text-red-500">适当的分组大小</span>时，分组检测策略最为有效。
          </p>
          <p class="leading-relaxed">
            当前参数下，分组检测比个体检测节省<span class="font-bold text-red-500">{{ savings.toFixed(1) }}%</span>的成本。
          </p>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="group-testing" />
    </template>
  </ExperimentBoard>
</template>

<template>
  <ExperimentBoard :layout="1" :panel-size="50">
    <template #experiment>
      <div class="max-w-4xl mx-auto p-5">
        <!-- 结果显示 -->
        <div class="grid grid-cols-2 gap-4 mb-5">
          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              个体检测总次数
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ sampleCount }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              分组检测期望次数
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ expectedTests.toFixed(1) }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              检测次数方差
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ variance.toFixed(1) }}
            </div>
          </div>

          <div class="bg-white/90 rounded-xl p-4 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
            <div class="text-base text-blue-600">
              成本节省率
            </div>
            <div class="text-3xl font-bold text-red-500 my-2">
              {{ savings.toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- 分组检测过程可视化 -->
        <div class="my-5">
          <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
            分组检测过程可视化
          </h3>
          <div class="flex flex-wrap gap-2.5 justify-center max-h-96 overflow-y-auto p-2.5 bg-white/85 rounded-xl shadow-lg">
            <div v-for="(group, index) in groups" :key="index" class="border-2 border-blue-500 rounded-xl p-2.5 flex flex-col items-center w-30 bg-white/90">
              <div class="font-bold mb-1 text-blue-700 text-sm">
                组 {{ index + 1 }}
              </div>
              <div class="flex gap-1 flex-wrap justify-center">
                <div
                  v-for="(sample, sIndex) in group.samples"
                  :key="sIndex"
                  class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" :class="[sample ? 'bg-red-500 text-white' : 'bg-green-500 text-white']"
                >
                  {{ sample ? '+' : '-' }}
                </div>
              </div>
              <div class="mt-1 text-xs font-bold text-center leading-tight" :class="[group.hasPositive ? 'text-red-500' : 'text-green-500']">
                {{ group.hasPositive ? '阳性组 (需进一步检测)' : '阴性组' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 图表展示 -->
        <div class="my-5">
          <div class="flex mb-4 border-b border-gray-300">
            <div
              v-for="tab in tabs"
              :key="tab.id"
              class="py-2.5 px-4 cursor-pointer bg-gray-100 border border-gray-300 border-b-0 rounded-t-md mr-1 text-sm transition-all duration-200 hover:bg-gray-200" :class="[activeTab === tab.id ? 'bg-white border-b border-white -mb-px font-bold text-blue-700' : '']"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </div>
          </div>

          <div class="bg-white/85 rounded-r-xl rounded-bl-xl shadow-lg">
            <div v-if="activeTab === 'analysis'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                期望检测次数分析
              </h3>
              <div class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden">
                <canvas ref="analysisChart" class="w-full h-full block" />
              </div>
            </div>

            <div v-if="activeTab === 'surface'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                三维曲面分析
              </h3>
              <div ref="surfaceChart" class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden" />
            </div>

            <div v-if="activeTab === 'efficiency'" class="p-5 h-112">
              <h3 class="mb-4 text-blue-700 text-lg font-semibold pb-2 border-b-2 border-blue-500">
                效率柱状图
              </h3>
              <div class="w-full h-96 relative bg-gray-50 rounded border border-gray-200 overflow-hidden">
                <canvas ref="efficiencyChart" class="w-full h-full block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="max-w-4xl mx-auto p-5">
        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">样本总数 (N):</label>
          <input
            v-model.number="sampleCount"
            type="range"
            min="10"
            max="200"
            step="1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ sampleCount }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">阳性率 (p):</label>
          <input
            v-model.number="prevalence"
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedPrevalence }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">分组大小 (k):</label>
          <input
            v-model.number="groupSize"
            type="range"
            min="1"
            :max="maxGroupSize"
            step="1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ groupSize }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">检测错误率:</label>
          <input
            v-model.number="testError"
            type="range"
            min="0"
            max="0.1"
            step="0.01"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedTestError }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-4">
          <label class="inline-block w-48 font-semibold text-sm">检测成本比例 (分组:个体):</label>
          <input
            v-model.number="costRatio"
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            class="flex-1 p-1"
            @input="onParameterChange"
          >
          <span class="min-w-15 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ formattedCostRatio }}</span>
        </div>

        <button class="w-full py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded cursor-pointer font-bold text-base my-5 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg" @click="runSimulation">
          运行模拟
        </button>

        <div class="mt-5 p-4 bg-blue-50 rounded-xl text-sm">
          <p class="mb-2 leading-relaxed">
            优化提示：当<span class="font-bold text-red-500">阳性率较低</span>且使用<span class="font-bold text-red-500">适当的分组大小</span>时，分组检测策略最为有效。
          </p>
          <p class="leading-relaxed">
            当前参数下，分组检测比个体检测节省<span class="font-bold text-red-500">{{ savings.toFixed(1) }}%</span>的成本。
          </p>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="group-testing" />
    </template>
  </ExperimentBoard>
</template>
