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
            <input type="number" id="riskFreeRate" v-model.number="riskFreeRatePercentage" placeholder="例如：2">

            <label for="marketReturn">市场回报率（%）：</label>
            <input type="number" id="marketReturn" v-model.number="marketReturnPercentage" placeholder="例如：8">

            <label for="beta">股票贝塔值：</label>
            <input type="number" id="beta" v-model.number="betaValue" placeholder="例如：1.2">

            <button @click="calculateExpectedReturn">计算期望回报率</button>

            <div class="result" v-if="result !== ''">{{ result }}</div>
            <div class="result" v-else>&nbsp;</div>
            <div>
                <strong>参数说明：</strong>
                <ul>
                    <li><strong>无风险利率：</strong> 指的是理论上没有任何风险的投资所能获得的回报率，通常以短期国债利率作为参考。</li>
                    <li><strong>市场回报率：</strong> 指的是整个市场投资组合的预期回报率，例如股票市场指数的长期平均回报率。</li>
                    <li
                        v-html="'<strong>贝塔值（β）：</strong> 衡量个别股票相对于整个市场波动性的指标。β > 1 表示股票波动性高于市场，β < 1 表示波动性低于市场，β = 1 表示与市场波动性相同。'">
                    </li>
                </ul>
            </div>
        </template>
        <template #conclusion>
        </template>
        <template #comment>
            <CommentPanel exp-id="capm-calculator" />
        </template>
    </ExperimentBoard>
</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, computed } from 'vue';

// 使用 ref 定义响应式数据
const riskFreeRatePercentage = ref(null);
const marketReturnPercentage = ref(null);
const betaValue = ref(null);
const result = ref('');
const calculatedExpectedReturn = ref(null);

// 计算期望回报率的方法
const calculateExpectedReturn = () => {
    // 将百分比转换为小数
    const riskFreeRate = riskFreeRatePercentage.value / 100;
    const marketReturn = marketReturnPercentage.value / 100;
    const beta = betaValue.value;

    // 检查输入是否有效
    if (isNaN(riskFreeRate) || isNaN(marketReturn) || isNaN(beta)) {
        result.value = "请输入有效的无风险利率、市场回报率和贝塔值。";
        calculatedExpectedReturn.value = null;
        return;
    }

    // 使用 CAPM 公式计算期望回报率
    const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate);
    calculatedExpectedReturn.value = expectedReturn * 100;
    result.value = `期望回报率：${calculatedExpectedReturn.value.toFixed(2)}%`;
};
</script>

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