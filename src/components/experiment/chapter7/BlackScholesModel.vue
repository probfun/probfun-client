<template>
    <ExperimentBoard>
        <template #experiment>
            <div class="container">
                <div id="result" v-if="result">
                    <h3>计算结果：</h3>
                    <p>欧式看涨期权价格：${{ result.callPrice }}</p>
                    <p>输入参数：</p>
                    <ul>
                        <li>标的资产价格 (S₀): ${{ result.S0 }}</li>
                        <li>执行价格 (K): ${{ result.K }}</li>
                        <li>无风险利率 (r): {{ result.r }}%</li>
                        <li>到期时间 (T): {{ result.T }} 年</li>
                        <li>波动率 (σ): {{ result.sigma }}%</li>
                        <li>股息率 (q): {{ result.q }}%</li>
                    </ul>
                </div>
            </div>
        </template>
        <template #parameter>
            <div class="container">
                <div class="input-group">
                    <label>标的资产价格 (S₀):</label>
                    <input type="number" v-model.number="S0" step="0.01">
                </div>

                <div class="input-group">
                    <label>执行价格 (K):</label>
                    <input type="number" v-model.number="K" step="0.01">
                </div>

                <div class="input-group">
                    <label>无风险利率 (r):</label>
                    <input type="number" v-model.number="r" step="0.01">
                </div>

                <div class="input-group">
                    <label>到期时间 (T, 年):</label>
                    <input type="number" v-model.number="T" step="0.1">
                </div>

                <div class="input-group">
                    <label>波动率 (σ):</label>
                    <input type="number" v-model.number="sigma" step="0.01">
                </div>

                <div class="input-group">
                    <label>股息率 (q):</label>
                    <input type="number" v-model.number="q" step="0.01">
                </div>

                <button @click="calculateOptionPrice">计算期权价格</button>


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
import { ref } from 'vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';

// 响应式变量
const S0 = ref(100);
const K = ref(100);
const r = ref(0.05);
const T = ref(1);
const sigma = ref(0.2);
const q = ref(0.0);
const result = ref(null);

const content = ref(`
## **Black-Scholes模型计算欧式看涨期权价格**
欧式看涨期权定价，最经典的方法是使用**布莱克-斯科尔斯模型 (Black-Scholes Model)**。简单来说，它是计算在期权到期日之前，以特定价格（行权价）买入股票的权利，现在值多少钱。

**核心思想：**

欧式看涨期权赋予持有者在**到期日**以**行权价**买入标的资产（如股票）的权利，但不是义务。定价就是计算这个权利在当前时刻的公平价值。

布莱克-斯科尔斯模型认为，期权的价格是由以下几个**输入变量**共同决定的：

1.  **标的资产当前价格 (S)：** 股票当前的市场价格。股票越贵，买入的权利可能越值钱。
2.  **行权价格 (K)：** 期权允许你买入股票的固定价格。行权价越低，期权越值钱。
3.  **到期时间 (T)：** 距离期权到期的剩余时间。时间越长，股票价格有更多机会上涨，期权价值可能越高。
4.  **无风险利率 (r)：** 投资者可以将资金投入无风险资产（如短期国债）所能获得的利率。这是持有期权（而不是无风险资产）的机会成本。
5.  **标的资产波动率 ($\sigma$)：** 衡量股票价格在未来一段时间内波动的大小。波动率越大，股票价格大幅上涨的可能性越大，期权的价值也越高（因为下跌的风险有限，而上涨的收益无限）。

**模型假设（简化）：**

布莱克-斯科尔斯模型有一些关键假设，使其能够推导出定价公式：
* 股票价格遵循几何布朗运动。
* 市场没有摩擦（无交易成本、无税收）。
* 可以无限制地借入或贷出资金，利率是无风险利率。
* 不存在套利机会。

**定价公式（不用细究具体数学）：**

布莱克-斯科尔斯模型通过复杂的数学推导，得出一个包含累积标准正态分布函数 $N(d_1)$ 和 $N(d_2)$ 的公式来计算看涨期权的价格 $C$：

$C = S N(d_1) - K e^{-rT} N(d_2)$

这里的 $d_1$ 和 $d_2$ 是根据上述五个输入变量计算出来的中间量。

**直观理解：**

* $S N(d_1)$ 可以看作是“持有股票的预期收益”部分。
* $K e^{-rT} N(d_2)$ 可以看作是“支付行权价的折现成本”部分。

**重要性：**

布莱克-斯科尔斯模型是金融工程领域的一个里程碑，它提供了一个理论框架来量化期权价格，使得期权交易变得更加科学和标准化。尽管有其局限性（例如，假设波动率恒定，但实际波动率是变化的），它仍然是期权定价和风险管理的基础工具。
`)

// 标准正态分布的累积分布函数（CDF）近似计算
function normCDF(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = (x < 0) ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

    return 0.5 * (1.0 + sign * y);
}

// Black-Scholes公式计算欧式看涨期权价格
function blackScholesCall(S0, K, r, T, sigma, q) {
    const d1 = (Math.log(S0 / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const callPrice = S0 * Math.exp(-q * T) * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
    return callPrice;
}

function calculateOptionPrice() {
    // 计算期权价格
    const callPrice = blackScholesCall(S0.value, K.value, r.value, T.value, sigma.value, q.value);

    // 显示结果
    result.value = {
        callPrice: callPrice.toFixed(4),
        S0: S0.value.toFixed(2),
        K: K.value.toFixed(2),
        r: (r.value * 100).toFixed(2),
        T: T.value.toFixed(2),
        sigma: (sigma.value * 100).toFixed(2),
        q: (q.value * 100).toFixed(2),
    };
}
</script>

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