<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import BPDiagram from './BPDiagram.vue';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, ref, watch } from 'vue';
import 'katex/dist/katex.min.css';

const number = ref([10]);
const probability = ref([0.1]);
const numberk = ref([1]);
const lambda = computed(() => number.value[0] * probability.value[0]);

// 计算组合数的函数
const BinomialCoefficient = (n: number, k: number): number => {
  if (k > n) return 0;

  const factorial = (num: number): number => {
    return num <= 1 ? 1 : num * factorial(num - 1);
  };

  return factorial(n) / (factorial(k) * factorial(n - k));
};

// 计算最终结果
const finalResultB = computed(() => {
  const n = number.value[0];
  const k = numberk.value[0];
  const p = probability.value[0];
  const coefficient = BinomialCoefficient(n, k);
  return coefficient * Math.pow(p, k) * Math.pow(1 - p, n - k);
});

// 计算阶乘
function factor(n: number) {
  if (n === 0 || n === 1)
    return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

const finalResultP = computed(() => {
  const k = numberk.value[0];
  const probabilityOfK = (lambda.value ** k * Math.exp(-lambda.value)) / factor(k);
  return probabilityOfK;
});

const binomialFormula = computed(() => {
  const absValue = Math.abs(finalResultB.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultB.value / Math.pow(10, exponent)).toFixed(3); // 计算尾数并保留5位小数
  const resultB = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return `
  \\begin{aligned}
P(X = k) &= \\binom{n}{k} p^k (1-p)^{n-k} 
         = \\binom{${number.value[0]}}{${numberk.value}} ${probability.value[0]}^${numberk.value} (1-${probability.value[0]})^{${number.value[0]}-${numberk.value}} \\\\
         &= ${resultB}
\\end{aligned}`;
});
const binomialContainer = ref<HTMLElement | null>(null);

const poissonFormula = computed(() => {

  const absValue = Math.abs(finalResultP.value);
  const exponent = Math.floor(Math.log10(absValue)); // 获取指数
  const mantissa = (finalResultP.value / Math.pow(10, exponent)).toFixed(3); // 计算尾数并保留5位小数
  const resultP = `${mantissa} \\times 10^{${exponent}}`; // 形成最终的结果字符串

  return ` λ = np = {${number.value}} * {${probability.value}}={{ ${(number.value[0] * probability.value[0]).toFixed(2)}}}\\\\
P(X = k) = \\frac{{λ}^ke^{-λ}}{k!} = \\frac{${lambda.value.toFixed(2)}^{${numberk.value}} e^{-${lambda.value.toFixed(2)}}}{${numberk.value}!} = ${resultP}`;
});
const poissonContainer = ref<HTMLElement | null>(null);

// 计算属性，用于动态更新k的最大值
const maxK = computed(() => number.value[0]);
// 监视n的变化，确保k的值不大于n
watch(number, (newVal) => {
  if (numberk.value[0] > newVal[0]) {
    numberk.value[0] = newVal[0];
  }
});

function renderFormula() {
  if (binomialContainer.value) {
    katex.render(binomialFormula.value, binomialContainer.value, {
      throwOnError: false,
    });
  }
  if (poissonContainer.value) {
    katex.render(poissonFormula.value, poissonContainer.value, {
      throwOnError: false,
    });
  }
}

onMounted(() => {
  renderFormula();
});

// 监听 props 的变化以动态更新图像
watch([number, probability, numberk], () => {
  renderFormula();
});

const content = `
## **二项分布与泊松分布的关系**

### **1. 二项分布到泊松分布的近似**

### **条件**
二项分布 $$ \\text{Binomial}(n, p) $$ 描述的是 $$ n $$ 次独立重复试验中成功次数的分布，每次成功的概率为 $$ p $$。泊松分布 $$ \\text{Poisson}(\\lambda) $$ 描述的是在单位时间或空间内，事件发生次数的分布。

当以下条件满足时，二项分布可以近似为泊松分布：

$$
n \\to \\infty, \\quad p \\to 0, \\quad np = \\lambda \\text{ 是常数}
$$

在这种情况下，二项分布的成功次数 $$ X $$ 接近于泊松分布的事件次数。

### **数学推导**
我们从二项分布的概率质量函数$（PMF）$开始：

$$
P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}
$$

其中：

$$
\\binom{n}{k} = \\frac{n!}{k!(n-k)!}
$$

是组合数。

当 $$ n $$ 很大，$$ p $$ 很小，且 $$ np = \\lambda $$ 时，考虑近似处理：
- 组合数 $$ \\binom{n}{k} $$ 可以近似为 

$$
\\frac{n^k}{k!}
$$

- $$ p^k $$ 可以表示为 

$$
\\left(\\frac{\\lambda}{n}\\right)^k
$$

- $$ (1-p)^{n-k} $$ 可以近似为 

$$
e^{-\\lambda}
$$

因为 

$$
(1-p)^n \\approx e^{-np} = e^{-\\lambda}
$$

对于小 $$ p $$ 近似成立。

将这些近似代入二项分布的公式中，我们得到：

$$
P(X = k) \\approx \\frac{n^k}{k!} \\cdot \\left(\\frac{\\lambda}{n}\\right)^k \\cdot e^{-\\lambda} = \\frac{\\lambda^k}{k!} \\cdot e^{-\\lambda}
$$

这就是泊松分布的概率质量函数：

$$
P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!}
$$

因此，当 $$ n $$ 很大且 $$ p $$ 很小，且 $$ np = \\lambda $$ 固定时，二项分布可以用泊松分布来近似。

### **2. 应用场景与解释**

### **稀有事件**
这种近似的一个经典应用场景是稀有事件的建模。当一个事件在独立试验中发生的概率很小，但试验的次数很多时，直接使用二项分布进行计算会变得复杂，而使用泊松分布来近似则更加简便。例如：
- 大型生产线中次品的数量。
- 一天中某个时间段发生交通事故的次数。

### **计算简化**
在实际应用中，当 $$ n $$ 和 $$ p $$ 满足上述条件时，计算二项分布的概率会涉及到较大的数值运算（如组合数计算），而泊松分布的计算相对简单，因此这种近似可以大大简化计算过程。

### **3. 两者关系的总结**
- **联系**: 泊松分布可以看作是二项分布在 $$ n \\to \\infty $$ 和 $$ p \\to 0 $$ 的极限情况。当试验次数很多且成功概率很小，但期望成功次数固定时，二项分布趋近于泊松分布。
- **近似条件**: $$ np = \\lambda $$，即 $$ n $$ 很大，$$ p $$ 很小且 $$ \\lambda $$ 固定。
- **实际应用**: 泊松分布常用于建模和计算稀有事件的发生次数，是二项分布在特定条件下的有效简化。
`
</script>

<template>
  <ExperimentBoard title="二项分布与泊松分布" :tags="[]">
    <template #experiment>
      <BPDiagram :n="number[0]" :p="probability[0]"></BPDiagram>
    </template>
    <template #parameter>
      <div class="w-full h-full flex flex-col items-center justify-center">
        <div class="w-full flex items-center justify-center mb-5">
          <div class="text-xl">
            二项分布：
          </div>
          <div ref="binomialContainer" class="text-xl" />
        </div>
        <div class="flex w-full mb-5">
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Number of experiments(n) </p>
            <InputNumber v-model.number="number[0]" />
            <Slider v-model="number" :min="1" :max="50" :step="1" class="w-48" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Number of success(k) </p>
            <InputNumber v-model.number="numberk[0]" />
            <Slider v-model="numberk" :min="1" :max="maxK" :step="1" class="w-48" />
          </div>
          <div class="flex flex-col flex-1 items-center justify-center space-y-5">
            <p> Probability of success(p) </p>
            <InputNumber v-model.number="probability[0]" :min-fraction-digits="2" />
            <Slider v-model="probability" :min="0" :max="1" :step="0.01" class="w-48" />
          </div>

        </div>
        <div class="w-full flex items-center justify-center mb-5">
          <div class="text-xl mr-10">
            泊松分布：
          </div>
          <div ref="poissonContainer" class="text-xl" />
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-none" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="BP" />
    </template>
  </ExperimentBoard>
</template>
