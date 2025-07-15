<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const props = defineProps<{
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}>();
declare const Desmos: any;
const elt = ref<HTMLDivElement | null>(null);
let calculator: any = null;

onMounted(() => {
  const options = {
    keypad: false,
    expressions: false,
    expressionsCollapsed: false,
    lockViewport: false,
    projectorMode: false,
    language: 'zh-CN',
  };

  calculator = Desmos.Calculator3D(elt.value, options);
  updateGraphAndBounds();
});

function updateGraphAndBounds() {
  const area = (props.x2 - props.x1) * (props.y2 - props.y1);
  const f = 1 / area;

  // 设置坐标轴范围（自动调整）
  calculator.setMathBounds({
    left: props.x1 - 1,
    right: props.x2 + 1,
    bottom: props.y1 - 1,
    top: props.y2 + 1,
    zMin: 0,
    zMax: f + 0.1, // 给z轴留一些空间
  });

  // 更新图形
  const uniform1 = {
    id: 'main',
    latex: `f_1(x, y) = \\frac{1}{${area}} \\{${props.x1} <= x <= ${props.x2}\\} \\{${props.y1} <= y <= ${props.y2}\\}`,
    color: Desmos.Colors.RED,
  };
  const uniform2 = {
    id: 'next',
    latex: `f_2(x, y) = 0 \\{ x < ${props.x1}, x > ${props.x2}, y < ${props.y1}, y > ${props.y2}\\}`,
    color: Desmos.Colors.BLUE,
  };
  const uniform3 = {
    id: 'shude1',
    latex: `x = ${props.x1} \\{0 <= z <= ${f}\\} \\{${props.y1} <= y <= ${props.y2}\\}`,
    color: Desmos.Colors.BLUE,
  };
  const uniform4 = {
    id: 'shude2',
    latex: `x = ${props.x2} \\{0 <= z <= ${f}\\} \\{${props.y1} <= y <= ${props.y2}\\}`,
    color: Desmos.Colors.BLUE,
  };
  const uniform5 = {
    id: 'shude3',
    latex: `y = ${props.y1} \\{0 <= z <= ${f}\\} \\{${props.x1} <= x <= ${props.x2}\\}`,
    color: Desmos.Colors.BLUE,
  };
  const uniform6 = {
    id: 'shude4',
    latex: `y = ${props.y2} \\{0 <= z <= ${f}\\} \\{${props.x1} <= x <= ${props.x2}\\}`,
    color: Desmos.Colors.BLUE,
  };

  calculator.setExpression(uniform1);
  calculator.setExpression(uniform2);
  calculator.setExpression(uniform3);
  calculator.setExpression(uniform4);
  calculator.setExpression(uniform5);
  calculator.setExpression(uniform6);
}

watch(() => [props.x1, props.x2, props.y1, props.y2], () => {
  updateGraphAndBounds();
});
</script>

<template>
  <div ref="elt" style="width: 100%; height: 100%;" />
</template>
