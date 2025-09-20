<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next';
import { Badge } from '@/components/ui/badge';

interface Insight {
  title: string;
  summary: string;
  evidence?: string[];
  tags?: string[];
}

interface Props {
  insight: Insight;
}

defineProps<Props>();
</script>

<template>
  <div class="bg-white rounded-2xl p-6 shadow border hover:border-primary/30 transition-all cursor-pointer group">
    <div class="flex items-start justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors flex-1 mr-4">
        {{ insight.title }}
      </h3>
      <div class="flex gap-2 flex-wrap">
        <Badge
          v-for="(tag, tagIndex) in insight.tags"
          :key="tagIndex"
          class="rounded-full"
        >
          {{ tag }}
        </Badge>
      </div>
    </div>
    <p class="text-gray-700 mb-4 leading-relaxed">
      {{ insight.summary }}
    </p>
    <div v-if="insight.evidence && insight.evidence.length > 0" class="space-y-2">
      <h4 class="text-sm font-medium text-gray-900">
        证据支持：
      </h4>
      <div
        v-for="(evidence, evidenceIndex) in insight.evidence"
        :key="evidenceIndex"
        class="flex items-start gap-2"
      >
        <ChevronRightIcon class="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <span class="text-sm text-gray-600">{{ evidence }}</span>
      </div>
    </div>
  </div>
</template>
