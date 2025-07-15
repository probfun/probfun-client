<script setup>
import { ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { toMarkdown } from '@/utils/markdown';

// 响应式变量
const S0 = ref(50);
const K = ref(50);
const r = ref(0.05);
const T = ref(1);
const N = ref(3);
const sigma = ref(0.3);
const q = ref(0.0);
const result = ref(null);

const content = ref(`
## **美式看跌期权定价**
美式看涨期权定价，与欧式看涨期权定价的核心区别在于一个关键特性：**美式期权可以在到期日或到期日之前的任何时间行权**。这个“提前行权”的权利使得美式期权的定价变得更加复杂。

**核心思想：**

* **额外价值：** 美式看涨期权比欧式看涨期权多了一个“灵活行权”的权利。理论上，这个权利会使美式看涨期权的价值**不低于**相同条款的欧式看涨期权。
* **“最优行权时机”问题：** 定价美式期权的关键在于找到一个策略，决定何时行权才能使期权价值最大化。这个“最优行权时机”不是固定的，而是取决于市场条件（如股票价格、剩余时间等）的变化。

**为什么美式看涨期权通常不提前行权？**

对于**不派发股息**的股票，美式看涨期权通常**不应被提前行权**。这是因为：
1.  **时间价值：** 期权有时间价值，提前行权会损失这部分价值。
2.  **资金利息：** 如果你提前行权买入股票，你需要立即支付行权价，这笔资金本来可以赚取无风险利息。
3.  **波动性收益：** 期权让你享受股票上涨的收益，而风险有限。提前行权就失去了未来价格上涨的可能性。

**例外：派发股息的股票**

如果股票在期权到期前派发**大额股息**，那么提前行权可能是最优选择。因为如果行权，你可以获得这笔股息；如果不提前行权，股息派发会导致股票价格下降，从而损害期权的价值。在这种情况下，权衡利弊后，可能会在股息派发前提前行权。

**定价方法（比欧式复杂得多）：**

由于提前行权的灵活性，布莱克-斯科尔斯模型**不能直接用于美式期权定价**。美式期权定价通常需要更复杂的数值方法：

1.  **二叉树模型 (Binomial Tree Model)：**
    * 这是最常用且直观的方法。它将股票价格的未来走势简化为一系列向上或向下的离散步骤，形成一个树状结构。
    * 从期权到期日开始，向后倒推计算在每个节点上行权或持有期权哪个更优，从而得出当前时刻的期权价值。
    * 在每个节点，模型会比较“立即行权所得价值”与“持有期权到未来（或直到到期）的预期价值”，取两者中的最大值作为该节点上期权的价值。

2.  **蒙特卡洛模拟 (Monte Carlo Simulation)：**
    * 通过大量模拟股票价格的随机路径，并计算每条路径下期权的最终收益。
    * 对于美式期权，蒙特卡洛模拟更复杂，因为它需要解决在每条路径上找到最优提前行权时间的问题，这通常结合最小二乘蒙特卡洛（Longstaff-Schwartz）方法来解决。

3.  **有限差分法 (Finite Difference Methods)：**
    * 通过数值方法求解期权定价的偏微分方程（PDE）。

**总结：**

美式看涨期权定价的核心挑战在于**提前行权的可能性**。对于**不派发股息**的股票，美式看涨期权通常**不应提前行权**，所以其价值与欧式看涨期权相同（可以用布莱克-斯科尔斯模型间接计算）。但对于**派发股息**的股票，提前行权可能有利，需要使用如**二叉树模型**等数值方法来捕捉这个额外价值和最优行权策略。
`);

function calculateOptionPrice() {
  // 获取输入参数
  const S0Val = S0.value;
  const KVal = K.value;
  const rVal = r.value;
  const TVal = T.value;
  const NVal = N.value;
  const sigmaVal = sigma.value;
  const qVal = q.value;

  // 计算二叉树参数
  const dt = TVal / NVal;
  const u = Math.exp(sigmaVal * Math.sqrt(dt));
  const d = 1 / u;
  const a = Math.exp((rVal - qVal) * dt);
  const p = (a - d) / (u - d);

  // 创建股价树
  const stockTree = Array.from({ length: NVal + 1 }, () => []);
  for (let i = 0; i <= NVal; i++) {
    for (let j = 0; j <= i; j++) {
      stockTree[i][j] = S0Val * u ** j * d ** (i - j);
    }
  }

  // 创建期权价值树
  const optionTree = Array.from({ length: NVal + 1 }, () => []);

  // 计算最后节点的期权价值
  const lastNode = stockTree[NVal];
  optionTree[NVal] = lastNode.map(price => Math.max(KVal - price, 0));

  // 向后回溯计算期权价值
  for (let i = NVal - 1; i >= 0; i--) {
    optionTree[i] = [];
    for (let j = 0; j <= i; j++) {
      // 持有价值
      const holdValue = (p * optionTree[i + 1][j + 1] + (1 - p) * optionTree[i + 1][j]) * Math.exp(-rVal * dt);

      // 行权价值
      const exerciseValue = Math.max(KVal - stockTree[i][j], 0);

      // 美式期权取最大值
      optionTree[i][j] = Math.max(holdValue, exerciseValue);
    }
  }

  // 显示结果
  result.value = {
    optionPrice: optionTree[0][0].toFixed(4),
    dt: dt.toFixed(4),
    u: u.toFixed(4),
    d: d.toFixed(4),
    p: p.toFixed(4),
  };
}
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <div class="container">
        <div v-if="result" id="result">
          <h3>计算结果：</h3>
          <p>期权价格：${{ result.optionPrice }}</p>
          <p>其他参数：</p>
          <ul>
            <li>时间步长 (dt): {{ result.dt }} 年</li>
            <li>上涨因子 (u): {{ result.u }}</li>
            <li>下跌因子 (d): {{ result.d }}</li>
            <li>风险中性概率 (p): {{ result.p }}</li>
          </ul>
        </div>
      </div>
    </template>
    <template #parameter>
      <div class="container">
        <div class="input-group">
          <label>标的资产价格 (S₀):</label>
          <input v-model.number="S0" type="number" step="0.01">
        </div>

        <div class="input-group">
          <label>执行价格 (K):</label>
          <input v-model.number="K" type="number" step="0.01">
        </div>

        <div class="input-group">
          <label>无风险利率 (r):</label>
          <input v-model.number="r" type="number" step="0.01">
        </div>

        <div class="input-group">
          <label>到期时间 (T, 年):</label>
          <input v-model.number="T" type="number" step="0.1">
        </div>

        <div class="input-group">
          <label>步数 (N):</label>
          <input v-model.number="N" type="number">
        </div>

        <div class="input-group">
          <label>波动率 (σ):</label>
          <input v-model.number="sigma" type="number" step="0.01">
        </div>

        <div class="input-group">
          <label>股息率 (q):</label>
          <input v-model.number="q" type="number" step="0.01">
        </div>

        <button @click="calculateOptionPrice">
          计算期权价格
        </button>
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

<style scoped>
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

.input-group {
    margin: 10px 0;
}

label {
    display: inline-block;
    width: 200px;
}

input {
    width: 100px;
    padding: 5px;
}

button {
    padding: 10px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background: #45a049;
}

#result {
    margin-top: 20px;
    padding: 15px;
    background: #f0f0f0;
}

#result h3 {
    margin-top: 0;
}

#result ul {
    padding-left: 20px;
}
</style>
