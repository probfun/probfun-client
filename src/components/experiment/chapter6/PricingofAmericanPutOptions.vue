<template>
    <ExperimentBoard>
        <template #experiment>
            <div class="container">
                <div id="result" v-if="result">
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
                    <label>步数 (N):</label>
                    <input type="number" v-model.number="N">
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
const S0 = ref(50);
const K = ref(50);
const r = ref(0.05);
const T = ref(1);
const N = ref(3);
const sigma = ref(0.3);
const q = ref(0.0);
const result = ref(null);

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
            stockTree[i][j] = S0Val * Math.pow(u, j) * Math.pow(d, i - j);
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