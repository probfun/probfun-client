<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import threeUniformDiagram from './threeUniformDiagram.vue';
import UniformDiagram from '../../distribution/UniformDiagram.vue';
import { ref } from 'vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Slider from 'primevue/slider';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, watch, nextTick } from 'vue';
import 'katex/dist/katex.min.css';


const x1 = ref(0);
const x2 = ref(1);
const y1 = ref(0);
const y2 = ref(1);

const oneContainer = ref<HTMLElement | null>(null);
const twoContainer = ref<HTMLElement | null>(null);
const threeContainer = ref<HTMLElement | null>(null);

const isChart1 = ref(true);
const isChart2 = ref(false);
const isChart3 = ref(false);

function toggleChart1() {
    isChart1.value = true;
    isChart2.value = false;
    isChart3.value = false;
}
function toggleChart2() {
    isChart1.value = false;
    isChart2.value = true;
    isChart3.value = false;
}
function toggleChart3() {
    isChart1.value = false;
    isChart2.value = false;
    isChart3.value = true;
}

const oneFormula = computed(() => {
    return `f(x, y) = 
    \\begin{cases} 
    \\frac{1}{(x_2 - x_1)(y_2 - y_1)}, & \\text{if } x \\in [x_1, x_2] \\text{ and } y \\in [y_1, y_2] \\\\
    0, & \\text{otherwise}
    \\end{cases}\\\\
  \\phantom{f(x, y)}=
  \\begin{cases} 
    \\frac{1}{(${x2.value} - ${x1.value})(${y2.value} - ${y1.value})}, & \\text{if } x \\in [${x1.value}, ${x2.value}] \\text{ and } y \\in [${y1.value}, ${y2.value}] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    `;

});

const twoFormula = computed(() => {

    return `f_X(x) = 
    \\begin{cases} 
    \\frac{1}{x_2 - x_1}, & \\text{if } x \\in [x_1, x_2] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    
=
    \\begin{cases} 
    \\frac{1}{(${x2.value} - ${x1.value})}, & \\text{if } x \\in [${x1.value}, ${x2.value}] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    
    \\\\
    \\phantom{f_Y(y)}
\\\\
   f_Y(y) = 
    \\begin{cases} 
    \\frac{1}{y_2 - y_1}, & \\text{if } y \\in [y_1, y_2] \\\\
    0, & \\text{otherwise}
    \\end{cases}
 
   =
    \\begin{cases} 
    \\frac{1}{(${y2.value} - ${y1.value})}, & \\text{if } y \\in [${y1.value}, ${y2.value}] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    `;
});

const threeFormula = computed(() => {

    return `f_X(x | y) = 
\\begin{cases} 
    \\frac{1}{x_2 - x_1}, & \\text{if } x \\in [x_1, x_2] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    =
    \\begin{cases} 
    \\frac{1}{${x2.value} - ${x1.value}}, & \\text{if } x \\in [${x1.value}, ${x2.value}] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    
     \\\\
    \\phantom{f_Y(y)}
\\\\
    f_Y(y | x) = 
    \\begin{cases} 
    \\frac{1}{y_2 - y_1}, & \\text{if } x \\in [y_1, y_2] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    =
    \\begin{cases} 
    \\frac{1}{${y2.value} - ${y1.value}}, & \\text{if } y \\in [${y1.value}, ${y2.value}] \\\\
    0, & \\text{otherwise}
    \\end{cases}
    
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

const content = `
## **概述**
二维均匀分布$（Two-dimensional\\ Uniform\\ Distribution）$是概率论中的一种分布类型，表示在二维空间中，所有位置的事件发生概率相等。具体来说，它假定随机变量在一个矩形区域内的任何点出现的可能性都是一样的。
二维均匀分布广泛应用于计算机图形学、模拟、随机采样等领域。
## **二维均匀分布的定义**

对于二维均匀分布，假设二维随机变量$（X,Y）$服从二维均匀分布，并且定义该分布在矩形区域$[a,b] × [c,d]$内的概率密度函数$（PDF）$为：

$$ 
f(x,y) =

\\frac{1}{(b-a)(d-c)},  \\text{当} a ≤ x ≤ b, c ≤ y ≤ d 

$$
否则，概率密度函数为0。


这意味着在矩形区域内，随机变量$(X,Y)$在任何位置的概率密度值都是常数，大小为$\\frac{1}{(b-a)(d-c)}$,而在矩形区域外的概率密度为0。

**期望值和方差:**

  期望值：在水平和垂直方向上的均值是区间的中点
  $$ 
  E(X) = \\frac{a + b}{2},

  E(Y) = \\frac{c + d}{2}
  $$
  方差：
  
  $$ 
  \\text{Var}(X) = \\frac{(b - a)^2}{12},

   \\text{Var}(Y) = \\frac{(d - c)^2}{12} 
   $$

## **特点**

- **1. 均匀性**：在定义区域内的所有点的出现概率相等，因此属于“均匀”分布。
- **2.矩形区域**：二维均匀分布通常定义在矩形区域内，边界由$[a,b]×[c,d]$给出。
- **3. 独立性**：若$(X,Y)$独立地从均匀分布中抽样，$X$ 和 $Y$ 的分布是独立的，且每个维度的分布也是均匀的。

`

</script>

<template>
    <ExperimentBoard>
        <template #experiment>
            <ThreeUniformDiagram v-if="isChart1" class="flex-1 h-full" :x1="x1" :x2="x2" :y1="y1" :y2="y2">
            </ThreeUniformDiagram>
            <div v-if="isChart2 || isChart3" class="w-full h-full flex">
                <UniformDiagram class="w-[50%] h-full mr-1" :a="x1" :b="x2" :k="1" :m="0" :show-history="false">
                </UniformDiagram>
                <UniformDiagram class="w-[50%] h-full ml-1" :a="y1" :b="y2" :k="1" :m="0" :show-history="false">
                </UniformDiagram>
            </div>
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-row  justify-center gap-3 p-3">
                <Card class="w-full w-1/2 card">
                    <CardHeader>
                        <CardTitle v-if="isChart1">二维均匀的联合概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart2">二维均匀的边缘分布概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart3">二维均匀的条件分布</CardTitle>
                    </CardHeader>
                    <CardContent class="flex w-full justify-start">
                        <div v-show="isChart1" ref="oneContainer" class="text-base" />
                        <div v-show="isChart2" ref="twoContainer" class="text-base" />
                        <div v-show="isChart3" ref="threeContainer" class="text-base" />

                    </CardContent>
                </Card>

                <Card class="h-full w-1/2 cardflex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>
                            参数调整
                        </CardTitle>
                    </CardHeader>
                    <CardContent class=" flex flex-col justify-center items-center gap-3">
                        <!-- 居中的按钮 -->
                        <div class="flex justify-center w-full">
                            <div class="dropdown">
                                <Button tabindex="0" role="button" class="m-0">
                                    点我切换
                                </Button>
                                <ul tabindex="0"
                                    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li @click="toggleChart1">
                                        <a>二维均匀分布</a>
                                    </li>
                                    <li @click="toggleChart2">
                                        <a>二维均匀分布的边缘分布</a>
                                    </li>
                                    <li @click="toggleChart3">
                                        <a>二维均匀分布的条件分布</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-10">
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-3">
                                    <Label>x1</Label>
                                    <div class="max-w-xl space-y-3">
                                        <Input v-model="x1" fluid />
                                        <Slider v-model="x1" :min="-10" :max="x2" :step="1" class="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-3">
                                    <Label>x2</Label>
                                    <div class="max-w-xl space-y-3">
                                        <Input v-model="x2" fluid />
                                        <Slider v-model="x2" :min="x1" :max="10" :step="1" class="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-3">
                                    <Label>y1</Label>
                                    <div class="max-w-xl space-y-3">
                                        <Input v-model="y1" fluid />
                                        <Slider v-model="y1" :min="-10" :max="y2" :step="1" class="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-3">
                                    <Label>y2</Label>
                                    <div class="max-w-xl space-y-3">
                                        <Input v-model="y2" fluid />
                                        <Slider v-model="y2" :min="y1" :max="10" :step="1" class="w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </CardContent>

                </Card>
            </div>
        </template>
        <template #conclusion>
            <div class="w-full h-full p-5">
                <div class="prose-sm max-w-full " v-html="toMarkdown(content)" />
            </div>
        </template>
        <template #comment>
            <CommentPanel exp-id="2DuniformDistribution" />
        </template>
    </ExperimentBoard>
</template>