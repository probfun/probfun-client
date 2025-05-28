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
        <template #conclusion></template>
        <template #comment>
            <CommentPanel exp-id="central-limit-theorem" />
        </template>
    </ExperimentBoard>

</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref } from 'vue';

// 响应式变量
const S0 = ref(100);
const K = ref(100);
const r = ref(0.05);
const T = ref(1);
const sigma = ref(0.2);
const q = ref(0.0);
const result = ref(null);

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