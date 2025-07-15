<template>
  <ExperimentBoard :layout="1" :panel-size="70">
    <template #experiment>
      <div class="w-full h-full p-4">
        <!-- 主要内容区域 -->
        <div class="flex flex-col h-full gap-3">
          <!-- 图表区域 -->
          <div class="flex-1 bg-white/90 rounded-xl p-4 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <h2 class="text-lg font-semibold text-blue-700 mb-3 pb-2 border-b-2 border-blue-500">抛硬币频率收敛过程</h2>
            <div ref="chartContainer" class="w-full h-128 bg-gray-50 rounded border border-gray-200"></div>

            <!-- 硬币动画区域 - 移到图表下方 -->
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="text-center">
                <div class="text-sm font-semibold text-blue-700 mb-2">当前抛掷</div>
                <div
                    ref="coinElement"
                    :class="['w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg transition-transform duration-300 mx-auto', isFlipping ? 'animate-flip' : '']"
                >
                  {{ currentCoinFace }}
                </div>
              </div>
            </div>
          </div>

          <!-- 统计数据 -->
          <div class="grid grid-cols-4 gap-3">
            <div class="bg-white/90 rounded-xl p-3 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
              <div class="text-sm text-blue-600 mb-1">总抛掷次数</div>
              <div class="text-2xl font-bold text-red-500">{{ totalFlips }}</div>
            </div>

            <div class="bg-white/90 rounded-xl p-3 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
              <div class="text-sm text-blue-600 mb-1">正面次数</div>
              <div class="text-2xl font-bold text-red-500">{{ headsCount }}</div>
            </div>

            <div class="bg-white/90 rounded-xl p-3 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
              <div class="text-sm text-blue-600 mb-1">反面次数</div>
              <div class="text-2xl font-bold text-red-500">{{ tailsCount }}</div>
            </div>

            <div class="bg-white/90 rounded-xl p-3 text-center transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl">
              <div class="text-sm text-blue-600 mb-1">当前频率</div>
              <div class="text-2xl font-bold text-red-500">{{ currentFrequency }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="w-full h-full p-4 flex flex-col justify-center">
        <div class="flex items-center gap-2.5 my-3">
          <label class="inline-block w-40 font-semibold text-sm">抛掷次数:</label>
          <input
              type="range"
              v-model.number="maxTrials"
              min="100"
              max="10000"
              step="100"
              class="flex-1 p-1"
          >
          <span class="min-w-16 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ maxTrials }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-3">
          <label class="inline-block w-40 font-semibold text-sm">轨迹数量:</label>
          <input
              type="range"
              v-model.number="numSequences"
              min="1"
              max="10"
              step="1"
              class="flex-1 p-1"
          >
          <span class="min-w-16 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ numSequences }}</span>
        </div>

        <div class="flex items-center gap-2.5 my-3">
          <label class="inline-block w-40 font-semibold text-sm">模拟速度:</label>
          <input
              type="range"
              v-model.number="speed"
              min="1"
              max="5"
              step="1"
              class="flex-1 p-1"
          >
          <span class="min-w-16 px-2.5 py-1 bg-gray-100 rounded text-center font-bold text-sm">{{ speedLabels[speed - 1] }}</span>
        </div>

        <div class="flex gap-2 my-4">
          <button
              @click="startSimulation"
              :disabled="isRunning"
              class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white border-0 rounded cursor-pointer font-bold text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            开始实验
          </button>
          <button
              @click="togglePause"
              class="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded cursor-pointer font-bold text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            {{ isPaused ? '继续' : '暂停' }}
          </button>
          <button
              @click="resetSimulation"
              class="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white border-0 rounded cursor-pointer font-bold text-sm transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            重置
          </button>
        </div>

        <div class="mt-4 p-3 bg-blue-50 rounded-xl text-sm">
          <h3 class="font-bold text-blue-700 mb-2">实验说明</h3>
          <p class="mb-2 leading-relaxed">抛硬币实验中，理论上正面出现的概率为<span class="font-bold text-red-500">0.5</span>。大数定律表明，随着抛掷次数增加，实际频率会逐渐接近理论概率值。</p>
          <p class="leading-relaxed">观察当抛掷次数较小时，频率波动较大；随着次数增加，频率逐渐稳定在<span class="font-bold text-red-500">0.5</span>附近。</p>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="law-of-large-numbers" />
    </template>
  </ExperimentBoard>
</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { toMarkdown } from '@/utils/markdown';
import * as d3 from 'd3';

// 响应式变量
const maxTrials = ref(1000);
const numSequences = ref(3);
const speed = ref(3);
const isRunning = ref(false);
const isPaused = ref(false);
const currentStep = ref(0);
const totalFlips = ref(0);
const headsCount = ref(0);
const currentCoinFace = ref('H');
const isFlipping = ref(false);

// 图表相关
const chartContainer = ref(null);
const coinElement = ref(null);
let svg = null;
let sequences = [];
let animationInterval = null;

// 常量
const speedLabels = ['极慢', '慢速', '中速', '快速', '极快'];

// 计算属性
const tailsCount = computed(() => totalFlips.value - headsCount.value);
const currentFrequency = computed(() => {
  return totalFlips.value > 0 ? (headsCount.value / totalFlips.value).toFixed(4) : '0.0000';
});

// 实验内容
const content = ref(`
## **大数定律 (Law of Large Numbers)**

大数定律是概率论中的一个重要定理，它描述了在大量重复实验中，样本均值趋向于理论期望值的现象。

**核心思想：**

当独立重复进行某个随机实验时，随着实验次数的增加，事件发生的频率会逐渐趋近于其理论概率。

**数学表述：**

设 $X_1, X_2, \\ldots, X_n$ 是独立同分布的随机变量序列，期望值为 $\\mu$，则：

$$\\lim_{n \\to \\infty} P\\left(\\left|\\frac{1}{n}\\sum_{i=1}^{n} X_i - \\mu\\right| < \\varepsilon\\right) = 1$$

对于任意 $\\varepsilon > 0$。

**抛硬币实验：**

在抛硬币实验中：
- 每次抛掷结果独立
- 正面出现的理论概率 $p = 0.5$
- 根据大数定律，当抛掷次数 $n$ 很大时，正面出现的频率 $\\frac{\\text{正面次数}}{n}$ 会收敛到 $0.5$

**观察要点：**

1. **初期波动**：抛掷次数较少时，频率可能偏离0.5较远
2. **逐渐收敛**：随着次数增加，频率波动减小，逐渐接近0.5
3. **收敛速度**：收敛速度与 $\\frac{1}{\\sqrt{n}}$ 成正比

**应用领域：**

- **统计学**：样本估计总体参数
- **保险业**：风险评估和保费计算
- **质量控制**：产品质量监控
- **金融学**：投资组合理论
- **机器学习**：模型训练和验证

大数定律为统计推断提供了理论基础，是现代统计学的重要支柱。
`);

// D3.js 图表配置
const chartConfig = {
  width: 600,
  height: 320,
  margin: { top: 20, right: 20, bottom: 50, left: 60 }
};

// 初始化图表
function initChart() {
  if (!chartContainer.value) return;

  // 清除现有内容
  d3.select(chartContainer.value).selectAll("*").remove();

  const { width, height, margin } = chartConfig;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg = d3.select(chartContainer.value)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // 创建比例尺
  const xScale = d3.scaleLinear()
      .domain([1, maxTrials.value])
      .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

  // 添加坐标轴
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")))
      .selectAll("text")
      .style("fill", "#374151");

  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll("text")
      .style("fill", "#374151");

  // 添加坐标轴标签
  svg.append("text")
      .attr("class", "axis-label")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "12px")
      .text("抛硬币次数 (n)");

  svg.append("text")
      .attr("class", "axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .style("fill", "#374151")
      .style("font-size", "12px")
      .text("正面频率");

  // 添加理论概率线
  svg.append("line")
      .attr("class", "theory-line")
      .attr("x1", 0)
      .attr("y1", yScale(0.5))
      .attr("x2", innerWidth)
      .attr("y2", yScale(0.5))
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

  svg.append("text")
      .attr("class", "theory-label")
      .attr("x", innerWidth - 10)
      .attr("y", yScale(0.5) - 10)
      .attr("text-anchor", "end")
      .style("fill", "#f59e0b")
      .style("font-size", "12px")
      .text("理论概率 (p=0.5)");

  // 存储比例尺以供后续使用
  svg.xScale = xScale;
  svg.yScale = yScale;
}

// 初始化序列
function initSequences() {
  sequences = [];
  for (let i = 0; i < numSequences.value; i++) {
    sequences.push({
      id: i,
      data: [],
      heads: 0,
      line: svg.append("path")
          .attr("class", "sequence-line")
          .attr("fill", "none")
          .attr("stroke", d3.interpolateRainbow(i / numSequences.value))
          .attr("stroke-width", 2)
          .attr("opacity", 0.8)
    });
  }
}

// 更新图表
function updateChart() {
  if (!svg) return;

  sequences.forEach(seq => {
    if (seq.data.length > 0) {
      const lineGenerator = d3.line()
          .x(d => svg.xScale(d.n))
          .y(d => svg.yScale(d.freq));

      seq.line.attr("d", lineGenerator(seq.data));
    }
  });
}

// 执行一次抛硬币
function flipCoin(sequence) {
  const isHeads = Math.random() < 0.5;
  if (isHeads) sequence.heads++;

  const n = sequence.data.length + 1;
  const freq = sequence.heads / n;

  sequence.data.push({ n, freq });

  return isHeads;
}

// 动画硬币翻转
function animateCoinFlip(isHeads) {
  isFlipping.value = true;

  setTimeout(() => {
    currentCoinFace.value = isHeads ? 'H' : 'T';
    setTimeout(() => {
      isFlipping.value = false;
    }, 300);
  }, 300);
}

// 更新统计数据
function updateStats() {
  if (sequences.length === 0) return;

  const currentSequence = sequences[0];
  totalFlips.value = currentSequence.data.length;
  headsCount.value = currentSequence.heads;
}

// 执行模拟
function runSimulation() {
  if (currentStep.value >= maxTrials.value || !isRunning.value || isPaused.value) {
    if (currentStep.value >= maxTrials.value) {
      isRunning.value = false;
      isPaused.value = false;
    }
    return;
  }

  // 每次执行多步以加快速度
  const stepsPerFrame = Math.pow(2, speed.value - 1);
  for (let i = 0; i < stepsPerFrame && currentStep.value < maxTrials.value; i++) {
    sequences.forEach(seq => {
      if (seq.data.length < maxTrials.value) {
        const isHeads = flipCoin(seq);
        if (seq.id === 0 && i === 0) {
          animateCoinFlip(isHeads);
        }
      }
    });
    currentStep.value++;
  }

  updateChart();
  updateStats();
}

// 开始模拟
function startSimulation() {
  if (isRunning.value) return;

  isRunning.value = true;
  isPaused.value = false;

  if (animationInterval) {
    clearInterval(animationInterval);
  }

  animationInterval = setInterval(runSimulation, 50);
}

// 暂停/继续
function togglePause() {
  if (!isRunning.value) return;

  isPaused.value = !isPaused.value;

  if (isPaused.value) {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  } else {
    animationInterval = setInterval(runSimulation, 50);
  }
}

// 重置模拟
function resetSimulation() {
  isRunning.value = false;
  isPaused.value = false;
  currentStep.value = 0;
  totalFlips.value = 0;
  headsCount.value = 0;
  currentCoinFace.value = 'H';

  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }

  if (svg) {
    // 清除所有序列
    sequences.forEach(seq => {
      seq.line.attr("d", null);
    });

    initSequences();
  }
}

// 监听器
watch(maxTrials, () => {
  if (svg) {
    svg.xScale.domain([1, maxTrials.value]);
    svg.select(".x-axis").call(d3.axisBottom(svg.xScale).ticks(5).tickFormat(d3.format("d")));
  }
  resetSimulation();
});

watch(numSequences, () => {
  resetSimulation();
});

// 生命周期
onMounted(async () => {
  await nextTick();
  setTimeout(() => {
    initChart();
    initSequences();
  }, 100);
});

onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval);
  }
});
</script>

<style scoped>
@keyframes flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
}

.animate-flip {
  animation: flip 0.6s ease-in-out;
}

/* D3.js图表样式 */
:deep(.x-axis) line,
:deep(.y-axis) line {
  stroke: #374151;
}

:deep(.x-axis) path,
:deep(.y-axis) path {
  stroke: #374151;
}
</style>