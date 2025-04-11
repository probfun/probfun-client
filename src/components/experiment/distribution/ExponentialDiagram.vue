<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  rate: number
  shift: number
  showGraph: boolean
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
  // 清除现有表达式
  calculator.removeExpression({ id: 'left_side' });
  calculator.removeExpression({ id: 'right_side' });
  calculator.removeExpression({ id: 'fun2' });
  calculator.removeExpression({ id: 'fun3' });

  if (props.showGraph) {
    if (!calculator)
      return;

    // 绘制左侧区间 (x < 0)，函数值为 0
    const leftSide = {
      id: 'left_side',
      latex: `f_1(x) = 0 \\{x < 0\\}`,
      color: Desmos.Colors.BLUE,
      lineWidth: 5, // 设置线条宽度为 5
    };

    // 绘制右侧区间 (x >= 0)
    const rightSide = {
      id: 'right_side',
      latex: `f_2(x) = ${props.rate} e^{-${props.rate} x} \\{x >= 0\\}`,
      color: Desmos.Colors.BLUE,
      lineWidth: 5, // 设置线条宽度为 5
    };

    // 如果显示历史记录，将当前表达式加入历史数组
    if (props.showHistory) {
      idNumber++;
      const expression = {
        id: `history_${idNumber}`,
        latex: `f(x) = ${props.rate} e^{-${props.rate} x} \\{x >= 0\\}`,
        color: 'rgba(0, 0, 255, 0.2)',
        lineWidth: 5, // 设置线条宽度为 5
      };
      historyExpressions.value.push(expression);
    }

    // 绘制当前的表达式
    calculator.setExpression(leftSide);
    calculator.setExpression(rightSide);
  }
  else {
    if (!calculator)
      return;

    // 绘制非条件分布
    const rightSide = {
      id: 'right_side',
      latex: `f_1(x) = e^{-${props.rate} x} \\{x >= 0\\}`,
      color: Desmos.Colors.BLUE,
      lineWidth: 5, // 设置线条宽度为 5
    };

    const fun2 = {
      id: 'fun2',
      latex: `f_2(x) = e^{-${props.rate} (x + ${props.shift})} \\{x >= 0\\}`,
      color: Desmos.Colors.RED,
      lineWidth: 5, // 设置线条宽度为 5
    };

    const fun3 = {
      id: 'fun3',
      latex: `f_3(x) = e^{-${props.rate} (${props.shift})} \\{0 \\leq x \\leq ${props.shift}\\}`,
      color: Desmos.Colors.RED,
      lineStyle: Desmos.Styles.DASHED, // 设置线条为虚线
      lineWidth: 5, // 设置线条宽度为 5
    };

    // 绘制当前的表达式
    calculator.setExpression(rightSide);
    calculator.setExpression(fun2);
    calculator.setExpression(fun3);
  }

  // 如果显示历史图像，将历史表达式加载到图表中
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
  if (props.showGraph) {
    calculator.setMathBounds({
      left: -1,
      right: 5,
      bottom: -1,
      top: 10,
    });
  }
  else {
    calculator.setMathBounds({
      left: -1,
      right: 4,
      bottom: -0.5,
      top: 1.5,
    });
  }
}

// 监听 props 的变化以动态更新图像
watch(() => [props.rate, props.shift, props.showGraph, props.showHistory], () => {
  drawUniformDistribution();
});
</script>

<template>
  <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
