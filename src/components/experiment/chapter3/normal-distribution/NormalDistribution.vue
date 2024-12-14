<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import NormalDiagram from './NormalDiagram.vue';

import { ref } from 'vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, watch, nextTick } from 'vue';
import 'katex/dist/katex.min.css';

const mean1 = ref(1);
const mean2 = ref(1);
const sigma1 = ref(0.1);
const sigma2 = ref(0.1);
const density = ref(0.5);

const parameters = [
    { label: 'μ1', model: mean1, min: 0, max: 10, step: 0.1 },
    { label: 'μ2', model: mean2, min: 0, max: 10, step: 0.1 },
   
    { label: 'σ1', model: sigma2, min: 0.1, max: 10, step: 0.05 },
    { label: 'σ2', model: density, min: 1, max: 10, step: 0.01 },
    { label: 'ρ', model: sigma1, min: 0.1, max: 10, step: 0.05 },
];

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
    return `
   \\\\
   \\text{当满足：} \\\\
    -∞<x<+∞,-∞<y<+∞,
   \\\\

   -∞<μ_1<+∞,-∞<μ_2<+∞,σ_1>0,σ_2>0,|ρ|<1,
     \\\\
   \\phantom{f(x, y)}
   \\\\
   \\text{则}
   \\\\
   f(x, y) = 
   \\frac{1}{2\\pi\\sqrt{1-ρ^2}}  e^{\\frac{-1}{2(1-ρ^2)}[\\frac{(x-μ_1)^2}{σ_1^2}-2ρ\\frac{(x-μ_1)(y-μ_2)}{σ_1·σ_2}+\\frac{(y-μ_2)^2}{σ_2^2}]} `;

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
\\frac{1}{\\sqrt{2\\pi} σ_2 \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_1}{σ_1}-ρ\\frac{y-μ_2}{σ_2}]^2}

 \\\\
\\phantom{f_Y(y)}
\\\\
f_{X|Y}(x | y) = 
\\frac{f(x,y)}{f_Y(y)}=
\\frac{1}{\\sqrt{2\\pi} σ_1 \\sqrt{1-ρ^2}} e^{\\frac{1}{2(1-ρ^2)}[\\frac{x-μ_1}{σ_1}-ρ\\frac{y-μ_2}{σ_2}]^2}

\\\\
\\phantom{f_Y(y)}
\\\\
\\text{因此，如果 Y = y,}
\\\\

 \\text{它的条件分布仍然是一个正态分布，满足：}
 \\\\
N(μ_1+ρ\\frac{σ_1}{σ_2}(y-μ_2) , (1-ρ^2)σ_1²).
\\\\
\\text{如果 X = x,}
\\\\
\\text{它的条件分布仍然是一个正态分布，满足：}
 \\\\
N(μ_2+ρ\\frac{σ_2}{σ_1}(x-μ_1) , (1-ρ^2)σ_2²)
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

const content = `
# 结论
这是我的实验结论...
`

</script>

<template>
    <ExperimentBoard>
        <template #experiment>
            <NormalDiagram :mean1="mean1" :mean2="mean2" :sigma1="sigma1" :sigma2="sigma2" :density="density">
            </NormalDiagram>
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-row  justify-center gap-3 p-3">
                <Card class="w-full w-1/2 card">
                    <CardHeader>
                        <CardTitle v-if="isChart1">二维正态的联合概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart2">二维正态的边缘分布概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart3">二维正态的条件分布</CardTitle>
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




                        <div class="grid grid-cols-2 gap-10">
                            <div v-for="(param) in parameters" :key="param.label" class="flex flex-col gap-8 pb-0">
                                <div class="flex flex-col md:w-full w-1/2 flex-1 items-center justify-center space-y-3">
                                    <Label>{{ param.label }}</Label>
                                    <div class="max-w-xl space-y-3">
                                        <Input :value="param.model" :min-fraction-digits="0.1" fluid />
                                        <Slider :value="param.model" :min="param.min" :max="param.max"
                                            :step="param.step" class="w-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="dropdown  transform translate-x-1/4 mt-6">
                                <Button tabindex="0" role="button" class="m-0">
                                    点我切换
                                </Button>
                                <ul tabindex="0"
                                    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li @click="toggleChart1">
                                        <a>二维正态分布</a>
                                    </li>
                                    <li @click="toggleChart2">
                                        <a>二维正态分布的边缘分布</a>
                                    </li>
                                    <li @click="toggleChart3">
                                        <a>二维正态分布的条件分布</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
<!-- 
                        <div class="flex  w-full">
                            <div class="dropdown">
                                <Button tabindex="0" role="button" class="m-0">
                                    点我切换
                                </Button>
                                <ul tabindex="0"
                                    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    <li @click="toggleChart1">
                                        <a>二维正态分布</a>
                                    </li>
                                    <li @click="toggleChart2">
                                        <a>二维正态分布的边缘分布</a>
                                    </li>
                                    <li @click="toggleChart3">
                                        <a>二维正态分布的条件分布</a>
                                    </li>
                                </ul>
                            </div>
                        </div> -->


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
            <CommentPanel exp-id="2DnormalDistribution" />
        </template>
    </ExperimentBoard>
</template>