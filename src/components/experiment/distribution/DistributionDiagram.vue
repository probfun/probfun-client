<script setup lang="ts">
declare const Desmos: any;
import { onMounted, ref, watch } from 'vue';
const elt = ref<HTMLDivElement | null>(null);

let calculator: any = null;
const props = defineProps<{
  mean: number;
  stdDev: number;
}>();

onMounted(() => {
  const options = {
    keypad: false,             // 隐藏键盘
    expressions: false,         // 显示表达式列表
    // settingsMenu: false,       // 隐藏设置菜单
    // zoomButtons: false,        // 隐藏缩放按钮
    // border: true,              // 显示边框
    // trace: false,              // 禁用追踪功能
    expressionsCollapsed: false, // 不折叠表达式列表
    lockViewport: false,       // 允许缩放和拖动
    projectorMode: false,      // 禁用投影模式
    language: 'zh-CN',         // 设置语言为中文
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

const drawNormalDistribution = () => {
  if (!calculator) return;
  const normalDistribution = `f(x) = \\frac{1}{${props.stdDev}\\sqrt{2\\pi}}e^{-\\frac{(x-${props.mean})^2}{2*${props.stdDev}^2}}`;

  calculator.setExpression({ id: 'normal_distribution', latex: normalDistribution });

  // calculator.setMathBounds({
  //   left: props.mean - 4 * props.stdDev,
  //   right: props.mean + 4 * props.stdDev,
  //   bottom: -0.1,
  //   top: 1 / (props.stdDev * Math.sqrt(2 * Math.PI)),
  // });
};

// 监听 props 的变化以动态更新图像
watch(() => [props.mean, props.stdDev], () => {
  drawNormalDistribution();
});
</script>

<template>
  <div>
    <div id="elt" class="w-full h-full" ref="elt" ></div>
  </div>
</template>

<style scoped>

</style>