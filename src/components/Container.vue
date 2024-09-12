<script setup lang="ts">
import {h, ref} from "vue";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import { SquareSigma } from 'lucide-vue-next';
import { vAutoAnimate } from '@formkit/auto-animate'

export interface Tab {
  id: number;
  label: string;
  icon?: any;
  name?: string;
}

const props = defineProps<{
  tabs: Tab[];
}>();

const activeTab = ref<number>(props.tabs[0].id ?? 0);
</script>

<template>
<div class="rounded-lg overflow-hidden border border-primary flex flex-col">
  <div class="w-full sticky top-0 z-10 bg-secondary p-1 flex gap-1 flex-shrink-0 overflow-x-auto"
  :style="{
    scrollbarWidth: 'none',
  }">
    <Button
        v-for="tab in tabs"
        :key="tab.id"
        variant="ghost"
        size="sm"
        class="px-2 h-auto py-1 gap-1 transition-all flex"
        :class="tab.id === activeTab ? '!bg-background' : 'opacity-50'"
        @click="activeTab = tab.id"
    >
      <component v-if="tab.icon" :is="h(tab.icon)" class="size-4 flex text-primary items-center justify-center"></component>
      {{ tab.label }}
    </Button>
  </div>
  <div class="flex-1 bg-card overflow-auto min-h-0" v-auto-animate>
    <slot :activeTab="activeTab"></slot>
  </div>
</div>
</template>

<style scoped>

</style>