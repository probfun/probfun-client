<script setup lang="ts">
import {
  BookOpenIcon,
  BrainIcon,
  ClockIcon,
  MessageCircleIcon,
  TargetIcon,
  TrendingUpIcon,
} from 'lucide-vue-next';
import { computed } from 'vue';

interface Props {
  title: string;
  value: number;
  explanation: string;
  icon: any;
  color: string;
}

const props = defineProps<Props>();

defineEmits<{
  hover: [];
  leave: [];
}>();

const iconComponent = computed(() => {
  const iconMap: Record<string, any> = {
    Target: TargetIcon,
    BookOpen: BookOpenIcon,
    TrendingUp: TrendingUpIcon,
    Clock: ClockIcon,
    MessageCircle: MessageCircleIcon,
    Brain: BrainIcon,
  };
  return iconMap[props.icon] || TargetIcon;
});

function getBorderColor(color: string) {
  const colorMap: Record<string, string> = {
    blue: 'hover:border-blue-200',
    green: 'hover:border-green-200',
    purple: 'hover:border-purple-200',
    orange: 'hover:border-orange-200',
    emerald: 'hover:border-emerald-200',
    indigo: 'hover:border-indigo-200',
  };
  return colorMap[color] || 'border-gray-100 hover:border-gray-200';
}

function getIconBgColor(color: string) {
  const colorMap: Record<string, string> = {
    blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
    green: 'bg-gradient-to-br from-green-400 to-green-600',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600',
    emerald: 'bg-gradient-to-br from-emerald-400 to-emerald-600',
    indigo: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
  };
  return colorMap[color] || 'bg-gradient-to-br from-gray-400 to-gray-600';
}

function getTextColor(color: string) {
  const colorMap: Record<string, string> = {
    blue: 'group-hover:text-blue-600',
    green: 'group-hover:text-green-600',
    purple: 'group-hover:text-purple-600',
    orange: 'group-hover:text-orange-600',
    emerald: 'group-hover:text-emerald-600',
    indigo: 'group-hover:text-indigo-600',
  };
  return colorMap[color] || 'hover:text-gray-600';
}
</script>

<template>
  <div
    class="bg-background rounded-2xl p-6 shadow border transition-all cursor-pointer transform group" :class="[
      getBorderColor(color),
    ]"
    @mouseenter="$emit('hover')"
    @mouseleave="$emit('leave')"
  >
    <div class="flex items-center justify-between mb-4">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center" :class="[
          getIconBgColor(color),
        ]"
      >
        <component :is="iconComponent" class="w-6 h-6 text-white" />
      </div>
      <span class="text-3xl font-bold">{{ Math.round(value * 100) }}%</span>
    </div>
    <h3 class="text-lg font-semibold mb-2 transition-all" :class="getTextColor(color)">
      {{ title }}
    </h3>
    <p class="text-sm text-gray-600 leading-relaxed">
      {{ explanation }}
    </p>
  </div>
</template>
