<script setup lang="ts">
import { BookOpenIcon, LightbulbIcon, TargetIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  title: string;
  description: string;
  actionType: string;
  targetKnowledge: string;
  triggerReason: string;
}

interface Props {
  recommendation: Recommendation;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow border border-gray-100 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
    <div class="flex items-start justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors flex-1 mr-4">
        {{ recommendation.title }}
      </h3>
      <div class="flex items-center gap-2">
        <Badge
          class="rounded-full"
        >
          {{ recommendation.actionType }}
        </Badge>
        <TargetIcon class="w-5 h-5 text-primary" />
      </div>
    </div>
    <p class="text-gray-700 mb-4 leading-relaxed">
      {{ recommendation.description }}
    </p>
    <div class="space-y-2">
      <div class="flex items-center gap-2 text-sm">
        <BookOpenIcon class="w-4 h-4 text-blue-500" />
        <span class="text-gray-600 whitespace-nowrap">目标知识点：</span>
        <span class="text-gray-900 font-medium">{{ recommendation.targetKnowledge }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm">
        <LightbulbIcon class="w-4 h-4 text-yellow-500" />
        <span class="text-gray-600 whitespace-nowrap">触发原因：</span>
        <span class="text-gray-700">{{ recommendation.triggerReason }}</span>
      </div>
    </div>
  </div>
</template>
