<script setup lang="ts">
import type { Question } from './questionTypes';
import Button from 'primevue/button';
import { computed, defineEmits, defineExpose, defineProps, onMounted, ref, watch } from 'vue';
import { fetchChapterListApi, fetchQuestionDetailApi, fetchQuestionListApi } from '@/api/do-question/doQuestion.ts';
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

// 状态管理
const currentQuestion = ref<Question | null>(null);
const viewAnswer = ref(false);
const selectedChoice = ref<number | null>(null);
const userResults = ref<Record<number, boolean>>({});
const loading = ref(false);
const error = ref<string | null>(null);
const chapterId = ref(1);

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

watch(
  () => props.currentSection,
  async (newSection, oldSection) => {
    if (newSection && newSection !== oldSection) {
      await refreshQuestionList(props.currentSection);

      // ✅ 强制重置题目
      if (currentSectionQuestions.value.length > 0) {
        const firstId = currentSectionQuestions.value[0].id;
        loadQuestion(firstId);
        emit('update:questionId', firstId);
      }
      else {
        currentQuestion.value = null; // 没有题目时清空
      }
    }
  },
);

// watch(
//   () => props.currentSection,
//   async (newSection, oldSection) => {
//     if (newSection && newSection !== oldSection) {
//       await refreshQuestionList(props.currentSection);
//     }
//   }
// );

watch(
  () => props.questionId,
  (newId) => {
    if (newId) {
      loadQuestion(newId);
    }
  },
);
</script>

<template>
  <div class="w-full h-full flex">
    <!-- 题目展示区 -->
    <div class="w-2/3 h-full p-6 overflow-auto bg-white border border-gray-200 rounded-l-lg">
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

    <!-- 分步骤辅导区 -->
    <div class="w-1/3 h-full bg-gray-50 border border-gray-200 rounded-r-lg p-4">
      <div v-if="viewAnswer && currentQuestion">
        <div class="border-b border-gray-200 pb-2 mb-4">
          <h3 class="font-semibold text-gray-800">
            分步骤辅导
          </h3>
        </div>
        <div class="space-y-4" />
      </div>

      <!-- 未提交时显示提示 -->
      <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
        点击提交按钮查看分步骤辅导
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
