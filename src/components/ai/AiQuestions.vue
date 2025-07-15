<script setup lang="ts">
import { ref } from 'vue';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

defineProps<{ disabled: boolean }>();

const emit = defineEmits<{
  send: [question: string];
}>();

const questions = ref<string[]>([
  '什么是二阶矩过程？',
  '如何理解泊松过程？',
  '期中之后随机过程部分不清楚，如何理解？',
  '如何进行数学计算，尤其是随机过程的计算？',
  '互谱密度的物理意义是什么？',
  '正交增量过程如何理解？有形象具体的例子吗？',
  '平稳独立增量过程是平稳过程吗？',
  '计算功率谱密度时，为什么要引入截尾函数？是否可以不引入？',
  '为什么截尾函数引入时，功率谱密度处理的是能量有限的信号？',
  '课本上随机过程模型的例子太少，缺乏图示，如何加深理解？',
  '如何将随机过程的数学模型与实际生活中的应用联系起来？',
  '量子力学中的波函数与随机过程有什么联系？',
  '随机过程是否有类似信号系统中的拉普拉斯变换和Z变换？',
  '如何证明导数的期望可导性？',
  '为什么一维随机过程和二维随机过程的性质差异如此之大，尽管它们的基本概念看似相似？',

]);
</script>

<template>
  <Card class="overflow-y-hidden flex flex-col hover:border-primary transition-all duration-300">
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
