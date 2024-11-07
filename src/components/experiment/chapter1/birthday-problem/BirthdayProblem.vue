<script setup lang="ts">
import { birthdayProblemApi } from '@/api/experiment/birthdayProblemApi';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Slider } from '@/components/ui/slider';
import { toMarkdown } from '@/utils/markdown';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref, watch } from 'vue';
import { content } from './content';

async function birthdayTwo(peopleCount: number, runs: number, monthProbs: number[], needNProb: false) {
  try {
    // 调用API获取同一天生日的概率
    const result = await birthdayProblemApi(peopleCount, runs, monthProbs, needNProb);
    const twoSameDayProb = result.twoSameDayProb;
    console.log('同一天生日的概率: ', twoSameDayProb);
    return twoSameDayProb; // 返回概率值，便于后续使用
  }
  catch (error) {
    console.error('发生错误: ', error);
    throw error; // 重新抛出错误，以便外部捕获
  }
}
async function birthdayN(peopleCount: number, runs: number, monthProbs: number[], needNProb: true) {
  try {
    // 调用API获取同一天生日的概率
    const result = await birthdayProblemApi(peopleCount, runs, monthProbs, needNProb);
    const nSameDayProbs = result.nsameDayProbs;
    console.log('至少有n人相同的概率: ', nSameDayProbs);
    return nSameDayProbs; // 返回概率值，便于后续使用
  }
  catch (error) {
    console.error('发生错误: ', error);
    throw error; // 重新抛出错误，以便外部捕获
  }
}

interface Person {
  id: number
  birthday: number
}

const toast = useToast();
const people = ref<Person[]>([]);
const peopleCount = ref(10);

function convertDayOfYearToDate(dayOfYear: number) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let month = 0;
  while (dayOfYear > daysInMonth[month]) {
    dayOfYear -= daysInMonth[month];
    month++;
  }

  return `${month + 1}月${dayOfYear}日`;
}

const selectedBirthday = ref(0);

const curPeopleCount = ref(peopleCount.value);
const nSameDayProb = ref(Array.from({ length: curPeopleCount.value + 1 }).fill(0) as number[]);
const nSameDayCount = ref(Array.from({ length: curPeopleCount.value + 1 }).fill(0) as number[]);
const nSameDayTotal = ref(0);

const pSameDayPeople = ref(Array.from({ length: 101 }).fill(0) as number[]);

const sameDayProb = ref(Array.from({ length: 101 }).fill(0) as number[]);
const sameDayCount = ref(Array.from({ length: 101 }).fill(0) as number[]);
const sameDayTotal = ref(Array.from({ length: 101 }).fill(0) as number[]);

const bornProb = ref(Array.from({ length: 12 }, () => [50]) as number[][]);
const realBornProb = ref(Array.from({ length: 12 }, () => [50]) as number[][]);

const mostCommonBirthday = ref(0);
const maxCount = ref(0);

const expType = ref('0');
function generatePeople(n: number) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 每个月的天数

  const bornProbSum = bornProb.value.flat().reduce((acc, val) => acc + val, 0);
  const monthProb = bornProb.value.map(prob => prob[0] / bornProbSum);
  const cumulativeMonthProb = monthProb.reduce((acc: number[], prob, index) => {
    const cumulativeProb = (acc[index - 1] || 0) + prob;
    acc.push(cumulativeProb);
    return acc;
  }, []);

  people.value = Array.from({ length: n }, (_, i) => {
    // 生成一个0到1之间的随机数
    const randomProb = Math.random();

    // 找到对应的月份
    let monthIndex = cumulativeMonthProb.findIndex(cumProb => randomProb <= cumProb);

    // 确保1月的概率不会漏掉
    if (monthIndex === -1) {
      monthIndex = 11; // 设置为12月
    }

    // 在该月份内随机选取一天
    const dayInMonth = Math.floor(Math.random() * daysInMonth[monthIndex]) + 1;

    // 计算出这一年中的第几天
    const birthday = daysInMonth.slice(0, monthIndex).reduce((acc, days) => acc + days, 0) + dayInMonth;

    return {
      id: i,
      birthday,
    };
  });

  getMostCommonBirthday();

  const count = getBirthdayCount(selectedBirthday.value);
  sameDayTotal.value[peopleCount.value]++;
  if (count > 1) {
    sameDayCount.value[peopleCount.value]++;
  }
  sameDayProb.value[peopleCount.value] = sameDayCount.value[peopleCount.value] / sameDayTotal.value[peopleCount.value];

  if (expType.value === '1') {
    if (curPeopleCount.value !== peopleCount.value) {
      pSameDayPeople.value = Array.from({ length: 101 }).fill(0) as number[];
    }
  }
  else if (expType.value === '2') {
    if (curPeopleCount.value !== peopleCount.value) {
      nSameDayProb.value = Array.from({ length: peopleCount.value + 1 }).fill(0) as number[];
      nSameDayCount.value = Array.from({ length: peopleCount.value + 1 }).fill(0) as number[];
      nSameDayTotal.value = 0;
      curPeopleCount.value = peopleCount.value;
    }
    nSameDayTotal.value++;
    for (let i = 0; i <= maxCount.value; i++) {
      nSameDayCount.value[i]++;
      nSameDayProb.value[i] = nSameDayCount.value[i] / nSameDayTotal.value;
    }
  }
}

function selectBirthday(birthday: number) {
  selectedBirthday.value = birthday;
}

function getBirthdayCount(birthday: number) {
  return people.value.filter(person => person.birthday === birthday).length;
}

function getMostCommonBirthday() {
  const birthdayCount = Array.from({ length: 365 }).fill(0) as number[];
  for (const person of people.value) {
    birthdayCount[person.birthday]++;
  }

  maxCount.value = 0;
  mostCommonBirthday.value = 0;
  for (let i = 0; i < 365; i++) {
    if (birthdayCount[i] > maxCount.value) {
      maxCount.value = birthdayCount[i];
      mostCommonBirthday.value = i;
    }
  }
  if (maxCount.value === 1) {
    mostCommonBirthday.value = -1;
  }
  selectedBirthday.value = mostCommonBirthday.value;
}

const visible = ref(false);

function saveSetting() {
  realBornProb.value = bornProb.value;
  visible.value = false;
  toast.add({ severity: 'success', summary: '成功', detail: '设置成功', life: 3000 });
}

function cancelSetting() {
  bornProb.value = realBornProb.value;
  visible.value = false;
}

const isSimulating = ref(false);

function resetData() {
  sameDayProb.value = Array.from({ length: 101 }).fill(0) as number[];
  sameDayCount.value = Array.from({ length: 101 }).fill(0) as number[];
  sameDayTotal.value = Array.from({ length: 101 }).fill(0) as number[];
}

async function startSimulate() {
  if (isSimulating.value) {
    return;
  }
  resetData();
  isSimulating.value = true;

  if (expType.value === '0') {
    for (let i = 2; i <= 100; i++) {
      peopleCount.value = i;
      for (let t = 0; t < 100; t++) {
        if (!isSimulating.value)
          return;
        generatePeople(peopleCount.value);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }
  else if (expType.value === '1') {
    while (true) {
      if (!isSimulating.value)
        break;
      peopleCount.value = Math.floor(Math.random() * 100) + 1;
      generatePeople(peopleCount.value);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  else if (expType.value === '2') {
    for (let t = 0; t < 1000; t++) {
      if (!isSimulating.value)
        return;
      generatePeople(peopleCount.value);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }
  isSimulating.value = false;
}

function stopSimulate() {
  isSimulating.value = false;
}

function getDaisyUIColor(variableName: string) {
  const hslValue = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const [h, s, l] = hslValue.split(' ').map((val, index) => {
    return index > 0 ? Number.parseFloat(val) / 100 : Number.parseFloat(val);
  });
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  }
  else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  }
  else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  }
  else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  }
  else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  }
  else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return `rgba(${r}, ${g}, ${b}, 100)`;
}

const textColor = getDaisyUIColor('--foreground');
const textColorSecondary = getDaisyUIColor('--secondary-foreground');
const surfaceBorder = getDaisyUIColor('--background');
const primaryColor = getDaisyUIColor('--primary');

const chartData = ref();
const chartOptions = ref({
  maintainAspectRatio: false,
  animation: false,
  aspectRatio: 0.6,
  plugins: {
    legend: {
      labels: {
        color: textColor,
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true, // 显示横坐标标签
        text: '人数n', // 横坐标标签名称
        color: textColorSecondary,
      },
      ticks: {
        color: textColorSecondary,
      },
      grid: {
        color: surfaceBorder,
      },
    },
    y: {
      ticks: {
        color: textColorSecondary,
      },
      grid: {
        color: surfaceBorder,
      },
      min: 0,
      max: 1,
    },
  },
});

const sameDayChartData = ref();
const nSameDayChartData = ref();
const pSameDayChartData = ref();

onMounted(() => {
  nSameDayChartData.value = {
    labels: Array.from({ length: curPeopleCount.value - 1 }, (_, i) => i + 2),
    datasets: [
      {
        label: '至少有n人同天生日的概率',
        data: nSameDayProb.value,
        fill: false,
        borderColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
  sameDayChartData.value = {
    labels: Array.from({ length: 101 }, (_, i) => i),
    datasets: [
      {
        label: '至少有两人同天生日的概率',
        data: sameDayProb.value,
        fill: false,
        borderColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
  generatePeople(peopleCount.value);
});

watch(() => sameDayProb, () => {
  sameDayChartData.value = {
    labels: Array.from({ length: 101 }, (_, i) => i),
    datasets: [
      {
        label: '至少有两人同天生日的概率',
        data: sameDayProb.value,
        fill: false,
        backgroundColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
}, { deep: true });

watch(() => pSameDayPeople, () => {
  pSameDayChartData.value = {
    labels: Array.from({ length: 101 }, (_, i) => i),
    datasets: [
      {
        label: '有两人同生日概率超过 p% 的最小人数',
        data: pSameDayPeople.value,
        fill: false,
        borderColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
}, { deep: true });

watch(() => nSameDayProb, () => {
  nSameDayChartData.value = {
    labels: Array.from({ length: curPeopleCount.value - 1 }, (_, i) => i + 2),
    datasets: [
      {
        label: '至少有n人同天生日的概率',
        data: nSameDayProb.value,
        fill: false,
        borderColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
}, { deep: true });

watch(bornProb, () => {
  const bornProbSum = bornProb.value.flat().reduce((a, b) => a + b, 0);
  const monthProb = bornProb.value.map(prob => prob[0] / bornProbSum);
  const labels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  chartData.value = {
    labels,
    datasets: [
      {
        label: '出生概率',
        data: monthProb,
        fill: false,
        borderColor: primaryColor,
        tension: 0.1,
      },
    ],
  };
}, { deep: true });
</script>

<template>
  <ExperimentBoard title="生日问题" :tags="['蒙特卡洛方法', '排列组合', '互补事件的概率', '大数定律', '均匀分布']">
    <template #experiment>
      <div v-if="!isSimulating" class="p-5 flex flex-col overflow-hidden h-full w-full">
        <div
          class="grid gap-3 overflow-y-auto py-3" :style="{
            gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))',
            gridAutoRows: '1fr',
          }"
        >
          <div v-for="person in people" :key="person.id" class="flex flex-col items-center justify-center">
            <Button
              class="size-10 rounded-full"
              :class="person.birthday === selectedBirthday ? 'bg-green-500 hover:bg-green-500' : 'bg-primary'"
              @click="selectBirthday(person.birthday)"
            >
              {{ person.id + 1 }}
            </Button>
            <Label class="mt-2">{{ convertDayOfYearToDate(person.birthday) }}</Label>
          </div>
        </div>

        <div>
          <div v-if="maxCount > 1" class="mt-4">
            <Label>最常见的生日：</Label>
            <Label>{{ convertDayOfYearToDate(mostCommonBirthday) }}</Label>
            <Label>，共有 {{ maxCount }} 人在这一天过生日!</Label>
          </div>
          <div v-if="maxCount === 1" class="mt-4">
            <Label>每个人的生日都不同！</Label>
          </div>
          <div v-if="selectedBirthday !== mostCommonBirthday" class="mt-4">
            <Label>你选择的生日生日：</Label>
            <Label>{{ convertDayOfYearToDate(selectedBirthday) }}</Label>
            <Label>，共有 {{ getBirthdayCount(selectedBirthday) }} 人在这一天过生日!</Label>
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-lg font-bold">
          数值模拟中，实验不予展示！
        </div>
      </div>
    </template>

    <template #parameter>
      <div class="w-full h-full flex justify-around gap-3 p-3">
        <!--        <div class="flex flex-col justify-around gap-3 items-center w-full h-full max-w-lg"> -->
        <Card class="w-1/3 flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>
              参数调整
            </CardTitle>
          </CardHeader>
          <CardContent class="p-4 flex flex-col gap-8 justify-center items-center flex-1">
            <div class="w-full flex flex-col items-center justify-center gap-4">
              <div class="flex flex-col w-full gap-2">
                <Label for="people" class="flex-shrink-0 font-bold text-left">人数 N：</Label>
                <Input
                  id="people" v-model.number="peopleCount" type="number" :min="1" :max="100"
                  :disabled="isSimulating"
                />
              </div>
              <div class="flex w-full gap-4 items-center justify-center">
                <Button class="w-1/3 items-center justify-center " :disabled="isSimulating" @click="generatePeople(peopleCount)">
                  生成
                </Button>
                <Dialog>
                  <DialogTrigger class = "w-fu">
                    <Button :disabled="isSimulating" class="flex-1 max-w-full" @click="visible = !visible">
                      设置出生概率
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader >
                      <DialogTitle class = "w-1/2  w-full items-center justify-center">设置出生概率</DialogTitle>
                      <DialogDescription>
                        默认每个月的出生概率相等，你可以对其进行修改。
                      </DialogDescription>
                    </DialogHeader>
                    <div class="grid grid-cols-4 items-center gap-4 mb-4">
                      <div v-for="(_, index) in bornProb" :key="index" class="flex flex-col gap-2">
                        <Label> {{ index + 1 }} 月：</Label>
                        <Slider v-model="bornProb[index]" :min="0" :max="100" :step="0.01" />
                      </div>
                    </div>
                    <chart class="h-64" type="line" :data="chartData" :options="chartOptions" />
                    <DialogFooter>
                      <Button type="Button" @click="bornProb = new Array<number[]>(12).fill([50])">
                        复原
                      </Button>
                      <DialogClose as-child>
                        <Button type="Button" @click="cancelSetting">
                          取消
                        </Button>
                      </DialogClose>
                      <DialogClose as-child>
                        <Button type="Button" @click="saveSetting">
                          保存
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div class="flex items-center flex-col gap-4 w-full">
              <div class="flex flex-col gap-2 grow">
                <Label class="flex-shrink-0 font-bold"> 探究实验： </Label>
                <Select v-model="expType" :disabled="isSimulating">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="0">
                        不同人数下至少有两人同天生日的概率
                      </SelectItem>
                      <SelectItem value="1">
                        有两人同生日的概率超过 p% 的最小人数
                      </SelectItem>
                      <SelectItem value="2">
                        至少有 n 人生日相同的概率
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button class="w-full" @click="isSimulating ? stopSimulate() : startSimulate()">
                {{ isSimulating ? '停止模拟' : '开始模拟' }}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card class="flex-1 flex flex-col">
          <CardHeader class="p-4">
            <CardTitle>
              实验结果
            </CardTitle>
          </CardHeader>
          <CardContent class="p-2 flex flex-col items-center flex-1">
            <chart
              v-if="expType === '0'" class="w-full h-full" type="bar" :data="sameDayChartData"
              :options="chartOptions"
            />
            <chart
              v-else-if="expType === '1'" class="w-full h-full" type="line" :data="pSameDayChartData"
              :options="chartOptions"
            />
            <chart
              v-else-if="expType === '2'" class="w-full h-full" type="line" :data="nSameDayChartData"
              :options="chartOptions"
            />
            <Button class="mt-3" :disabled="isSimulating" @click="resetData">
              重置数据
            </Button>
          </CardContent>
        </Card>
      </div>
    </template>

    <template #conclusion>
      <div class="p-5">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(content)" />
      </div>
    </template>

    <template #comment>
      <CommentPanel exp-id="birthday-problem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped></style>
