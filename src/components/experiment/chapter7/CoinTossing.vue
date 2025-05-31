<template>
    <ExperimentBoard :panel-size="70">
        <template #experiment>
            <div class="controls flex justify-center items-center">
                <button @click="flipCoins" :disabled="isFlipping">开始抛掷</button>
                <button @click="resetAll">重置</button>
            </div>
            <div class="coins-container" ref="coinsContainer">
                <div v-for="(coin, index) in coins" :key="index" class="coin">
                    <div class="coin-inner" :style="{ transform: `rotateY(${coin.rotation}deg)` }">
                        <div class="coin-front">正</div>
                        <div class="coin-back">反</div>
                    </div>
                </div>
            </div>
            <div class="stats flex flex-col justify-center items-center">
                <p>本次正面数: <span id="headsCount">{{ currentHeads }}</span></p>
                <p>累计正面数: <span id="headsTotal">{{ headsTotal }}</span></p>
                <p>总抛掷次数: <span id="totalFlips">{{ totalFlips }}</span></p>
                <p>正面概率: <span id="probability">{{ probability }}%</span></p>
            </div>
        </template>
        <template #parameter>
            <div class="flex justify-center items-center">
                <label>
                    硬币数量:
                    <input type="number" v-model="coinCount" min="1" max="50">
                </label>
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

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { renderLatex, toMarkdown } from '@/utils/markdown';
import { ref, onMounted, watch } from 'vue';

const coinCount = ref(10);
const coins = ref([]);
const headsTotal = ref(0);
const totalFlips = ref(0);
const currentHeads = ref(0);
const probability = ref('0.00');
const isFlipping = ref(false);
const coinsContainer = ref(null);

const content = ref(`
## **硬币投掷实验**
硬币投掷实验是一个简单但经典的概率和统计学实验。

**核心思想：**

通过重复投掷一枚硬币多次，来观察正面（heads）和反面（tails）出现的频率。

**目的：**

* **验证理论概率：** 一枚均匀的硬币，理论上正面和反面出现的概率都是 50% (0.5)。实验可以验证在大量重复试验下，实际频率是否接近理论值。
* **理解大数定律：** 投掷次数越多，正面和反面出现的频率越接近 50%。这直观地展示了大数定律的原理。
* **介绍随机性：** 每次投掷的结果是随机的，不可预测的，但大量重复后会呈现出统计规律。

**实验步骤（简化版）：**

1.  **准备：** 一枚硬币。
2.  **设定目标：** 决定要投掷多少次（例如，10次、50次、100次，甚至更多）。
3.  **记录：** 每次投掷后，记录是正面还是反面。
4.  **分析：** 计算正面出现的总次数和反面出现的总次数，并计算各自的频率（次数 / 总投掷次数）。

**预期结果：**

* **少量投掷：** 正面和反面的频率可能差别很大，例如，投10次可能出现7次正面、3次反面。
* **大量投掷：** 随着投掷次数的增加，正面和反面的频率会越来越接近 0.5（50%）。

**在统计学中的意义：**

硬币投掷是理解**伯努利试验**（只有两种可能结果的试验）和**二项分布**（重复进行伯努利试验的次数和成功次数的关系）最简单的例子。它常用于教学、演示概率概念以及作为更复杂统计模型的基础。
`)

// 创建硬币
function createCoins() {
    coins.value = Array(coinCount.value)
        .fill(null)
        .map(() => ({ rotation: 0 }));
}

// 抛掷硬币函数
async function flipCoins() {
    if (isFlipping.value) return;
    isFlipping.value = true;
    currentHeads.value = 0;

    for (let i = 0; i < coins.value.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                const isHeads = Math.random() > 0.5;
                coins.value[i].rotation = isHeads ? 0 : 180;
                if (isHeads) currentHeads.value++;
                resolve();
            }, i * 30);
        });
    }

    totalFlips.value++;
    headsTotal.value += currentHeads.value;
    probability.value = ((headsTotal.value / (totalFlips.value * coinCount.value)) * 100).toFixed(2);
    isFlipping.value = false;
}

// 重置所有统计
function resetAll() {
    headsTotal.value = 0;
    totalFlips.value = 0;
    currentHeads.value = 0;
    probability.value = '0.00';
    createCoins();
}

// 监听硬币数量变化
watch(coinCount, () => {
    resetAll();
});

// 初始化
onMounted(() => {
    createCoins();
});
</script>

<style scoped>
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

.controls {
    margin: 20px 0;
}

.coins-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 20px 0;
}

.coin {
    width: 50px;
    height: 50px;
    position: relative;
    perspective: 1000px;
}

.coin-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.coin-front,
.coin-back {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    backface-visibility: hidden;
    border: 2px solid #666;
}

.coin-front {
    background-color: #e0ffe0;
    transform: rotateY(0deg);
}

.coin-back {
    background-color: #ffe0e0;
    transform: rotateY(180deg);
}

button {
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    margin: 0 5px;
}

button:hover {
    background-color: #45a049;
}

input[type="number"] {
    padding: 6px;
    width: 60px;
    margin: 0 10px;
}

.stats {
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.6;
}
</style>