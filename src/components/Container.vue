<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { vAutoAnimate } from '@formkit/auto-animate'
import { h, ref } from 'vue';

export interface Tab {
  id: number
  label: string
  icon?: any
  name?: string
}

const props = defineProps<{
  tabs: Tab[]
}>();

const activeTab = ref<Tab>(props.tabs[0]);
</script>

<template>
  <div class="rounded-lg overflow-hidden border border-primary flex flex-col">
    <div
      class="w-full sticky top-0 z-10 bg-secondary p-1 flex gap-1 flex-shrink-0 overflow-x-auto"
      :style="{
        scrollbarWidth: 'none',
      }"
    >
      <Button
        v-for="tab in tabs"
        :key="tab.id"
        variant="ghost"
        size="sm"
        class="px-2 h-auto py-1 gap-1 transition-all flex"
        :class="tab.id === activeTab.id ? '!bg-background' : 'opacity-50'"
        @click="activeTab = tab"
      >
        <component :is="h(tab.icon)" v-if="tab.icon" class="size-4 flex text-primary items-center justify-center" />
        {{ tab.label }}
      </Button>
    </div>
    <div v-auto-animate class="flex-1 bg-card overflow-auto">
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>

<style scoped>

</style>
