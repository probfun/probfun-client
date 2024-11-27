<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// 用来存储历史表达式

const props = defineProps<{
  a: number
  b: number
  k: number
  m: number
  showHistory: boolean
}>();

declare const Desmos: any;

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

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
  drawUniformDistribution();
});

function drawUniformDistribution() {
  if (!calculator)
    return;

  // 绘制左侧区间 (x < a)，函数值为 0
  const leftSide = {
    id: 'left_side',
    latex: `f_1(x) = 0 \\{x < ${props.k * props.a + props.m}\\}`,
    color: Desmos.Colors.BLUE,
  };

  // 绘制中间区间 (a <= x <= b)，函数值为 1 / (b - a)
  const middleSection = {
    id: 'middle_section',
    latex: `f_2(x) = \\frac{1}{${props.k}(${props.b} - ${props.a})} \\{${props.k * props.a + props.m} \\leq x \\leq ${props.k * props.b + props.m}\\}`,
    color: Desmos.Colors.BLUE,
  };

  // 绘制右侧区间 (x > b)，函数值为 0
  const rightSide = {
    id: 'right_side',
    latex: `f_3(x) = 0 \\{x > ${props.k * props.b + props.m}\\}`,
    color: Desmos.Colors.BLUE,
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
  };

  if (props.showHistory) {
    idNumber++;
    const expressions = [
      { id: `history_${idNumber}_1`, latex: leftSide.latex, color: Desmos.Colors.BLUE },
      { id: `history_${idNumber}_2`, latex: middleSection.latex, color: Desmos.Colors.BLUE },
      { id: `history_${idNumber}_3`, latex: rightSide.latex, color: Desmos.Colors.BLUE },
      { id: `history_${idNumber}_4`, latex: verticalLineA.latex, parametricDomain: verticalLineA.parametricDomain, color: Desmos.Colors.BLUE },
      { id: `history_${idNumber}_5`, latex: verticalLineB.latex, parametricDomain: verticalLineB.parametricDomain, color: Desmos.Colors.BLUE },
    ];

    historyExpressions.value.push(...expressions);
  }

  // 设置三个部分的表达式和垂直线
  calculator.setExpression(leftSide);
  calculator.setExpression(middleSection);
  calculator.setExpression(rightSide);
  calculator.setExpression(verticalLineA);
  calculator.setExpression(verticalLineB);

  if (props.showHistory) {
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
