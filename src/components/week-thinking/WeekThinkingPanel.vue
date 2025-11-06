<script setup lang="ts">
import { computed, ref } from 'vue';
import CommentPanel from '@/components/comment/CommentPanel.vue';
import WeeklyThoughtCard from '@/components/home/WeeklyThoughtCard.vue';
import { homeConfigs } from '@/components/subject/configs.ts';
import ThinkingBoard from '@/components/week-thinking/ThinkingBoard.vue';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
// 响应式获取当前学科的每周一思，避免切换学科后需要刷新
const weeklyThoughts = computed(() =>
  configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].thinking : null,
);

// 详情页支持切换周次（默认第1周 -> 索引0）
const selectedWeek = ref(0);
const currentThought = computed(() => {
  const list = weeklyThoughts.value || [];
  if (!list.length)
    return null;
  const idx = Math.min(Math.max(selectedWeek.value, 0), list.length - 1);
  return list[idx];
});
</script>

<template>
  <ThinkingBoard
    v-if="weeklyThoughts"
    :key="`${currentThought?.pdfUrl || currentThought?.docxUrl || ''}-${currentThought?.title || ''}-${selectedWeek}`"
    :show-parameter-panel="false"
  >
    <template #thinking>
      <div class="flex flex-col gap-2 pb-32 h-full w-full items-center">
        <!-- 周次切换器 -->
        <div class="w-full max-w-5xl flex justify-end">
          <select
            v-model.number="selectedWeek"
            class="border rounded px-2 py-1 text-sm bg-background"
          >
            <option v-for="(t, i) in weeklyThoughts" :key="i" :value="i">
              第{{ i + 1 }}周
            </option>
          </select>
        </div>
        <!-- 内容区 -->
        <div class="flex items-center h-full w-full justify-center">
          <WeeklyThoughtCard
            v-if="currentThought"
            :key="currentThought.docxUrl || currentThought.pdfUrl || currentThought.title"
            class="max-w-5xl w-full border-none shadow-none"
            :title="currentThought.title"
            :description="currentThought.description"
            :docx-url="currentThought.docxUrl"
            :pdf-url="currentThought.pdfUrl"
          />
        </div>
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="week-thinking" />
    </template>
  </ThinkingBoard>
</template>
