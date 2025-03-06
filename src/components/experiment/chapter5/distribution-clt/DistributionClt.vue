<script setup lang="ts">
import { generateDistributionFunctionApi } from '@/api/ai/aiApi.ts';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import { getConvergeFuncData, getConvergeFuncOption } from '@/components/experiment/chapter5/distribution-clt/config.ts';
import DistributionCltDiagram from '@/components/experiment/chapter5/distribution-clt/DistributionCltDiagram.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toMarkdown } from '@/utils/markdown.ts';
import { all, create } from 'mathjs';
import { nextTick, onMounted, ref, watch } from 'vue';
import { content } from './content';
// import 'nerdamer/Calculus';
// import 'nerdamer/Algebra';
// import 'nerdamer/Solve';

const distributionCltDiagram = ref<typeof DistributionCltDiagram | null>(null);
const latexInput = ref('e^{-x^2}');
const aiInput = ref('T分布');
const displayLatexInput = ref('e^{-x^2}');
const range = ref([0, 10]);
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
const multi = ref(false);

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
    chinese: '自定义...',
    latex: '',
    left: 0,
    right: 1,
  },
  ai: {
    name: 'AI',
    f: fCustom.value,
    chinese: 'AI 生成',
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
  'ai',
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
    Number.parseFloat(code.evaluate({ x: 0 }));
    displayLatexInput.value = latex;
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
  console.log(fAny.value)
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

const xs = ref<number[]>([]);
const ys = ref<number[]>([]);
const chartData = ref(getConvergeFuncData(xs.value, ys.value));
const chartOption = ref(getConvergeFuncOption());

watch(() => n_list, () => {
  n.value = n_list.value[0];
}, { deep: true });

function refreshConvergeFunc() {
  if (distributionCltDiagram.value) {
    const { x, y } = distributionCltDiagram.value.calculateConvergeFuncPoints();
    xs.value = x;
    ys.value = y;
    chartData.value = getConvergeFuncData(xs.value, ys.value);
  }
}

watch([fAny, range, n], () => {
  nextTick(() => {
    refreshConvergeFunc();
  });
}, { deep: true });

onMounted(() => {
  fAny.value = fAnyWrap(functionList[selected.value].f);
  range.value = [functionList[selected.value].left, functionList[selected.value].right];
  refreshConvergeFunc();
});

const generating = ref(false);
async function generate() {
  if (generating.value) {
    return;
  }
  try {
    generating.value = true;
    const response = await generateDistributionFunctionApi(aiInput.value);
    const funcStr = response.function;
    const functionMatch = funcStr.match(/function\s+(\w+)\s*\((.*?)\)\s*\{([\s\S]*)\}/);
    if (functionMatch) {
      const functionName = functionMatch[1]; // "distribution"
      const args = functionMatch[2]; // "x"
      const body = functionMatch[3]; // function body
      console.log(functionName, args, body);
      // eslint-disable-next-line no-new-func
      fAny.value = new Function(args, body) as (x: number) => number;
    }
    displayLatexInput.value = response.latex;
    range.value[0] = response.min;
    range.value[1] = response.max;
  }
  catch (error) {
    console.error(error);
  }
  finally {
    generating.value = false;
  }
}

const distanceContent = String.raw`
我们使用 $ D_{KS}(P||Q) = \max_x |P(x) - Q(x)|$ 衡量两个分布之间的距离。有：

$$
\text{Distance}(i) = D_{KS}(F_i||N_i), \quad i = 1,\ 2, \dots,\ 30
$$

作为叠加 $i$ 个分布后的分布 $F_i$ 与其对应的正态分布 $N_i$ 之间的距离。可以以此判断叠加分布是否收敛于正态分布。
`;
</script>

<template>
  <ExperimentBoard>
    <template #experiment>
      <DistributionCltDiagram v-if="fAny" ref="distributionCltDiagram" :args="{ f: fAny, dx: 0.01, left: range[0], right: range[1], n, multi }" />
    </template>
    <template #parameter>
      <div class="p-2 grid grid-cols-2 gap-2 h-full w-full">
        <div class="flex flex-col gap-2">
          <Card>
            <CardHeader class="p-4">
              <CardTitle> 分布选择 </CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-2">
              <div class="grid grid-cols-[1fr_3fr] gap-4 items-center">
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
                    {{ functionList[selected].chinese }}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="func in functionLabel" :key="functionList[func].name" :value="func">
                      {{ functionList[func].chinese }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Label v-if="selected === 'custom'" class="flex-shrink-0">
                  自定义分布：
                </Label>
                <div v-if="selected === 'custom'" class="gap-2 flex">
                  <Input v-model="latexInput" />
                  <Button @click="convert">
                    确定
                  </Button>
                </div>
                <Label v-if="selected === 'ai'" class="flex-shrink-0">
                  想要生成的分布名称：
                </Label>
                <div v-if="selected === 'ai'" class="gap-2 flex">
                  <Input v-model="aiInput" />
                  <Button :disabled="generating" @click="generate">
                    生成
                  </Button>
                </div>
              </div>
              <div v-if="fAny" class="w-full prose items-center mt-3" v-html="toMarkdown(`$$\n${selected === 'ai' ? displayLatexInput : selected === 'custom' ? `f(x)=${displayLatexInput}` : functionList[selected].latex}\n$$`)" />
              <div v-else class="w-full pt-3 flex justify-center items-center">
                <Label class="text-destructive">
                  你输入的概率密度函数无法解析，请检查输入
                </Label>
              </div>
            </CardContent>
          </Card>
          <Card class="flex-1 flex flex-col">
            <CardHeader class="p-4">
              <CardTitle> 参数调整 </CardTitle>
            </CardHeader>
            <CardContent class="flex items-center justify-center flex-1">
              <div class="grid w-full grid-cols-[1fr_3fr] gap-4 items-center">
                <Label class="flex-shrink-0">
                  叠加分布数量：
                </Label>
                <div class="gap-2 flex items-center">
                  <Slider v-model="n_list" :disabled="multi" :min="1" :max="30" />
                  <Input v-model="n" :disabled="multi" :min="1" :max="30" type="number" class="w-16" />
                  <Label class="flex-shrink-0">
                    个
                  </Label>
                </div>
                <Label class="flex-shrink-0">
                  分布定义域：
                </Label>
                <div class="flex gap-2">
                  <!--                  <Label class="flex-shrink-0"> -->
                  <!--                    {{ range[0] }} -->
                  <!--                  </Label> -->
                  <Input v-model="range[0]" :disabled="selected !== 'custom'" :min="-10" :max="range[1]" type="number" class="w-16" />
                  <Slider v-model="range" :disabled="selected !== 'custom'" :min="-10" :max="10" />
                  <!--                  <Label class="flex-shrink-0"> -->
                  <!--                    {{ range[1] }} -->
                  <!--                  </Label> -->
                  <Input v-model="range[1]" :disabled="selected !== 'custom'" :min="range[0]" :max="10" type="number" class="w-16" />
                </div>
                <Label class="flex-shrink-0">
                  展示方式：
                </Label>
                <div class="flex justify-center py-2">
                  <RadioGroup
                    default-value="option-one" class="flex flex-row gap-5" @update:model-value="(value) => {
                      multi = value === 'option-two';
                      console.log(multi);
                    }"
                  >
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option-one" value="option-one" />
                      <Label for="option-one">动态调整</Label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option-two" value="option-two" />
                      <Label for="option-two">对比展示</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card class="flex flex-col">
          <CardHeader class="p-4">
            <CardTitle> 收敛速度 </CardTitle>
          </CardHeader>
          <CardContent class="flex-1 flex flex-col">
            <div class="w-full" v-html="toMarkdown(distanceContent)" />
            <chart type="line" :data="chartData" class="w-full flex-1" :options="chartOption" />
          </CardContent>
        </Card>
        <!--        <div class="flex gap-2 items-center"> -->
        <!--          <Label class="flex-shrink-0"> -->
        <!--            选择分布： -->
        <!--          </Label> -->
        <!--          <Select -->
        <!--            v-model="selected" @update:model-value="() => { -->
        <!--              fAny = fAnyWrap(functionList[selected].f); -->
        <!--              range = [functionList[selected].left, functionList[selected].right]; -->
        <!--              if (selected === 'custom') { -->
        <!--                convert(); -->
        <!--              } -->
        <!--            }" -->
        <!--          > -->
        <!--            <SelectTrigger> -->
        <!--              {{ functionList[selected].name }} ({{ functionList[selected].chinese }}) -->
        <!--            </SelectTrigger> -->
        <!--            <SelectContent> -->
        <!--              <SelectItem v-for="func in functionLabel" :key="functionList[func].name" :value="func"> -->
        <!--                {{ functionList[func].name }} ({{ functionList[func].chinese }}) -->
        <!--              </SelectItem> -->
        <!--            </SelectContent> -->
        <!--          </Select> -->
        <!--        </div> -->
        <!--        <div class="flex gap-2 items-center"> -->
        <!--          <Label class="flex-shrink-0"> -->
        <!--            叠加的分布数量： -->
        <!--          </Label> -->
        <!--          <Slider v-model="n_list" :min="1" :max="30" /> -->
        <!--          <Label class="flex-shrink-0 w-10 text-center"> -->
        <!--            {{ n }} 个 -->
        <!--          </Label> -->
        <!--        </div> -->
        <!--        <div v-if="selected === 'custom'" class="flex gap-2"> -->
        <!--          <Input v-model="latexInput" /> -->
        <!--          <Button @click="convert"> -->
        <!--            确定 -->
        <!--          </Button> -->
        <!--        </div> -->
        <!--        <Slider v-model="range" :min="-10" :max="10" /> -->
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
