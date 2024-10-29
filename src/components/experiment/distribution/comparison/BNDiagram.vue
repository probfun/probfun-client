<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    n: number; // 试验次数
    p: number; // 成功概率
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

    const normal = {
        id: 'normal',
        latex: `f(x) = \\frac{1}{\\sqrt{2\\pi} \\cdot ${Math.sqrt(props.n * props.p * (1 - props.p))}} e^{-\\frac{(x - ${props.n * props.p})^2}{2 \\cdot ${props.n * props.p * (1 - props.p)}}} \\{x > 0\\}`,
        color: Desmos.Colors.BLUE
    };

    const binomial = {
        id: 'binomial',
        latex: `f(x) = \\frac{${props.n}!}{x!((${props.n} - x)!)} ${props.p}^{x} (1 - ${props.p})^{${props.n} - x} \\{x > 0\\}`,
        color: Desmos.Colors.RED
    }
    calculator.setExpression(normal);
    calculator.setExpression(binomial);

    // 设置图形边界
    calculator.setMathBounds({
        left: -0.5,
        right: 20,
        bottom: -0.1,
        top: 0.5,
    });
};

// 监听 props 的变化以动态更新图像
watch(() => [props.n, props.p], () => {
    drawDistributions();
});
</script>

<template>
    <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped>
</style>
