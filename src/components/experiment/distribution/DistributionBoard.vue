<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DistributionDiagram from "@/components/experiment/distribution/DistributionDiagram.vue";

const mean = ref(0);
const stdDev = ref(1);
const selectedCity = ref();
const cities = ref([
  { name: '正态分布' },
]);

const latexFormula = computed(() => `f(x) = \\frac{1}{\\sqrt{2\\pi\\times${stdDev.value}^2}} e^{-\\frac{(x-${mean.value})^2}{2\\times${stdDev.value}^2}}`);
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
            <distribution-diagram class="flex-1 h-full" :mean="mean" :std-dev="stdDev" />
          </div>
          <div class="w-full flex items-center justify-center mb-5">
            <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="选择一个分布"
              class="w-full md:w-56 mr-5" />
            <div ref="katexContainer" class="text-2xl"></div>
          </div>
          <div class="flex w-full mb-5">
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
              <p> mean </p>
              <InputNumber v-model.number="mean" />
              <Slider :min="-5" :max="5" :step="0.1" v-model="mean" class="w-48" />
            </div>
            <div class="flex flex-col flex-1 items-center justify-center space-y-5">
              <p> var </p>
              <InputNumber v-model.number="stdDev" />
              <Slider :min="0.1" :max="5" :step="0.1" v-model="stdDev" class="w-48" />
            </div>
          </div>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5" :size="25">
      <Panel header="提示区" class="h-full">
        <p class="m-0">正态分布（Normal Distribution），又称高斯分布（Gaussian Distribution），是一种重要的连续概率分布，在统计学和自然科学中有广泛应用。其概率密度函数的公式为：

          \[ f(x|\mu, \sigma^2) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp \left( -\frac{(x - \mu)^2}{2\sigma^2} \right) \]

          其中：<br/>
          - \(\mu\) 是正态分布的均值，决定了分布的中心位置。<br/>
          - \(\sigma^2\) 是方差，决定了分布的宽度和形状。标准差 \(\sigma\) 是方差的平方根。<br/>

          正态分布的图形呈钟形，称为钟形曲线。它具有以下几个主要特点：<br/>

          1. 对称性：正态分布关于均值 \(\mu\) 对称。<br/>
          2. 均值、中位数和众数相等：在正态分布中，均值、中位数和众数是相同的。<br/>
          3. 68-95-99.7 规则：约68%的数据位于均值 \(\mu\) 加减一个标准差 \(\sigma\) 范围内，95% 的数据位于均值加减两个标准差内，99.7% 的数据位于均值加减三个标准差内。<br/>
          4. 渐近性：曲线的两端渐近于水平线，但永远不会触及水平线。
        </p>
      </Panel>
    </SplitterPanel>
  </Splitter>
</template>

<style scoped></style>