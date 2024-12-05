<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { onMounted, ref, watch } from 'vue';
// 用来存储历史表达式

const props = withDefaults(defineProps<{
  mean: number
  stdDev: number
  transformedMeanY?: number
  transformedVarianceY?: number
  showHistory?: boolean
  lineShow?: boolean
}>(), {
  mean: 0,
  stdDev: 1,
  transformedMeanY: 0,
  transformedVarianceY: 1,
  showHistory: false,
  lineShow: false,
});
const uid = uuidv4();
declare const Desmos: any;

const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

let idNumber = 0;
const historyExpressions = ref<any[]>([]);
onMounted(() => {
  const options = {
    keypad: false, // 隐藏键盘
    expressions: false, // 显示表达式列表
    // settingsMenu: false,       // 隐藏设置菜单
    // zoomButtons: false,        // 隐藏缩放按钮
    // border: true,              // 显示边框
    // trace: false,              // 禁用追踪功能
    expressionsCollapsed: false, // 不折叠表达式列表
    lockViewport: false, // 允许缩放和拖动
    projectorMode: false, // 禁用投影模式
    language: 'zh-CN', // 设置语言为中文
  };
  calculator = Desmos.GraphingCalculator(elt.value, options);
  drawNormalDistribution();
  calculator.setMathBounds({
    left: props.mean - 4 * props.stdDev,
    right: props.mean + 4 * props.stdDev,
    bottom: -0.1,
    top: 0.5,
  });
  // elt.value!.style.height = (container.value?.clientHeight ?? 0) + 'px';
  // calculator.resize();
});

function drawNormalDistribution() {
  if (!calculator)
    return;
  const normalDistribution = `f(x) = \\frac{1}{${props.stdDev}\\sqrt{2\\pi}}e^{-\\frac{(x-${props.mean})^2}{2*${props.stdDev}^2}}`;
  const normalDistributionY = `g(x) = \\frac{1}{${props.transformedVarianceY}\\sqrt{2\\pi}}e^{-\\frac{(x-${props.transformedMeanY})^2}{2*${props.transformedVarianceY}^2}}`; // 新的正态分布

  if (props.showHistory) {
    idNumber = idNumber + 2;
    const expression1 = {
      id: `history_${idNumber}`,
      latex: `f(x) = \\frac{1}{${props.stdDev}\\sqrt{2\\pi}}e^{-\\frac{(x-${props.mean})^2}{2*${props.stdDev}^2}}`,
      color: 'rgba(0, 0, 255, 0.2)',
    };
    historyExpressions.value.push(expression1);
    if (props.lineShow) {
      const expression2 = {
        id: `history_${idNumber + 1}`,
        latex: `g(x) = \\frac{1}{${props.transformedVarianceY}\\sqrt{2\\pi}}e^{-\\frac{(x-${props.transformedMeanY})^2}{2*${props.transformedVarianceY}^2}}`,
        color: 'rgba(0, 255, 0, 0.2)',
      };
      historyExpressions.value.push(expression2);
    }
  }
  calculator.setExpression({ id: 'normal_distribution', latex: normalDistribution, label: 'f(x)', showLabel: true });
  calculator.setExpression({ id: 'normal_distribution_y', latex: normalDistributionY, label: 'f(y)', showLabel: true }); // 绘制第二条线

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

  // calculator.setMathBounds({
  //   left: props.mean - 4 * props.stdDev,
  //   right: props.mean + 4 * props.stdDev,
  //   bottom: -0.1,
  //   top: 1 / (props.stdDev * Math.sqrt(2 * Math.PI)),
  // });
}

// 监听 props 的变化以动态更新图像
watch(() => [props.mean, props.stdDev, props.transformedMeanY, props.transformedVarianceY, props.showHistory], () => {
  drawNormalDistribution();
});
</script>

<template>
  <div :id="uid" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
