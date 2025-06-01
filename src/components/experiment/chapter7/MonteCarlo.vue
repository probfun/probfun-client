<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import { ref } from 'vue';
import {newPlot} from "plotly.js";

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
const params = {
  S0: 100,
  T: 1.0,
  r: 0.05,
  sigma: 0.2,
  simulations: 10000,
  timeSteps: 252,
  optionType: 'call',
  lookbackType: 'continuous',
  K: 100,
};

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

// 计算按钮事件
document.getElementById('calculate-btn').addEventListener('click', () => {
  calculateOptionPrice();
});

// 蒙特卡洛模拟计算
function calculateOptionPrice() {
  const startTime = performance.now();
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';

  // 使用setTimeout让UI有机会更新加载状态
  setTimeout(() => {
    const { S0, T, r, sigma, simulations, timeSteps, optionType, lookbackType, K } = params;

    const dt = T / timeSteps;
    const discount = Math.exp(-r * T);

    // 生成随机数 (使用Box-Muller变换)
    const z = generateRandomNormals(simulations * timeSteps);

    // 计算价格路径和极值
    const paths = Array.from({length: simulations});
    const maxima = Array.from({length: simulations}).fill(-Infinity);
    const minima = Array.from({length: simulations}).fill(Infinity);
    const payoffs = Array.from({length: simulations});

    for (let i = 0; i < simulations; i++) {
      paths[i] = Array.from({length: timeSteps + 1});
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
    const price = discount * mean(payoffs);
    const stderr = discount * std(payoffs) / Math.sqrt(simulations);

    // 更新结果显示
    document.getElementById('price').textContent = price.toFixed(4);
    document.getElementById('stderr').textContent = stderr.toFixed(6);

    const endTime = performance.now();
    document.getElementById('calc-time').textContent
        = `${((endTime - startTime) / 1000).toFixed(2)}秒`;

    // 更新图表
    updateCharts(paths, maxima, minima);

    loadingElement.style.display = 'none';
  }, 10);
}

// 生成正态分布随机数 (Box-Muller变换)
function generateRandomNormals(n) {
  const randoms = Array.from({ length: n });
  for (let i = 0; i < n; i += 2) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    randoms[i] = z0;
    if (i + 1 < n)
      randoms[i + 1] = z1;
  }
  return randoms;
}

// 计算平均值
function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// 计算标准差
function std(arr) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length);
}

// 更新图表
function updateCharts(paths, maxima, minima) {
  const { timeSteps, T, optionType } = params;
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
}

// 初始化计算
calculateOptionPrice();
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <div class="results">
        <h3>计算结果</h3>
        <table>
          <tr>
            <th>指标</th>
            <th>值</th>
          </tr>
          <tr>
            <td>期权价格</td>
            <td id="price">
              -
            </td>
          </tr>
          <tr>
            <td>标准误差</td>
            <td id="stderr">
              -
            </td>
          </tr>
          <tr>
            <td>计算时间</td>
            <td id="calc-time">
              -
            </td>
          </tr>
        </table>
      </div>
    </template>
    <template #parameter>
      <div class="container">
        <div class="control-panel">
          <h2>参数设置</h2>

          <div class="slider-container">
            <label for="S0">初始价格 (S₀): <span id="S0-value">100</span></label>
            <input id="S0" type="range" min="50" max="150" value="100" step="1">
          </div>

          <div class="slider-container">
            <label for="T">到期时间 (T, 年): <span id="T-value">1.0</span></label>
            <input id="T" type="range" min="0.1" max="3" value="1.0" step="0.1">
          </div>

          <div class="slider-container">
            <label for="r">无风险利率 (r): <span id="r-value">0.05</span></label>
            <input id="r" type="range" min="0" max="0.2" value="0.05" step="0.01">
          </div>

          <div class="slider-container">
            <label for="sigma">波动率 (σ): <span id="sigma-value">0.2</span></label>
            <input id="sigma" type="range" min="0.1" max="0.5" value="0.2" step="0.01">
          </div>

          <div class="slider-container">
            <label for="simulations">模拟路径数: <span id="simulations-value">10000</span></label>
            <input id="simulations" type="range" min="1000" max="50000" value="10000" step="1000">
          </div>

          <div class="slider-container">
            <label for="time-steps">时间步数: <span id="time-steps-value">252</span></label>
            <input id="time-steps" type="range" min="10" max="500" value="252" step="1">
          </div>

          <div>
            <label>期权类型:</label>
            <select id="option-type">
              <option value="call">
                浮动执行看涨 (Floating Strike Call)
              </option>
              <option value="put">
                浮动执行看跌 (Floating Strike Put)
              </option>
              <option value="fixed-call">
                固定执行看涨 (Fixed Strike Call)
              </option>
              <option value="fixed-put">
                固定执行看跌 (Fixed Strike Put)
              </option>
            </select>
          </div>

          <div>
            <label>回望类型:</label>
            <select id="lookback-type">
              <option value="continuous">
                连续监测
              </option>
              <option value="discrete">
                离散监测
              </option>
            </select>
          </div>

          <div id="fixed-strike-container" style="display:none;">
            <label for="K">执行价格 (K): <span id="K-value">100</span></label>
            <input id="K" type="range" min="50" max="150" value="100" step="1">
          </div>

          <button id="calculate-btn">
            计算期权价格
          </button>
          <div id="loading" class="loading">
            计算中，请稍候...
          </div>
        </div>
      </div>
      <div class="info">
        <h4>关于回望期权:</h4>
        <p>回望期权的收益取决于标的资产在期权有效期内的最高或最低价格。</p>
        <p><strong>浮动执行</strong>期权: 执行价格等于期内最优价格</p>
        <p><strong>固定执行</strong>期权: 执行价格固定，但使用期内最优价格计算收益</p>
        <p>连续监测理论上更精确，但离散监测更接近实际交易情况。</p>
      </div>
      <div class="chart-container">
        <div id="paths-chart" style="height: 400px;" />
        <div id="extrema-chart" style="height: 400px;" />
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<head>
<title>回望期权定价 - 蒙特卡洛模拟</title>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<style>
  body {
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
    line-height: 1.6;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .control-panel {
    flex: 1;
    min-width: 300px;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .chart-container {
    flex: 2;
    min-width: 600px;
  }
  h1 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    text-align: center;
  }
  .slider-container {
    margin-bottom: 15px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input[type="range"] {
    width: 100%;
    margin-bottom: 5px;
  }
  .value-display {
    font-size: 0.9em;
    color: #6c757d;
    text-align: right;
  }
  .results {
    background: #e8f4f8;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th, td {
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid #dee2e6;
  }
  th {
    background-color: #3498db;
    color: white;
  }
  button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    width: 100%;
  }
  button:hover {
    background-color: #2980b9;
  }
  .loading {
    text-align: center;
    padding: 10px;
    color: #3498db;
    display: none;
  }
  .info {
    background-color: #e7f5fe;
    padding: 10px;
    border-radius: 4px;
    margin-top: 20px;
    font-size: 0.9em;
  }
</style>
</head>
