<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    lambda: number,
    save: boolean,
}>();

let idNumber = 0;
const historyExpressions = ref<any[]>([]);
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
    calculator.removeExpression({ id: 'poisson' });
    calculator.removeExpression({ id: `points_${idNumber}` });

    if (!calculator) return;

    const points = Array.from({ length: 51 }, (_, k) => `(${k}, ${(Math.exp(-props.lambda) * (props.lambda ** k) / factorial(k)).toFixed(4)})`);

    const pointExpression = {
        id: `points_${idNumber}`,
        latex: `(${points.join('), (')})`,
        color: Desmos.Colors.BLUE,
        pointSize: 8 // 设置点的大小
    };

    // 辅助函数计算阶乘
    function factorial(n: any): any {
        return n <= 1 ? 1 : n * factorial(n - 1);
    }

    const poisson = {
        id: 'poisson',
        latex: `f(x) = \\frac{${props.lambda}^x e^{- ${props.lambda}}}{x!} \\{x >= 0\\}`,
        color: Desmos.Colors.BLUE
    };


    if (props.save) {
        idNumber = idNumber + 2;
        const expression1 = {
            id: `history_${idNumber}`,
            latex: `f(x) = \\frac{${props.lambda}^x e^{- ${props.lambda}}}{x!} \\{x >= 0\\}`,
            color: 'rgba(0, 0, 255, 0.2)',
        };
        historyExpressions.value.push(expression1);
    }
    if (!props.save) {
        calculator.setExpression(pointExpression);
    }
    calculator.setExpression(poisson);
    if (props.save) {
        historyExpressions.value.forEach((expression) => {
            calculator.setExpression(expression);
        });
    }
    else {
        historyExpressions.value.forEach((expression) => {
            calculator.removeExpression({ id: expression.id });
        });
        // 清空历史表达式数组
        historyExpressions.value = [];
    }

    // 设置图形边界
    calculator.setMathBounds({
        left: -0.5,
        right: 10,
        bottom: -0.2,
        top: 0.5,
    });

};

// 监听 props 的变化以动态更新图像
watch(() => [props.lambda, props.save], () => {
    drawDistributions();
});
</script>

<template>
    <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
