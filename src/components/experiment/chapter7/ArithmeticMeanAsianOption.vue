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
            <td id="price">-</td>
          </tr>
          <tr>
            <td>标准误差</td>
            <td id="stderr">-</td>
          </tr>
          <tr>
            <td>计算时间</td>
            <td id="calc-time">-</td>
          </tr>
        </table>
      </div>

      <div class="info">
        <h4>关于亚式期权:</h4>
        <p>亚式期权的收益取决于标的资产在期权有效期内的平均价格(而非到期价格)。</p>
        <p><strong>算术平均</strong>亚式期权没有解析解，必须使用数值方法(如蒙特卡洛)定价。</p>
        <p><strong>几何平均</strong>亚式期权有解析解，可作为算术平均期权的控制变量。</p>
      </div>

      <div class="chart-container">
        <div id="paths-chart" style="height: 400px;"></div>
        <div id="histogram-chart" style="height: 400px;"></div>
      </div>

    </template>
    <template #parameter>
      <h1>亚式期权定价 - 蒙特卡洛模拟 (算术平均)</h1>

      <div class="container">
        <div class="control-panel">
          <h2>参数设置</h2>

          <div class="slider-container">
            <label for="S0">初始价格 (S₀): <span id="S0-value">100</span></label>
            <input type="range" id="S0" min="50" max="150" value="100" step="1">
          </div>

          <div class="slider-container">
            <label for="K">执行价格 (K): <span id="K-value">100</span></label>
            <input type="range" id="K" min="50" max="150" value="100" step="1">
          </div>

          <div class="slider-container">
            <label for="T">到期时间 (T, 年): <span id="T-value">1.0</span></label>
            <input type="range" id="T" min="0.1" max="3" value="1.0" step="0.1">
          </div>

          <div class="slider-container">
            <label for="r">无风险利率 (r): <span id="r-value">0.05</span></label>
            <input type="range" id="r" min="0" max="0.2" value="0.05" step="0.01">
          </div>

          <div class="slider-container">
            <label for="sigma">波动率 (σ): <span id="sigma-value">0.2</span></label>
            <input type="range" id="sigma" min="0.1" max="0.5" value="0.2" step="0.01">
          </div>

          <div class="slider-container">
            <label for="simulations">模拟路径数: <span id="simulations-value">10000</span></label>
            <input type="range" id="simulations" min="1000" max="50000" value="10000" step="1000">
          </div>

          <div class="slider-container">
            <label for="time-steps">时间步数: <span id="time-steps-value">252</span></label>
            <input type="range" id="time-steps" min="10" max="500" value="252" step="1">
          </div>

          <div>
            <label>期权类型:</label>
            <select id="option-type">
              <option value="call">看涨 (Call)</option>
              <option value="put">看跌 (Put)</option>
            </select>
          </div>

          <div>
            <label>平均类型:</label>
            <select id="average-type">
              <option value="arithmetic">算术平均</option>
              <option value="geometric">几何平均</option>
            </select>
          </div>

          <button id="calculate-btn">计算期权价格</button>
          <div id="loading" class="loading">计算中，请稍候...</div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div  class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>

</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';
import { ref } from 'vue';

const content = ref(`
## **障碍期权定价：蒙特卡洛模拟**

障碍期权是一种具有“触发条件”的衍生品，其支付取决于标的资产价格是否触及或超过某个特定的障碍水平。与普通的欧式期权不同，障碍期权在到期时只有在标的资产的价格经过某个特定价格点时才会激活，这使得其定价变得更加复杂。为了计算这种期权的价格，常用的方法之一是**蒙特卡洛模拟**。

**核心思想：**

障碍期权赋予持有者在期权到期时，依据标的资产价格是否触及预设的障碍（如上障碍或下障碍）来决定是否生效。如果触及了障碍，期权才会具有价值。蒙特卡洛模拟通过大量的随机路径模拟，来估算这种期权的价格。

**蒙特卡洛模拟在障碍期权定价中的应用：**

蒙特卡洛模拟是一种基于随机抽样的数值方法，它通过模拟标的资产价格的多条可能路径，计算期权的平均回报。对于障碍期权而言，蒙特卡洛模拟的步骤包括以下几个关键要素：

1. **标的资产当前价格 (S)：** 期权的标的资产的当前市场价格。
2. **障碍水平 (H)：** 触发期权生效的价格水平。例如，上障碍期权要求标的资产价格突破上方的某一水平才能激活。
3. **行权价格 (K)：** 在期权激活的情况下，期权的执行价格。
4. **到期时间 (T)：** 距离期权到期的剩余时间。
5. **无风险利率 (r)：** 无风险资产的利率，用于折现未来现金流。
6. **波动率 (\\$\\sigma\\$)：** 标的资产价格的波动性，通常使用历史波动率或隐含波动率来估算。

**模型假设：**

蒙特卡洛模拟虽然并不需要严格的理论假设，但在障碍期权定价中，一些假设通常会被采用：

* 标的资产价格遵循几何布朗运动（GBM）。
* 市场没有摩擦（无交易成本、无税收）。
* 无套利机会，投资者能够自由地借入和贷出资金。

**定价方法（简化步骤）：**

1. **模拟路径：** 使用几何布朗运动（GBM）模型，根据历史数据和波动率生成多个标的资产价格路径。
2. **检查障碍条件：** 对每一条模拟路径，检查标的资产价格是否触及障碍水平。如果触及障碍，则期权生效。
3. **计算回报：** 如果期权生效，计算期权的回报（例如，差价 \\$S\\_T - K\\$，其中 \\$S\\_T\\$ 是期权到期时的标的资产价格）。
4. **折现回报：** 将每一条路径的回报折现到当前时刻，得到期权的现值。
5. **取平均值：** 对所有模拟路径的现值取平均，得到期权的最终定价。

**定价公式（通过模拟实现）：**

障碍期权的价格可以通过以下方式来估算：

$C = e^{-rT} \\times \\frac{1}{N} \\sum_{i=1}^{N} \\text{Payoff}_i$

其中，\\$\\text{Payoff}\\_i\\$ 是第 \\$i\\$ 条路径的回报，\\$N\\$ 是模拟的路径总数。

**直观理解：**

* 通过蒙特卡洛模拟，我们可以模拟多条可能的资产价格路径，并根据这些路径计算期权的回报。
* 对于障碍期权，关键在于路径是否触及障碍水平，这决定了期权是否激活以及它的支付额。
* 通过大量模拟路径，我们可以得到期权价格的一个近似值。

**重要性：**

障碍期权的定价通常非常复杂，传统的解析方法（如布莱克-斯科尔斯模型）无法有效应对。蒙特卡洛模拟为这一类期权的定价提供了灵活且强大的工具。尽管蒙特卡洛模拟需要大量的计算资源，但其可以处理各种不同类型的障碍期权，并适应不同的市场条件和假设，因此在金融工程中得到了广泛应用。

`)

// 初始化参数
let params = {
  S0: 100,
  K: 100,
  T: 1.0,
  r: 0.05,
  sigma: 0.2,
  simulations: 10000,
  timeSteps: 252,
  optionType: 'call',
  averageType: 'arithmetic',
};

// 绑定滑块事件
document.querySelectorAll('input[type="range"], select').forEach((element) => {
  element.addEventListener('input', function () {
    const id = this.id;
    const value = this.type === 'range' ? Number.parseFloat(this.value) : this.value;
    params[id] = value;
    if (this.type === 'range') {
      document.getElementById(`${id}-value`).textContent =
          ['r', 'sigma'].includes(id) ? value.toFixed(2) : value;
    }
  });
});

// 计算按钮事件
document.getElementById('calculate-btn').addEventListener('click', function() {
  calculateOptionPrice();
});

// 蒙特卡洛模拟计算
function calculateOptionPrice() {
  const startTime = performance.now();
  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';

  // 使用setTimeout让UI有机会更新加载状态
  setTimeout(() => {
    const { S0, K, T, r, sigma, simulations, timeSteps, optionType, averageType } = params;

    const dt = T / timeSteps;
    const discount = Math.exp(-r * T);

    // 生成随机数 (使用Box-Muller变换)
    const z = generateRandomNormals(simulations * timeSteps);

    // 计算价格路径和平均值
    const paths = Array.from({length: simulations});
    const averages = Array.from({length: simulations});
    const payoffs = Array.from({length: simulations});

    for (let i = 0; i < simulations; i++) {
      paths[i] = Array.from({length: timeSteps + 1});
      paths[i][0] = S0;

      // 计算路径
      for (let j = 1; j <= timeSteps; j++) {
        const idx = i * timeSteps + (j - 1);
        paths[i][j] = paths[i][j - 1] * Math.exp(
            (r - 0.5 * sigma * sigma) * dt +
            sigma * Math.sqrt(dt) * z[idx]
        );
      }

      // 计算平均值
      if (averageType === 'arithmetic') {
        // 算术平均
        let sum = 0;
        for (let j = 1; j <= timeSteps; j++) {
          sum += paths[i][j];
        }
        averages[i] = sum / timeSteps;
      } else {
        // 几何平均
        let product = 1;
        for (let j = 1; j <= timeSteps; j++) {
          product *= paths[i][j];
        }
        averages[i] = product**(1 / timeSteps);
      }

      // 计算收益
      if (optionType === 'call') {
        payoffs[i] = Math.max(averages[i] - K, 0);
      } else {
        payoffs[i] = Math.max(K - averages[i], 0);
      }
    }

    // 计算统计量
    const price = discount * mean(payoffs);
    const stderr = discount * std(payoffs) / Math.sqrt(simulations);

    // 更新结果显示
    document.getElementById('price').textContent = price.toFixed(4);
    document.getElementById('stderr').textContent = stderr.toFixed(6);

    const endTime = performance.now();
    document.getElementById('calc-time').textContent =
        `${((endTime - startTime) / 1000).toFixed(2)}秒`;

    // 更新图表
    updateCharts(paths, averages);

    loadingElement.style.display = 'none';
  }, 10);
}

// 生成正态分布随机数 (Box-Muller变换)
function generateRandomNormals(n) {
  const randoms = Array.from({length: n});
  for (let i = 0; i < n; i += 2) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    randoms[i] = z0;
    if (i + 1 < n) randoms[i + 1] = z1;
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
function updateCharts(paths, averages) {
  const { timeSteps, T } = params;
  const timePoints = Array.from({length: timeSteps + 1}, (_, i) => i * T / timeSteps);

  // 选择部分路径显示 (最多20条)
  const displayPaths = Math.min(20, paths.length);
  const pathTraces = [];

  for (let i = 0; i < displayPaths; i++) {
    pathTraces.push({
      x: timePoints,
      y: paths[i],
      type: 'line',
      line: {color: 'rgba(0, 128, 255, 0.5)', width: 1},
      showlegend: false,
      hoverinfo: 'none',
    });
  }

  // 添加平均价格线
  pathTraces.push({
    x: timePoints,
    y: Array.from({length: timeSteps + 1}).fill(averages[0]),
    mode: 'lines',
    line: {color: 'red', width: 2},
    name: '平均价格',
  });

  // 绘制价格路径图
  Plotly.newPlot('paths-chart', pathTraces, {
    title: '蒙特卡洛模拟路径及平均价格',
    xaxis: {title: '时间 (年)'},
    yaxis: {title: '标的资产价格'},
    margin: {t: 40, l: 50, r: 30, b: 50},
    showlegend: true
  });

  // 绘制平均价格直方图
  const histogramTrace = {
    x: averages,
    type: 'histogram',
    marker: { color: 'rgba(100, 200, 100, 0.7)' },
    name: '平均价格分布',
  };

  // 添加执行价格线
  const shapes = [{
    type: 'line',
    x0: params.K,
    y0: 0,
    x1: params.K,
    y1: 1,
    yref: 'paper',
    line: { color: 'red', width: 2, dash: 'dash' }
  }];

  Plotly.newPlot('histogram-chart', [histogramTrace], {
    title: '平均价格分布',
    xaxis: {title: '平均价格'},
    yaxis: {title: '频数'},
    margin: {t: 40, l: 50, r: 30, b: 50},
    shapes: shapes
  });
}

// 初始化计算
calculateOptionPrice();
</script>
<title>亚式期权定价 - 蒙特卡洛模拟</title>
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

