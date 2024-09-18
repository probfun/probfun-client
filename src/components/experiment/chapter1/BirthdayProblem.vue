<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Button } from '@/components/ui/button';
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
import { computed, onMounted, ref, watch } from 'vue';

const content = `
### **问题简述**

假设一年有 $365$ 天（不考虑闰年），一个群体中有 $N$ 个人，在这个群体中至少有两个人生日相同的概率是多少？

### **实验思路**
#### **均匀出生**

**1. 不同人数下至少有两人同天生日的概率**

   生日悖论公式：令
   $$
   \\text{事件}A=\\{ N \\text{个人在不同天生日}\\}
   $$

   $$
   \\text{事件}B=\\{ N\\text{人中至少有 2 人在同一天生日}\\}
   $$

   从 $2$ 人到 $100$ 人。对不同的人数下事件 $B$ 概率进行数值计算，绘图展示。

**2. 从 $0%$ 到 $100%$，以 $0.1$ 为间隔至少有两人同天生日的概率超过 $50%$ 的最小人数**

   蒙特卡洛模拟：对于具有不同人数的群体进行 $1000$ 次模拟。为每个人随机分配生日，统计有至少两人同天生日的次数的次数 $n$ ，并通过 $P = \\frac{n}{1000}$ 计算的概率。为找到达到目标概率所需的最少人数，从一个人开始，逐渐增加人数并重复此过程，直到概率达到或超过目标值，记录最小人数。

**3. 在含有 $N$ 个人的群体中，至少有 $n$ 人生日相同的概率**

   蒙特卡洛模拟：为每个人随机生成一个生日，这些生日分布在一年的 $365$ 天中。接着统计每一天生日的人数，并检查是否存在至少有某个指定数目（$n$）的人在同一天过生日。重复以上过程，统计出满足条件的情况的次数，最后将这个次数除以总的模拟次数，从而得到至少有 $n$ 个人共享同一天生日的概率。

#### **非均匀出生**

在日常生活中，新生儿的出生率可能因季节性变化、社会文化习俗、医疗进步等多个因素而异，导致不同时期的生日概率不均等，产生了非均匀分布下的生日问题。

在存在出生高峰/低谷月的条件下，有 $x$ 人同天生日的概率

   用户选择出生高峰月份并输入这些月份的出生概率，同时设置样本总人数和至少 $m$ 有 $x$ 个人同一天生日的人数。实验首先根据用户输入建立非均匀的生日分布，确保各月份概率总和为 $1$。接着，利用蒙特卡洛模拟估计样本中至少有 $x$ 个人同一天生日的概率。最后将每个月的平均概率绘制成折线图，公式为：
   $$
   月平均概率 = \\frac{1}{天数} \\sum_{天数} P(至少有x个人同天生日)
   $$
`;

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
      pSameDayPeople.value = Array.from({ length: 101 }).fill(0);
    }
  } if (expType.value === '2') {
    if (curPeopleCount.value !== peopleCount.value) {
      nSameDayProb.value = new Array<number>(peopleCount.value + 1).fill(0);
      nSameDayCount.value = new Array<number>(peopleCount.value + 1).fill(0);
      nSameDayTotal.value = 0;
      curPeopleCount.value = peopleCount.value;
    }
    nSameDayTotal.value++;
    for (let i = 2; i <= maxCount.value; i++) {
      nSameDayCount.value[i]++;
      nSameDayProb.value[i] = nSameDayCount.value[i] / nSameDayTotal.value;
    }
  }
}

const selectedBirthday = ref(0);

function selectBirthday(birthday: number) {
  selectedBirthday.value = birthday;
}

const mostCommonBirthday = ref(0);
const maxCount = ref(0);

function getBirthdayCount(birthday: number) {
  return people.value.filter(person => person.birthday === birthday).length;
}

function getMostCommonBirthday() {
  const birthdayCount = Array.from({ length: 365 }).fill(0);
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
  sameDayProb.value = Array.from({ length: 101 }).fill(0);
  sameDayCount.value = Array.from({ length: 101 }).fill(0);
  sameDayTotal.value = Array.from({ length: 101 }).fill(0);
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

const curPeopleCount = ref(peopleCount.value);
const nSameDayProb = ref<number[]>(new Array<number>(curPeopleCount.value + 1).fill(0));
const nSameDayCount = ref<number[]>(new Array<number>(curPeopleCount.value + 1).fill(0));
const nSameDayTotal = ref(0);

const pSameDayPeople = ref<number[]>(Array.from({ length: 101 }).fill(0));

const sameDayProb = ref(Array.from({ length: 101 }).fill(0));
const sameDayCount = ref(Array.from({ length: 101 }).fill(0));
const sameDayTotal = ref(Array.from({ length: 101 }).fill(0));

const bornProb = ref(Array.from({ length: 12 }).fill([50]));
const realBornProb = ref(Array.from({ length: 12 }).fill([50]));

function getDaisyUIColor(variableName: string) {
  const hslValue = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  const [h, s, l] = hslValue.split(' ').map((val, index) => {
    return index > 0 ? Number.parseFloat(val) / 100 : Number.parseFloat(val);
  });
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0; let g = 0; let b = 0;
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  }
  else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  }
  else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  }
  else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  }
  else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  }
  else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
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

console.log(textColor, textColorSecondary, surfaceBorder, primaryColor);

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
        text: '人数', // 横坐标标签名称
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

onMounted(() => {
  nSameDayChartData.value = {
    labels: Array.from({ length: curPeopleCount.value + 1 }, (_, i) => i),
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
});

const sameDayChartData = ref();
const nSameDayChartData = ref();
const pSameDayChartData = ref();

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
    labels: Array.from({ length: curPeopleCount.value + 1 }, (_, i) => i),
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

const data = computed(() => {
  return sameDayProb.value.map((item, index) => {
    return {
      name: index,
      至少有两人同天生日的概率: item,
    };
  });
});

const expType = ref('0');
</script>

<template>
  <ExperimentBoard title="生日问题" :tags="['蒙特卡洛方法', '排列组合', '互补事件的概率', '大数定律', '均匀分布']">
    <template #experiment>
      <div v-if="!isSimulating" class="p-5 flex flex-col overflow-hidden h-full w-full">
        <div
          class="grid gap-3 overflow-y-auto py-3"
          :style="{
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
      <div class="w-full h-full flex items-center justify-center p-3">
        <div class="flex flex-col justify-around gap-3 items-center w-full h-full max-w-lg">
          <div class="w-full flex items-center justify-center gap-2">
            <div class="flex items-center grow">
              <Label for="people" class="flex-shrink-0">人数：</Label>
              <Input id="people" v-model.number="peopleCount" type="number" :min="1" :max="100" :disabled="isSimulating" />
            </div>
            <Button :disabled="isSimulating" @click="generatePeople(peopleCount)">
              生成
            </Button>
            <Dialog>
              <DialogTrigger>
                <Button :disabled="isSimulating" @click="visible = !visible">
                  设置出生概率
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>设置出生概率</DialogTitle>
                  <DialogDescription>
                    默认每个月的出生概率相等，你可以对其进行修改。
                  </DialogDescription>
                </DialogHeader>
                <div class="grid grid-cols-4 items-center gap-4 mb-4">
                  <div v-for="(_, index) in bornProb" class="flex flex-col gap-2">
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

          <div class="flex items-center gap-4 w-full">
            <div class="flex items-center grow">
              <Label class="flex-shrink-0"> 探究实验： </Label>
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
              <!--              <Select class="select select-primary grow"> -->
              <!--                <option selected :value="0"> 不同人数下至少有两人同天生日的概率 </option> -->
              <!--                <option :value="1"> 有两人同生日的概率超过 p% 的最小人数 </option> -->
              <!--                <option :value="2"> 至少有 n 人生日相同的概率 </option> -->
              <!--              </Select> -->
            </div>
            <Button @click="isSimulating ? stopSimulate() : startSimulate()">
              {{ isSimulating ? '停止模拟' : '开始模拟' }}
            </Button>
          </div>
          <chart v-if="expType === '0'" class="w-full h-full" type="bar" :data="sameDayChartData" :options="chartOptions" />
          <chart v-else-if="expType === '1'" class="w-full h-full" type="line" :data="pSameDayChartData" :options="chartOptions" />
          <chart v-else-if="expType === '2'" class="w-full h-full" type="line" :data="nSameDayChartData" :options="chartOptions" />
          <Button class="mt-3" :disabled="isSimulating" @click="resetData">
            重置数据
          </Button>
        </div>
      </div>

      <!--      <Dialog v-model:visible="visible" modal header="设置出生概率" :style="{ width: '60rem' }"> -->
      <!--        <span class="text-surface-500 dark:text-surface-400 block mb-8">默认每个月的出生概率相等，你可以对其进行修改。</span> -->
      <!--        <div class="grid grid-cols-4 items-center gap-4 mb-4"> -->
      <!--          <div class="flex flex-col gap-2" v-for="(_, index) in bornProb"> -->
      <!--            <label> {{ index + 1 }} 月：</label> -->
      <!--            <input type="range" class="range range-primary range-sm" v-model.number="bornProb[index]" :min="0" :max="100" :step="0.01" /> -->
      <!--          </div> -->
      <!--        </div> -->
      <!--        <chart class="h-64" type="line" :data="chartData" :options="chartOptions"></chart> -->
      <!--        <div class="flex justify-end gap-3 mt-4"> -->
      <!--          <Button class="btn btn-primary" type="Button"  @click="bornProb = new Array<number>(12).fill(50)"> 复原 </Button> -->
      <!--          <Button class="btn btn-primary" type="Button" @click="cancelSetting"> 取消 </Button> -->
      <!--          <Button class="btn btn-primary" type="Button" @click="saveSetting"> 保存 </Button> -->
      <!--        </div> -->
      <!--      </Dialog> -->
    </template>

    <template #conclusion>
      <div class="p-5">
        <div class="prose-sm max-w-none text-foreground" v-html="toMarkdown(content)" />
      </div>
    </template>
  </ExperimentBoard>
</template>

<style scoped>

</style>
