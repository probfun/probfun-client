<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    lambda: number
}>();

let idNumber = 0;

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

    const poissonValue: any[] = [];

    const poissonPoints = Array.from({ length: 150 }, (_, k) => {
        poissonValue.push((Math.exp(-props.lambda) * ((props.lambda) ** k) / factorial(k)).toFixed(4));
        return `(${k}, ${(Math.exp(-props.lambda) * ((props.lambda) ** k) / factorial(k)).toFixed(4)})`;
    });

    const poissonPointExpression = {
        id: `points_${idNumber + 1}`,
        latex: `(${poissonPoints.join('), (')})`,
        color: Desmos.Colors.BLUE,
        
        lineWidth: 4.5, // 设置线条宽度
    };
    for (let i = 0; i <= 200; i++) {
        const poissonLine = {
            id: `plines_${i}`,
            latex: `x = ${i} \\{0<= y <= ${poissonValue[i]}\\}`,
            color: Desmos.Colors.BLUE,
            pointSize: 15, // 设置点的大小
            lineWidth: 4.5, // 设置线条宽度
        }
        calculator.setExpression(poissonLine)
    }

    function factorial(n: any): any {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    const normal = {
        id: 'normal',
        latex: `f(x) = \\frac{1}{\\sqrt{2\\pi \\cdot ${props.lambda}}} e^{-\\frac{(x - ${props.lambda})^2}{2 \\cdot ${props.lambda}}} \\{x >= 0\\}`,
        color: Desmos.Colors.RED,
        lineWidth: 4.5, // 设置线条宽度
    };
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
