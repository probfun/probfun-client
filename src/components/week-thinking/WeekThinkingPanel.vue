<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import WeeklyThoughtCard from '@/components/home/WeeklyThoughtCard.vue';
import { homeConfigs } from '@/components/subject/configs.ts';
import ThinkingBoard from '@/components/week-thinking/ThinkingBoard.vue';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
const weeklyThoughts = configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].thinking : null;
</script>

<template>
  <ThinkingBoard v-if="weeklyThoughts" :show-parameter-panel="false">
    <template #thinking>
      <div class="flex items-center pb-32 h-full w-full justify-center">
        <WeeklyThoughtCard
          class="max-w-5xl w-full border-none shadow-none"
          :title="weeklyThoughts[0].title"
          :description="weeklyThoughts[0].description"
          :docx-url="weeklyThoughts[0].docxUrl"
        />
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="week-thinking" />
    </template>
  </ThinkingBoard>
</template>
