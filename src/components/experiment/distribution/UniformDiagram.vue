<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  a: number;
  b: number;
  k: number;
  m: number;
  showHistory: boolean;
}>();

declare const Desmos: any;

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

// const idNumber = 0;
// const historyExpressions = ref<any[]>([]);

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

function drawUniformDistribution() {
  if (!calculator)
    return;

  // 清除旧的表达式
  calculator.removeExpression({ id: 'left_side' });
  calculator.removeExpression({ id: 'middle_section' });
  calculator.removeExpression({ id: 'right_side' });
  calculator.removeExpression({ id: 'vertical_line_a' });
  calculator.removeExpression({ id: 'vertical_line_b' });

  // 绘制左侧区间 (x < a)，函数值为 0
  const leftSide = {
    id: 'left_side',
    latex: `f_1(x) = 0 \\{x < ${props.k * props.a + props.m}\\}`,
    color: Desmos.Colors.BLUE,
    lineStyle: 'solid', // 确保设置了线型
    lineWidth: 4.5, // Desmos 使用 width 属性
  };

  // 绘制中间区间 (a <= x <= b)，函数值为 1 / (b - a)
  const middleSection = {
    id: 'middle_section',
    latex: `f_2(x) = \\frac{1}{${props.k}(${props.b} - ${props.a})} \\{${props.k * props.a + props.m} \\leq x \\leq ${props.k * props.b + props.m}\\}`,
    color: Desmos.Colors.BLUE,
    lineStyle: 'solid',
    lineWidth: 4.5,
  };

  // 绘制右侧区间 (x > b)，函数值为 0
  const rightSide = {
    id: 'right_side',
    latex: `f_3(x) = 0 \\{x > ${props.k * props.b + props.m}\\}`,
    color: Desmos.Colors.BLUE,
    lineStyle: 'solid',
    lineWidth: 4.5,
  };

  // 绘制 x = a 处的垂直线段
  const verticalLineA = {
    id: 'vertical_line_a',
    latex: `\\left( ${props.k * props.a + props.m}, t \\right)`,
    parametricDomain: {
      min: 0,
      max: 1 / (props.k * (props.b - props.a)),
    },
    color: Desmos.Colors.BLUE,
    lineStyle: 'solid',
    lineWidth: 4.5,
  };

  // 绘制 x = b 处的垂直线段
  const verticalLineB = {
    id: 'vertical_line_b',
    latex: `\\left( ${props.k * props.b + props.m}, t \\right)`,
    parametricDomain: {
      min: 0,
      max: 1 / (props.k * (props.b - props.a)),
    },
    color: Desmos.Colors.BLUE,
    lineStyle: 'solid',
    lineWidth: 4.5,
  };

  // 设置三个部分的表达式和垂直线
  calculator.setExpression(leftSide);
  calculator.setExpression(middleSection);
  calculator.setExpression(rightSide);
  calculator.setExpression(verticalLineA);
  calculator.setExpression(verticalLineB);

  // 设置图形边界
  calculator.setMathBounds({
    left: props.k * props.a + props.m - 1,
    right: props.k * props.b + props.m + 1,
    bottom: -0.1,
    top: 1 / (props.k * (props.b - props.a)) + 1,
  });
}

// 监听 props 的变化以动态更新图像
watch(() => [props.a, props.b, props.k, props.m, props.showHistory], () => {
  drawUniformDistribution();
});
</script>

<template>
  <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
