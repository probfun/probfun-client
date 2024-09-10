<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
    rate: number;
    shift: number;
    showGraph: boolean;
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
    calculator.removeExpression({ id: 'left_side' });
    calculator.removeExpression({ id: 'right_side' });
    calculator.removeExpression({ id: 'fun2' });
    calculator.removeExpression({ id: 'fun3' });

    if (props.showGraph) {
        if (!calculator) return;

        // 绘制左侧区间 (x < 0)，函数值为 0
        const leftSide = {
            id: 'left_side',
            latex: `f_1(x) = 0 \\{x < 0\\}`,
            color: Desmos.Colors.BLUE
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
            bottom: -1,
            top: 10,
        });
    }
    else {
        if (!calculator) return;

        // 绘制非条件分布
        const rightSide = {
            id: 'right_side',
            latex: `f_1(x) = e^{-${props.rate} x} \\{x >= 0\\}`,
            color: Desmos.Colors.BLUE
        };

        const fun2 = {
            id: 'fun2',
            latex: `f_2(x) = e^{-${props.rate} (x + ${props.shift})} \\{x >= 0\\}`,
            color: Desmos.Colors.RED
        };

        const fun3 = {
            id: 'fun3',
            latex: `f_3(x) = e^{-${props.rate} (${props.shift})} \\{0 \\leq x \\leq ${props.shift}\\}`,
            color: Desmos.Colors.RED,
            lineStyle: Desmos.Styles.DASHED // 设置线条为虚线
        };

        // 设置三个部分的表达式和垂直线
        calculator.setExpression(rightSide);
        calculator.setExpression(fun2);
        calculator.setExpression(fun3);

        // 设置图形边界
        calculator.setMathBounds({
            left: -1,
            right: 4,
            bottom: -0.5,
            top: 1.5,
        });
    }
};

// 监听 props 的变化以动态更新图像
watch(() => [props.rate, props.shift, props.showGraph], () => {
    drawUniformDistribution();
});
</script>

<template>
    <div id="elt" class="w-full h-full" ref="elt"></div>
</template>

<style scoped></style>
