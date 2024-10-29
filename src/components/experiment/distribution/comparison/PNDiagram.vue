<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    lambda: number
}>();

onMounted(() => {
    const options = {
        keypad: false,
        expressions: false,
        expressionsCollapsed: false,
        lockViewport: false,
        projectorMode: false,
        language: 'zh-CN',
    };

    calculator = Desmos.GraphingCalculator(elt.value, options);
    drawDistributions();
});

const drawDistributions = () => {
    if (!calculator) return;

    const poisson = {
        id: 'poisson',
        latex: `f(x) = \\frac{${props.lambda}^x e^{- ${props.lambda}}}{x!} \\{x > 0\\}`,
        color: Desmos.Colors.BLUE
    };

    const normal = {
        id: 'normal',
        latex: `f(x) = \\frac{1}{\\sqrt{2\\pi \\cdot ${props.lambda}}} e^{-\\frac{(x - ${props.lambda})^2}{2 \\cdot ${props.lambda}}} \\{x > 0\\}`,
        color: Desmos.Colors.RED
    };
    calculator.setExpression(poisson);
    calculator.setExpression(normal);

    // 设置图形边界
    calculator.setMathBounds({
        left: -0.5,
        right: 100,
        bottom: -0.01,
        top: 0.1,
    });
};

// 监听 props 的变化以动态更新图像
watch(() => [props.lambda], () => {
    drawDistributions();
});
</script>

<template>
    <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
