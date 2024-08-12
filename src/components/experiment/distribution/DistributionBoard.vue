<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';
import DistributionDiagram from "@/components/experiment/distribution/DistributionDiagram.vue";

const mean = ref(0);
const stdDev = ref(1);
const selectedCity = ref();
const cities = ref([
    { name: '正态分布'},
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
  <div class="h-full w-full flex flex-col">
    <div class="mb-5 w-full flex-1">
      <distribution-diagram class="flex-1 h-full" :mean="mean" :std-dev="stdDev"/>
    </div>
    <div class="w-full flex items-center justify-center mb-5">
      <Select v-model="selectedCity" :options="cities" optionLabel="name" placeholder="选择一个分布" class="w-full md:w-56 mr-5" />
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
</template>

<style scoped>

</style>