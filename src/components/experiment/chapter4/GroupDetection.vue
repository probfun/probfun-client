<template>
  <ExperimentBoard>
    <template #experiment>
      <div class="container">
        <!-- 结果显示 -->
        <div class="results-grid">
          <div class="result-card">
            <div class="result-label">个体检测总次数</div>
            <div class="result-value">{{ sampleCount }}</div>
          </div>

          <div class="result-card">
            <div class="result-label">分组检测期望次数</div>
            <div class="result-value">{{ expectedTests.toFixed(1) }}</div>
          </div>

          <div class="result-card">
            <div class="result-label">检测次数方差</div>
            <div class="result-value">{{ variance.toFixed(1) }}</div>
          </div>

          <div class="result-card">
            <div class="result-label">成本节省率</div>
            <div class="result-value">{{ savings.toFixed(1) }}%</div>
          </div>
        </div>

        <!-- 分组检测过程可视化 -->
        <div class="visualization-section">
          <h3>分组检测过程可视化</h3>
          <div class="group-visual">
            <div v-for="(group, index) in groups" :key="index" class="sample-group">
              <div class="group-header">组 {{ index + 1 }}</div>
              <div class="samples">
                <div
                    v-for="(sample, sIndex) in group.samples"
                    :key="sIndex"
                    :class="['sample', sample ? 'positive' : 'negative']"
                >
                  {{ sample ? '+' : '-' }}
                </div>
              </div>
              <div :class="['group-result', group.hasPositive ? 'group-positive' : 'group-negative']">
                {{ group.hasPositive ? '阳性组 (需进一步检测)' : '阴性组' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 图表展示 -->
        <div class="chart-section">
          <div class="tabs">
            <div
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab', { active: activeTab === tab.id }]"
                @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </div>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'analysis'">
              <h3>期望检测次数分析</h3>
              <div class="chart-container">
                <canvas ref="analysisChart" class="chart-canvas"></canvas>
                <div v-if="!analysisChart" class="chart-loading">图表加载中...</div>
              </div>
            </div>

            <div v-if="activeTab === 'efficiency'">
              <h3>成本节省效果分析</h3>
              <div class="chart-container">
                <canvas ref="efficiencyChart" class="chart-canvas"></canvas>
                <div v-if="!efficiencyChart" class="chart-loading">图表加载中...</div>
              </div>
            </div>

            <div v-if="activeTab === 'heatmap'">
              <h3>不同参数组合的效率对比</h3>
              <div class="chart-container">
                <canvas ref="heatmapChart" class="chart-canvas"></canvas>
                <div v-if="!heatmapChart" class="chart-loading">图表加载中...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="container">
        <div class="input-group">
          <label>样本总数 (N):</label>
          <input
              type="range"
              v-model.number="sampleCount"
              min="10"
              max="200"
              step="1"
              @input="onParameterChange"
          >
          <span class="value-display" :key="sampleCount">{{ sampleCount }}</span>
        </div>

        <div class="input-group">
          <label>阳性率 (p):</label>
          <input
              type="range"
              v-model.number="prevalence"
              min="0.01"
              max="0.3"
              step="0.01"
              @input="onParameterChange"
          >
          <span class="value-display" :key="prevalence">{{ formattedPrevalence }}</span>
        </div>

        <div class="input-group">
          <label>分组大小 (k):</label>
          <input
              type="range"
              v-model.number="groupSize"
              min="1"
              :max="maxGroupSize"
              step="1"
              @input="onParameterChange"
          >
          <span class="value-display" :key="groupSize">{{ groupSize }}</span>
        </div>

        <div class="input-group">
          <label>检测错误率:</label>
          <input
              type="range"
              v-model.number="testError"
              min="0"
              max="0.1"
              step="0.01"
              @input="onParameterChange"
          >
          <span class="value-display" :key="testError">{{ formattedTestError }}</span>
        </div>

        <div class="input-group">
          <label>检测成本比例 (分组:个体):</label>
          <input
              type="range"
              v-model.number="costRatio"
              min="0.1"
              max="1"
              step="0.1"
              @input="onParameterChange"
          >
          <span class="value-display" :key="costRatio">{{ formattedCostRatio }}</span>
        </div>

        <button @click="runSimulation" class="simulate-btn">运行模拟</button>

        <div class="stats-summary">
          <p>优化提示：当<span class="stats-highlight">阳性率较低</span>且使用<span class="stats-highlight">适当的分组大小</span>时，分组检测策略最为有效。</p>
          <p>当前参数下，分组检测比个体检测节省<span class="stats-highlight">{{ savings.toFixed(1) }}%</span>的成本。</p>
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

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { toMarkdown } from '@/utils/markdown';

// 响应式变量
const sampleCount = ref(100);
const prevalence = ref(0.05);
const groupSize = ref(5);
const testError = ref(0.02);
const costRatio = ref(0.3);
const activeTab = ref('analysis');
const isChartsReady = ref(false);

// 图表引用
const analysisChart = ref(null);
const efficiencyChart = ref(null);
const heatmapChart = ref(null);

// 数据
const groups = ref([]);

const tabs = [
  { id: 'analysis', name: '二维分析' },
  { id: 'efficiency', name: '三维曲面' },
  { id: 'heatmap', name: '柱状图' }
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
  const probAllNegative = Math.pow(1 - prevalence.value, groupSize.value);
  const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + groupSize.value);
  return groups * expectedPerGroup;
});

const variance = computed(() => {
  const groupCount = Math.ceil(sampleCount.value / groupSize.value);
  const probAllNegative = Math.pow(1 - prevalence.value, groupSize.value);

  const E_Tg = probAllNegative * 1 + (1 - probAllNegative) * (1 + groupSize.value);
  const E_Tg2 = probAllNegative * Math.pow(1, 2) + (1 - probAllNegative) * Math.pow(1 + groupSize.value, 2);
  const varPerGroup = E_Tg2 - Math.pow(E_Tg, 2);

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
      if (isPositive) hasPositive = true;
    }

    newGroups.push({
      samples,
      hasPositive
    });
  }

  groups.value = newGroups;
}

// 带重试机制的绘制函数
async function drawChartWithRetry(drawFunction, chartName, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting to draw ${chartName}, attempt ${attempt}/${maxRetries}`);
      const success = drawFunction();
      if (success !== false) {
        console.log(`Successfully drew ${chartName}`);
        return true;
      }
    } catch (error) {
      console.error(`Error drawing ${chartName}, attempt ${attempt}:`, error);
    }

    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms再重试
    }
  }

  console.error(`Failed to draw ${chartName} after ${maxRetries} attempts`);
  return false;
}

// 图表更新函数
async function updateNativeCharts() {
  await nextTick();
  setTimeout(async () => {
    try {
      // 只绘制当前活动的图表
      if (activeTab.value === 'analysis') {
        await drawChartWithRetry(() => drawAnalysisChart(), 'analysis chart');
      } else if (activeTab.value === 'efficiency') {
        await drawChartWithRetry(() => drawEfficiencyChart(), 'efficiency chart');
      } else if (activeTab.value === 'heatmap') {
        await drawChartWithRetry(() => drawHeatmapChart(), 'heatmap chart');
      }
    } catch (error) {
      console.error('Failed to draw charts:', error);
    }
  }, 200);
}

function debounceUpdateCharts() {
  if (updateChartsTimer) {
    clearTimeout(updateChartsTimer);
  }
  updateChartsTimer = setTimeout(() => {
    updateNativeCharts();
  }, 300);
}

// 事件处理函数
function onParameterChange() {
  generateGroups();
  debounceUpdateCharts();
}

function runSimulation() {
  console.log('Running simulation...');
  generateGroups();
  updateNativeCharts();
}

// 原生图表绘制
async function initNativeCharts() {
  console.log('Initializing native charts for tab:', activeTab.value);
  try {
    // 只初始化当前活动的图表
    if (activeTab.value === 'analysis') {
      await drawChartWithRetry(() => drawAnalysisChart(), 'analysis chart');
    } else if (activeTab.value === 'efficiency') {
      await drawChartWithRetry(() => drawEfficiencyChart(), 'efficiency chart');
    } else if (activeTab.value === 'heatmap') {
      await drawChartWithRetry(() => drawHeatmapChart(), 'heatmap chart');
    }
  } catch (error) {
    console.error('Failed to initialize charts:', error);
  }
}

function setupCanvas(canvasRef) {
  try {
    if (!canvasRef || !canvasRef.value) {
      console.warn('Canvas reference not found');
      return null;
    }

    const canvas = canvasRef.value;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.warn('Could not get 2D context from canvas');
      return null;
    }

    // 直接使用容器的实际尺寸
    const container = canvas.parentElement;
    if (!container) {
      console.warn('Canvas container not found');
      return null;
    }

    // 强制获取容器尺寸，如果为0则使用默认值
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width > 0 ? containerRect.width - 20 : 680; // 给边距留点空间
    const height = containerRect.height > 0 ? containerRect.height - 20 : 300;

    console.log('Container dimensions:', { containerWidth: containerRect.width, containerHeight: containerRect.height });
    console.log('Canvas dimensions will be:', { width, height });

    // 设置canvas的实际像素尺寸
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // 设置canvas的CSS显示尺寸
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // 缩放绘图上下文以适应设备像素比
    ctx.scale(dpr, dpr);

    console.log('Canvas setup successful:', { width, height, dpr });

    return {
      ctx,
      width: width,
      height: height
    };
  } catch (error) {
    console.error('Error in setupCanvas:', error);
    return null;
  }
}

function drawAnalysisChart() {
  if (activeTab.value !== 'analysis') return false;

  const setup = setupCanvas(analysisChart);
  if (!setup) {
    console.log('Analysis chart setup failed');
    return false;
  }

  const { ctx, width, height } = setup;

  // 调整边距以适应较小的空间
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  if (chartWidth <= 0 || chartHeight <= 0) {
    console.warn('Chart area too small');
    return false;
  }

  // 清除画布
  ctx.clearRect(0, 0, width, height);

  // 计算数据
  const maxSize = Math.min(15, Math.floor(sampleCount.value / 2));
  if (maxSize <= 1) {
    console.warn('maxSize too small for analysis chart');
    return false;
  }

  const expectationData = [];
  let maxValue = sampleCount.value;

  for (let k = 1; k <= maxSize; k++) {
    const groups = Math.ceil(sampleCount.value / k);
    const probAllNegative = Math.pow(1 - prevalence.value, k);
    const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
    const value = groups * expectedPerGroup;
    expectationData.push(value);
    maxValue = Math.max(maxValue, value);
  }

  // 绘制背景
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // 绘制坐标轴
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + chartHeight);
  ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
  ctx.stroke();

  // 绘制期望检测次数线
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 2;
  ctx.beginPath();

  expectationData.forEach((value, index) => {
    const x = margin.left + (index / (maxSize - 1)) * chartWidth;
    const y = margin.top + chartHeight - (value / maxValue) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    // 绘制数据点
    ctx.save();
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  });
  ctx.stroke();

  // 绘制个体检测次数线（水平线）
  ctx.strokeStyle = '#f44336';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  const individualY = margin.top + chartHeight - (sampleCount.value / maxValue) * chartHeight;
  ctx.beginPath();
  ctx.moveTo(margin.left, individualY);
  ctx.lineTo(margin.left + chartWidth, individualY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('期望检测次数分析', width / 2, 20);

  // 添加图例
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4CAF50';
  ctx.fillText('━ 期望检测次数', margin.left, height - 10);
  ctx.fillStyle = '#f44336';
  ctx.fillText('━ 个体检测次数', margin.left + 100, height - 10);

  // 添加x轴标签
  ctx.fillStyle = '#666';
  ctx.font = '9px Arial';
  ctx.textAlign = 'center';
  for (let i = 0; i < Math.min(8, maxSize); i++) {
    const x = margin.left + (i / (maxSize - 1)) * chartWidth;
    ctx.fillText((i + 1).toString(), x, margin.top + chartHeight + 15);
  }

  // 添加轴标签
  ctx.font = '10px Arial';
  ctx.fillText('分组大小', width / 2, height - 25);

  return true;
}

function drawEfficiencyChart() {
  if (activeTab.value !== 'efficiency') return false;

  const setup = setupCanvas(efficiencyChart);
  if (!setup) {
    console.log('Efficiency chart setup failed');
    return false;
  }

  const { ctx, width, height } = setup;

  // 调整边距
  const margin = { top: 40, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  if (chartWidth <= 0 || chartHeight <= 0) {
    console.warn('Chart area too small');
    return false;
  }

  // 清除画布
  ctx.clearRect(0, 0, width, height);

  // 计算数据
  const maxSize = Math.min(12, Math.floor(sampleCount.value / 2));
  if (maxSize <= 1) {
    console.warn('maxSize too small for efficiency chart');
    return false;
  }

  const savingsData = [];
  for (let k = 1; k <= maxSize; k++) {
    const groups = Math.ceil(sampleCount.value / k);
    const probAllNegative = Math.pow(1 - prevalence.value, k);
    const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
    const groupCost = groups * expectedPerGroup * costRatio.value;
    const savingsPercent = Math.max(0, (1 - groupCost / sampleCount.value) * 100);
    savingsData.push(savingsPercent);
  }

  // 绘制背景
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // 绘制坐标轴
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + chartHeight);
  ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
  ctx.stroke();

  // 绘制柱状图
  const barWidth = Math.max(chartWidth / maxSize * 0.7, 15);
  const barSpacing = (chartWidth - barWidth * maxSize) / (maxSize + 1);

  savingsData.forEach((value, index) => {
    const x = margin.left + barSpacing + index * (barWidth + barSpacing);
    const barHeight = Math.max(0, (value / 100) * chartHeight);
    const y = margin.top + chartHeight - barHeight;

    // 绘制柱子
    ctx.fillStyle = 'rgba(76, 175, 80, 0.7)';
    ctx.fillRect(x, y, barWidth, barHeight);

    // 绘制边框
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barWidth, barHeight);

    // 添加数值标签（如果空间足够）
    if (barHeight > 15 && barWidth > 20) {
      ctx.fillStyle = '#333';
      ctx.font = '9px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(1) + '%', x + barWidth / 2, y - 5);
    }
  });

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('成本节省效果', width / 2, 20);

  // 添加x轴标签
  ctx.fillStyle = '#666';
  ctx.font = '9px Arial';
  ctx.textAlign = 'center';
  for (let i = 0; i < maxSize; i++) {
    const x = margin.left + barSpacing + i * (barWidth + barSpacing) + barWidth / 2;
    ctx.fillText((i + 1).toString(), x, margin.top + chartHeight + 15);
  }

  // 添加轴标签
  ctx.font = '10px Arial';
  ctx.fillText('分组大小', width / 2, height - 25);

  return true;
}

function drawHeatmapChart() {
  if (activeTab.value !== 'heatmap') return false;

  const setup = setupCanvas(heatmapChart);
  if (!setup) {
    console.log('Heatmap chart setup failed');
    return false;
  }

  const { ctx, width, height } = setup;

  // 调整边距
  const margin = { top: 40, right: 30, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  if (chartWidth <= 0 || chartHeight <= 0) {
    console.warn('Chart area too small');
    return false;
  }

  // 清除画布
  ctx.clearRect(0, 0, width, height);

  // 计算数据
  const pValues = [0.01, 0.03, 0.05, 0.08, 0.1, 0.15];
  const maxSize = Math.min(8, Math.floor(sampleCount.value / 2));
  if (maxSize <= 1 || pValues.length === 0) {
    console.warn('Invalid data size for heatmap chart');
    return false;
  }

  const cellWidth = chartWidth / maxSize;
  const cellHeight = chartHeight / pValues.length;

  // 计算所有数据找到最大值，用于颜色映射
  let maxSavings = 0;
  const allSavings = [];

  pValues.forEach((p) => {
    const rowSavings = [];
    for (let k = 1; k <= maxSize; k++) {
      const groups = Math.ceil(sampleCount.value / k);
      const probAllNegative = Math.pow(1 - p, k);
      const expectedPerGroup = probAllNegative * 1 + (1 - probAllNegative) * (1 + k);
      const groupCost = groups * expectedPerGroup * costRatio.value;
      const savingsPercent = Math.max(0, (1 - groupCost / sampleCount.value) * 100);
      rowSavings.push(savingsPercent);
      maxSavings = Math.max(maxSavings, savingsPercent);
    }
    allSavings.push(rowSavings);
  });

  // 绘制背景
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // 绘制热力图
  pValues.forEach((p, pIndex) => {
    for (let k = 1; k <= maxSize; k++) {
      const savingsPercent = allSavings[pIndex][k - 1];
      const x = margin.left + (k - 1) * cellWidth;
      const y = margin.top + pIndex * cellHeight;

      // 计算颜色强度
      const intensity = maxSavings > 0 ? savingsPercent / maxSavings : 0;

      // 使用绿色渐变
      const green = Math.round(255 * intensity);
      const alpha = 0.3 + intensity * 0.7;

      ctx.fillStyle = `rgba(76, 175, 80, ${alpha})`;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      // 添加边框
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, cellHeight);

      // 添加数值（如果空间足够）
      if (cellWidth > 25 && cellHeight > 15) {
        ctx.fillStyle = intensity > 0.6 ? '#fff' : '#333';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(savingsPercent.toFixed(0), x + cellWidth / 2, y + cellHeight / 2 + 3);
      }
    }
  });

  // 添加标题
  ctx.fillStyle = '#333';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('效率对比热力图', width / 2, 20);

  // 添加y轴标签（阳性率）
  ctx.font = '9px Arial';
  ctx.textAlign = 'right';
  pValues.forEach((p, index) => {
    const y = margin.top + index * cellHeight + cellHeight / 2;
    ctx.fillStyle = '#666';
    ctx.fillText(`${(p * 100).toFixed(1)}%`, margin.left - 5, y + 3);
  });

  // 添加x轴标签（分组大小）
  ctx.textAlign = 'center';
  for (let k = 1; k <= maxSize; k++) {
    const x = margin.left + (k - 1) * cellWidth + cellWidth / 2;
    ctx.fillStyle = '#666';
    ctx.fillText(k.toString(), x, margin.top + chartHeight + 15);
  }

  // 添加轴标题
  ctx.font = '10px Arial';
  ctx.fillStyle = '#333';
  ctx.save();
  ctx.translate(15, margin.top + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('阳性率', 0, 0);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.fillText('分组大小', margin.left + chartWidth / 2, height - 25);

  return true;
}

// 窗口大小变化处理
let resizeTimer = null;
function handleResize() {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(() => {
    console.log('Window resized, redrawing charts...');
    updateNativeCharts();
  }, 300);
}

// 清理函数
function cleanup() {
  if (updateChartsTimer) {
    clearTimeout(updateChartsTimer);
    updateChartsTimer = null;
  }
  if (resizeTimer) {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }
  window.removeEventListener('resize', handleResize);
  console.log('Component cleanup');
}

// 监听器
watch([sampleCount, prevalence, groupSize, testError, costRatio], () => {
  generateGroups();
  debounceUpdateCharts();
});

watch(groupSize, (newVal) => {
  if (newVal > maxGroupSize.value) {
    groupSize.value = maxGroupSize.value;
  }
});

watch(activeTab, (newTab) => {
  // 当切换标签页时，重新绘制当前图表
  console.log('Tab changed to:', newTab);
  nextTick(() => {
    setTimeout(async () => {
      try {
        if (newTab === 'analysis') {
          await drawChartWithRetry(() => drawAnalysisChart(), 'analysis chart');
        } else if (newTab === 'efficiency') {
          await drawChartWithRetry(() => drawEfficiencyChart(), 'efficiency chart');
        } else if (newTab === 'heatmap') {
          await drawChartWithRetry(() => drawHeatmapChart(), 'heatmap chart');
        }
      } catch (error) {
        console.error('Failed to draw chart on tab change:', error);
      }
    }, 300);
  });
});

// 生命周期
onMounted(async () => {
  try {
    console.log('Component mounted, generating groups...');
    generateGroups();

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleResize);

    // 较短的延迟，确保DOM渲染
    await nextTick();
    setTimeout(async () => {
      console.log('Attempting to initialize charts...');
      await initNativeCharts();
      isChartsReady.value = true;
    }, 300); // 减少到300ms
  } catch (error) {
    console.error('Failed to mount component:', error);
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.input-group {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group label {
  display: inline-block;
  width: 200px;
  font-weight: 600;
}

.input-group input[type="range"] {
  flex: 1;
  padding: 5px;
}

.value-display {
  min-width: 50px;
  padding: 5px 10px;
  background: #f0f0f0;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
}

.simulate-btn {
  width: 100%;
  padding: 12px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin: 20px 0;
  transition: all 0.3s;
}

.simulate-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.result-card {
  background: #f0f0f0;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s ease;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.result-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4CAF50;
  margin: 8px 0;
}

.result-label {
  font-size: 1rem;
  color: #666;
}

.visualization-section {
  margin: 20px 0;
}

.visualization-section h3 {
  margin-bottom: 15px;
  color: #4CAF50;
}

.group-visual {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background: #f8f8f8;
  border-radius: 10px;
}

.sample-group {
  border: 2px solid #666;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  background: white;
}

.group-header {
  font-weight: bold;
  margin-bottom: 5px;
  color: #4CAF50;
  font-size: 0.9rem;
}

.samples {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.sample {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
}

.negative {
  background-color: #4CAF50;
  color: white;
}

.positive {
  background-color: #f44336;
  color: white;
}

.group-result {
  margin-top: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}

.group-positive {
  color: #f44336;
}

.group-negative {
  color: #4CAF50;
}

.chart-section {
  margin: 20px 0;
}

.tabs {
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 10px 15px;
  cursor: pointer;
  background: #f1f1f1;
  border: 1px solid #ddd;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  margin-right: 5px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab:hover {
  background: #e0e0e0;
}

.tab.active {
  background: white;
  border-bottom: 1px solid white;
  margin-bottom: -1px;
  font-weight: bold;
  color: #4CAF50;
}

.tab-content {
  background: white;
  padding: 15px;
  border-radius: 0 10px 10px 10px;
  height: 400px;
  overflow: hidden;
}

.tab-content h3 {
  margin-bottom: 10px;
  color: #4CAF50;
  font-size: 1.1rem;
}

.chart-container {
  width: 100%;
  height: 320px;
  position: relative;
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  overflow: hidden;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
}

.stats-summary {
  margin-top: 20px;
  padding: 15px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  font-size: 0.9rem;
}

.stats-summary p {
  margin-bottom: 8px;
  line-height: 1.4;
}

.stats-highlight {
  font-weight: bold;
  color: #4CAF50;
}

@media (max-width: 600px) {
  .results-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .input-group label {
    width: 100%;
  }
}
</style>