<template>
  <div class="w-full h-full flex">
    <!-- 题目展示区 -->
    <div class="w-2/3 h-full p-6 overflow-auto bg-white border border-gray-200 rounded-l-lg">
      <div v-if="currentQuestion" class="space-y-6">
        <!-- 题目内容-->
        <div class="p-4 border border-gray-200 rounded-md relative">
          <div class="text-xl">
            <span v-html="currentQuestion.content" class="ml-2"></span>
          </div>
          <!-- 难度标签 -->
          <span :class="['absolute right-3 bottom-3 px-3 py-1 rounded-full text-sm font-medium', {
            'bg-green-100 text-green-800': currentQuestion.difficulty === '简单',
            'bg-yellow-100 text-yellow-800': currentQuestion.difficulty === '中等',
            'bg-red-100 text-red-800': currentQuestion.difficulty === '困难'
          }]">
            {{ currentQuestion.difficulty }}
          </span>
        </div>

        <!-- 选项区域 -->
        <div class="space-y-3 mt-4">
          <div v-for="(choice, index) in currentQuestion.choices" :key="index"
            class="p-3 border rounded-md cursor-pointer transition-all flex items-start" :class="{
              'border-blue-500 bg-blue-50': selectedChoice === index,
              'border-green-500 bg-green-50': viewAnswer && choice.isCorrect,
              'border-red-500 bg-red-50': viewAnswer && !choice.isCorrect && selectedChoice === index,
              'border-gray-200 hover:bg-gray-50': !viewAnswer && selectedChoice !== index
            }" @click="!viewAnswer && (selectedChoice = index)">
            <!-- 选项图标 -->
            <div class="mr-3 mt-0.5">
              <i class="pi pi-circle-o text-gray-400" v-if="!viewAnswer && selectedChoice !== index"></i>
              <i class="pi pi-check-circle text-blue-500" v-if="!viewAnswer && selectedChoice === index"></i>
              <i class="pi pi-check text-green-500" v-if="viewAnswer && choice.isCorrect"></i>
              <i class="pi pi-times text-red-500"
                v-if="viewAnswer && !choice.isCorrect && selectedChoice === index"></i>
            </div>

            <!-- 选项内容 -->
            <div>
              <span class="font-medium mr-2">{{ String.fromCharCode(65 + index) }}.</span>
              <span v-html="choice.content"></span>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-between mt-6">
          <Button severity="secondary" :disabled="!hasPrevQuestion" @click="prevQuestion">
            上一题
          </Button>
          <Button severity="success" @click="handleSubmit">
            {{ viewAnswer ? '隐藏' : '提交' }}
          </Button>
          <Button severity="danger" @click="resetSelection">
            删除
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
            <span v-for="(tag, index) in currentQuestion.knowledgePoint.split('、')" :key="index"
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ tag }}
            </span>
          </div>

          <div class="text-green-600 font-medium mb-2">
            正确答案：{{String.fromCharCode(65 + currentQuestion.choices.findIndex(c => c.isCorrect))}}
          </div>
          <div class="text-gray-700">
            <p class="font-medium mb-2">解析：</p>
            <p v-html="currentQuestion.analysis"></p>
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
          <h3 class="font-semibold text-gray-800">分步骤辅导</h3>
        </div>
        <div class="space-y-4">
        </div>
      </div>

      <!-- 未提交时显示提示 -->
      <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
        点击提交按钮查看分步骤辅导
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineExpose, onMounted, defineEmits, watch, computed } from 'vue';
import Button from 'primevue/button';
import { Question, questionSectionMap } from './questionTypes';
import { fetchQuestionListApi, fetchChapterListApi } from '@/api/do-question/doQuestion.ts';

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
  if (!currentQuestion.value) return false;
  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  return currentIndex > 0;
});

const hasNextQuestion = computed(() => {
  if (!currentQuestion.value) return false;
  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  return currentIndex < currentSectionQuestions.value.length - 1;
});

// 重置功能
const resetSelection = () => {
  selectedChoice.value = null;
  viewAnswer.value = false;
};

// 加载题目
function loadQuestion(id: number) {
  const question = currentSectionQuestions.value.find(q => q.id === id);
  if (question) {
    currentQuestion.value = question;
    viewAnswer.value = false;
    selectedChoice.value = null;

    // 加载保存的结果
    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${id}`;
    userResults.value[id] = storedResults[resultKey] ?? null;
  }
}

// 刷新题目列表
async function refreshQuestionList(x: string) {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetchChapterListApi(5);
    const apiChapter = res.chapters || [];
    if (x === '1.1') {
      chapterId.value = apiChapter[0]?.children?.[0]?.id || 1;
    }
    else if (x === '1.2') {
      chapterId.value = apiChapter[0]?.children?.[1]?.id || 1;
    }
    else {
      chapterId.value = apiChapter[0]?.children?.[2]?.id || 1; 
    }

    if (chapterId.value && props.currentSection) {
      const response = await fetchQuestionListApi(chapterId.value);
      const apiQuestions = response.questions || [];

      // 转换难度数字为文本描述
      const difficultyMap: { [key: number]: string } = { 1: '简单', 2: '中等', 3: '困难' };
      const formattedQuestions = apiQuestions.map((question: any) => ({
        id: question.id,
        category: props.currentSection,
        content: question.content,
        choices: [
          { content: '选项A', isCorrect: false },
          { content: '选项B', isCorrect: true },
          { content: '选项C', isCorrect: false },
          { content: '选项D', isCorrect: false }
        ],
        analysis: '题目解析内容...',
        knowledgePoint: '相关知识点',
        difficulty: difficultyMap[question.difficulty] || '未知',
        lastResult: null
      }));

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
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载题目失败';
    console.error('刷新题目列表错误:', err);
  } finally {
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
  if (!currentQuestion.value) return;

  const currentIndex = currentSectionQuestions.value.findIndex(q => q.id === currentQuestion.value!.id);
  if (currentIndex > 0) {
    const prevQuestion = currentSectionQuestions.value[currentIndex - 1];
    loadQuestion(prevQuestion.id);
    emit('update:questionId', prevQuestion.id);
  }
}

function nextQuestion() {
  if (!currentQuestion.value) return;

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
  }
});

// 初始化和监听
onMounted(() => {
  refreshQuestionList(props.currentSection);
  if (props.questionId) {
    loadQuestion(props.questionId);
  }
});

watch(
  () => props.currentSection,
  (newSection, oldSection) => {
    if (newSection && newSection !== oldSection) {
      refreshQuestionList(props.currentSection);
    }
  }
);

watch(
  () => props.questionId,
  (newId) => {
    if (newId) {
      loadQuestion(newId);
    }
  }
);
</script>

<style scoped>
::v-deep .pi {
  font-size: 1.2rem;
}
</style>