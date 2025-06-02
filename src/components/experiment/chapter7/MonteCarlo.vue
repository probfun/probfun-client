<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import { ref, reactive, computed, onMounted } from 'vue';
import Plotly from 'plotly.js-dist';

const content = ref(`
## **回望期权定价 - 蒙特卡洛模拟**

回望期权是一种具有特殊特点的衍生工具，它的支付结构依赖于标的资产在期权生命周期内的**最高价格**。因此，与传统的欧式期权不同，回望期权的定价通常更加复杂，蒙特卡洛模拟被广泛应用于其定价过程中。

**核心思想：**

回望期权赋予持有者在期权到期时，基于标的资产在期权有效期内的**最高价格**来确定期权的支付。例如，在回望看涨期权中，投资者可以选择在到期时以最高的历史价格来行使期权，从而获得价格波动带来的最大利益。

蒙特卡洛模拟是一种通过大量随机样本路径模拟来近似计算期权价格的数值方法。对于回望期权的定价，我们主要利用蒙特卡洛模拟生成大量的价格路径，并计算每条路径的最大值，以确定最终的期权支付。

**输入变量：**

回望期权定价中，蒙特卡洛模拟需要以下几个输入变量：

1. **标的资产当前价格 (S)：** 标的资产在当前时刻的市场价格。
2. **行权价格 (K)：** 期权的执行价格，通常用来与最大价格比较，确定支付。
3. **到期时间 (T)：** 期权到期的时间长度，通常以年为单位。
4. **无风险利率 (r)：** 可用于投资的无风险资产的回报率。
5. **波动率 (\\$\\sigma\\$)：** 标的资产的波动性，影响未来价格的波动程度。
6. **路径数量 (N)：** 蒙特卡洛模拟中所需的模拟路径数，路径数越多，模拟结果的精度越高。

**模型假设（简化）：**

与其他期权定价模型一样，回望期权的蒙特卡洛模拟也有一定的假设条件：

* 标的资产价格遵循几何布朗运动。
* 模拟过程中无交易成本和税收。
* 利率是常数且无风险。
* 市场的波动性可由历史数据估计，但在实际应用中可能有所波动。

**蒙特卡洛模拟过程：**

1. **生成价格路径：** 利用随机模拟生成若干条标的资产的价格路径。这些路径遵循几何布朗运动模型，即通过随机变量生成资产的价格序列。
2. **计算最大值：** 对每条模拟路径，找出期权生命周期内的最大价格。
3. **计算期权支付：** 在回望看涨期权的情况下，期权支付为最大价格与行权价格的差（如果最大价格高于行权价格）。回望看跌期权则是行权价格与最大价格的差（如果行权价格高于最大价格）。
4. **折现：** 对所有模拟路径的支付结果进行折现，得到期权的现值。

**定价公式：**

回望期权的价格是通过蒙特卡洛模拟得到的平均折现支付。具体公式如下：

$$
C_{MC} = e^{-rT} \\cdot \\frac{1}{N} \\sum_{i=1}^{N} \\max(S_{\\text{max}}^{(i)} - K, 0)
$$

其中，\\$S\\_{\\text{max}}^{(i)}\\$ 是第 \\$i\\$ 条路径的最大价格，\\$N\\$ 是路径数量，\\$T\\$ 是期权到期时间，\\$r\\$ 是无风险利率，\\$K\\$ 是行权价格。

**直观理解：**

* 每条路径代表一种可能的价格变动情况，回望期权的价值则依赖于这条路径的最大价格。
* 蒙特卡洛模拟通过大量模拟路径，能够提供期权价值的近似值，尽管这种方法没有封闭解，但随着路径数增加，结果趋于准确。

**重要性：**

回望期权的定价不同于传统期权，要求我们在整个生命周期内考虑标的资产的最大价格，这使得其定价问题比标准期权更为复杂。蒙特卡洛模拟通过其强大的数值计算能力，提供了一种非常有效的方式来估算这些复杂期权的价值。尽管蒙特卡洛模拟需要大量计算资源，但它依然是目前最为通用的回望期权定价工具之一，尤其适用于路径依赖型期权。
`)

// 初始化参数
const params = reactive({
  S0: 100,
  T: 1.0,
  r: 0.05,
  sigma: 0.2,
  simulations: 10000,
  timeSteps: 252,
  optionType: 'call',
  lookbackType: 'continuous',
  K: 100,
});

// 计算结果
const results = reactive({
  price: '-',
  stderr: '-',
  calcTime: '-'
});

// 加载状态
const isLoading = ref(false);

// 控制固定执行价格输入框的显示
const showFixedStrike = ref(false);

// 绑定滑块事件
document.querySelectorAll('input[type="range"], select').forEach((element) => {
  element.addEventListener('input', function () {
    const id = this.id;
    const value = this.type === 'range' ? Number.parseFloat(this.value) : this.value;
    params[id] = value;
    if (this.type === 'range') {
      document.getElementById(`${id}-value`).textContent
        = ['r', 'sigma'].includes(id) ? value.toFixed(2) : value;
    }

    // 显示/隐藏固定执行价格滑块
    if (id === 'option-type') {
      const showFixed = value.startsWith('fixed');
      document.getElementById('fixed-strike-container').style.display
        = showFixed ? 'block' : 'none';
    }
  });
});

// 工具函数
const generateRandomNormals = (n) => {
  const randoms = Array.from({ length: n });
  for (let i = 0; i < n; i += 2) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    randoms[i] = z0;
    if (i + 1 < n) randoms[i + 1] = z1;
  }
  return randoms;
};

const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const std = (arr) => {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
};

// 蒙特卡洛模拟计算
const calculateOptionPrice = async () => {
  const startTime = performance.now();
  isLoading.value = true;

  try {
    const { S0, T, r, sigma, simulations, timeSteps, optionType, lookbackType, K } = params;

    const dt = T / timeSteps;
    const discount = Math.exp(-r * T);

    // 生成随机数
    const z = generateRandomNormals(simulations * timeSteps);

    // 计算价格路径和极值
    const paths = Array.from({ length: simulations });
    const maxima = Array.from({ length: simulations }).fill(-Infinity);
    const minima = Array.from({ length: simulations }).fill(Infinity);
    const payoffs = Array.from({ length: simulations });

    for (let i = 0; i < simulations; i++) {
      paths[i] = Array.from({ length: timeSteps + 1 });
      paths[i][0] = S0;

      // 计算路径
      for (let j = 1; j <= timeSteps; j++) {
        const idx = i * timeSteps + (j - 1);
        paths[i][j] = paths[i][j - 1] * Math.exp(
          (r - 0.5 * sigma * sigma) * dt
          + sigma * Math.sqrt(dt) * z[idx],
        );

        // 更新极值
        if (lookbackType === 'continuous' || j === timeSteps) {
          maxima[i] = Math.max(maxima[i], paths[i][j]);
          minima[i] = Math.min(minima[i], paths[i][j]);
        }
      }

      // 计算收益
      switch (optionType) {
        case 'call': // 浮动执行看涨: S_T - min(S)
          payoffs[i] = Math.max(paths[i][timeSteps] - minima[i], 0);
          break;
        case 'put': // 浮动执行看跌: max(S) - S_T
          payoffs[i] = Math.max(maxima[i] - paths[i][timeSteps], 0);
          break;
        case 'fixed-call': // 固定执行看涨: max(S) - K
          payoffs[i] = Math.max(maxima[i] - K, 0);
          break;
        case 'fixed-put': // 固定执行看跌: K - min(S)
          payoffs[i] = Math.max(K - minima[i], 0);
          break;
      }
    }

    // 计算统计量
    results.price = (discount * mean(payoffs)).toFixed(4);
    results.stderr = (discount * std(payoffs) / Math.sqrt(simulations)).toFixed(6);
    results.calcTime = `${((performance.now() - startTime) / 1000).toFixed(2)}秒`;

    // 更新图表
    updateCharts(paths, maxima, minima);
  } catch (error) {
    console.error('计算期权价格时发生错误:', error);
  } finally {
    isLoading.value = false;
  }
};

// 更新图表
const updateCharts = (paths, maxima, minima) => {
  const { timeSteps, T } = params;
  const timePoints = Array.from({ length: timeSteps + 1 }, (_, i) => i * T / timeSteps);

  // 选择部分路径显示 (最多10条)
  const displayPaths = Math.min(10, paths.length);
  const pathTraces = [];
  const maxMinTraces = [];

  for (let i = 0; i < displayPaths; i++) {
    pathTraces.push({
      x: timePoints,
      y: paths[i],
      type: 'line',
      line: { color: 'rgba(0, 128, 255, 0.5)', width: 1 },
      name: `路径 ${i + 1}`,
      showlegend: false,
      hoverinfo: 'none',
    });

    // 添加极值点
    maxMinTraces.push({
      x: [timePoints[timeSteps]],
      y: [maxima[i]],
      mode: 'markers',
      marker: { color: 'red', size: 8 },
      name: `最大值 ${i + 1}`,
      showlegend: i === 0,
    });

    maxMinTraces.push({
      x: [timePoints[timeSteps]],
      y: [minima[i]],
      mode: 'markers',
      marker: { color: 'green', size: 8 },
      name: `最小值 ${i + 1}`,
      showlegend: i === 0,
    });
  }

  // 绘制价格路径图
  Plotly.newPlot('paths-chart', [...pathTraces, ...maxMinTraces], {
    title: '蒙特卡洛模拟路径及极值点',
    xaxis: { title: '时间 (年)' },
    yaxis: { title: '标的资产价格' },
    margin: { t: 40, l: 50, r: 30, b: 50 },
    showlegend: true,
  });

  // 绘制极值分布图
  const maxTrace = {
    x: maxima,
    type: 'histogram',
    marker: { color: 'rgba(255, 0, 0, 0.7)' },
    name: '最大值分布',
    opacity: 0.5,
  };

  const minTrace = {
    x: minima,
    type: 'histogram',
    marker: { color: 'rgba(0, 200, 0, 0.7)' },
    name: '最小值分布',
    opacity: 0.5,
  };

  Plotly.newPlot('extrema-chart', [maxTrace, minTrace], {
    title: '极值价格分布',
    xaxis: { title: '价格' },
    yaxis: { title: '频数' },
    barmode: 'overlay',
    margin: { t: 40, l: 50, r: 30, b: 50 },
  });
};

// 选项类型改变处理函数
const handleOptionTypeChange = () => {
  showFixedStrike.value = params.optionType.startsWith('fixed');
};

// 初始化计算
onMounted(() => {
  // 初始化
  calculateOptionPrice();
});
</script>

<template>
  <ExperimentBoard :panel-size="70">
    <template #experiment>
      <div class="bg-blue-50 rounded-lg p-5 shadow-md">
        <h3 class="text-xl font-semibold mb-4">计算结果</h3>
        <table class="w-full">
          <thead>
            <tr>
              <th class="bg-blue-500 text-white px-4 py-2 text-left">指标</th>
              <th class="bg-blue-500 text-white px-4 py-2 text-left">值</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">期权价格</td>
              <td class="border-b border-gray-200 px-4 py-2">{{ results.price }}</td>
            </tr>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">标准误差</td>
              <td class="border-b border-gray-200 px-4 py-2">{{ results.stderr }}</td>
            </tr>
            <tr>
              <td class="border-b border-gray-200 px-4 py-2">计算时间</td>
              <td class="border-b border-gray-200 px-4 py-2">{{ results.calcTime }}</td>
            </tr>
          </tbody>
        </table>

        <div class="bg-blue-50 p-4 rounded-lg mt-5">
          <h4 class="font-semibold mb-2">关于回望期权:</h4>
          <p class="mb-2">回望期权的收益取决于标的资产在期权有效期内的最高或最低价格。</p>
          <p class="mb-2"><strong>浮动执行</strong>期权: 执行价格等于期内最优价格</p>
          <p class="mb-2"><strong>固定执行</strong>期权: 执行价格固定，但使用期内最优价格计算收益</p>
          <p>连续监测理论上更精确，但离散监测更接近实际交易情况。</p>
        </div>

        <div class="flex-[2] min-w-[600px] mt-5">
          <div id="paths-chart" class="h-[400px] mb-5" />
          <div id="extrema-chart" class="h-[400px]" />
        </div>
      </div>
    </template>
    <template #parameter>
      <div class="flex flex-wrap gap-5">
        <div class="flex-1 min-w-[300px] bg-gray-50 p-5 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold mb-4">参数设置</h2>

          <div class="mb-4">
            <label class="block mb-1 font-medium">初始价格 (S₀): <span>{{ params.S0 }}</span></label>
            <input type="range" v-model.number="params.S0" min="50" max="150" step="1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">到期时间 (T, 年): <span>{{ params.T.toFixed(1) }}</span></label>
            <input type="range" v-model.number="params.T" min="0.1" max="3" step="0.1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">无风险利率 (r): <span>{{ params.r.toFixed(2) }}</span></label>
            <input type="range" v-model.number="params.r" min="0" max="0.2" step="0.01" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">波动率 (σ): <span>{{ params.sigma.toFixed(2) }}</span></label>
            <input type="range" v-model.number="params.sigma" min="0.1" max="0.5" step="0.01" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">模拟路径数: <span>{{ params.simulations }}</span></label>
            <input type="range" v-model.number="params.simulations" min="1000" max="50000" step="1000" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">时间步数: <span>{{ params.timeSteps }}</span></label>
            <input type="range" v-model.number="params.timeSteps" min="10" max="500" step="1" class="w-full">
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">期权类型:</label>
            <select v-model="params.optionType" @change="handleOptionTypeChange"
              class="w-full p-2 border border-gray-300 rounded">
              <option value="call">浮动执行看涨 (Floating Strike Call)</option>
              <option value="put">浮动执行看跌 (Floating Strike Put)</option>
              <option value="fixed-call">固定执行看涨 (Fixed Strike Call)</option>
              <option value="fixed-put">固定执行看跌 (Fixed Strike Put)</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-1 font-medium">回望类型:</label>
            <select v-model="params.lookbackType" class="w-full p-2 border border-gray-300 rounded">
              <option value="continuous">连续监测</option>
              <option value="discrete">离散监测</option>
            </select>
          </div>

          <div v-show="showFixedStrike" class="mb-4">
            <label class="block mb-1 font-medium">执行价格 (K): <span>{{ params.K }}</span></label>
            <input type="range" v-model.number="params.K" min="50" max="150" step="1" class="w-full">
          </div>

          <button @click="calculateOptionPrice" :disabled="isLoading"
            class="w-full mt-4 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-base rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            计算期权价格
          </button>

          <div v-if="isLoading" class="text-center py-2.5 text-blue-500">
            计算中，请稍候...
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
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
/* Only essential styles that can't be handled by Tailwind */
</style>
