<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    rate: number;
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
    drawUniformDistribution();
});

const drawUniformDistribution = () => {
    if (!calculator) return;

    // 绘制左侧区间 (x < 0)，函数值为 0
    const leftSide = {
        id: 'left_side',
        latex: `f_1(x) = 0 \\{x < 0\\}`
    };

    // 绘制右侧区间 (x >= 0)，函数值为 0
    const rightSide = {
        id: 'right_side',
        latex: `f_2(x) = ${props.rate} e^{-${props.rate} x} \\{x >= 0\\}`,
        color: Desmos.Colors.BLUE
    };

    // 设置三个部分的表达式和垂直线
    calculator.setExpression(leftSide);
    calculator.setExpression(rightSide);

    // 设置图形边界
    calculator.setMathBounds({
        left: -1,
        right: 5,
        bottom: -0.1,
        top: 5,
    });
};

// 监听 props 的变化以动态更新图像
watch(() => [props.rate], () => {
    drawUniformDistribution();
});
</script>

<template>
    <div id="elt" class="w-full h-full" ref="elt"></div>
</template>

<style scoped></style>
