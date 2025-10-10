<script setup lang="ts">
import type { ReceiveData } from '@/api/ai/aiType';
import type { Chat, Question } from '@/api/do-question/doQuestion.ts';
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ReceiveDataType } from '@/api/ai/aiType';
import { answerQuestionApi, chatWithAiAPi, clearQuestionChatApi, draftQuestionApi, fetchQuestionChatsApi, fetchQuestionListApi } from '@/api/do-question/doQuestion.ts';

import MarkdownDiv from '@/components/markdown-div/MarkdownDiv.vue';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserStore } from '@/store';

const route = useRoute();
const router = useRouter();
const questionList = ref<Question[]>([]);
const questionIndex = ref(0);
const showAiSidebar = ref(false);
const showAnalytics = ref(false);
const aiState = ref('idle');
const aiContent = ref('');
const abortController = ref<AbortController | null>(null);
const quickQuestions = ref([
  {
    title: '理解题意',
    content: '我不太明白题目的意思',
  },
  {
    title: '方法指导',
    content: '我不知道该用什么公式/定理',
  },
  {
    title: '思路确认',
    content: '我有几个思路，但不确定对不对',
  },
  {
    title: '结果检查',
    content: '我觉得我做对了，但结果不对',
  },
  {
    title: '计算帮助',
    content: '我计算到某一步卡住了',
  },
]);
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
        content: choice.content.replace(/^[A-Z]\.\s*/, ''),
      })), // .sort(() => Math.random() - 0.5),
      content: question.content.replace(/^\d+\.\s*/, ''),
    }));

    if (route.query.questionIndex) {
      const index = Number.parseInt(route.query.questionIndex as string, 10);
      if (!Number.isNaN(index) && index >= 0 && index < questionList.value.length) {
        questionIndex.value = index;
      }
      else {
        gotoQuestion(0);
      }
    }
    else {
      gotoQuestion(0);
    }
  }
  catch (error) {
    console.error('Error fetching question list:', error);
    router.go(-1);
  }
}

async function loadQuestionChats() {
  if (!currentQuestion.value || currentQuestion.value.chats) {
    return;
  }
  try {
    const response = await fetchQuestionChatsApi(currentQuestion.value.id);
    currentQuestion.value.chats = response.conversation.messages;
    if (response.conversation.messages.length > 0) {
      showAiSidebar.value = true;
    }
  }
  catch (error) {
    console.error('Error fetching question:', error);
  }
}

function gotoQuestion(index: number) {
  router.push({
    query: { questionIndex: index.toString() },
  });
}

async function answerQuestion() {
  if (currentQuestion.value === null)
    return;
  const optionIds = currentQuestion.value.choices?.filter(choice => choice.isChosen).map(choice => choice.id) || [];
  const questionId = currentQuestion.value.id;
  try {
    const response = await answerQuestionApi(questionId, optionIds, '');
    questionList.value[questionIndex.value].answerRecords = response.question.answerRecords;
    showAnalytics.value = true;
  }
  catch (error) {
    console.error('Error answering question:', error);
  }
}

async function draftQuestion() {
  if (currentQuestion.value === null)
    return;
  const optionIds = currentQuestion.value.choices?.filter(choice => choice.isChosen).map(choice => choice.id) || [];
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
  await loadQuestionChats();
});

watch(() => route.params.chapterId, () => {
  loadQuestionList();
});

watch(() => route.query.questionIndex, () => {
  if (route.query.questionIndex) {
    const index = Number.parseInt(route.query.questionIndex as string, 10);
    if (!Number.isNaN(index) && index >= 0 && index < questionList.value.length) {
      questionIndex.value = index;
      if (currentQuestion.value?.answerRecords.length === 0) {
        showAnalytics.value = false;
      }
      loadQuestionChats();
    }
  }
});

async function quickAsk(content: string) {
  if (currentQuestion.value === null || currentQuestion.value.chats === null)
    return;
  const chats = currentQuestion.value.chats;

  if (abortController.value) {
    abortController.value.abort();
  }

  const controller = new AbortController();
  abortController.value = controller;

  try {
    aiState.value = 'thinking';

    const userMessage: Chat = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    chats.push(userMessage);

    const aiMessage: Chat = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      status: 'streaming',
      hasReceivedText: false,
      isUsingTool: false,
    };
    chats.push(aiMessage);

    await chatWithAiAPi(
      currentQuestion.value.id,
      content,
      async () => {
        console.log('SSE connection established');
      },
      (data: ReceiveData) => {
        const lastMessage = chats[chats.length - 1] as Chat;
        switch (data.type) {
          case ReceiveDataType.TEXT: {
            if (lastMessage && lastMessage.role === 'assistant' && data.content) {
              lastMessage.content += data.content;
              lastMessage.hasReceivedText = true;
            }
            break;
          }
          case ReceiveDataType.TOOL: {
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.isUsingTool = true;
            }
            break;
          }
          case ReceiveDataType.ERROR: {
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.status = 'error';
              lastMessage.content += `\n\n[错误] ${data.content}`;
            }
            aiState.value = 'error';
            break;
          }
          default: {
            break;
          }
        }
      },
      () => {
        console.log('SSE connection closed');
        const lastMessage = chats[chats.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.status = 'completed';
        }
        aiState.value = 'idle';
      },
      (ev) => {
        console.error('SSE error:', ev);
        const lastMessage = chats[chats.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.status = 'error';
        }
        aiState.value = 'error';
      },
      controller,
    );
  }
  catch (error) {
    aiState.value = 'error';
    console.error('Error quickAsk:', error);
  }
  finally {
    abortController.value = null;
  }
}

function stopGenerating() {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
    aiState.value = 'idle';
  }
}

async function clearChat() {
  if (currentQuestion.value === null || currentQuestion.value.chats === null)
    return;
  try {
    await clearQuestionChatApi(currentQuestion.value.id);
    currentQuestion.value.chats = [];
  }
  catch (error) {
    console.error('Error clearChat:', error);
  }
}
</script>

<template>
  <div class="w-full h-full flex justify-center">
    <div
      v-auto-animate
      class="w-full h-full max-w-5xl p-6 flex flex-col gap-6" :class="{
        'grid grid-cols-[3fr_2fr] max-w-7xl': showAiSidebar,
      }"
    >
      <div v-auto-animate class="space-y-4 pb-6">
        <div class="border rounded-2xl shadow-sm p-4 bg-background">
          <div class="font-semibold mb-4">
            题目列表
          </div>
          <div v-if="questionList.length === 0" class="text-sm text-muted-foreground flex items-center gap-2">
            <Icon class="w-4 h-4" icon="lucide:info" />
            本章节暂时还没有题目哦
          </div>
          <div v-else class="grid grid-cols-10 gap-2">
            <Button
              v-for="(item, index) in questionList"
              :key="item.id"
              class="text-xs font-medium transition-all border"
              :class="{
                'border-red-500 !bg-red-50': item.answerRecords.length > 0 && !item.answerRecords[0].isCorrect,
                'border-green-500 !bg-green-50': item.answerRecords.length > 0 && item.answerRecords[0].isCorrect,
                'border-orange-500': !(item.answerRecords.length > 0) && item.choices.some(c => c.isChosen),
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
            <MarkdownDiv :text="currentQuestion.content" />
          </div>
          <div class="mt-4 grid gap-2">
            <RadioGroup
              v-if="currentQuestion?.choices"
              orientation="vertical"
              :model-value="(currentQuestion.choices.find(c => c.isChosen) || {}).id ?? null"
              @update:model-value="id => {
                currentQuestion?.choices.forEach(c => (c.isChosen = c.id === id));
                draftQuestion();
              }"
            >
              <label
                v-for="(choice, index) in currentQuestion.choices"
                :key="choice.id"
                :for="choice.id"
                class="group border rounded-xl p-3 flex items-center justify-start transition-all h-auto cursor-pointer"
                :class="{
                  'border-green-500 bg-green-50': currentQuestion.answerRecords.length && choice.isCorrect,
                  'border-red-500 bg-red-50': currentQuestion.answerRecords.length && !choice.isCorrect && choice.isChosen,
                  'hover:border-primary': !currentQuestion.answerRecords.length,
                }"
              >
                <RadioGroupItem
                  :id="choice.id.toString()"
                  v-auto-animate="{ duration: 100 }"
                  :value="choice.id"
                  class="mr-3 text-foreground"
                  :disabled="currentQuestion.answerRecords.length > 0"
                  @click="choice.isChosen && currentQuestion.choices.forEach(c => (c.isChosen = false))"
                />
                <label class="mr-2"> {{ String.fromCharCode(65 + index) }}. </label>
                <MarkdownDiv class="" :text="choice.content" />
              </label>
            </RadioGroup>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 items-center">
            <Button
              :disabled="currentQuestion.answerRecords.length === 0 && !currentQuestion.choices.some(c => c.isChosen)"
              class="transition-all"
              @click="() => {
                if (!currentQuestion)
                  return;
                if (currentQuestion.answerRecords.length > 0) {
                  showAnalytics = false;
                  currentQuestion.answerRecords = [];
                  currentQuestion.choices.forEach(choice => choice.isChosen = false);
                }
                else {
                  draftQuestion();
                  answerQuestion();
                }
              }"
            >
              {{ currentQuestion.answerRecords.length === 0 ? '确认作答' : '重新作答' }}
            </Button>
            <Button
              :disabled="currentQuestion.answerRecords.length === 0" variant="outline"
              class="transition-all"
              @click="showAnalytics = !showAnalytics"
            >
              {{ showAnalytics ? '隐藏解析' : '查看解析' }}
            </Button>
            <Button
              variant="outline"
              class="transition-all"
              @click="showAiSidebar = !showAiSidebar"
            >
              {{ showAiSidebar ? '收起AI辅导' : '展开AI辅导' }}
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
        <div v-if="showAnalytics && currentQuestion" class="rounded-xl border p-4 transition-all mb-12">
          <div class="font-semibold mb-1">
            答案解析
          </div>
          <MarkdownDiv :text="currentQuestion.fullAnswer" />
        </div>
      </div>

      <div v-if="showAiSidebar && currentQuestion" class="space-y-4">
        <div class="rounded-2xl border bg-background">
          <div class="p-4 border-b flex items-center gap-2">
            <div class="font-semibold">
              AI辅导
            </div>
            <div class="ml-auto text-xs text-muted-foreground">
              当前题目：{{ questionIndex + 1 }}
            </div>
          </div>

          <div v-auto-animate class="p-4 space-y-3 max-h-[600px] overflow-auto">
            <div v-if="currentQuestion?.chats?.length === 0" class="text-xs text-muted-foreground">
              开始提问吧：可以描述你卡住的步骤或贴出你的推导。
            </div>
            <div v-for="(chat, index) in (currentQuestion.chats as Chat[])" v-else :key="index">
              <div class="text-xs ml-1 mb-1 opacity-60">
                {{ chat.role === 'user' ? useUserStore().user?.username : '邮小率' }}
              </div>
              <div
                class="inline-block px-3 py-2 rounded-sm border text-sm" :class="{
                  'bg-primary text-primary-foreground': chat.role === 'user',
                  'bg-secondary text-secondary-foreground': chat.role === 'assistant',
                }"
              >
                <div v-if="chat.role === 'assistant'">
                  <div v-if="!chat.hasReceivedText && chat.status === 'streaming'" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                    <span>{{ chat.isUsingTool ? 'AI 正在获取题目信息' : 'AI 正在思考中...' }}</span>
                  </div>
                  <MarkdownDiv
                    v-else
                    class="text-sm text-secondary-foreground"
                    :text="chat.content"
                  />
                </div>
                <MarkdownDiv
                  v-else
                  class="text-sm"
                  :class="{
                    'text-primary-foreground': chat.role === 'user',
                    'text-secondary-foreground': chat.role === 'assistant',
                  }"
                  :text="chat.content"
                />
              </div>
            </div>
          </div>

          <div class="p-4 border-t space-y-2">
            <div class="flex flex-wrap gap-2">
              <Button
                v-for="question in quickQuestions"
                :key="question.title"
                :disabled="aiState !== 'idle'"
                variant="outline" class="px-2 py-1 border text-xs" @click="() => quickAsk(question.content)"
              >
                {{ question.title }}
              </Button>
            </div>
            <div class="flex gap-2">
              <Input
                v-model="aiContent"
                placeholder="向邮小率提问，例如：为什么选 B 而不是 A？"
                class="flex-1 transition-all border px-3 py-2"
                @keydown="(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (aiContent.trim() !== '') {
                      quickAsk(aiContent.trim());
                      aiContent = '';
                    }
                  }
                }"
              />
              <Button
                v-if="aiState === 'thinking'"
                variant="outline"
                class="px-3 py-2"
                @click="stopGenerating"
              >
                停止生成
              </Button>
              <Button
                v-else
                :disabled="aiContent.trim() === ''"
                class="px-3 py-2"
                @click="() => {
                  quickAsk(aiContent.trim());
                  aiContent = '';
                }"
              >
                发送
              </Button>

              <Button
                :disabled="currentQuestion.chats?.length === 0 || aiState === 'thinking'"
                class="text-red-500 hover:text-red-600 size-9 p-0"
                variant="outline"
                @click="clearChat"
              >
                <Icon
                  class="w-4 h-4"
                  icon="lucide:trash-2"
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
