<script setup lang="ts">
import type { Question } from '@/api/do-question/doQuestion.ts';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { answerQuestionApi, draftQuestionApi, fetchQuestionListApi } from '@/api/do-question/doQuestion.ts';
import MarkdownDiv from '@/components/markdown-div/MarkdownDiv.vue';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const route = useRoute();
const router = useRouter();
const questionList = ref<Question[]>([]);
const questionIndex = ref(0);
const showSidebar = ref(false);
const currentQuestion = computed(() => {
  if (questionIndex.value < 0 || questionIndex.value >= questionList.value.length) {
    return null;
  }
  return questionList.value[questionIndex.value];
});

async function loadQuestionList() {
  const chapterId = route.params.chapterId as string | undefined;
  try {
    if (!chapterId) {
      router.go(-1);
      return;
    }
    const response = await fetchQuestionListApi(chapterId);
    questionList.value = response.questions.map(question => ({
      ...question,
      choices: question.choices!.map(choice => ({
        ...choice,
        // is_chosen: false,
        content: choice.content.replace(/^[A-Z]\.\s*/, ''),
      })).sort(() => Math.random() - 0.5),
      content: question.content.replace(/^\d+\.\s*/, ''),
    }));
    gotoQuestion(0);
  }
  catch (error) {
    console.error('Error fetching question list:', error);
    router.go(-1);
  }
}

async function loadQuestion() {
  // const questionId = questionList.value[questionIndex.value].id;
  // if (questionList.value[questionIndex.value].choices) {
  //   return;
  // }
  // try {
  //   const response = await fetchQuestionApi(questionId);
  //   const choices = response.question.choices!.map(choice => ({
  //     ...choice,
  //     is_chosen: false,
  //     content: choice.content.replace(/^[A-Z]\.\s*/, ''),
  //   }));
  //   choices.sort(() => Math.random() - 0.5);
  //   questionList.value[questionIndex.value].choices = choices;
  // }
  // catch (error) {
  //   console.error('Error fetching question:', error);
  // }
}

function gotoQuestion(index: number) {
  router.push({
    query: { questionIndex: index.toString() },
  });
}

async function answerQuestion() {
  if (currentQuestion.value === null)
    return;
  const optionIds = currentQuestion.value.choices?.filter(choice => choice.is_chosen).map(choice => choice.id) || [];
  const questionId = currentQuestion.value.id;
  try {
    const response = await answerQuestionApi(questionId, optionIds, '');
    questionList.value[questionIndex.value].answer_records = response.question.answer_records;
  }
  catch (error) {
    console.error('Error answering question:', error);
  }
}

async function draftQuestion() {
  if (currentQuestion.value === null)
    return;
  const optionIds = currentQuestion.value.choices?.filter(choice => choice.is_chosen).map(choice => choice.id) || [];
  const questionId = currentQuestion.value.id;
  try {
    await draftQuestionApi(questionId, optionIds);
  }
  catch (error) {
    console.error('Error draftQuestion:', error);
  }
}

onMounted(async () => {
  await loadQuestionList();
  await loadQuestion();
});

watch(() => route.params.chapterId, () => {
  loadQuestionList();
});

watch(() => route.query.questionIndex, () => {
  if (route.query.questionIndex) {
    const index = Number.parseInt(route.query.questionIndex as string, 10);
    if (!Number.isNaN(index) && index >= 0 && index < questionList.value.length) {
      questionIndex.value = index;
      loadQuestion();
    }
  }
});
</script>

<template>
  <div
    class="w-full h-full max-w-5xl mx-auto p-6 grid gap-6" :class="{
      'grid-cols-[2fr_1fr]': showSidebar,
    }"
  >
    <div class="space-y-4">
      <div class="border rounded-2xl shadow-sm p-4 bg-background">
        <div class="font-semibold mb-4">
          题目列表
        </div>
        <div class="grid grid-cols-10 gap-2">
          <Button
            v-for="(item, index) in questionList"
            :key="item.id"
            class="text-xs font-medium transition-all border"
            :class="{
              'border-red-500 !bg-red-50': item.answer_records.length > 0 && !item.answer_records[0].is_correct,
              'border-green-500 !bg-green-50': item.answer_records.length > 0 && item.answer_records[0].is_correct,
              'border-orange-500': !(item.answer_records.length > 0) && item.choices.some(c => c.is_chosen),
              'ring-2 border-none ring-primary': index === questionIndex,
            }"
            variant="outline"
            @click="gotoQuestion(index)"
          >
            {{ index + 1 }}
          </Button>
        </div>
      </div>
      <div v-if="currentQuestion" class="border rounded-2xl shadow-sm p-5 bg-background">
        <div class="flex items-start gap-3">
          <span class="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
            {{ questionIndex + 1 }}
          </span>
          <MarkdownDiv class="flex items-center gap-2" :text="currentQuestion.content" />
        </div>
        <div class="mt-4 grid gap-2">
          <RadioGroup
            v-if="currentQuestion?.choices"
            orientation="vertical"
            :model-value="(currentQuestion.choices.find(c => c.is_chosen) || {}).id ?? null"
            @update:model-value="id => {
              currentQuestion?.choices.forEach(c => (c.is_chosen = c.id === id));
              draftQuestion();
            }"
          >
            <label
              v-for="(choice, index) in currentQuestion.choices"
              :key="choice.id"
              :for="choice.id"
              class="group border rounded-xl p-3 flex items-center justify-start transition-all h-auto cursor-pointer"
              :class="{
                'border-green-500 bg-green-50': currentQuestion.answer_records.length && choice.is_correct,
                'border-red-500 bg-red-50': currentQuestion.answer_records.length && !choice.is_correct && choice.is_chosen,
                'hover:border-primary': !currentQuestion.answer_records.length,
              }"
            >
              <RadioGroupItem
                :id="choice.id.toString()"
                v-auto-animate="{ duration: 100 }"
                :value="choice.id"
                class="mr-3 text-foreground"
                :disabled="currentQuestion.answer_records.length > 0"
                @click="choice.is_chosen && currentQuestion.choices.forEach(c => (c.is_chosen = false))"
              />
              <label class="mr-2"> {{ String.fromCharCode(65 + index) }}. </label>
              <MarkdownDiv class="" :text="choice.content" />
            </label>
          </RadioGroup>
        </div>

        <div class="mt-4 flex flex-wrap gap-2 items-center">
          <Button
            class="transition-all"
            @click="() => {
              if (!currentQuestion)
                return;
              if (currentQuestion.answer_records.length > 0) {
                currentQuestion.answer_records = []
                currentQuestion.choices.forEach(choice => choice.is_chosen = false)
              }
              else {
                draftQuestion();
                answerQuestion();
              }
            }"
          >
            {{ currentQuestion.answer_records.length === 0 ? '确认作答' : '重新作答' }}
          </Button>
          <Button
            :disabled="currentQuestion.answer_records.length === 0" variant="outline"
            class="transition-all"
          >
            查看解析
          </Button>
          <Button
            :disabled="currentQuestion.answer_records.length === 0" variant="outline"
            class="transition-all"
          >
            展开AI辅导
          </Button>

          <div class="ml-auto flex gap-2">
            <Button
              :disabled="questionIndex <= 0"
              variant="outline"
              @click="() => {
                if (questionIndex > 0) {
                  gotoQuestion(questionIndex - 1);
                }
              }"
            >
              上一题
            </Button>
            <Button
              :disabled="questionIndex >= questionList.length - 1"
              variant="outline"
              @click="() => {
                if (questionIndex < questionList.length - 1) {
                  gotoQuestion(questionIndex + 1);
                }
              }"
            >
              下一题
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
