<script setup lang="ts">
import type { StatisticsData } from '../../types/statistics';
import { onMounted, ref } from 'vue';
import {
  generateSimpleStatisticsData,
} from '../../utils/mockData';
import ProgressCurve from './ProgressCurve.vue';
import RadarChart from './RadarChart.vue';

const statisticsData = ref<StatisticsData | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    // 直接使用简单模拟数据，无需等待
    statisticsData.value = generateSimpleStatisticsData();
  }
  catch (error) {
    console.error('Failed to load statistics data:', error);
  }
  finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div
    class="w-full h-full p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl shadow-lg"
  >
    <div class="prose-sm max-w-full mb-6">
      <h3 class="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
        <span class="mr-2">📊</span>学情数据可视化
      </h3>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-[500px]">
      <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p class="text-slate-500 dark:text-slate-400">
        数据加载中...
      </p>
    </div>

    <!-- 图表容器 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-8rem)]">
      <!-- 雷达图卡片 -->
      <!-- 雷达图卡片 -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex flex-col h-full transform transition-all hover:shadow-lg"
      >
        <h4 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
          知识点掌握程度雷达图
        </h4>
        <div class="flex-grow flex items-center justify-center">
          <RadarChart :data="statisticsData?.radarData || []" />
        </div>
      </div>

      <!-- 进步曲线卡片 -->
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 flex flex-col h-full transform transition-all hover:shadow-lg"
      >
        <h4 class="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
          学习进步趋势曲线
        </h4>
        <div class="flex-grow flex items-center justify-center">
          <ProgressCurve :data="statisticsData?.progressData || []" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式调整 */
@media (max-width: 1024px) {
  .grid-cols-1 {
    height: auto;
  }
}
</style>
