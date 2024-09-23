<script setup lang="ts">

import ExperimentBoard from "@/components/experiment/ExperimentBoard.vue";
import {toMarkdown} from "@/utils/markdown";
import {onMounted, ref, watch} from "vue";
import {useToast} from "primevue/usetoast";

const content = `
### **实验简述**

假设一年有 $365$ 天（不考虑闰年），一个群体中有 $N$ 个人，在这个群体中至少有两个人生日相同的概率是多少？

### **实验思路**
### 均匀出生

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

### 非均匀出生

在日常生活中，新生儿的出生率可能因季节性变化、社会文化习俗、医疗进步等多个因素而异，导致不同时期的生日概率不均等，产生了非均匀分布下的生日问题。

在存在出生高峰/低谷月的条件下，有 $x$ 人同天生日的概率

   用户选择出生高峰月份并输入这些月份的出生概率，同时设置样本总人数和至少 $m$ 有 $x$ 个人同一天生日的人数。实验首先根据用户输入建立非均匀的生日分布，确保各月份概率总和为 $1$。接着，利用蒙特卡洛模拟估计样本中至少有 $x$ 个人同一天生日的概率。最后将每个月的平均概率绘制成折线图，公式为：
   $$
   月平均概率 = \\frac{1}{天数} \\sum_{天数} P(至少有x个人同天生日)
   $$
`;

interface Person {
  id: number;
  birthday: number;
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

  return (month + 1) + "月" + dayOfYear + "日";
}

function generatePeople(n: number) {
  people.value = Array.from({length: n}, (_, i) => ({id: i, birthday: Math.floor(Math.random() * 365) + 1}));
  getMostCommonBirthday();

  const count = getBirthdayCount(selectedBirthday.value);
  sameDayTotal.value[peopleCount.value]++;
  if (count > 1) {
    sameDayCount.value[peopleCount.value]++;
  }
  sameDayProb.value[peopleCount.value] = sameDayCount.value[peopleCount.value] / sameDayTotal.value[peopleCount.value];
  console.log(sameDayProb.value[peopleCount.value]);
}

const selectedBirthday = ref(0);

function selectBirthday(birthday: number) {
  selectedBirthday.value = birthday;
  console.log(selectedBirthday.value);
}

const mostCommonBirthday = ref(0);
const maxCount = ref(0);

function getBirthdayCount(birthday: number) {
  return people.value.filter(person => person.birthday === birthday).length;
}

function getMostCommonBirthday() {
  const birthdayCount = new Array(365).fill(0);
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
  toast.add({severity: 'success', summary: '成功', detail: '设置成功', life: 3000});
}

function cancelSetting() {
  bornProb.value = realBornProb.value;
  visible.value = false;
}

const isSimulating = ref(false);

async function startSimulate() {
  if (isSimulating.value) {
    return;
  }
  isSimulating.value = true;
  while (true) {
    if (!isSimulating.value) break;
    peopleCount.value = Math.floor(Math.random() * 100) + 1;
    generatePeople(peopleCount.value);

    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

function stopSimulate() {
  isSimulating.value = false;
}

const sameDayProb = ref(new Array<number>(101).fill(0));
const sameDayCount = ref(new Array<number>(101).fill(0));
const sameDayTotal = ref(new Array<number>(101).fill(0));

const bornProb = ref(new Array<number>(12).fill(50));
const realBornProb = ref(new Array<number>(12).fill(50));
console.log(bornProb.value);

const chartData = ref();
const chartOptions = ref();

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
  sameDayChartData.value = {
    labels: Array.from({length: 101}, (_, i) => i),
    datasets: [
      {
        label: "至少有两人同天生日的概率",
        data: sameDayProb.value,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
      }
    ]
  };
});

const sameDayChartData = ref();

watch(() => sameDayProb, () => {
  sameDayChartData.value = {
    labels: Array.from({length: 101}, (_, i) => i),
    datasets: [
      {
        label: "至少有两人同天生日的概率",
        data: sameDayProb.value,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1
      }
    ]
  };
}, { deep: true });


const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const bornProbSum = bornProb.value.reduce((a, b) => a + b, 0);
  const monthProb = bornProb.value.map(prob => prob / bornProbSum);
  const labels = Array.from({length: 12}, (_, i) => (i + 1) + "月");
  return ({
    labels: labels,
    datasets: [
      {
        label: "出生概率",
        data: monthProb,
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.1
      }
    ]
  });
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    animation: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
}

watch(() => bornProb, () => {
  chartData.value = setChartData();
}, { deep: true });

</script>

<template>
  <experiment-board title="生日问题" :tags="['蒙特卡洛方法', '排列组合', '互补事件的概率', '大数定律', '均匀分布']">
   <template #experiment>
     <div class="p-5 flex flex-col overflow-y-hidden">
        <div class="mt-4 grid grid-cols-8 gap-3 overflow-y-auto h-96">
          <div class="flex flex-col items-center" v-for="person in people" :key="person.id">
            <Button :label="(person.id + 1).toString()" class="size-12" rounded
                    @click="selectBirthday(person.birthday)"
                    :severity="person.birthday === selectedBirthday ? 'success' : ''" />
            <label>{{ convertDayOfYearToDate(person.birthday) }}</label>
          </div>
        </div>

       <div>
          <div class="mt-4" v-if="maxCount > 1">
            <label>最常见的生日：</label>
            <label>{{ convertDayOfYearToDate(mostCommonBirthday) }}</label>
            <label>，共有 {{ maxCount }} 人在这一天过生日!</label>
          </div>
         <div class="mt-4" v-if="maxCount === 1">
           <label>每个人的生日都不同！</label>
         </div>
         <div class="mt-4" v-if="selectedBirthday !== mostCommonBirthday">
           <label>你选择的生日生日：</label>
           <label>{{ convertDayOfYearToDate(selectedBirthday) }}</label>
           <label>，共有 {{ getBirthdayCount(selectedBirthday) }} 人在这一天过生日!</label>
         </div>
       </div>
     </div>
   </template>

    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="flex items-center justify-center gap-2">
          <float-label>
            <InputNumber id="people" :min="1" :max="100" v-model.number="peopleCount"/>
            <label for="people">人数：</label>
          </float-label>
          <Button @click="generatePeople(peopleCount)" label="生成" />
          <Button @click="visible = !visible" label="设置出生概率" />
          <Button @click="isSimulating ? stopSimulate() : startSimulate()" :label="isSimulating ? '停止模拟' : '开始模拟'" />
          <Dialog v-model:visible="visible" modal header="设置出生概率" :style="{ width: '60rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">默认每个月的出生概率相等，你可以对其进行修改。</span>
            <div class="grid grid-cols-4 items-center gap-4 mb-4">
              <div v-for="(item, index) in bornProb">
                <label>{{ index + 1 }}月：</label>
                <Slider v-model.number="bornProb[index]" :min="0" :max="100" :step="0.01" />
              </div>
            </div>
            <chart class="h-64" type="line" :data="chartData" :options="chartOptions"></chart>
            <div class="flex justify-end gap-2">
              <Button type="button" label="复原" severity="secondary" @click="bornProb = new Array<number>(12).fill(50)"></Button>
              <Button type="button" label="取消" severity="secondary" @click="cancelSetting"></Button>
              <Button type="button" label="保存" @click="saveSetting"></Button>
            </div>
          </Dialog>
        </div>

        <chart class="h-64" type="bar" :data="sameDayChartData" :options="chartOptions"></chart>
      </div>
    </template>

    <template #conclusion>
      <div class="p-5">
        <div v-html="toMarkdown(content)" class="prose max-w-full text-base-content"> </div>
      </div>
    </template>
  </experiment-board>
</template>

<style scoped>

</style>