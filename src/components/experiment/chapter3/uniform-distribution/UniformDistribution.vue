<script setup lang="ts">
import ExperimentBoard from '@/components/experiment/ExperimentBoard.vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import UniformDiagram from './UniformDiagram.vue';
import { ref } from 'vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toMarkdown } from '@/utils/markdown';
import katex from 'katex';
import { computed, onMounted, watch, nextTick } from 'vue';
import 'katex/dist/katex.min.css';

const parameters = [
    { label: 'x1', model: x1, min: 0, max: 30, step: 0.1 },
    { label: 'x2', model: x2, min: 1, max: 30, step: 0.2 },
    { label: 'y1', model: y1, min: 0, max: 30, step: 0.2 },
    { label: 'y2', model: y2, min: 1, max: 30, step: 0.2 }
];
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
    return `f(x) `;
    //     return `f(x) =
    //  \\begin{cases} 
    // \\frac{${1}}{b - a} , & \\text{if } a \\leq x \\leq b \\\\
    // 0 , & \\text{otherwise}
    // \\end{cases}
    //  = 
    //  \\begin{cases} 
    // \\frac{${1}}{${bFormatted} - ${aFormatted}} , & \\text{if } ${a.value[0]} \\leq x \\leq ${bFormatted} \\\\
    // 0 , & \\text{otherwise}
    // \\end{cases}`;

});

const twoFormula = computed(() => {

    return `f(x) `;
});

const threeFormula = computed(() => {

    return `f(x)`;
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
    nextTick(() => {
        renderFormula();
    });
});

watch([oneFormula, twoFormula, threeFormula], () => {
    nextTick(() => {
        renderFormula();
    });
});



const content = `
# 结论
这是我的实验结论...
`

</script>

<template>
    <ExperimentBoard>
        <template #experiment>
            <UniformDiagram class="flex-1 h-full" :x1="x1" :x2="x2" :y1="y1" :y2="y2" :show-graph="isChart1">
            </UniformDiagram>
        </template>
        <template #parameter>
            <div class="w-full h-full flex flex-col items-center justify-center gap-3 p-3">
                <Card class="w-full">
                    <CardHeader>
                        <CardTitle v-if="isChart1">二维正态的联合概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart2">二维正态的边缘分布概率密度函数（PDF）</CardTitle>
                        <CardTitle v-if="isChart3">二维正态的条件分布</CardTitle>
                    </CardHeader>
                    <CardContent class="flex w-full justify-center">
                        <div v-show="isChart1" ref="oneContainer" class="text-base" />
                        <div v-show="isChart2" ref="twoContainer" class="text-base" />
                        <div v-show="isChart3" ref="threeContainer" class="text-base" />

                    </CardContent>
                </Card>

                <Card class="w-full flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>
                            参数调整
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="flex-1 flex flex-col justify-center items-center gap-3">
                        <div class="dropdown ">
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
                        <div v-for="param in parameters" :key="param.label"
                            class="flex flex-col flex-1 items-center justify-center space-y-5">
                            <Label>{{ param.label }}</Label>
                            <div class="max-w-xl space-y-3">
                                <Input v-model.number="param.model" :min-fraction-digits="0.1" />
                                <Slider v-model="param.model" :min="param.min" :max="param.max" :step="param.step"
                                    class="w-48" />
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