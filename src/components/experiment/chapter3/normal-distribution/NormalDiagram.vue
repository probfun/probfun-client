<script setup lang="ts">
import { color } from 'echarts/core';
import { onMounted, ref } from 'vue';

const props = defineProps<{
    mean1: number,
    mean2: number,
    sigma1: number,
    sigma2: number,
    density: number,
}>();
declare const Desmos: any;
const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

onMounted(() => {
    const options = {
        keypad: false,
        expressions: false,
        expressionsCollapsed: false,
        lockViewport: false,
        projectorMode: false,
        language: 'zh-CN',
    };

    // 创建 Desmos 3D 图形计算器实例
    calculator = Desmos.Calculator3D(elt.value, options);
    draw3DUniformDistribution();
    calculator.setMathBounds({
        left: props.mean1 - 1,
        right: props.mean1 + 1,
        bottom: props.mean2 - 1,
        top: props.mean2 + 1
    });
});

function draw3DUniformDistribution() {

    const normal = {
        id: 'normal',
        latex: `f(x, y) = \\frac{1}{2*\\pi*\\sqrt{1-${props.density}^2}} * e^{\\frac{-1}{2*(1-${props.density}^2)}*(\\frac{(x-${props.mean1})^2}{${props.sigma1}^2}-2*${props.density}*\\frac{(x-${props.mean1})*(y-${props.mean2})}{${props.sigma1}*${props.sigma2}}+\\frac{(y-${props.mean2})^2}{${props.sigma2}^2})}`,
        color: Desmos.Colors.BLUE
    }
    calculator.setExpression(normal);
}
</script>

<template>
    <div ref="elt" style="width: 100%; height: 100%;"></div>
</template>