<script setup lang="ts">
import {ref} from "vue";

interface Tab {
  id: number;
  label: string;
  icon?: string;
}

const props = defineProps<{
  tabs: Tab[];
}>();

const activeTab = ref<number>(props.tabs[0].id ?? 0);
</script>

<template>
<div class="rounded-xl bg-base-100 overflow-auto border border-primary flex flex-col">
  <div class="w-full bg-base-200 p-1.5 flex gap-1 flex-shrink-0">
    <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-2 gap-1 btn btn-sm text-base btn-ghost transition-all flex"
        :class="tab.id === activeTab ? '' : 'opacity-60'"
        @click="activeTab = tab.id"
    >
      <span v-if="tab.icon" v-html="tab.icon" class="size-5 flex items-center justify-center"></span>
      {{ tab.label }}
    </button>
  </div>
  <div class="flex-1 overflow-auto">
    <slot :activeTab="activeTab"></slot>
  </div>
</div>
</template>

<style scoped>

</style>