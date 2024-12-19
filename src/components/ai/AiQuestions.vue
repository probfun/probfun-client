<script setup lang="ts">
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ref } from 'vue';

defineProps<{ disabled: boolean }>();

const emit = defineEmits<{
  send: [question: string]
}>();

const questions = ref<string[]>([
  '平稳独立增量过程是平稳过程吗？',
  '为什么一维随机过程和二维随机过程的性质差异如此之大，尽管它们的基本概念看似相似？',
  '如何计算方差？',
  '如何计算协方差？',
  '如何计算相关系数？',
  '如何计算条件期望？',
  '如何计算条件方差？',
  '如何计算条件概率？',
]);
</script>

<template>
  <Card class="h-full overflow-y-hidden flex flex-col hover:border-primary transition-all duration-300">
    <CardHeader class="px-4 py-3">
      <CardTitle class="flex items-center">
        常见问题
      </CardTitle>
    </CardHeader>
    <CardContent class="px-2 py-2 border-t flex flex-col gap-2 overflow-y-auto h-full">
      <Button v-for="(question, index) in questions" :key="index" :disabled="disabled" class="text-wrap h-auto text-left justify-start" variant="outline" @click="emit('send', question)">
        {{ question }}
      </Button>
    </CardContent>
  </Card>
</template>

<style scoped>

</style>
