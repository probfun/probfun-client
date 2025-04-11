<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { GraduationCap, Lightbulb, MessagesSquare } from 'lucide-vue-next';
import Slider from 'primevue/slider';
import { computed, onMounted, ref, watch } from 'vue';
import ThreeNormalDiagram from './threeNormalDiagram.vue';
import 'katex/dist/katex.min.css';

const mean1 = ref(0);
const mean2 = ref(0);
const sigma1 = ref(1);
const sigma2 = ref(1);
const density = ref(0);
const x = ref(1);
const y = ref(1)

// 定义渲染 LaTeX 的函数

const oneContainer = ref<HTMLElement | null>(null);
const twoContainer = ref<HTMLElement | null>(null);
const threeContainer = ref<HTMLElement | null>(null);

const isChart1 = ref(true);
const isChart3 = ref(false);

function toggleChart1() {
  isChart1.value = true;
  isChart3.value = false;
}
function toggleChart3() {
  isChart1.value = false;
  isChart3.value = true;
}

const oneFormula = computed(() => {
  return `
        \\text{如果}\\ 
    (X,Y) \\sim N(μ_x,μ_y;σ_x²,σ_y²;ρ),\ 
    
    \\text{则} 
    X \\sim N(μ_x,σ_x²) , \ 
    Y \\sim N(μ_y,σ_y²).\ 
   
    \\text{当满足：} \ 

    σ_x>0,σ_y>0,|ρ|<1,
    \\\\
    \\phantom{f(x, y)}
    \\\\
    \\text{则二维正态分布的概率密度函数为:\\;}\ 


    f(x, y) = 
    \\frac{1}{2\\piσ_xσ_y\\sqrt{1-ρ^2}}  e^{\\frac{-1}{2(1-ρ^2)}[\\frac{(x-μ_x)^2}{σ_x^2}-2ρ\\frac{(x-μ_x)(y-μ_y)}{σ_xσ_y}+\\frac{(y-μ_y)^2}{σ_y^2}]} 
   \\\\
    \\phantom{f(x, y)}
    \\\\
    \\text{则边缘分布概率密度函数为:\\;}\ 
    f_X(x) = \\frac{1}{\\sqrt{2\\pi} σ_x}e^{-\\frac{(x-μ_x)^2}{2σ_x²}} , \ -∞<x<+∞
, \\;
    f_Y(y) = \\frac{1}{\\sqrt{2\\pi} σ_y}e^{-\\frac{(y-μ_y)^2}{2σ_y²}} , \ -∞<y<+∞
 

    `;
});

const twoFormula = computed(() => {
  return `
\\\\
f_X(x) = \\frac{1}{\\sqrt{2\\pi} σ_1}e^{-\\frac{(x-μ_1)^2}{2σ_1²}} , -∞<x<+∞
     \\\\
   \\phantom{f(x, y)}
   \\\\
f_Y(y) = \\frac{1}{\\sqrt{2\\pi} σ_2}e^{-\\frac{(y-μ_2)^2}{2σ_2²}} , -∞<y<+∞


    \\\\
   \\phantom{f(x, y)} 
   \\\\


    \\text{如果}
(X,Y) \\sim N(μ1,μ2;σ1²,σ2²;ρ),
\\\\
   \\text{则} 
   X \\sim N(μ1,σ1²) , 
    Y \\sim N(μ2,σ2²).
`;
});

const threeFormula = computed(() => {
  return `f_{Y|X}(y | x) = 
\\frac{f(x,y)}{f_X(x)}=
\\frac{1}{\\sqrt{2\\pi} σ_y \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_x}{σ_x}-ρ\\frac{y-μ_y}{σ_y}]^2}
, \\;
f_{X|Y}(x | y) = 
\\frac{f(x,y)}{f_Y(y)}=
\\frac{1}{\\sqrt{2\\pi} σ_x \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_x}{σ_x}-ρ\\frac{y-μ_y}{σ_y}]^2}

\\\\
\\phantom{f_Y(y)}
\\\\
\\text{因此，如果 Y = y,\\;}


 \\text{它的条件分布仍然是一个正态分布，满足：}

N(μ_x+ρ\\frac{σ_x}{σ_y}(y-μ_y) , (1-ρ^2)σ_x²)。
\\\\
\\text{如果 X = x,\\;}

\\text{它的条件分布仍然是一个正态分布，满足：}

N(μ_y+ρ\\frac{σ_y}{σ_x}(x-μ_x) , (1-ρ^2)σ_y²。
`;
});

function renderFormula() {
  if (oneContainer.value) {
    katex.render(oneFormula.value, oneContainer.value, {
      throwOnError: false,
    });
  }
  if (twoContainer.value) {
    katex.render(twoFormula.value, twoContainer.value, {
      throwOnError: false,
    });
  }
  if (threeContainer.value) {
    katex.render(threeFormula.value, threeContainer.value, {
      throwOnError: false,
    });
  }
}
onMounted(() => {
  renderFormula();
});

watch([oneFormula, twoFormula, threeFormula], () => {
  renderFormula();
});

const discuss = `
## **二维正态的联合与边缘分布概率密度函数（PDF）**

如果$(X,Y) \\sim N(μ_x,μ_y;σ_x²,σ_y²;ρ),$ 则
   $ X \\sim N(μ_x,σ_x²) , $
    $Y \\sim N(μ_y,σ_y²)。$

当满足：
$σ_x>0,σ_y>0,|ρ|<1,$
则二维正态分布的概率密度函数为:
$$
f(x, y) = 
\\frac{1}{2\\piσ_xσ_y\\sqrt{1-ρ^2}}  e^{\\frac{-1}{2(1-ρ^2)}[\\frac{(x-μ_x)^2}{σ_x^2}-2ρ\\frac{(x-μ_x)(y-μ_y)}{σ_xσ_y}+\\frac{(y-μ_y)^2}{σ_y^2}]} 
$$
边缘分布概率密度函数为:
$$
f_X(x) = \\frac{1}{\\sqrt{2\\pi} σ_x}e^{-\\frac{(x-μ_x)^2}{2σ_x²}} ,  -∞<x<+∞
$$
$$
f_Y(y) = \\frac{1}{\\sqrt{2\\pi} σ_y}e^{-\\frac{(y-μ_y)^2}{2σ_y²}} , -∞<y<+∞
$$

## **二维正态的条件分布**

$$
f_{Y|X}(y | x) = 
\\frac{f(x,y)}{f_X(x)}=
\\frac{1}{\\sqrt{2\\pi} σ_y \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_x}{σ_x}-ρ\\frac{y-μ_y}{σ_y}]^2}
$$
$$
f_{X|Y}(x | y) = 
\\frac{f(x,y)}{f_Y(y)}=
\\frac{1}{\\sqrt{2\\pi} σ_x \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_x}{σ_x}-ρ\\frac{y-μ_y}{σ_y}]^2}
$$

因此，如果 $Y = y$,

它的条件分布仍然是一个正态分布，满足：
$$
N(μ_x+ρ\\frac{σ_x}{σ_y}(y-μ_y) , (1-ρ^2)σ_x²)
$$
如果 $X = x$,
它的条件分布仍然是一个正态分布，满足：
$$
N(μ_y+ρ\\frac{σ_y}{σ_x}(x-μ_x) , (1-ρ^2)σ_y²
$$
`

const content = `
## **概述**
二维正态分布$(Two-dimensional\\ Normal\\ Distribution)$是正态分布在二维空间中的扩展，描述了二维随机变量的联合分布。二维正态分布通常用于建模在两个相关变量之间的关系，这些变量具有正态分布的特征，且它们可能存在一定的线性相关性。二维正态分布广泛应用于统计学、金融、信号处理等领域。
## **定义**
设$(X,Y)$为二维随机变量，服从二维正态分布，其概率密度函数$(PDF)$为：
$$
 f(x, y) = 
    \\frac{1}{2\\piσ_xσ_y\\sqrt{1-ρ^2}}  e^{\\frac{-1}{2(1-ρ^2)}[\\frac{(x-μ_x)^2}{σ_x^2}-2ρ\\frac{(x-μ_x)(y-μ_y)}{σ_x·σ_y}+\\frac{(y-μ_y)^2}{σ_y^2}]} 
$$
其中：

- $μ_x, μ_y$为$X,Y$的均值。
- $σ_x,σ_y$为$X,Y$的标准差。
- $ρ$为$X,Y$之间的相关系数，$ρ∈[-1,1]$。
- $π$为圆周率。

该函数描述了随机变量$(X,Y)$的联合分布，表示了在二维空间中任意一点$(x,y)$出现的概率集中程度。

令
 $$
μ = 
        \\begin{pmatrix}
          μ_x  \\\\
          μ_y
        \\end{pmatrix}
        ,\\ 
Σ = \\begin{pmatrix}
          \\sigma_x^2 & \\rho \\sigma_x \\sigma_y \\\\
          \\rho \\sigma_x \\sigma_y & \\sigma_y^2
        \\end{pmatrix}
        ，\\
x = 
        \\begin{pmatrix}
          x_1  \\\\
          x_2
        \\end{pmatrix} ，
  $$
 则
 $$
f(x,y) = \\frac{1}{2\\pi|Σ|^\\frac{1}{2}}e^{-(x-μ)'·Σ^{-1}(x-μ)}。
 $$


**期望、方差和协方差**

期望：
 $$ 
  \\text{E(X)} = μ_x,

  \\text{E(Y)} = μ_y,
  $$

方差：
 $$ 
  \\text{Var(X)} = σ_x²,

  \\text{Var(Y)} = σ_y²,
 $$

  协方差：
  $$
  \\text{Cov(X,Y)} = ρσ_xσ_y
  $$

  协方差矩阵：
  协方差矩阵描述了$X$和$Y$之间的关系，其中$ρ$为相关系数，衡量$X$和$Y$之间的线性关系。
  $$
\\Sigma = 
        \\begin{pmatrix}
          \\sigma_x^2 & \\rho \\sigma_x \\sigma_y \\\\
          \\rho \\sigma_x \\sigma_y & \\sigma_y^2
        \\end{pmatrix}
  $$
 

## **特点**
- **1. 对称性**：二维正态分布的概率密度函数在均值点$(μ_x，μ_y)$处对称，并且随着距离均值点的增加，密度逐渐降低。
- **2. 联合正态性**：如果$X$和$Y$服从二维正态分布，那么它的每个边缘分布也是正态分布。
- **3. 相关性**：如果$ρ = 0$,则$X$和$Y$是独立的，如果$ρ = ±1$，则$X$和$Y$完全线性相关。

`
const discussTabList = [
  {
    id: 0,
    label: '参考公式',
    name: 'formula',
    icon: Lightbulb,
  },
  {
    id: 1,
    label: '实验结论',
    name: 'conclusion',
    icon: GraduationCap,
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
  <ExperimentBoard :layout="1" :panel-size="70" :discuss-tab-list="discussTabList">
    <template #experiment>
      <ThreeNormalDiagram :mean1="mean1" :mean2="mean2" :sigma1="sigma1" :sigma2="sigma2" :density="density"
        :is-chart3="isChart3" :fixed-x="x" :fixed-y="y" class="w-full h-full" />
    </template>
    <template #parameter>
      <div class="w-full min-h-full flex flex-col items-center justify-center gap-3 p-6">
        <RadioGroup default-value="chart1" class="gap-2 py-4" @update:model-value="(value) => {
          if (value === 'chart1') {
            toggleChart1();
          }
          else {
            toggleChart3();
          }
        }">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="option-one" value="chart1" />
            <Label for="option-one" class="text-lg"> 联合与边缘分布 </Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="option-two" value="chart3" />
            <Label for="option-two" class="text-lg"> 条件分布 </Label>
          </div>
        </RadioGroup>
        <div class="grid grid-cols-1 gap-8 pb-12">
          <div class="flex flex-col gap-8 pb-0 items-center">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$μ_x=$$')" />
              <div class="max-w-lg space-y-3">
                <Input v-model="mean1" class="border-2" placeholder="-10~10" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < -10) mean1 = -10;
                  else if (numValue > 10) mean1 = 10;
                }" />
                <Slider v-model="mean1" :min="-10" :max="10" :step="0.1" class="w-full" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-8 pb-0 items-center">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$μ_y=$$')" />
              <div class="max-w-lg space-y-3">
                <Input v-model="mean2" class="border-2" placeholder="-10~10" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < -10) mean2 = -10;
                  else if (numValue > 10) mean2 = 10;
                }" />
                <Slider v-model="mean2" :min="-10" :max="10" :step="0.1" class="w-full" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-8 pb-0 items-center">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$σ_x=$$')" />

              <div class="max-w-lg space-y-3">
                <Input v-model="sigma1" class="border-2" placeholder="0.1~2" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < 0.1) sigma1 = 0.1;
                  else if (numValue > 2) sigma1 = 2;
                }" />
                <Slider v-model="sigma1" :min="0.1" :max="2" :step="0.1" class="w-full" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-8 pb-0 items-center">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$σ_y=$$')" />

              <div class="max-w-lg space-y-3">
                <Input v-model="sigma2" class="border-2" placeholder="0.1~2" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < 0.1) sigma2 = 0.1;
                  else if (numValue > 2) sigma2 = 2;
                }" />
                <Slider v-model="sigma2" :min="0.1" :max="2" :step="0.1" class="w-full" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-8 pb-0 items-center">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$ρ=$$')" />

              <div class="max-w-lg space-y-3">
                <Input v-model="density" class="border-2" placeholder="-0.9~0.9" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < -0.9) density = -0.9;
                  else if (numValue > 0.9) density = 0.9;
                }" />
                <Slider v-model="density" :min="-0.9" :max="0.9" :step="0.1" class="w-full" />
              </div>
            </div>
          </div>

          <div v-if="isChart3" class="flex flex-col gap-8 pb-0">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$y=$$')" />

              <div class="max-w-lg space-y-3">
                <Input v-model="y" class="border-2" placeholder="-10~10" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < -10) y = -10;
                  else if (numValue > 10) y = 10;
                }" />
                <Slider v-model="y" :min="-10" :max="10" :step="1" class="w-full" />
              </div>
            </div>
          </div>
          <div v-if="isChart3" class="flex flex-col gap-8 pb-0">
            <div class="flex w-4/5 flex-1 items-center justify-center space-y-1 gap-3">
              <div class="mb-3" v-html="toMarkdown('$$x=$$')" />
              <div class="max-w-lg space-y-3">
                <Input v-model="x" placeholder="-10~10" @update:model-value="v => {
                  const numValue = Number(v);
                  if (numValue < -10) x = -10;
                  else if (numValue > 10) x = 10;
                }" />
                <Slider v-model="x" :min="-10" :max="10" :step="1" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #conclusion>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="2d-normal-distribution" />
    </template>
    <template #formula>
      <div class="w-full h-full p-5">
        <div class="prose-sm max-w-full " v-html="toMarkdown(discuss)" />
      </div>
    </template>
  </ExperimentBoard>
</template>
