<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import ExponentialDiagram from './ExponentialDiagram.vue';

const rate = ref(2);
const selectedCity = ref();
const cities = ref([
  { name: '正态分布' },
]);

const latexFormula = computed(() => `f(x) = ${rate.value} e^{-${rate.value} x}, \\quad x \\geq 0`);
const katexContainer = ref<HTMLElement | null>(null);

const renderFormula = () => {
  if (katexContainer.value) {
    katex.render(latexFormula.value, katexContainer.value, {
      throwOnError: false
    });
  }
};

onMounted(() => {
  renderFormula();
});

watch(latexFormula, () => {
  renderFormula();
});

</script>

<template>
  <Splitter class="mb-8 h-full !border-0">
    <SplitterPanel class="pr-1.5">
      <div class="flex-1 p-3.5 border rounded-lg flex flex-col h-full">
        <div class="mb-2 font-bold"> 实验区 </div>
        <div class="h-full w-full flex flex-col">
          <div class="mb-5 w-full flex-1">
            <exponential-diagram class="flex-1 h-full" :rate="rate" />
          </div>
          <div class="w-full flex items-center justify-center mb-5">
            <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="选择一个分布"
              class="w-full md:w-56 mr-5" />
            <div ref="katexContainer" class="text-2xl"></div>
          </div>
          <div class="flex w-full mb-5">
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
              <p> Rate parameter </p>
              <InputNumber v-model.number="rate" />
              <Slider :min="0" :max="5" :step="0.1" v-model="rate" class="w-48" />
            </div>
          </div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5" :size="25">
      <Panel header="提示区" class="h-full">
        <p class="m-0">指数分布（Exponential
          Distribution）是连续概率分布中的一种，用于描述独立事件之间的时间间隔。它通常与泊松分布相关联：泊松分布描述在固定时间段内发生的事件数量，而指数分布描述事件发生的时间间隔。 </p>
        <h1 class="font-semibold my-2">指数分布的定义</h1>
        <p class="m-0">如果事件的发生时间间隔 \( T \) 服从指数分布，那么其概率密度函数（PDF）为：

          \[
          f(t; \lambda) = \lambda e^{-\lambda t} \quad \text{for } t \geq 0
          \]

          其中：<br>
          - \( t \) 是时间间隔（非负实数）<br>
          - \( \lambda \) 是分布的参数，通常称为“速率参数”，它表示单位时间内事件发生的平均次数；<br>
          - \( e \) 是自然对数的底数（约等于 2.71828）；<br>
        </p>
        <h1 class="font-semibold my-2">期望值和方差</h1>
        <p class="m-0">- 期望值：\( E(T) = \frac{1}{\lambda} \)
          <br>
          - 方差：\( \text{Var}(T) = \frac{1}{\lambda^2} \)
        </p>
        <h1 class="font-semibold my-2">特点</h1>
        <p class="m-0">1. 无记忆性：指数分布具有无记忆性（Memoryless Property），即过去的时间不会影响未来事件的发生。这意味着在时间 \( t \) 后再等 \( s \)
          时间发生事件的概率，与一开始就等待 \( s \) 时间的概率是相同的。数学上表示为：
          \[
          P(T > t + s \mid T > t) = P(T > s)
          \]
          2. 关联泊松分布：指数分布和泊松分布密切相关，如果事件发生时间间隔服从指数分布，则在给定时间段内的事件发生次数服从泊松分布。</p>
      </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>