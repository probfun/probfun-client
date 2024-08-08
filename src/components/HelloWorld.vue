<template>
  <div class="flex flex-col items-center justify-center w-full">
    <Splitter style="height: 750px; width: 1100px;" class="mb-8 h-full p-0">
      <SplitterPanel>
        <Splitter style="height: 750px;" layout="vertical">
          <SplitterPanel>
            <Panel header="图形化结果展示区">
              <div class="mb-2 max-w-screen-lg" style="width: 550px;">
                <Line :data="data" :options="options" />
              </div>
            </Panel>
          </SplitterPanel>
          <SplitterPanel>
            <div class="input">
              <Panel header="输入区">
                <div class="flex w-full">
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
                <div class="w-full flex items-center justify-center h-36">
                  <div ref="katexContainer" class="text-3xl"></div>
                </div>
              </Panel>
            </div>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
      <SplitterPanel size="30">
        <div class="summary">
          <Panel header="提示区">
            <p class="m-0">一些提示信息或总结</p>
          </Panel>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts" setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  PointElement,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {Line} from 'vue-chartjs'
import {computed, onMounted, ref, watch} from 'vue'
import katex from 'katex';
import 'katex/dist/katex.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function generateNormalDistribution(mean: number, stdDev: number, count: number) {
  const data = [];
  const labels = [];
  for (let i = -count; i <= count; i++) {
    const x = i / 10;
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    labels.push(x.toFixed(1));
    data.push(y);
  }
  return { labels, data };
}

const mean = ref(0);
const stdDev = ref(1);
const count = 50;

const normalDistribution = computed(() => generateNormalDistribution(mean.value, stdDev.value, count));

const data = computed(() => ({
  labels: normalDistribution.value.labels,
  datasets: [{
    label: 'Normal Distribution',
    data: normalDistribution.value.data,
    borderColor: '#42A5F5',
    fill: true,
    pointHoverRadius: 0,
    pointRadius: 0
  }]
}));

const options = {
  responsive: true,
  scales: {
    x: {
      title: {
        display: true,
        text: 'X-axis'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Y-axis'
      }
    }
  }
};

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