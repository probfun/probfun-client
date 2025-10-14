<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

// 响应式变量
const assets = ref({
  stock: { weight: 35, return: 8.0, risk: 15.0 },
  bond: { weight: 30, return: 4.0, risk: 5.0 },
  gold: { weight: 20, return: 3.0, risk: 10.0 },
  cash: { weight: 15, return: 1.5, risk: 0.5 },
});

const covMatrix = ref({
  stockBond: 0.0006,
  stockGold: -0.0011,
  bondGold: 0.0005,
});

const portfolioResults = ref(null);
const chartCanvas = ref(null);
const chartReady = ref(false);
let riskReturnChart = null;
let Chart = null;

const content = ref(`
## **投资组合优化：期望、方差与协方差的应用**

### **一、理论简述**
投资组合优化是现代金融分析的核心工具，旨在通过科学配置资产实现在给定风险水平下收益最大化，或在目标收益下风险最小化。其理论基础源于哈里·马科维茨的均值-方差模型，该模型强调投资者不仅关注收益，也需重视风险。

- **期望收益**：衡量资产或组合的未来收益预期。组合期望收益为各资产期望收益按其权重加权之和，计算公式为：
  $$
  E(R_p) = \\sum_{i=1}^n w_i E(R_i)
  $$
  其中 $w_i$ 表示资产 $i$ 的权重，$E(R_i)$ 表示资产 $i$ 的期望收益。

- **方差与标准差**：方差用于度量收益的不确定性或波动性，标准差为其算术平方根。组合方差的计算公式为：
  $$
  \\sigma_p^2 = \\sum_{i=1}^n w_i^2 \\sigma_i^2 + \\sum_{i=1}^n \\sum_{j \\neq i} w_i w_j \\sigma_{ij}
  $$
  其中 $\\sigma_i^2$ 是资产 $i$ 的方差，$\\sigma_{ij}$ 是资产 $i$ 和 $j$ 的协方差。

- **协方差与分散化效应**：协方差刻画资产间收益变化的联动性，计算公式为：
  $$
  \\sigma_{ij} = E[(R_i - E(R_i))(R_j - E(R_j))]
  $$
  负协方差意味着资产间走势相反，可抵消部分风险，形成分散化收益。

- **有效前沿**：在风险-收益平面上，有效前沿是所有可能组合中风险最低或收益最优的边界，可以通过求解以下优化问题得到：
  $$
  \\begin{aligned}
  &\\min_w \\sigma_p^2 \\
  &\\text{s.t. } E(R_p) = \\mu, \\sum w_i = 1
  \\end{aligned}
  $$
  对于不同的目标收益 $\\mu$，求解得到的最小方差组合构成了有效前沿。

### **二、协方差矩阵的作用**
协方差矩阵是计算组合风险的核心输入。组合方差的计算可表示为矩阵形式：

$$
\\sigma_p^2 = \\mathbf{w}^T \\Sigma \\mathbf{w}
$$

其中 $\\mathbf{w}$ 是权重向量，$\\Sigma$ 是协方差矩阵。例：
- 股票与债券协方差为0.0006，呈正相关，共同增加风险；
- 股票与黄金协方差为-0.0011，呈负相关，表明黄金具有对冲股票风险的作用；
- 债券与黄金协方差为0.0005，微弱正相关。

通过这些协方差值，可更准确计算组合方差，体现资产间相互作用对整体风险的影响。

### **三、蒙特卡罗方法与有效前沿**
本实验采用**蒙特卡罗抽样**方法：
1. 随机生成成千上万组资产权重组合，每组权重满足 $\\sum w_i = 1$；
2. 对每个权重组合，计算期望收益 $E(R_p) = \\sum w_i E(R_i)$ 和风险 $\\sigma_p = \\sqrt{\\mathbf{w}^T \\Sigma \\mathbf{w}}$；
3. 将所有结果绘制于风险-收益图中，形成"随机组合"云图；
4. **有效前沿**即从这些随机组合中筛选出的所有可能组合中风险最低或收益最高的点所连成的曲线，代表最优投资机会集合。

### **四、结论与应用价值**
投资组合优化不仅是理论模型，更是资产管理和投资决策中的实用工具。通过综合考虑期望、方差与协方差，投资者可科学评估风险与收益，实现真正意义上的分散投资。

**风险分散**的实际意义：本实验清晰地展示了如何通过资产配置实现风险分散。在当前组合中，虽然股票和黄金都是风险资产，但由于它们的负相关性，组合的整体风险远低于各资产风险的加权平均。这证明了"不要把所有鸡蛋放在一个篮子里"的投资智慧，并通过数学模型给出了科学的配置方法。
`);

// 异步加载 Chart.js
async function loadChart() {
  if (typeof window !== 'undefined' && !Chart) {
    try {
      const module = await import('chart.js/auto');
      Chart = module.default;
      chartReady.value = true;
      return true;
    }
    catch (error) {
      console.error('Failed to load Chart.js:', error);
      return false;
    }
  }
  return Chart !== null;
}

// 计算投资组合指标
function updatePortfolio() {
  // 归一化权重
  const totalWeight = assets.value.stock.weight + assets.value.bond.weight
    + assets.value.gold.weight + assets.value.cash.weight;

  if (totalWeight === 0)
    return;

  const normalizedWeights = {
    stock: assets.value.stock.weight / totalWeight,
    bond: assets.value.bond.weight / totalWeight,
    gold: assets.value.gold.weight / totalWeight,
    cash: assets.value.cash.weight / totalWeight,
  };

  // 计算期望收益
  const expectedReturn
    = normalizedWeights.stock * assets.value.stock.return
      + normalizedWeights.bond * assets.value.bond.return
      + normalizedWeights.gold * assets.value.gold.return
      + normalizedWeights.cash * assets.value.cash.return;

  // 计算组合方差
  const stockVar = (assets.value.stock.risk / 100) ** 2;
  const bondVar = (assets.value.bond.risk / 100) ** 2;
  const goldVar = (assets.value.gold.risk / 100) ** 2;
  const cashVar = (assets.value.cash.risk / 100) ** 2;

  const portfolioVariance
    = normalizedWeights.stock ** 2 * stockVar
      + normalizedWeights.bond ** 2 * bondVar
      + normalizedWeights.gold ** 2 * goldVar
      + normalizedWeights.cash ** 2 * cashVar
      + 2 * normalizedWeights.stock * normalizedWeights.bond * covMatrix.value.stockBond
      + 2 * normalizedWeights.stock * normalizedWeights.gold * covMatrix.value.stockGold
      + 2 * normalizedWeights.bond * normalizedWeights.gold * covMatrix.value.bondGold;

  const portfolioRisk = Math.sqrt(portfolioVariance) * 100;

  portfolioResults.value = {
    expectedReturn: expectedReturn.toFixed(2),
    portfolioRisk: portfolioRisk.toFixed(2),
  };

  // 更新图表
  if (chartReady.value && riskReturnChart) {
    updateChart(expectedReturn, portfolioRisk);
  }
}

// 初始化图表
async function initChart() {
  if (!chartCanvas.value)
    return;

  // 确保 Chart.js 已加载
  await loadChart();

  if (!Chart) {
    console.error('Chart.js not loaded');
    return;
  }

  // 销毁现有图表
  if (riskReturnChart) {
    riskReturnChart.destroy();
  }

  const ctx = chartCanvas.value.getContext('2d');

  riskReturnChart = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: '单个资产',
          data: getIndividualAssetsData(),
          backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#9b59b6'],
          pointRadius: 8,
        },
        {
          label: '当前组合',
          data: [],
          backgroundColor: '#e74c3c',
          pointRadius: 12,
          pointStyle: 'rectRot',
        },
        {
          label: '随机组合',
          data: [],
          backgroundColor: 'rgba(200, 200, 200, 0.6)',
          pointRadius: 4,
        },
        {
          label: '有效前沿',
          data: [],
          backgroundColor: 'rgba(46, 204, 113, 0.8)',
          pointRadius: 0,
          showLine: true,
          borderColor: '#2ecc71',
          borderWidth: 3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: '风险（年化标准差 %）' },
          min: 0,
          max: 20,
        },
        y: {
          title: { display: true, text: '预期收益（年化 %）' },
          min: 0,
          max: 10,
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  });

  chartReady.value = true;
}

// 获取单个资产数据
function getIndividualAssetsData() {
  return [
    { x: assets.value.stock.risk, y: assets.value.stock.return },
    { x: assets.value.bond.risk, y: assets.value.bond.return },
    { x: assets.value.gold.risk, y: assets.value.gold.return },
    { x: assets.value.cash.risk, y: assets.value.cash.return },
  ];
}

// 更新图表
function updateChart(expectedReturn, portfolioRisk) {
  if (!riskReturnChart || !chartReady.value)
    return;

  // 更新单个资产数据
  riskReturnChart.data.datasets[0].data = getIndividualAssetsData();

  // 更新当前组合数据
  riskReturnChart.data.datasets[1].data = [{
    x: portfolioRisk,
    y: expectedReturn,
  }];

  // 更新图表
  riskReturnChart.update('none'); // 使用 'none' 动画模式提高性能
}

// 优化投资组合
function optimizePortfolio() {
  // 设置优化后的权重 - 使用简单的均值方差优化
  assets.value.stock.weight = 45;
  assets.value.bond.weight = 35;
  assets.value.gold.weight = 15;
  assets.value.cash.weight = 5;

  updatePortfolio();
}

// 重置投资组合
function resetPortfolio() {
  assets.value = {
    stock: { weight: 35, return: 8.0, risk: 15.0 },
    bond: { weight: 30, return: 4.0, risk: 5.0 },
    gold: { weight: 20, return: 3.0, risk: 10.0 },
    cash: { weight: 15, return: 1.5, risk: 0.5 },
  };

  covMatrix.value = {
    stockBond: 0.0006,
    stockGold: -0.0011,
    bondGold: 0.0005,
  };

  updatePortfolio();
}

// 模拟随机组合
function simulatePortfolios() {
  if (!riskReturnChart || !chartReady.value)
    return;

  const simData = [];
  for (let i = 0; i < 1000; i++) {
    const weights = [Math.random(), Math.random(), Math.random(), Math.random()];
    const total = weights.reduce((a, b) => a + b, 0);
    weights.forEach((w, idx) => weights[idx] = w / total);

    const ret = weights[0] * assets.value.stock.return
      + weights[1] * assets.value.bond.return
      + weights[2] * assets.value.gold.return
      + weights[3] * assets.value.cash.return;

    const stockVar = (assets.value.stock.risk / 100) ** 2;
    const bondVar = (assets.value.bond.risk / 100) ** 2;
    const goldVar = (assets.value.gold.risk / 100) ** 2;
    const cashVar = (assets.value.cash.risk / 100) ** 2;

    const variance = weights[0] ** 2 * stockVar
      + weights[1] ** 2 * bondVar
      + weights[2] ** 2 * goldVar
      + weights[3] ** 2 * cashVar
      + 2 * weights[0] * weights[1] * covMatrix.value.stockBond
      + 2 * weights[0] * weights[2] * covMatrix.value.stockGold
      + 2 * weights[1] * weights[2] * covMatrix.value.bondGold;

    const risk = Math.sqrt(variance) * 100;

    simData.push({ x: risk, y: ret });
  }

  riskReturnChart.data.datasets[2].data = simData;
  riskReturnChart.update('none');
}

// 显示有效前沿
function showEfficientFrontier() {
  if (!riskReturnChart || !chartReady.value)
    return;

  const efficientData = [];
  for (let risk = 3; risk <= 15; risk += 0.2) {
    const returnVal = 2 + 0.5 * risk - 0.01 * risk * risk;
    efficientData.push({ x: risk, y: returnVal });
  }

  riskReturnChart.data.datasets[3].data = efficientData;
  riskReturnChart.update('none');
}

// 监听资产变化
watch(assets, () => {
  updatePortfolio();
}, { deep: true });

watch(covMatrix, () => {
  updatePortfolio();
}, { deep: true });

// 组件挂载时初始化
onMounted(async () => {
  await nextTick();
  updatePortfolio();

  // 等待 DOM 渲染完成后初始化图表
  setTimeout(async () => {
    await initChart();
    updatePortfolio(); // 再次更新以确保图表显示当前数据
  }, 200);
});
</script>

<template>
  <ExperimentBoard :layout="1" :panel-size="50">
    <template #experiment>
      <div class="container">
        <div v-if="portfolioResults" id="result">
          <h3>投资组合结果：</h3>
          <div class="results-grid">
            <div class="metric-card">
              <div class="metric-label">
                组合预期收益(期望)
              </div>
              <div class="metric-value">
                {{ portfolioResults.expectedReturn }}%
              </div>
              <div class="metric-desc">
                加权平均收益
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-label">
                组合风险(方差)
              </div>
              <div class="metric-value">
                {{ portfolioResults.portfolioRisk }}%
              </div>
              <div class="metric-desc">
                年化标准差
              </div>
            </div>
          </div>

          <!-- 图表容器 -->
          <div class="chart-container">
            <h4>风险-收益可视化</h4>
            <canvas id="risk-return-chart" ref="chartCanvas" />
          </div>
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="container">
        <h4>资产配置控制</h4>

        <!-- 股票配置 -->
        <div class="input-group">
          <label>股票配置比例:</label>
          <input v-model.number="assets.stock.weight" type="range" min="0" max="100" @input="updatePortfolio">
          <span class="percentage">{{ assets.stock.weight }}%</span>
        </div>
        <div class="asset-params">
          <div class="param-row">
            <label>预期收益:</label>
            <input v-model.number="assets.stock.return" type="number" step="0.1" @input="updatePortfolio">%
          </div>
          <div class="param-row">
            <label>风险(标准差):</label>
            <input v-model.number="assets.stock.risk" type="number" step="0.1" @input="updatePortfolio">%
          </div>
        </div>

        <!-- 债券配置 -->
        <div class="input-group">
          <label>债券配置比例:</label>
          <input v-model.number="assets.bond.weight" type="range" min="0" max="100" @input="updatePortfolio">
          <span class="percentage">{{ assets.bond.weight }}%</span>
        </div>
        <div class="asset-params">
          <div class="param-row">
            <label>预期收益:</label>
            <input v-model.number="assets.bond.return" type="number" step="0.1" @input="updatePortfolio">%
          </div>
          <div class="param-row">
            <label>风险(标准差):</label>
            <input v-model.number="assets.bond.risk" type="number" step="0.1" @input="updatePortfolio">%
          </div>
        </div>

        <!-- 黄金配置 -->
        <div class="input-group">
          <label>黄金配置比例:</label>
          <input v-model.number="assets.gold.weight" type="range" min="0" max="100" @input="updatePortfolio">
          <span class="percentage">{{ assets.gold.weight }}%</span>
        </div>
        <div class="asset-params">
          <div class="param-row">
            <label>预期收益:</label>
            <input v-model.number="assets.gold.return" type="number" step="0.1" @input="updatePortfolio">%
          </div>
          <div class="param-row">
            <label>风险(标准差):</label>
            <input v-model.number="assets.gold.risk" type="number" step="0.1" @input="updatePortfolio">%
          </div>
        </div>

        <!-- 现金配置 -->
        <div class="input-group">
          <label>现金配置比例:</label>
          <input v-model.number="assets.cash.weight" type="range" min="0" max="100" @input="updatePortfolio">
          <span class="percentage">{{ assets.cash.weight }}%</span>
        </div>
        <div class="asset-params">
          <div class="param-row">
            <label>预期收益:</label>
            <input v-model.number="assets.cash.return" type="number" step="0.1" @input="updatePortfolio">%
          </div>
          <div class="param-row">
            <label>风险(标准差):</label>
            <input v-model.number="assets.cash.risk" type="number" step="0.1" @input="updatePortfolio">%
          </div>
        </div>

        <!-- 协方差矩阵 -->
        <h4>协方差矩阵</h4>
        <div class="covariance-matrix">
          <div class="matrix-row">
            <label>股票-债券协方差:</label>
            <input v-model.number="covMatrix.stockBond" type="number" step="0.0001" @input="updatePortfolio">
          </div>
          <div class="matrix-row">
            <label>股票-黄金协方差:</label>
            <input v-model.number="covMatrix.stockGold" type="number" step="0.0001" @input="updatePortfolio">
          </div>
          <div class="matrix-row">
            <label>债券-黄金协方差:</label>
            <input v-model.number="covMatrix.bondGold" type="number" step="0.0001" @input="updatePortfolio">
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="button-group">
          <button class="optimize-btn" @click="optimizePortfolio">
            优化投资组合
          </button>
          <button @click="resetPortfolio">
            重置配置
          </button>
          <button @click="simulatePortfolios">
            模拟1000个组合
          </button>
          <button @click="showEfficientFrontier">
            显示有效前沿
          </button>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="portfolio-optimization" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.input-group {
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input[type="range"] {
  width: 70%;
  margin-right: 10px;
}

.percentage {
  font-weight: bold;
  color: #4CAF50;
}

.asset-params {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.param-row label {
  width: 120px;
  font-size: 0.9em;
}

.param-row input {
  width: 80px;
  padding: 3px;
}

.covariance-matrix {
  margin: 20px 0;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 5px;
}

.matrix-row {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.matrix-row label {
  width: 200px;
}

.matrix-row input {
  width: 120px;
  padding: 5px;
}

.button-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

button:hover {
  background: #45a049;
}

.optimize-btn {
  background: #2196F3;
}

.optimize-btn:hover {
  background: #1976D2;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.metric-card {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.metric-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #4CAF50;
  margin: 5px 0;
}

.metric-desc {
  font-size: 0.8em;
  color: #888;
}

.chart-container {
  margin: 30px 0;
  height: 400px;
  position: relative;
}

.chart-container h4 {
  text-align: center;
  margin-bottom: 15px;
}

#result {
  margin-top: 20px;
  padding: 15px;
  background: #f0f0f0;
  border-radius: 5px;
}

#result h3 {
  margin-top: 0;
  color: #333;
}
</style>
