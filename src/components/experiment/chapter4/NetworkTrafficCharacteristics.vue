<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

// 响应式数据
const currentScenario = ref('normal');
const currentTimestamp = ref('');
const trafficCanvas = ref(null);
const autocorrelationCanvas = ref(null);
const chartsLoaded = ref(false);
const chartError = ref(null);
const chartJSLoaded = ref(false);

let trafficChart = null;
let autocorrelationChart = null;
let timestampInterval = null;
let loadAttempts = 0;
const maxLoadAttempts = 3;

// Chart.js动态加载函数 - 改进版
function loadChartJS() {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (typeof window.Chart !== 'undefined') {
      chartJSLoaded.value = true;
      resolve(window.Chart);
      return;
    }

    // 检查是否已经有脚本标签在加载
    const existingScript = document.querySelector('script[src*="chart"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (typeof window.Chart !== 'undefined') {
          chartJSLoaded.value = true;
          resolve(window.Chart);
        }
        else {
          reject(new Error('Chart.js loaded but not available'));
        }
      });
      return;
    }

    const script = document.createElement('script');
    // 使用更稳定的Chart.js版本
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.js';
    script.async = true;

    script.onload = () => {
      // 等待一小段时间确保Chart.js完全初始化
      setTimeout(() => {
        if (typeof window.Chart !== 'undefined') {
          chartJSLoaded.value = true;
          resolve(window.Chart);
        }
        else {
          reject(new Error('Chart.js loaded but not available'));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error('Failed to load Chart.js'));
    };

    // 设置超时
    setTimeout(() => {
      if (!chartJSLoaded.value) {
        reject(new Error('Chart.js loading timeout'));
      }
    }, 10000);

    document.head.appendChild(script);
  });
}

// 静态数据
const features = ['源IP计数', '目的IP计数', '端口号计数', '数据包大小', '流量速率'];

const correlationMatrix = ref([
  [1.00, 0.85, 0.62, 0.45, 0.78],
  [0.85, 1.00, 0.55, 0.38, 0.72],
  [0.62, 0.55, 1.00, 0.68, 0.58],
  [0.45, 0.38, 0.68, 1.00, 0.42],
  [0.78, 0.72, 0.58, 0.42, 1.00],
]);

const content = ref(`
## **网络流量分析与异常检测系统**

网络流量异常检测是网络安全的重要组成部分，通过分析网络流量的各种特征模式来识别潜在的安全威胁。

### **检测原理**

本系统通过监控以下关键特征来检测网络异常：

1. **源IP计数**: 统计特定时间窗口内的唯一源IP地址数量
2. **目的IP计数**: 统计目标IP地址的分布情况
3. **端口号计数**: 监控访问的端口数量变化
4. **数据包大小**: 分析数据包大小的统计分布
5. **流量速率**: 测量网络流量的传输速度

### **异常检测方法**

#### **相关性分析**
在正常网络流量中，各特征之间存在稳定的相关模式。当发生网络攻击时，这些相关关系会发生显著变化：

- **DDoS攻击**: 源IP数量激增，但目标IP集中，导致源IP与目标IP相关性显著降低
- **端口扫描**: 单一源IP访问大量端口，源IP与端口数相关性异常增强
- **蠕虫传播**: 感染主机数量逐步增加，呈现特殊的时间相关模式

#### **自相关分析**
流量速率的自相关函数可以揭示流量的时间模式：

- **正常流量**: 呈现平滑的指数衰减模式
- **DDoS攻击**: 自相关快速衰减，呈现突发性特征
- **扫描活动**: 自相关出现周期性振荡
- **蠕虫传播**: 自相关保持较高水平，反映持续传播特性

### **实际应用价值**

该检测系统可以：
- **实时监控**网络安全状态
- **早期发现**各类网络攻击
- **量化评估**网络威胁程度
- **辅助决策**安全响应措施

通过多维度特征分析和统计学方法，系统能够有效区分正常流量和恶意流量，为网络安全防护提供重要支撑。
`);

// 计算属性
const anomalyStatus = computed(() => {
  const statusMap = {
    normal: '正常状态',
    ddos: 'DDoS攻击检测',
    scan: '端口扫描检测',
    worm: '蠕虫爆发检测',
  };
  return statusMap[currentScenario.value];
});

const anomalyIndicatorClass = computed(() => {
  const classMap = {
    normal: 'bg-green-100 text-green-800',
    ddos: 'bg-red-100 text-red-800 animate-pulse',
    scan: 'bg-yellow-100 text-yellow-800 animate-pulse',
    worm: 'bg-purple-100 text-purple-800 animate-pulse',
  };
  return classMap[currentScenario.value];
});

const networkStatus = computed(() => {
  const statusMap = {
    normal: '正常运行',
    ddos: 'DDoS攻击进行中',
    scan: '端口扫描活动',
    worm: '蠕虫传播中',
  };
  return statusMap[currentScenario.value];
});

const statusTextColor = computed(() => {
  const colorMap = {
    normal: '#10b981',
    ddos: '#ef4444',
    scan: '#f59e0b',
    worm: '#8b5cf6',
  };
  return colorMap[currentScenario.value];
});

const statusDotClass = computed(() => {
  return currentScenario.value === 'normal'
    ? 'bg-green-500'
    : 'bg-red-500 animate-ping';
});

const scenarioDescription = computed(() => {
  const descriptions = {
    normal: '正常网络流量模式，各项指标在正常范围内波动，特征间相关性稳定。',
    ddos: 'DDoS攻击模式，大量恶意流量同时访问少数目标，源IP激增但目标IP集中。',
    scan: '端口扫描模式，攻击者系统性地探测目标端口，端口访问模式异常。',
    worm: '蠕虫传播模式，恶意软件在网络中传播，感染主机数量逐步增加。',
  };
  return descriptions[currentScenario.value];
});

// 方法
function scenarioButtonClass(scenario) {
  return currentScenario.value === scenario
    ? 'border-blue-500 bg-blue-50 text-blue-700'
    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300';
}

function getMatrixCellColor(value, isDiagonal) {
  if (isDiagonal) {
    return '#6b7280'; // gray-500
  }

  if (value > 0.7) {
    return `rgba(16, 185, 129, ${0.6 + value * 0.4})`; // green with opacity based on value
  }
  else if (value > 0.4) {
    return `rgba(245, 158, 11, ${0.6 + (value - 0.4) * 1.3})`; // yellow
  }
  else {
    return `rgba(239, 68, 68, ${0.6 + (0.4 - value) * 1.5})`; // red
  }
}

function setScenario(scenario) {
  currentScenario.value = scenario;
  updateCorrelationMatrix();

  // 只有在图表已初始化后才更新
  if (chartsLoaded.value && !chartError.value) {
    updateCharts();
  }
}

function updateTimestamp() {
  const now = new Date();
  currentTimestamp.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function generateTrafficData(scenario) {
  const data = {
    srcIP: [],
    destIP: [],
    trafficRate: [],
  };

  // 生成24小时的时间标签
  const timeLabels = [];
  for (let i = 0; i < 24; i++) {
    timeLabels.push(`${String(i).padStart(2, '0')}:00`);
  }

  // 基础正常数据
  for (let i = 0; i < 24; i++) {
    data.srcIP.push(Math.floor(Math.random() * 200 + 300));
    data.destIP.push(Math.floor(Math.random() * 150 + 200));
    data.trafficRate.push(Math.floor(Math.random() * 200 + 300));
  }

  // 根据场景修改数据
  if (scenario === 'ddos') {
    for (let i = 18; i < 24; i++) {
      data.srcIP[i] = Math.floor(Math.random() * 1000 + 1500);
      data.destIP[i] = Math.floor(Math.random() * 10 + 5);
      data.trafficRate[i] = Math.floor(Math.random() * 800 + 1200);
    }
  }
  else if (scenario === 'scan') {
    for (let i = 16; i < 24; i++) {
      data.srcIP[i] = Math.floor(Math.random() * 100 + 150);
      data.destIP[i] = Math.floor(Math.random() * 500 + 300);
      data.trafficRate[i] = Math.floor(Math.random() * 100 + 150);
    }
  }
  else if (scenario === 'worm') {
    for (let i = 10; i < 24; i++) {
      const factor = Math.min(1, (i - 10) / 5);
      data.srcIP[i] = Math.floor((Math.random() * 200 + 300) * (1 + factor * 2));
      data.destIP[i] = Math.floor((Math.random() * 150 + 200) * (1 + factor * 1.5));
      data.trafficRate[i] = Math.floor((Math.random() * 200 + 300) * (1 + factor * 3));
    }
  }

  return { data, timeLabels };
}

function generateAutocorrelationData(scenario) {
  const scenarios = {
    normal: [0.85, 0.72, 0.62, 0.55, 0.48, 0.42, 0.38, 0.35],
    ddos: [0.92, 0.35, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02],
    scan: [0.78, 0.68, 0.75, 0.62, 0.58, 0.65, 0.55, 0.52],
    worm: [0.88, 0.82, 0.78, 0.75, 0.72, 0.68, 0.65, 0.62],
  };
  return scenarios[scenario] || scenarios.normal;
}

function updateCorrelationMatrix() {
  const matrices = {
    normal: [
      [1.00, 0.85, 0.62, 0.45, 0.78],
      [0.85, 1.00, 0.55, 0.38, 0.72],
      [0.62, 0.55, 1.00, 0.68, 0.58],
      [0.45, 0.38, 0.68, 1.00, 0.42],
      [0.78, 0.72, 0.58, 0.42, 1.00],
    ],
    ddos: [
      [1.00, 0.25, 0.18, 0.12, 0.92],
      [0.25, 1.00, 0.15, 0.10, 0.28],
      [0.18, 0.15, 1.00, 0.65, 0.20],
      [0.12, 0.10, 0.65, 1.00, 0.15],
      [0.92, 0.28, 0.20, 0.15, 1.00],
    ],
    scan: [
      [1.00, 0.72, 0.85, 0.38, 0.65],
      [0.72, 1.00, 0.60, 0.32, 0.58],
      [0.85, 0.60, 1.00, 0.75, 0.55],
      [0.38, 0.32, 0.75, 1.00, 0.35],
      [0.65, 0.58, 0.55, 0.35, 1.00],
    ],
    worm: [
      [1.00, 0.92, 0.68, 0.52, 0.95],
      [0.92, 1.00, 0.62, 0.48, 0.88],
      [0.68, 0.62, 1.00, 0.70, 0.65],
      [0.52, 0.48, 0.70, 1.00, 0.50],
      [0.95, 0.88, 0.65, 0.50, 1.00],
    ],
  };
  correlationMatrix.value = matrices[currentScenario.value] || matrices.normal;
}

function updateCharts() {
  if (!chartsLoaded.value || chartError.value)
    return;

  try {
    const { data: trafficData, timeLabels } = generateTrafficData(currentScenario.value);
    const autocorrData = generateAutocorrelationData(currentScenario.value);

    // 更新流量图表
    if (trafficChart) {
      trafficChart.data.labels = timeLabels;
      trafficChart.data.datasets[0].data = trafficData.srcIP;
      trafficChart.data.datasets[1].data = trafficData.destIP;
      trafficChart.data.datasets[2].data = trafficData.trafficRate;
      trafficChart.update('none'); // 使用'none'模式提高性能
    }

    // 更新自相关图表
    if (autocorrelationChart) {
      autocorrelationChart.data.datasets[0].data = autocorrData;

      // 根据场景更改颜色
      const colors = {
        normal: { bg: 'rgba(16, 185, 129, 0.7)', border: 'rgb(16, 185, 129)' },
        ddos: { bg: 'rgba(239, 68, 68, 0.7)', border: 'rgb(239, 68, 68)' },
        scan: { bg: 'rgba(245, 158, 11, 0.7)', border: 'rgb(245, 158, 11)' },
        worm: { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' },
      };

      const color = colors[currentScenario.value];
      autocorrelationChart.data.datasets[0].backgroundColor = color.bg;
      autocorrelationChart.data.datasets[0].borderColor = color.border;
      autocorrelationChart.update('none');
    }
  }
  catch (error) {
    console.error('Error updating charts:', error);
    chartError.value = '图表更新失败';
  }
}

function destroyCharts() {
  try {
    if (trafficChart) {
      trafficChart.destroy();
      trafficChart = null;
    }
    if (autocorrelationChart) {
      autocorrelationChart.destroy();
      autocorrelationChart = null;
    }
  }
  catch (error) {
    console.warn('Error destroying charts:', error);
  }
}

async function initCharts() {
  try {
    // 确保DOM元素存在
    if (!trafficCanvas.value || !autocorrelationCanvas.value) {
      throw new Error('Canvas elements not found');
    }

    // 确保Chart.js已加载
    if (!window.Chart) {
      throw new Error('Chart.js not loaded');
    }

    // 销毁现有图表
    destroyCharts();

    // 等待DOM更新
    await nextTick();

    const Chart = window.Chart;

    // 初始化流量特征趋势图
    const { data: trafficData, timeLabels } = generateTrafficData(currentScenario.value);

    trafficChart = new Chart(trafficCanvas.value, {
      type: 'line',
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: '源IP计数',
            data: trafficData.srcIP,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: '目的IP计数',
            data: trafficData.destIP,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 3,
            pointHoverRadius: 6,
          },
          {
            label: '流量速率 (Mbps)',
            data: trafficData.trafficRate,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 3,
            tension: 0.3,
            yAxisID: 'y1',
            pointRadius: 3,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // 禁用动画提高性能
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
          },
          y: {
            position: 'left',
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: 'IP计数',
              color: '#374151',
            },
          },
          y1: {
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: '流量速率 (Mbps)',
              color: '#374151',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: '#374151',
              usePointStyle: true,
              padding: 20,
            },
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#d1d5db',
            borderWidth: 1,
            padding: 12,
            usePointStyle: true,
          },
        },
      },
    });

    // 初始化自相关图表
    const autocorrData = generateAutocorrelationData(currentScenario.value);

    autocorrelationChart = new Chart(autocorrelationCanvas.value, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
        datasets: [{
          label: '自相关系数',
          data: autocorrData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // 禁用动画提高性能
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1.0,
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
              stepSize: 0.2,
            },
          },
          x: {
            grid: {
              color: 'rgba(107, 114, 128, 0.2)',
            },
            ticks: {
              color: '#374151',
            },
            title: {
              display: true,
              text: '时间窗口 (分钟)',
              color: '#374151',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#d1d5db',
            borderWidth: 1,
            padding: 12,
          },
        },
      },
    });

    chartsLoaded.value = true;
    chartError.value = null;
  }
  catch (error) {
    console.error('Chart initialization failed:', error);
    chartError.value = `图表初始化失败: ${error.message}`;
    chartsLoaded.value = false;
  }
}

async function retryChartLoad() {
  loadAttempts++;
  if (loadAttempts >= maxLoadAttempts) {
    chartError.value = '图表加载失败，已达到最大重试次数';
    return;
  }

  chartError.value = null;
  chartsLoaded.value = false;

  try {
    await loadChartJS();
    await nextTick();
    await initCharts();
  }
  catch (error) {
    console.error('Retry failed:', error);
    chartError.value = `重试失败: ${error.message}`;
  }
}

// 生命周期钩子
onMounted(async () => {
  updateTimestamp();
  timestampInterval = setInterval(updateTimestamp, 1000);
  updateCorrelationMatrix();

  try {
    await loadChartJS();
    // 等待DOM完全渲染
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 200));
    await initCharts();
  }
  catch (error) {
    console.error('Failed to initialize charts:', error);
    chartError.value = `图表加载失败: ${error.message}`;
  }
});

onUnmounted(() => {
  if (timestampInterval) {
    clearInterval(timestampInterval);
  }
  destroyCharts();
});
</script>

<template>
  <ExperimentBoard :layout="1" :panel-size="50">
    <template #experiment>
      <div class="container mx-auto p-4">
        <!-- 流量特征趋势图 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              流量特征趋势
            </h3>
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="anomalyIndicatorClass"
            >
              {{ anomalyStatus }}
            </div>
          </div>
          <div class="h-80 relative">
            <canvas v-show="chartsLoaded" ref="trafficCanvas" />
            <div v-if="!chartsLoaded || chartError" class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <div v-if="!chartError" class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <div v-else class="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>{{ chartError || '正在加载图表...' }}</p>
                <button v-if="chartError" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600" @click="retryChartLoad">
                  重试
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 流量速率自相关图 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            流量速率自相关
          </h3>
          <div class="h-80 relative">
            <canvas v-show="chartsLoaded" ref="autocorrelationCanvas" />
            <div v-if="!chartsLoaded || chartError" class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <div v-if="!chartError" class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <div v-else class="w-8 h-8 bg-red-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p>{{ chartError || '正在加载图表...' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 特征相关系数矩阵 -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            特征相关系数矩阵
          </h3>
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full">
              <div class="grid grid-cols-6 gap-1 text-sm">
                <!-- 矩阵标题行 -->
                <div class="bg-gray-100 p-3 text-center font-semibold" />
                <div
                  v-for="feature in features" :key="feature"
                  class="bg-gray-100 p-3 text-center font-semibold text-gray-700"
                >
                  {{ feature }}
                </div>

                <!-- 矩阵数据行 -->
                <template v-for="(row, rowIndex) in correlationMatrix" :key="rowIndex">
                  <div class="bg-gray-100 p-3 text-center font-semibold text-gray-700">
                    {{ features[rowIndex] }}
                  </div>
                  <div
                    v-for="(value, colIndex) in row" :key="colIndex"
                    class="p-3 text-center font-medium text-white rounded"
                    :style="{ backgroundColor: getMatrixCellColor(value, rowIndex === colIndex) }"
                  >
                    {{ value.toFixed(2) }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
          <div class="text-gray-600">
            {{ currentTimestamp }}
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="statusDotClass" />
            <span class="text-sm font-medium" :style="{ color: statusTextColor }">
              网络状态: {{ networkStatus }}
            </span>
          </div>
          <div class="text-gray-600">
            检测灵敏度: 高
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="container mx-auto p-4">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            场景选择
          </h3>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <button
              :class="scenarioButtonClass('normal')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('normal')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-green-500" />
                <span class="font-medium">正常流量</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('ddos')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('ddos')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-red-500" />
                <span class="font-medium">DDoS攻击</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('scan')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('scan')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-yellow-500" />
                <span class="font-medium">端口扫描</span>
              </div>
            </button>

            <button
              :class="scenarioButtonClass('worm')"
              class="p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md"
              @click="setScenario('worm')"
            >
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full bg-purple-500" />
                <span class="font-medium">蠕虫爆发</span>
              </div>
            </button>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-800 mb-2">
              当前场景说明
            </h4>
            <p class="text-blue-700 text-sm">
              {{ scenarioDescription }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="network-traffic-analysis" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* 添加一些自定义样式 */
.container {
  max-width: 1200px;
}

/* 动画效果 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
