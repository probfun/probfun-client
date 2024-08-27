<template>
  <Splitter class="h-full !border-0">
    <SplitterPanel class="pr-1.5">
      <div class="h-full flex flex-col overflow-auto">
        <div class="text-white px-2 rounded-xl mb-2 w-max bg-indigo-600">
          {{ title }}
          <Tag v-for="tag in tags" :key="tag" :value="tag" class="h-6 ml-2 my-2" severity="secondary" />
        </div>
        <div class="h-full w-full flex flex-col">
          <slot name="experiment"></slot>
        </div>
      </div>
    </SplitterPanel>
    <SplitterPanel class="pr-3 pl-1.5 h-full w-full" :size="25" :min-size="20">
      <Fieldset legend="提示区" class="h-full w-full overflow-auto flex">
        <slot name="hint"></slot>
      </Fieldset>
    </SplitterPanel>
  </Splitter>
</template>

<script setup lang="ts">
defineProps<{
  title: string,
  tags: string[]
}>();
</script>

<style scoped></style>
