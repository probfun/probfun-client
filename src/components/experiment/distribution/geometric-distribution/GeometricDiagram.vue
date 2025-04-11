<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  p: number
  n: number
  isChart1: boolean
  isChart2: boolean
  isChart3: boolean
  save: boolean
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
  drawDistributions();
});

function drawDistributions() {
  calculator.removeExpression({ id: 'one' });
  calculator.removeExpression({ id: 'two' });
  calculator.removeExpression({ id: 'three' });
  calculator.removeExpression({ id: 'four' });
  calculator.removeExpression({ id: 'five' });

  if (!calculator)
    return;

  const geometric1 = {
    id: 'one',
    latex: `f_1(x) = ((1 - ${props.p}) ^ {x - 1}) ${props.p} \\{x >= 0\\}`,
    color: Desmos.Colors.BLUE,
    pointSize: 12, // 设置点的大小
    lineWidth: 4.5, // 设置线条宽度
  };

  const geometric2 = {
    id: 'two',
    latex: `f_2(x) = ((1 - ${props.p}) ^ {x}) ${props.p} \\{x >= 0\\}`,
    color: Desmos.Colors.BLUE,
    pointSize: 12, // 设置点的大小
    lineWidth: 4.5, // 设置线条宽度
  };

  const geometric3 = {
    id: 'three',
    latex: `f_3(x) = ((1 - ${props.p}) ^ {x}) \\{x >= 0\\}`,
    color: Desmos.Colors.BLUE,
    pointSize: 12, // 设置点的大小
    lineWidth: 4.5, // 设置线条宽度
  };

  const geometricN = {
    id: 'four',
    latex: `f_4(x) = ((1 - ${props.p}) ^ {x + ${props.n}}) \\{x >= 0\\}`,
    color: Desmos.Colors.BLUE,
    pointSize: 12, // 设置点的大小
    lineWidth: 4.5, // 设置线条宽度
  }

  const geometricX = {
    id: 'five',
    latex: `f_5(x) = (1 - ${props.p}) ^ {${props.n}} \\{${props.n} >= x >= 0\\}`,
    color: Desmos.Colors.RED,
    lineStyle: Desmos.Styles.DASHED,
    pointSize: 12, // 设置点的大小
    lineWidth: 4.5, // 设置线条宽度
  }

  if (props.isChart1) {
    if (props.save) {
      idNumber = idNumber + 2;
      const expression1 = {
        id: `history_${idNumber}`,
        latex: `f(x) = ((1 - ${props.p}) ^ {x - 1}) ${props.p} \\{x >= 0\\}`,
        color: 'rgba(0, 0, 255, 0.2)',
      
        lineWidth: 4.5, // 设置线条宽度
      };
      historyExpressions.value.push(expression1);
    }
    calculator.setExpression(geometric1);
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
  }

  if (props.isChart2) {
    calculator.setExpression(geometric2);
  }

  if (props.isChart3) {
    calculator.setExpression(geometric3);
    calculator.setExpression(geometricN);
    calculator.setExpression(geometricX);
  }

  // 设置图形边界
  if (props.isChart3) {
    calculator.setMathBounds({
      left: -0.5,
      right: 10,
      bottom: -0.2,
      top: 2,
    });
  }
  else {
    calculator.setMathBounds({
      left: -0.5,
      right: 10,
      bottom: -0.2,
      top: 5,
    });
  }
}

// 监听 props 的变化以动态更新图像
watch(() => [props.p, props.n, props.isChart1, props.isChart2, props.isChart3, props.save], () => {
  drawDistributions();
});
</script>

<template>
  <div id="elt" ref="elt" class="w-full h-full" />
</template>

<style scoped></style>
