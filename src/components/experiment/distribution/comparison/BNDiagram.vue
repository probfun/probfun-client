<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    n: number; // 试验次数
    p: number; // 成功概率
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

    const binomialValue: any[] = [];

    const binomialPoints = Array.from({ length: props.n + 1 }, (_, k) => {
        const binomialCoefficient = factorial(props.n) / (factorial(k) * factorial(props.n - k));
        const probability = (binomialCoefficient * (props.p ** k) * ((1 - props.p) ** (props.n - k))).toFixed(4);
        binomialValue.push(probability);
        return `(${k}, ${probability})`;
    });

    function factorial(n: any): any {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    const normal = {
        id: 'normal',
        latex: `f(x) = \\frac{1}{\\sqrt{2\\pi} \\cdot ${Math.sqrt(props.n * props.p * (1 - props.p))}} e^{-\\frac{(x - ${props.n * props.p})^2}{2 \\cdot ${props.n * props.p * (1 - props.p)}}} \\{x >= 0\\}`,
        color: Desmos.Colors.BLUE,
        lineWidth: 4.5, // 设置线条宽度
    };

    const binomialPointExpression = {
        id: `points_${idNumber}`,
        latex: `(${binomialPoints.join('), (')})`,
        color: Desmos.Colors.RED,
        pointSize: 15, // 设置点的大小
        lineWidth: 4.5, // 设置线条宽度
    };
    for (let i = 0; i <= props.n; i++) {
        const binomialLine = {
            id: `lines_${i}`,
            latex: `x = ${i} \\{0<= y <= ${binomialValue[i]}\\}`,
            color: Desmos.Colors.RED,
            lineStyle: Desmos.Styles.DASHED,
            lineWidth: 4.5, // 设置线条宽度
        }
        calculator.setExpression(binomialLine)
    }

    calculator.setExpression(normal);
    calculator.setExpression(binomialPointExpression);

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

<style scoped></style>
