<script setup lang="ts">
import type Display from '@/components/experiment/chapter1/buffon-needle/BuffonNeedleDisplay.vue';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, registerables, Tooltip } from 'chart.js';
import { computed, onMounted, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import BuffonNeedleDisplay from '@/components/experiment/chapter1/buffon-needle/BuffonNeedleDisplay.vue';
import {
  chartOptions,
  discussTabList,
  getChartData,
  getChartDataAver,
} from '@/components/experiment/chapter1/buffon-needle/config';
import {
  conclusionContent,
  discussContent,
  discussContent2,
} from '@/components/experiment/chapter1/buffon-needle/content';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button'; // 引入 GridComponent 用于折线图布局
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

import { toMarkdown } from '@/utils/markdown';

defineProps<{
  title: string;
  tags: string[];
}>();

const needleLength = ref(30);
const floorLineSpacing = ref(60);
const needleAmount = ref(1000);
const display = ref<typeof Display | null>(null);

const historyEstimatedPi = ref<number[]>([]);
const averageEstimatedPi = ref(0);

const isSimulating = ref(false);

ChartJS.register(...registerables);
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);
ChartJS.register(LineElement, CategoryScale, LinearScale, Tooltip, Legend);

async function resetData() {
  display.value?.reset();
  historyEstimatedPi.value = [];
}

async function startSimulate() {
  isSimulating.value = true;
  while (true) {
    if (!isSimulating.value) {
      break;
    }
    await addNeedles();
    await new Promise<void>(resolve => setTimeout(resolve, 100));
  }
}

async function endSimulate() {
  isSimulating.value = false;
}

const isCalculating = ref(false);

function getAverageEstimatedPi() {
  if (historyEstimatedPi.value.length === 0)
    return 0;
  let sum = 0;
  let cnt = 0;
  for (let i = 0; i < historyEstimatedPi.value.length; i++) {
    if (Number.isFinite(historyEstimatedPi.value[i])) {
      sum += historyEstimatedPi.value[i];
      ++cnt;
    }
  }
  return sum / cnt;
}

let running = false;

const chartData = computed(() => getChartData(historyEstimatedPi.value));

async function run() {
  await display.value?.runSimulation();
  historyEstimatedPi.value = historyEstimatedPi.value.concat(display.value?.estimatedPi);
  averageEstimatedPi.value = getAverageEstimatedPi();
}

async function addNeedles() {
  if (running)
    return;
  running = true;
  await run();
  running = false;
}

const chartDataAver = computed(() => getChartDataAver(historyEstimatedPi.value));

onMounted(() => {
  addNeedles();
});
</script>

<template>
  <ExperimentBoard title="Buffon投针" :tags="['辛钦大数定律', '蒙特卡罗方法']" :discuss-tab-list="discussTabList">
    <template #experiment>
      <BuffonNeedleDisplay
        ref="display" :args="{
          needleLength,
          floorLineSpacing,
          needleAmount,
        }"
      />
    </template>

    <template #parameter>
      <div class="w-full h-full overflow-auto grid gap-2 p-2 grid-cols-[2fr_3fr]">
        <div class="flex flex-col h-full items-start gap-2">
          <Card class="w-full">
            <!--            <CardHeader class="p-4"> -->
            <!--              <CardTitle>参数面板</CardTitle> -->
            <!--              &lt;!&ndash;              <CardDescription>Deploy your new project in one-click.</CardDescription> &ndash;&gt; -->
            <!--            </CardHeader> -->
            <CardContent class="grid grid-cols-2 gap-2 p-3">
              <div class="flex items-center gap-2">
                <Label for="needleLength" class="text-left flex-shrink-0 font-bold">针的长度(l) = </Label>
                <Input
                  id="needleLength" v-model="needleLength" type="number" :min="20"
                  :max="40" placeholder="20~40" @input="run"
                />
              </div>
              <div class="flex items-center gap-2">
                <Label for="floorLineSpacing" class="text-left flex-shrink-0 font-bold">线的间距(d) = </Label>
                <Input
                  id="floorLineSpacing" v-model="floorLineSpacing" type="number"
                  :min="20" :max="80" placeholder="20~80" @input="run"
                />
              </div>
              <div class="flex items-center gap-2">
                <Label for="needleAmount" class="text-left flex-shrink-0 font-bold">抛针数量(N) = </Label>
                <Input
                  id="needleAmount" v-model="needleAmount" type="number"
                  :max="5000" placeholder="1~5000" @input="run"
                />
              </div>
            </CardContent>
            <CardFooter class="flex justify-between gap-2 p-3 pt-0">
              <Button class="flex-1" :disabled="isCalculating || isSimulating" @click="addNeedles">
                抛针
              </Button>
              <Button class="flex-1 gap-3" @click="isSimulating ? endSimulate() : startSimulate()">
                {{ isSimulating ? '停止模拟' : '自动模拟' }}
              </Button>
            </CardFooter>
          </Card>

          <Card class="w-full flex-1">
            <CardContent class="flex flex-col justify-center w-full h-full gap-3 p-3">
              <!--              <Label class="mb-2 font-bold">实验结果:</Label> -->
              <div class="flex gap-2 items-center">
                <Label class="font-bold flex-shrink-0">和线相交的针的数量：</Label>
                <Label class="font-bold"> {{ display?.hits }} </Label>
              </div>
              <div class="flex gap-2 items-center">
                <Label class="text-start w-full h-full py-5">
                  <p class="mb-1 font-bold">估算的 Pi 值:</p>
                  <div
                    class="prose w-full text-foreground font-bold"
                    v-html="toMarkdown(`$\\pi = \\frac{2l}{Pd} = $ ${display?.estimatedPi.toFixed(5)}`)"
                  />
                </Label>
              </div>

              <div class="flex gap-2 items-center">
                <Label class="font-bold">历史估算 Pi 值的平均值：</Label>
                <Label class="font-bold">{{ averageEstimatedPi.toFixed(5) }}</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <div class="flex-1 h-full flex">
          <Card class="w-full h-full">
            <CardContent class="flex flex-col justify-center items-center h-full gap-2 w-full p-3">
              <!--              <VChart class="flex-1" :option="option" autoresize /> -->
              <!--              <VChart class="flex-1" :option="optionAvg" autoresize /> -->
              <!--              <VChart class="flex-1" :option="data" autoresize /> -->
              <chart type="line" :data="chartData" class="flex-1 w-full" :options="chartOptions" />
              <chart type="line" :data="chartDataAver" class="flex-1 w-full" :options="chartOptions" />
              <Button @click="resetData">
                重置数据
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </template>

    <template #conclusion>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(conclusionContent)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="buffon" />
    </template>

    <template #discuss>
      <div class="w-full h-full p-3">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(discussContent)" />
        <table class="mb-5">
          <thead>
            <tr>
              <th>方法</th>
              <th>优点</th>
              <th>缺点</th>
              <th>适用场景</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>方法1</strong></td>
              <td>数学上严密，形式上直观，尤其是通过概率密度函数和积分可以清晰地描述针与线相交的概率从而推导出π的表达式</td>
              <td>理论上复杂，实际操作时需要积分</td>
              <td>适合理论分析或推导π的公式</td>
            </tr>
            <tr>
              <td><strong>方法2</strong></td>
              <td>通过起点、角度生成终点，几何描述清晰直观</td>
              <td>计算量大，特别是每次都要生成起点和终点</td>
              <td>适合模拟或者编程实现复杂的几何问题</td>
            </tr>
            <tr>
              <td><strong>方法3</strong></td>
              <td>仅需检查两端点是否位于同一半平面，算法简洁，计算量较小，几何描述清晰直观</td>
              <td>不容易直接推导出π的表达式</td>
              <td>适合需要简化计算或者快速判断相交情况的场景，但不利于进一步推导π的公式</td>
            </tr>
          </tbody>
        </table>
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(discussContent2)" />
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

div, label {
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE/Edge */
}
</style>
