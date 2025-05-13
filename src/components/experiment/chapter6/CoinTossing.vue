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
        <template #conclusion></template>
        <template #comment>
            <CommentPanel exp-id="central-limit-theorem" />
        </template>
    </ExperimentBoard>

</template>

<script setup>
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { ref, onMounted, watch } from 'vue';

const coinCount = ref(10);
const coins = ref([]);
const headsTotal = ref(0);
const totalFlips = ref(0);
const currentHeads = ref(0);
const probability = ref('0.00');
const isFlipping = ref(false);
const coinsContainer = ref(null);

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