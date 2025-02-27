<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import DistributionCltDiagram from '@/components/experiment/chapter5/distribution-clt/DistributionCltDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider' // 如果需要微积分功能
import { toMarkdown } from '@/utils/markdown.ts';
import { all, create } from 'mathjs';
import { onMounted, ref, watch } from 'vue';
import { content } from './content';
import 'nerdamer/Calculus';
import 'nerdamer/Algebra';
import 'nerdamer/Solve';

const latexInput = ref('1');
const range = ref([0, 1]);
const math = create(all);

function uniform(x: number): number {
  if (x >= 0 && x <= 1) {
    return 1;
  }
  else {
    return 0;
  }
}

function normal(x: number): number {
  const mean = 0;
  const stdDev = 1;
  return (1 / (Math.sqrt(2 * Math.PI) * stdDev)) * Math.exp(-0.5 * ((x - mean) / stdDev) ** 2);
}

function exponential(x: number): number {
  const lambda = 1;
  if (x < 0)
    return 0;
  return lambda * Math.exp(-lambda * x);
}

function gamma(x: number): number {
  const k = 2; // shape
  const theta = 2; // scale
  if (x < 0)
    return 0;
  return (x ** (k - 1) * Math.exp(-x / theta)) / (theta ** k * gammaFunction(k));
}

function beta(x: number): number {
  const alpha = 2;
  const beta = 2;
  if (x < 0 || x > 1)
    return 0;
  return (x ** (alpha - 1) * (1 - x) ** (beta - 1)) / betaFunction(alpha, beta);
}

function cauchy(x: number): number {
  const x0 = 0; // location parameter
  const gamma = 1; // scale parameter
  return (1 / (Math.PI * gamma)) * (gamma / ((x - x0) ** 2 + gamma ** 2));
}

function pareto(x: number): number {
  const xm = 1; // scale parameter
  const alpha = 3; // shape parameter
  if (x < xm)
    return 0;
  return (alpha * xm ** alpha) / x ** (alpha + 1);
}

function gammaFunction(n: number): number {
  if (n === 1)
    return 1;
  if (n === 0.5)
    return Math.sqrt(Math.PI);
  return (n - 1) * gammaFunction(n - 1);
}

function betaFunction(a: number, b: number): number {
  return (gammaFunction(a) * gammaFunction(b)) / gammaFunction(a + b);
}

const fAny = ref<((x: number) => number) | null>(null);
const fCustom = ref<((x: number) => number) | null>(null);

const functionList = {
  uniform: {
    name: 'Uniform',
    f: uniform,
    chinese: '均匀分布',
    latex: 'f(x) = \\begin{cases} 1, & 0 \\leq x \\leq 1 \\\\ 0, & \\text{其他} \\end{cases}',
    left: 0,
    right: 1,
  },
  normal: {
    name: 'Normal',
    f: normal,
    chinese: '正态分布',
    latex: 'f(x) = \\frac{1}{\\sqrt{2\\pi}}*e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}',
    left: -5,
    right: 5,
  },
  exponential: {
    name: 'Exponential',
    f: exponential,
    chinese: '指数分布',
    latex: 'f(x) = \\lambda e^{-\\lambda x}',
    left: 0,
    right: 10,
  },
  gamma: {
    name: 'Gamma',
    f: gamma,
    chinese: '伽玛分布',
    latex: 'f(x) = \\frac{x^{k-1} e^{-\\frac{x}{\\theta}}}{\\theta^k \\Gamma(k)}',
    left: 0,
    right: 10,
  },
  beta: {
    name: 'Beta',
    f: beta,
    chinese: '贝塔分布',
    latex: 'f(x) = \\frac{x^{\\alpha-1} (1-x)^{\\beta-1}}{B(\\alpha, \\beta)}',
    left: 0,
    right: 1,
  },
  cauchy: {
    name: 'Cauchy',
    f: cauchy,
    chinese: '柯西分布',
    latex: 'f(x) = \\frac{1}{\\pi\\gamma} \\frac{\\gamma}{(x-x_0)^2 + \\gamma^2}',
    left: -10,
    right: 10,
  },
  pareto: {
    name: 'Pareto',
    f: pareto,
    chinese: '帕累托分布',
    latex: 'f(x) = \\frac{\\alpha x_m^\\alpha}{x^{\\alpha+1}}',
    left: 0,
    right: 10,
  },
  custom: {
    name: 'Custom',
    f: fCustom.value,
    chinese: '自定义',
    latex: '',
    left: 0,
    right: 1,
  },
};

type FunctionLabel = keyof typeof functionList;

const functionLabel: FunctionLabel[] = [
  'uniform',
  'normal',
  'exponential',
  'gamma',
  'beta',
  'cauchy',
  'pareto',
  'custom',
]

function latexToMath(latex: string): ((x: number) => number) | null {
  const expression = latex
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)') // 处理分数
    .replace(/\\sqrt\{([^}]*)\}/g, 'sqrt($1)') // 处理平方根
    .replace(/\\left|\\right/g, '') // 移除括号修饰符
    .replace(/\\cdot/g, '*') // 处理乘号
    .replace(/\\times/g, '*') // 处理乘号
    .replace(/\\div/g, '/') // 处理除号
    .replace(/\\pi/g, 'PI') // 处理 π
    .replace(/\\sin/g, 'sin') // 处理正弦函数
    .replace(/\\cos/g, 'cos') // 处理余弦函数
    .replace(/\\tan/g, 'tan') // 处理正切函数
    .replace(/\\log/g, 'log') // 处理对数函数
    .replace(/\\exp/g, 'exp') // 处理指数函数
    .replace(/\\left\(/g, '(') // 处理左括号
    .replace(/\\right\)/g, ')') // 处理右括号
    .replace(/\\,/g, '') // 移除逗号
    .replace(/\\ /g, '')
    .replace(/\{([^}]*)\}/g, (match, p1) => `(${p1})`)
    .replace(/\\\^/g, '^');
  try {
    const node = math.parse(expression);
    const code = node.compile();
    return (x: number) => {
      return Number.parseFloat(code.evaluate({ x }));
    }
  }
  catch (error: any) {
    console.error(error);
    return null;
  }
}

function convert() {
  try {
    fAny.value = latexToMath(latexInput.value);
    range.value = [range.value[0], range.value[1]];
  }
  catch (error) {
    console.error(error);
  }
}

function fAnyWrap(f: ((xx: number) => number) | null) {
  return (x: number) => {
    if (f === null) {
      return 0;
    }
    if (x < range.value[0] || x > range.value[1]) {
      return 0;
    }
    return f(x);
  }
}

const selected = ref<FunctionLabel>(functionLabel[0]);

const n_list = ref<number[]>([2]);
const n = ref(2);
watch(() => n_list, () => {
  n.value = n_list.value[0];
}, { deep: true });

onMounted(() => {
  fAny.value = fAnyWrap(functionList[selected.value].f);
  range.value = [functionList[selected.value].left, functionList[selected.value].right];
});
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <DistributionCltDiagram v-if="fAny" :args="{ f: fAny, dx: 0.01, left: range[0], right: range[1], n }" />
    </template>
    <template #parameter>
      <div class="p-5 flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <Label class="flex-shrink-0">
            选择分布：
          </Label>
          <Select
            v-model="selected" @update:model-value="() => {
              fAny = fAnyWrap(functionList[selected].f);
              range = [functionList[selected].left, functionList[selected].right];
              if (selected === 'custom') {
                convert();
              }
            }"
          >
            <SelectTrigger>
              {{ functionList[selected].name }} ({{ functionList[selected].chinese }})
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="func in functionLabel" :key="functionList[func].name" :value="func">
                {{ functionList[func].name }} ({{ functionList[func].chinese }})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex gap-2 items-center">
          <Label class="flex-shrink-0">
            叠加的分布数量：
          </Label>
          <Slider v-model="n_list" :min="1" :max="30" />
          <Label class="flex-shrink-0 w-10 text-center">
            {{ n }} 个
          </Label>
        </div>
        <div v-if="selected === 'custom'" class="flex gap-2">
          <Input v-model="latexInput" />
          <Button @click="convert">
            确定
          </Button>
        </div>
        <Slider v-model="range" :min="-10" :max="10" />
        <!--        <Slider v-model="right" :min="left[0]" :max="19" /> -->
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full" v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="central-limit-theorem" />
    </template>
  </ExperimentBoard>
</template>

<style scoped>

</style>
