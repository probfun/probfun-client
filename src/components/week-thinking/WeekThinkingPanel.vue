<script setup lang="ts">
import CommentPanel from '@/components/comment/CommentPanel.vue';
import { homeConfigs } from '@/components/subject/configs.ts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ThinkingBoard from '@/components/week-thinking/ThinkingBoard.vue';
import { useConfigStore } from '@/store';

const configStore = useConfigStore();
const weeklyThoughts = configStore.currentSubjectId ? homeConfigs[configStore.currentSubjectId].thinking : null;
</script>

<template>
  <ThinkingBoard v-if="weeklyThoughts" :show-parameter-panel="false">
    <template #thinking>
      <div class="flex items-center pb-32 h-full">
        <Card class="max-w-5xl border-none shadow-none">
          <CardHeader>
            <CardTitle class="text-3xl font-bold">
              {{ weeklyThoughts[0].title }}
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-for="(item, idx) in weeklyThoughts[0].description" :key="idx">
              <Label class="block text-base leading-relaxed">{{ item }}</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>
    <template #comment>
      <CommentPanel exp-id="week-thinking" />
    </template>
  </ThinkingBoard>
</template>
