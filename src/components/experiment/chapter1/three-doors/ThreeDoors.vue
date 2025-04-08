<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ThreeDoorsDisplay from '@/components/experiment/chapter1/three-doors/ThreeDoorsDisplay.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toMarkdown } from '@/utils/markdown';
import { GraduationCap, Lightbulb, MessagesSquare } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';

import { conclusionContent, discussContent, explanationContent } from './content';

// 新增一个状态变量来存储用户选择的策略
const selectedStrategy = ref<'never' | 'always' | 'random'>('random');
const threeDoorsDisplay = ref<InstanceType<typeof ThreeDoorsDisplay> | null>(null);

// const changeWinNum = ref(0);
// const changeLoseNum = ref(0);
// const notChangeWinNum = ref(0);
// const notChangeLoseNum = ref(0);

// const dataC = ref();
// const dataNC = ref();
const historyC = ref<number[]>([]);
const historyNC = ref<number[]>([]);
const chartDataC = ref();
const chartDataNC = ref();

const documentStyle = getComputedStyle(document.documentElement);

function setdataC() {
  const kValues = Array.from({ length: historyC.value.length }, (_, i) => i + 1);
  // 使用 historyC 生成返回数据
  console.log(historyC);

  return ({
    labels: kValues,
    datasets: [
      {
        label: ['换门胜率'],
        data: historyC.value,
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        tension: 0.4,
      },
      {
        label: '0.66', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 0.66 : 0.66), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

function setdataNC() {
  if (threeDoorsDisplay.value === null)
    return;
  const kValues = Array.from({ length: historyC.value.length }, (_, i) => i + 1);
  const notChangeLoseNum = threeDoorsDisplay.value.notChangeLoseNum;
  const notChangeWinNum = threeDoorsDisplay.value.notChangeWinNum;
  const changeWinNum = threeDoorsDisplay.value.changeWinNum;
  const changeLoseNum = threeDoorsDisplay.value.changeLoseNum;
  historyNC.value = historyNC.value.concat(notChangeWinNum / (notChangeLoseNum + notChangeWinNum));
  historyC.value = historyC.value.concat(changeWinNum / (changeWinNum + changeLoseNum));
  console.log(historyC);

  return ({
    labels: kValues,
    datasets: [
      {
        label: ['不换门胜率'],
        data: historyNC.value,
        fill: false,
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
        tension: 0.4,
      },
      {
        label: '0.33', // 辅助线的标签
        data: kValues.map(k => (k >= 1 && k <= 500) ? 0.33 : 0.33), // 不使用 null 值
        fill: false, // 不填充线下面的区域
        borderColor: documentStyle.getPropertyValue('--p-red-500') || 'red', // 设置辅助线的颜色，或者给一个备用颜色
        borderWidth: 1, // 辅助线的宽度
        pointRadius: 0, // 不显示数据点
        borderDash: [10, 5], // 虚线样式
        tension: 0, // 线的张力设置为 0，确保为直线
      },
    ],
  });
}

watch(() => [threeDoorsDisplay.value?.changeWinNum, threeDoorsDisplay.value?.changeLoseNum, threeDoorsDisplay.value?.notChangeWinNum, threeDoorsDisplay.value?.notChangeLoseNum], () => {
  chartDataC.value = setdataC();
  chartDataNC.value = setdataNC();
});

onMounted(() => {
  chartDataC.value = setdataC();
  chartDataNC.value = setdataNC()
});

const options = ref({
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: 1,
    },
  },
});

const discussTabList = [

  {
    id: 0,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,
  },
  {
    id: 1,
    label: '相关讨论',
    name: 'discuss',
    icon: Lightbulb,
  },
  {
    id: 2,
    label: '讨论区',
    name: 'comment',
    icon: MessagesSquare,
  },
];
</script>

<template>
  <ExperimentBoard title="三门问题" :tags="['条件概率', '贝叶斯定理']" :discuss-tab-list="discussTabList">
    <template #experiment>
      <ThreeDoorsDisplay ref="threeDoorsDisplay" :args="{ selectedStrategy }" />
    </template>
    <template #parameter>
      <div v-if="threeDoorsDisplay" class="p-2 grid grid-cols-2 w-full h-full gap-2">
        <div class="flex flex-col gap-2">
          <!-- <Card class="flex-1 flex flex-col">
            <CardContent class="flex justify-center grid grid-cols-2 items-center w-full h-full">
              <div class="flex flex-1 items-center justify-start">
                <Label class="font-bold mr-2">模拟轮数 = </Label>
                <Input v-model="threeDoorsDisplay.autoGameRound[0]" class="flex-1" :min="1" :max="500" />
              </div>
              <div class="flex ml-8">
                <Button @click="() => {
                  if (threeDoorsDisplay === null)
                    return;
                  threeDoorsDisplay.autoGaming ? threeDoorsDisplay.autoGaming = false : threeDoorsDisplay.simulateGame();
                }">
                  {{ threeDoorsDisplay.autoGaming ? '终止模拟' : '开始模拟' }}
                </Button>
              </div>
            </CardContent>
          </Card> -->
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle>
                模拟策略
              </CardTitle>
            </CardHeader>
            <CardContent class="flex-wrap justify-around gap-8 items-center  grid grid-row-2">
              <div class=" grid grid-cols-3 flex gap-8 justify-center items-center">
                <Button :class="cn('transition-all', selectedStrategy !== 'never' && 'opacity-60')"
                  @click="selectedStrategy = 'never'">
                  每次都不换门
                </Button>
                <Button :class="cn('transition-all', selectedStrategy !== 'always' && 'opacity-60')"
                  @click="selectedStrategy = 'always'">
                  每次都换门
                </Button>
                <Button :class="cn('transition-all', selectedStrategy !== 'random' && 'opacity-60')"
                  @click="selectedStrategy = 'random'">
                  随机换门
                </Button>
              </div>
              <div class=" grid grid-cols-2">
              <div class="flex flex-1 items-center justify-start">
                <Label class="font-bold mr-2">模拟轮数 = </Label>
                <Input v-model="threeDoorsDisplay.autoGameRound[0]" class="flex-1" :min="1" :max="500" placeholder="1~500"/>
                </div>
                <div class="flex ml-8">
                  <Button @click="() => {
                    if (threeDoorsDisplay === null)
                      return;
                    threeDoorsDisplay.autoGaming ? threeDoorsDisplay.autoGaming = false : threeDoorsDisplay.simulateGame();
                  }">
                    {{ threeDoorsDisplay.autoGaming ? '终止模拟' : '开始模拟' }}
                  </Button>
                </div>
              </div>

            </CardContent>
          </card>
          <Card class="flex-1">
            <CardHeader class="p-4">
              <CardTitle>
                实验结果
              </CardTitle>
            </CardHeader>
            <CardContent class="flex items-center flex-col">
              <div class="grid grid-cols-2 gap-y-4 gap-x-10 justify-between">
                <Label class="flex items-center flex-shrink-0">
                  换门胜利次数： {{ threeDoorsDisplay.changeWinNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  换门失败次数： {{ threeDoorsDisplay.changeLoseNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门胜利次数： {{ threeDoorsDisplay.notChangeWinNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门失败次数： {{ threeDoorsDisplay.notChangeLoseNum }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  不换门胜率： {{ (threeDoorsDisplay.notChangeWinNum / (threeDoorsDisplay.notChangeWinNum +
                    threeDoorsDisplay.notChangeLoseNum)).toFixed(2) }}
                </Label>
                <Label class="flex items-center flex-shrink-0">
                  换门胜率： {{ (threeDoorsDisplay.changeWinNum / (threeDoorsDisplay.changeWinNum +
                    threeDoorsDisplay.changeLoseNum)).toFixed(2) }}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card class="h-full flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>
              实验结果
            </CardTitle>
          </CardHeader>
          <CardContent class="flex flex-1 flex-col  items-center justify-center">
            <Chart type="line" :data="chartDataC" :options="options" class="flex-1 w-full" />
            <Chart type="line" :data="chartDataNC" :options="options" class="flex-1 w-full" />
            <Button class="mt-3" @click="threeDoorsDisplay.resetData">
              重置数据
            </Button>
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(conclusionContent)" />
      </div>
    </template>

    <template #change>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(explanationContent)" />
      </div>
    </template>
    <template #discuss>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-full text-foreground" v-html="toMarkdown(discussContent)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="three-doors" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>
div,
label {
  user-select: none;
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
}
</style>
