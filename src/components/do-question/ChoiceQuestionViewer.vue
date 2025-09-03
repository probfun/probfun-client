<script setup lang="ts">
import type { Question } from './questionTypes';
import { Bot } from 'lucide-vue-next';
import Button from 'primevue/button';
import { computed, defineEmits, defineExpose, defineProps, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { langchainChatApi } from '@/api/ai/langchainApi';
import { fetchChapterListApi, fetchQuestionDetailApi, fetchQuestionListApi } from '@/api/do-question/doQuestion.ts';
import { error as toastError } from '@/utils/toast';
import { renderMarkdown } from './latexmarkdown.ts';
import { questionSectionMap } from './questionTypes';

import 'katex/dist/katex.css';
// 定义Props
const props = defineProps<{
  questionId: number | null;
  currentSection: string;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:questionId', id: number): void;
  (e: 'update:questionCount', count: number): void;
}>();
const route = useRoute();

// 状态管理
const currentQuestion = ref<Question | null>(null);
const viewAnswer = ref(false);
const selectedChoice = ref<number | null>(null);
const userResults = ref<Record<number, boolean>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const chapterId = ref(1);

// AI对话相关状态
const aiMessages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const aiInputMessage = ref('');
const isAiTyping = ref(false);
const conversationId = ref<string>(''); // 新增：用于保存对话ID
const abortController = ref<AbortController | null>(null); // 新增：用于中断请求

// 计算属性：获取当前章节的题目列表
const currentSectionQuestions = computed(() => {
  return questionSectionMap.value[props.currentSection] || [];
});

// 计算属性：判断是否有上一题/下一题
const hasPrevQuestion = computed(() => {
  if (!currentQuestion.value)
    return false;
  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  return currentIndex > 0;
});

const hasNextQuestion = computed(() => {
  if (!currentQuestion.value)
    return false;
  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  return currentIndex < currentSectionQuestions.value.length - 1;
});

// 重置功能
function resetSelection() {
  selectedChoice.value = null;
  viewAnswer.value = false;
  if (currentQuestion.value) {
    // 清除内存中的lastResult
    currentQuestion.value.lastResult = null;
    // 清除localStorage中对应的结果记录
    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${currentQuestion.value.id}`;
    delete storedResults[resultKey];
    localStorage.setItem('questionResults', JSON.stringify(storedResults));
    // 清除用户结果对象中的记录
    delete userResults.value[currentQuestion.value.id];
  }
}

// 加载题目
function loadQuestion(id: number) {
  const question = currentSectionQuestions.value.find(q => q.id === id);
  if (question) {
    currentQuestion.value = question;
    viewAnswer.value = false;
    selectedChoice.value = null;
    // 保存当前题目ID到localStorage
    localStorage.setItem(`currentQuestion_${props.currentSection}`, id.toString());

    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${id}`;
    userResults.value[id] = storedResults[resultKey] ?? null;
  }
}

// 刷新题目列表
async function refreshQuestionList(x: string) {
  loading.value = true;
  error.value = null;

  // 关键修复：强制重置所有状态
  currentQuestion.value = null;
  selectedChoice.value = null;
  viewAnswer.value = false;
  aiMessages.value = [];
  userResults.value = {};

  const [yStr, zStr] = x.split('.');
  const y = Number(yStr);
  const z = Number(zStr);

  try {
    const resChapter = await fetchChapterListApi(5);
    const apiChapters = resChapter.chapters || [];
    console.log('apiChapters:', apiChapters);

    chapterId.value = apiChapters[y - 1]?.children?.[z - 1]?.id;

    if (chapterId.value && props.currentSection) {
      const resQuestion = await fetchQuestionListApi(chapterId.value);
      console.log('resQuestion:', resQuestion);

      const apiQuestions = resQuestion.questions || [];
      console.log('apiQuestions', apiQuestions);

      // 转换难度数字为文本描述
      const difficultyMap: { [key: number]: string } = { 1: '简单', 2: '中等', 3: '困难' };
      const formattedQuestions = await Promise.all(apiQuestions.map(async (question: any) => {
        const resDetail = await fetchQuestionDetailApi(question.id);
        // 映射选项数据，将is_correct转换为isCorrect
        const apiChoices = Array.isArray(resDetail.question.choices) ? resDetail.question.choices : [];
        const choices = apiChoices.map((choice: any) => ({
          content: choice.content,
          isCorrect: choice.is_correct,
          knowledgePoint: choice.knowledge_point?.name || '',
        }));
        return {
          id: question.id,
          category: '',
          content: question.content,
          choices,
          analysis: question.full_answer,
          knowledgePoint: apiChoices[0]?.knowledge_point?.name || '',
          difficulty: difficultyMap[question.difficulty] || '未知',
          lastResult: null,
        };
      }));

      console.log('formattedQuestions:', formattedQuestions);

      // 更新题目映射表
      questionSectionMap.value[props.currentSection] = formattedQuestions;

      // 通知父组件更新题目数量
      emit('update:questionCount', formattedQuestions.length);

      // 自动加载第一题
      if (formattedQuestions.length > 0 && (!currentQuestion.value || !props.questionId)) {
        const firstId = formattedQuestions[0].id;
        loadQuestion(firstId);
        emit('update:questionId', firstId);
      }
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '加载题目失败';
    console.error('刷新题目列表错误:', err);
  }
  finally {
    loading.value = false;
  }
}

// 提交功能
function handleSubmit() {
  console.log('选项', selectedChoice.value);
  if (!selectedChoice.value) {
    // toastError('请输入一个选项');
    return;
  }
  viewAnswer.value = !viewAnswer.value;
  if (viewAnswer.value && selectedChoice.value !== null && currentQuestion.value) {
    // 判断答案是否正确（找到正确选项的索引）
    const correctIndex = currentQuestion.value.choices.findIndex(c => c.isCorrect);
    const correct = selectedChoice.value === correctIndex;

    userResults.value[currentQuestion.value.id] = correct;

    // 保存结果到localStorage
    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${currentQuestion.value.id}`;
    storedResults[resultKey] = correct;
    localStorage.setItem('questionResults', JSON.stringify(storedResults));

    // 自动触发AI反馈
    provideAiFeedback(correct);
  }
}

// AI智能反馈功能
async function provideAiFeedback(isCorrect: boolean) {
  isAiTyping.value = true;

  let feedbackMessage = '';

  if (isCorrect) {
    // 答题正确时的反馈
    const correctMessages = [
      '太棒了！你的答案完全正确！',
      '你真棒！这道题做得很出色！',
      '完美！你的思路很清晰！',
      '优秀！继续保持这个水平！',
    ];
    feedbackMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
  }
  else {
    // 答题错误时的反馈
    const wrongMessages = [
      '这道题目有些挑战，我们一起来分析一下。',
      '看起来遇到了一些困难，让我来帮助你理解。',
    ];
    feedbackMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
  }

  try {
    const response = await langchainChatApi(
      feedbackMessage,
      conversationId.value || undefined,
      (response) => {
        if (response.conversation_id && !conversationId.value) {
          conversationId.value = response.conversation_id;
        }

        aiMessages.value.push({
          role: 'assistant',
          content: response.message,
        });

        // 如果是错误答案，添加询问思路的消息
        if (!isCorrect) {
          setTimeout(async () => {
            const followUpResponse = await langchainChatApi(
              '你能告诉我为什么选择这个答案吗？你的解题思路是什么？这样我可以更好地帮助你理解。',
              conversationId.value,
            );

            if (followUpResponse) {
              aiMessages.value.push({
                role: 'assistant',
                content: followUpResponse.message,
              });
            }
          }, 1000);
        }

        isAiTyping.value = false;

        // 滚动到底部
        nextTick(() => {
          const container = document.querySelector('.ai-messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      (errorMessage) => {
        console.log(errorMessage);
        // 错误处理
        // aiMessages.value.push({
        //   role: 'assistant',
        //   content: feedbackMessage, // 使用本地生成的消息作为备选
        // });
        isAiTyping.value = false;
      },
    );

    if (!response) {
      // API调用失败时使用本地消息
      // aiMessages.value.push({
      //   role: 'assistant',
      //   content: feedbackMessage,
      // });
      isAiTyping.value = false;
    }
  }
  catch (error) {
    console.error('AI反馈失败:', error);
    // aiMessages.value.push({
    //   role: 'assistant',
    //   content: feedbackMessage,
    // });
    isAiTyping.value = false;
  }
}

// 上一题/下一题导航
function prevQuestion() {
  if (!currentQuestion.value)
    return;

  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  if (currentIndex > 0) {
    const prevQuestion = currentSectionQuestions.value[currentIndex - 1];
    loadQuestion(prevQuestion.id);
    emit('update:questionId', prevQuestion.id);
  }
}

function nextQuestion() {
  if (!currentQuestion.value)
    return;

  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  if (currentIndex < currentSectionQuestions.value.length - 1) {
    const nextQuestion = currentSectionQuestions.value[currentIndex + 1];
    loadQuestion(nextQuestion.id);
    emit('update:questionId', nextQuestion.id);
  }
}

// 暴露方法给父组件
defineExpose({
  loadQuestion,
  getUserResults: () => userResults.value,
  getQuestionCount: () => currentSectionQuestions.value.length,
  getQuestionResult: (id: number) => {
    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    return storedResults[`${props.currentSection}-${id}`] ?? null;
  },
  getQuestionIds: () => currentSectionQuestions.value.map(q => q.id), // 添加此方法
});

// AI对话相关方法
// 发送AI消息
async function sendAiMessage() {
  if (!aiInputMessage.value.trim())
    return;

  const userMessage = aiInputMessage.value;
  aiMessages.value.push({ role: 'user', content: userMessage });
  aiInputMessage.value = '';
  isAiTyping.value = true;

  try {
    const response = await langchainChatApi(
      userMessage,
      conversationId.value || undefined,
      (response) => {
        if (response.conversation_id && !conversationId.value) {
          conversationId.value = response.conversation_id;
        }

        aiMessages.value.push({
          role: 'assistant',
          content: response.message,
        });

        isAiTyping.value = false;

        // 滚动到底部
        nextTick(() => {
          const container = document.querySelector('.ai-messages-container');
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });
      },
      (errorMessage) => {
        console.log(errorMessage);
        toastError(`AI服务故障: ${errorMessage}`);
        isAiTyping.value = false;
      },
    );

    if (!response) {
      // API调用失败时的处理
      toastError('AI服务暂时不可用');
      isAiTyping.value = false;
    }
  }
  catch (error) {
    console.error('发送AI消息失败:', error);
    toastError('发送消息失败，请稍后重试');
    isAiTyping.value = false;
  }
}

// 初始化和监听
onMounted(async () => {
  await refreshQuestionList(props.currentSection);
  // 优先从localStorage加载上次保存的题目
  const savedId = localStorage.getItem(`currentQuestion_${props.currentSection}`);
  if (savedId) {
    const numericId = Number.parseInt(savedId, 10);
    // 验证ID是否属于当前章节
    const isValidId = currentSectionQuestions.value.some(q => q.id === numericId);
    if (isValidId) {
      loadQuestion(numericId);
      return;
    }
  }
  // 回退逻辑
  if (props.questionId) {
    loadQuestion(props.questionId);
  }
  else if (currentSectionQuestions.value.length > 0) {
    loadQuestion(currentSectionQuestions.value[0].id);
  }
});

// watch(
//   () => props.currentSection,
//   async (newSection, oldSection) => {
//     if (newSection && newSection !== oldSection) {
//       await refreshQuestionList(props.currentSection);
//     }
//   },
// );

watch(
  () => route.params.section,
  (newSection) => {
    if (newSection && typeof newSection === 'string') {
      console.log('章节切换:', newSection);
      refreshQuestionList(newSection);
    }
  },
  { immediate: true },
);

watch(
  () => route.params.questionId,
  (newQuestionId) => {
    if (newQuestionId && currentSectionQuestions.value.length > 0) {
      const questionId = typeof newQuestionId === 'string'
        ? Number.parseInt(newQuestionId)
        : Number(newQuestionId);

      if (!Number.isNaN(questionId)) {
        loadQuestion(questionId);
        // 同步到父组件
        emit('update:questionId', questionId);
      }
    }
  },
);

// 在组件卸载时清理资源
onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
  }
});
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 题目展示区 -->
    <div :key="`${props.currentSection}-${props.questionId || 0}`" class="w-2/3 h-full p-6 overflow-auto bg-white border border-gray-200 rounded-l-lg">
      <div v-if="currentQuestion" class="space-y-6">
        <!-- 题目内容 -->
        <div class="p-4 border border-gray-200 rounded-md relative">
          <div class="text-xl">
            <span class="ml-2" v-html="renderMarkdown(currentQuestion.content)" />
          </div>
          <!-- 难度标签 -->
          <span
            class="absolute right-3 bottom-3 px-3 py-1 rounded-full text-sm font-medium" :class="[{
              'bg-green-100 text-green-800': currentQuestion.difficulty === '简单',
              'bg-yellow-100 text-yellow-800': currentQuestion.difficulty === '中等',
              'bg-red-100 text-red-800': currentQuestion.difficulty === '困难',
            }]"
          >
            {{ currentQuestion.difficulty }}
          </span>
        </div>

        <!-- 选项区域 -->
        <div class="space-y-3 mt-4">
          <div
            v-for="(choice, index) in currentQuestion.choices" :key="index"
            class="p-3 border rounded-md cursor-pointer transition-all flex items-start" :class="{
              'border-blue-500 bg-blue-50': selectedChoice === index,
              'border-green-500 bg-green-50': viewAnswer && choice.isCorrect,
              'border-red-500 bg-red-50': viewAnswer && !choice.isCorrect && selectedChoice === index,
              'border-gray-200 hover:bg-gray-50': !viewAnswer && selectedChoice !== index,
            }" @click="!viewAnswer && (selectedChoice = index)"
          >
            <!-- 选项图标 -->
            <div class="mr-3 mt-0.5">
              <i v-if="!viewAnswer && selectedChoice !== index" class="pi pi-circle-o text-gray-400" />
              <i v-if="!viewAnswer && selectedChoice === index" class="pi pi-check-circle text-blue-500" />
              <i v-if="viewAnswer && choice.isCorrect" class="pi pi-check text-green-500" />
              <i
                v-if="viewAnswer && !choice.isCorrect && selectedChoice === index"
                class="pi pi-times text-red-500"
              />
            </div>

            <!-- 选项内容 -->
            <div>
              <span v-html="renderMarkdown(choice.content)" />
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-between mt-6">
          <Button severity="secondary" :disabled="!hasPrevQuestion" @click="prevQuestion">
            上一题
          </Button>
          <Button severity="success" @click="handleSubmit">
            {{ viewAnswer ? '隐藏解析' : '提交并查看解析' }}
          </Button>
          <Button severity="danger" @click="resetSelection">
            清除历史做题记录
          </Button>
          <Button severity="secondary" :disabled="!hasNextQuestion" @click="nextQuestion">
            下一题
          </Button>
        </div>

        <!-- 答案解析 -->
        <div v-if="viewAnswer" class="mt-4 p-4 bg-gray-50 rounded-md">
          <!-- 知识点标签 -->
          <div v-if="currentQuestion.knowledgePoint" class="flex flex-wrap gap-2 mb-4">
            <span class="text-gray-700 font-medium">相关知识点：</span>
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ currentQuestion.knowledgePoint }}
            </span>
          </div>

          <div class="text-green-600 font-medium mb-2">
            正确答案：{{ String.fromCharCode(65 + currentQuestion.choices.findIndex(c => c.isCorrect)) }}
          </div>
          <div class="text-gray-700">
            <p class="font-medium mb-2">
              解析：
            </p>
            <p v-html="renderMarkdown(currentQuestion.analysis)" />
          </div>
        </div>
      </div>

      <!-- 无题目时的占位 -->
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        请选择试题查看内容
      </div>
    </div>

    <!-- AI对话区 -->
    <div class="w-1/3 h-full bg-gray-50 border border-gray-200 rounded-r-lg p-4 flex flex-col">
      <!-- 标题 -->
      <div class="border-b border-gray-200 pb-2 mb-4">
        <h3 class="font-semibold text-gray-800 flex items-center">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-2">
            <Bot class="size-7 text-white" />
          </div>
          邮小率
        </h3>
      </div>

      <!-- 消息显示区域 -->
      <div class="flex-1 overflow-y-auto space-y-3 mb-4">
        <div
          v-for="(message, index) in aiMessages" :key="index"
          :class="message.role === 'user' ? 'text-right' : 'text-left'"
        >
          <div
            class="inline-block max-w-[80%] px-3 py-2 rounded-lg text-sm" :class="[
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800 border border-gray-200',
            ]"
          >
            {{ message.content }}
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isAiTyping" class="text-left">
          <div class="inline-block px-3 py-2 bg-white text-gray-800 border border-gray-200 rounded-lg text-sm">
            <span class="animate-pulse">AI正在思考...</span>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="border-t border-gray-200 pt-3">
        <div class="flex space-x-2">
          <input
            v-model="aiInputMessage"
            type="text"
            placeholder="向AI提问..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="sendAiMessage"
          >
          <button
            :disabled="!aiInputMessage.trim() || isAiTyping"
            class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="sendAiMessage"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep .pi {
  font-size: 1.2rem;
}

::v-deep .question-content .katex {
  font-size: 1.1em;
}

::v-deep .question-content .katex-display {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

::v-deep(.question-content) .katex-display>.katex {
  white-space: nowrap;
}
</style>
