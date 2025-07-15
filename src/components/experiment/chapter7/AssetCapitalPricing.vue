<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

const content = ref(`
## **资本资产定价模型（CAPM）期望回报率计算器**
股票期望回报率（Expected Rate of Return on a Stock）是**投资者对未来持有某只股票所能获得的平均收益的预测**。它是一个概率加权平均值，考虑了所有可能的回报情况及其发生的可能性。

**核心思想：**

期望回报率是一个前瞻性的概念，不是实际已经发生的回报。它试图回答：**“如果我对这只股票的未来表现做出最合理的估计，我平均能赚多少钱？”**

**计算方法：**

最直观的计算方法是：

$E(R) = \\sum_{i=1}^{n} (P_i \\times R_i)$

其中：
* $E(R)$: 股票的期望回报率。
* $P_i$: 第 $i$ 种可能的回报情况发生的概率。
* $R_i$: 第 $i$ 种可能的回报情况对应的回报率。
* $n$: 可能回报情况的总数。

**例子：**

假设你分析一只股票，认为它有三种可能的未来表现：

* **情况 1：** 经济强劲，股价上涨 20%，概率为 30% (0.3)。
* **情况 2：** 经济平稳，股价上涨 5%，概率为 50% (0.5)。
* **情况 3：** 经济衰退，股价下跌 10%，概率为 20% (0.2)。

那么这只股票的期望回报率就是：

$E(R) = (0.3 \\times 0.20) + (0.5 \\times 0.05) + (0.2 \\times -0.10)$
$E(R) = 0.06 + 0.025 - 0.02$
$E(R) = 0.065 \\text{ 或 } 6.5\\%$

这意味着，根据你的预测和对各种情况的概率估计，这只股票的平均预期回报是 6.5%。

**在实践中，期望回报率的确定更复杂，通常会用到：**

* **历史数据：** 分析过去的回报率，但要认识到历史不代表未来。
* **基本面分析：** 公司盈利增长、行业前景、管理层能力等。
* **宏观经济因素：** GDP 增长、利率、通货膨胀等。
* **风险调整模型：** 例如，**资本资产定价模型 (CAPM)** 是一种常用的计算期望回报率的模型，它将风险考虑在内，认为股票的期望回报率应等于无风险利率加上一个风险溢价，而风险溢价与该股票的系统性风险（$\\beta$ 值）有关。
    * CAPM 公式：$E(R_i) = R_f + \\beta_i \\times (E(R_m) - R_f)$
        * $R_f$: 无风险利率
        * $\\beta_i$: 股票 $i$ 的贝塔系数
        * $E(R_m)$: 市场组合的期望回报率

**重要性：**

* **投资决策：** 投资者会比较不同股票的期望回报率，以及其承担的风险，来做出投资决策。
* **估值：** 在股票估值模型（如股利折现模型）中，期望回报率常被用作折现率。
* **风险管理：** 结合期望回报率和风险（如标准差），可以评估投资的风险收益比。

**总结来说，股票期望回报率就是你对一只股票未来平均能赚多少钱的“最可能”的估计，它是一个在不确定性下进行决策的重要参考指标。**
`);

// 使用 ref 定义响应式数据
const riskFreeRatePercentage = ref(null);
const marketReturnPercentage = ref(null);
const betaValue = ref(null);
const result = ref('');
const calculatedExpectedReturn = ref(null);

// 计算期望回报率的方法
function calculateExpectedReturn() {
  // 将百分比转换为小数
  const riskFreeRate = riskFreeRatePercentage.value / 100;
  const marketReturn = marketReturnPercentage.value / 100;
  const beta = betaValue.value;

  // 检查输入是否有效
  if (Number.isNaN(riskFreeRate) || Number.isNaN(marketReturn) || Number.isNaN(beta)) {
    result.value = '请输入有效的无风险利率、市场回报率和贝塔值。';
    calculatedExpectedReturn.value = null;
    return;
  }

  // 使用 CAPM 公式计算期望回报率
  const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
  calculatedExpectedReturn.value = expectedReturn * 100;
  result.value = `期望回报率：${calculatedExpectedReturn.value.toFixed(2)}%`;
}
</script>

<template>
  <ExperimentBoard :panel-size="20">
    <template #experiment>
      <div v-if="calculatedExpectedReturn !== null">
        <strong>计算结果分析：</strong>
        <p>根据输入的参数，该股票的期望回报率为 {{ calculatedExpectedReturn.toFixed(2) }}%。</p>
        <p>这个期望回报率是投资者在承担了该股票的系统性风险（市场风险）后，预期能够获得的补偿。</p>
      </div>
      <div v-else>
        请先输入参数并计算。
      </div>
    </template>
    <template #parameter>
      <label for="riskFreeRate">无风险利率（%）：</label>
      <input id="riskFreeRate" v-model.number="riskFreeRatePercentage" type="number" placeholder="例如：2">

      <label for="marketReturn">市场回报率（%）：</label>
      <input id="marketReturn" v-model.number="marketReturnPercentage" type="number" placeholder="例如：8">

      <label for="beta">股票贝塔值：</label>
      <input id="beta" v-model.number="betaValue" type="number" placeholder="例如：1.2">

      <button @click="calculateExpectedReturn">
        计算期望回报率
      </button>

      <div v-if="result !== ''" class="result">
        {{ result }}
      </div>
      <div v-else class="result">
&nbsp;
      </div>
      <div>
        <strong>参数说明：</strong>
        <ul>
          <li><strong>无风险利率：</strong> 指的是理论上没有任何风险的投资所能获得的回报率，通常以短期国债利率作为参考。</li>
          <li><strong>市场回报率：</strong> 指的是整个市场投资组合的预期回报率，例如股票市场指数的长期平均回报率。</li>
          <li
            v-html="'<strong>贝塔值（β）：</strong> 衡量个别股票相对于整个市场波动性的指标。β > 1 表示股票波动性高于市场，β < 1 表示波动性低于市场，β = 1 表示与市场波动性相同。'"
          />
        </ul>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="capm-calculator" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
h1 {
    font-size: 1.5em;
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 8px;
}

input {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;
}

button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

.result {
    margin-top: 20px;
    font-size: 1.2em;
    font-weight: bold;
}

.parameter-info {
    margin-top: 20px;
    font-size: 0.9em;
    color: #555;
}

.parameter-info strong {
    display: block;
    margin-bottom: 5px;
}

.parameter-info ul {
    padding-left: 20px;
}

.conclusion-info {
    margin-top: 20px;
}

.conclusion-info strong {
    display: block;
    margin-bottom: 5px;
}
</style>
