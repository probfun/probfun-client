<template>
  <div class="w-full h-full flex">
    <!-- 加载状态 -->
    <div v-if="loading" class="w-full h-full flex items-center justify-center">
      <div class="text-center">
        <div class="pi pi-spin pi-circle-o-notch text-3xl text-indigo-600 mb-2"></div>
        <p>正在加载题目数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error && !loading" class="w-full h-full flex items-center justify-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- 题目展示区（仅在加载完成后显示） -->
    <div v-if="!loading && !error" class="w-full h-full flex">
      <div class="w-2/3 h-full p-6 overflow-auto bg-white border border-gray-200 rounded-l-lg">
        <div v-if="currentQuestion" class="space-y-6">
          <!-- 题目内容 -->
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
            <Button severity="secondary" :disabled="!hasPrevQuestion"
              @click="prevQuestion">
              上一题
            </Button>
            <Button severity="success" @click="handleSubmit">
              {{ viewAnswer ? '隐藏' : '提交' }}
            </Button>
            <Button severity="danger" @click="resetSelection">
              重置
            </Button>
            <Button severity="secondary" :disabled="!hasNextQuestion"
              @click="nextQuestion">
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
          该章节暂无题目数据
        </div>
      </div>

      <!-- 分步骤辅导区 -->
      <div class="w-1/3 h-full bg-gray-50 border border-gray-200 rounded-r-lg p-4">
        <div v-if="viewAnswer && currentQuestion">
          <div class="border-b border-gray-200 pb-2 mb-4">
            <h3 class="font-semibold text-gray-800">分步骤辅导</h3>
          </div>
          <div class="space-y-4">
            <!-- 辅导内容可在这里扩展 -->
          </div>
        </div>

        <!-- 未提交时显示提示 -->
        <div v-else class="flex items-center justify-center h-full text-gray-500 text-sm">
          点击提交按钮查看分步骤辅导
        </div>
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
  currentSection: string;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:questionId', id: number): void;
  (e: 'update:questionCount', count: number): void;
  (e: 'questionLoaded', loaded: boolean): void;
}>();

// 状态管理
const currentQuestion = ref<Question | null>(null);
const viewAnswer = ref(false);
const selectedChoice = ref<number | null>(null);
const userResults = ref<Record<number, boolean>>({});
const loading = ref(true); // 初始为加载状态
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

// 重置选择
const resetSelection = () => {
  selectedChoice.value = null;
  viewAnswer.value = false;
};

// 加载指定题目
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

// 从API刷新题目列表
async function refreshQuestionList() {
  loading.value = true;
  error.value = null;
  try {
    // 获取章节信息
    const res = await fetchChapterListApi(5);
    const apiChapter = res.chapters || [];
    chapterId.value = apiChapter[0]?.children?.[0]?.id || 1;

    if (chapterId.value && props.currentSection) {
      // 获取题目数据
      const response = await fetchQuestionListApi(chapterId.value);
      const apiQuestions = response.questions || [];
      
      // 转换API数据为本地格式
      const difficultyMap: { [key: number]: string } = { 1: '简单', 2: '中等', 3: '困难' };
      const formattedQuestions = apiQuestions.map((question: any) => ({
        id: question.id,
        category: props.currentSection,
        content: question.content || '暂无题目内容',
        choices: question.choices?.map((c: any) => ({ 
          content: c.content || '暂无选项内容', 
          isCorrect: c.isCorrect || false 
        })) || [],
        analysis: question.analysis || '暂无解析',
        knowledgePoint: question.knowledgePoint || '暂无知识点',
        difficulty: difficultyMap[question.difficulty] || '未知',
        lastResult: null
      }));

      // 填充到对应章节的空壳中
      questionSectionMap.value[props.currentSection] = formattedQuestions;
      
      // 通知父组件更新题目数量
      emit('update:questionCount', formattedQuestions.length);
      
      // 加载第一题
      if (formattedQuestions.length > 0) {
        loadQuestion(formattedQuestions[0].id);
        emit('update:questionId', formattedQuestions[0].id);
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载题目失败';
    console.error('刷新题目列表错误:', err);
  } finally {
    loading.value = false;
    emit('questionLoaded', true);
  }
}

// 提交答案
function handleSubmit() {
  viewAnswer.value = !viewAnswer.value;
  if (viewAnswer.value && selectedChoice.value !== null && currentQuestion.value) {
    const correctIndex = currentQuestion.value.choices.findIndex(c => c.isCorrect);
    const correct = selectedChoice.value === correctIndex;
    
    userResults.value[currentQuestion.value.id] = correct;

    // 保存结果到本地存储
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
  },
  refreshQuestionList // 暴露刷新方法方便父组件调用
});

// 初始化时加载题目
onMounted(async () => {
  await refreshQuestionList();
});

// 监听章节变化重新加载
watch(
  () => props.currentSection,
  async (newSection) => {
    if (newSection) {
      await refreshQuestionList();
    }
  }
);
</script>

<style scoped>
::v-deep .pi {
  font-size: 1.2rem;
}
</style>
    