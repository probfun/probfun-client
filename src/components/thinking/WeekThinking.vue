<script setup lang="ts">
import ThinkingBoard from '@/components/thinking/ThinkingBoard.vue';
import { weeklyThoughts } from '@/components/thinking/thinkingConfig';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
</script>

<template>
  <ThinkingBoard :show-parameter-panel="false">
    <template #thinking>
      <div class="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle class="text-xl font-bold">
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
