<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { useVModel } from '@vueuse/core';

const props = withDefaults(defineProps<{
  modelValue?: number;
  min?: number;
  max?: number;
  defaultValue?: number;
  class?: HTMLAttributes['class'];
}>(), {
  modelValue: 0,
  min: -Infinity,
  max: Infinity,
  defaultValue: 0,
});

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <Input
    v-model="modelValue"
    type="number"
    :min="props.min"
    :max="props.max"
    :placeholder="`${props.min} ~ ${props.max}`"
    :class="props.class"
  />
</template>

<style scoped>

</style>
