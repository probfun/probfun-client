<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

const props = defineProps<{
  a: number;
  b: number;
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

  // 绘制左侧区间 (x < a)，函数值为 0
  const leftSide = {
    id: 'left_side',
    latex: `f_1(x) = 0 \\{x < ${props.a}\\}`
  };
  
  // 绘制中间区间 (a <= x <= b)，函数值为 1 / (b - a)
  const middleSection = {
    id: 'middle_section',
    latex: `f_2(x) = \\frac{1}{${props.b} - ${props.a}} \\{${props.a} \\leq x \\leq ${props.b}\\}`
  };
  
  // 绘制右侧区间 (x > b)，函数值为 0
  const rightSide = {
    id: 'right_side',
    latex: `f_3(x) = 0 \\{x > ${props.b}\\}`,
    color: Desmos.Colors.BLUE
  };

  // 绘制 x = a 处的垂直线段
  const verticalLineA = {
    id: 'vertical_line_a',
    latex: `\\left( ${props.a}, t \\right)`,
    parametricDomain: {
      min: 0,
      max: 1 / (props.b - props.a)
    },
    color: Desmos.Colors.BLUE
  };
  
  // 绘制 x = b 处的垂直线段
  const verticalLineB = {
    id: 'vertical_line_b',
    latex: `\\left( ${props.b}, t \\right)`,
    parametricDomain: {
      min: 0,
      max: 1 / (props.b - props.a)
    },
    color: Desmos.Colors.BLUE
  };

  // 设置三个部分的表达式和垂直线
  calculator.setExpression(leftSide);
  calculator.setExpression(middleSection);
  calculator.setExpression(rightSide);
  calculator.setExpression(verticalLineA);
  calculator.setExpression(verticalLineB);

  // 设置图形边界
  calculator.setMathBounds({
    left: props.a - 1,
    right: props.b + 1,
    bottom: -0.1,
    top: 1.1 / (props.b - props.a),
  });
};

// 监听 props 的变化以动态更新图像
watch(() => [props.a, props.b], () => {
  drawUniformDistribution();
});
</script>

<template>
  <div id="elt" class="w-full h-full" ref="elt"></div>
</template>

<style scoped>
</style>
