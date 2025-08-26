<template>
  <div class="w-full h-full flex">
    <!-- 题目展示区 -->
    <div class="w-2/3 h-full p-6 overflow-auto bg-white border border-gray-200 rounded-l-lg">
      <div v-if="currentQuestion" class="space-y-6">
        <!-- 题目内容-->
        <div class="p-4 border border-gray-200 rounded-md relative">
          <div class="text-xl">
            <span>{{ currentQuestion.id }}.</span>
            <span v-html="currentQuestion.content" class="ml-2"></span>
          </div>
          <!-- 难度标签调整到右下角 -->
          <span :class="['absolute right-3 bottom-3 px-3 py-1 rounded-full text-sm font-medium', {
            'bg-green-100 text-green-800': currentQuestion.difficulty === '简单',
            'bg-yellow-100 text-yellow-800': currentQuestion.difficulty === '中等',
            'bg-red-100 text-red-800': currentQuestion.difficulty === '困难'
          }]">
            {{ currentQuestion.difficulty }}
          </span>
        </div>

        <!-- 选项区域（添加图标） -->
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
          <Button severity="secondary" :disabled="currentQuestion.id <= 1" @click="prevQuestion">
            上一题
          </Button>
          <Button severity="success" @click="handleSubmit">
            {{ viewAnswer ? '隐藏' : '提交' }}
          </Button>
          <Button severity="danger" @click="resetSelection">
            删除
          </Button>
          <Button severity="secondary"
            :disabled="currentQuestion.id >= (questionSectionMap[props.currentSection] || []).length"
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
        请选择试题查看内容
      </div>
    </div>

    <!-- 分步骤辅导区 -->
    <div class="w-1/3 h-full bg-gray-50 border border-gray-200 rounded-r-lg p-4">
      <!-- 添加外层条件判断 -->
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
import { ref, defineProps, defineExpose, onMounted, defineEmits, watch } from 'vue';
import Button from 'primevue/button';
import { Question, questionSectionMap } from './questionTypes';
import { fetchQuestionListApi } from '@/api/do-question/doQuestion.ts';

// 定义Props（兼容原有接口并新增chapterId）
const props = defineProps<{
  questionId: number | null;
  currentSection: string;
  chapterId: number; // 新增章节ID参数
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update:questionId', id: number): void;
}>();

// 状态管理（保留所有原有状态）
const currentQuestion = ref<Question | null>(null);
const viewAnswer = ref(false);
const selectedChoice = ref<number | null>(null);
const userResults = ref<Record<number, boolean>>({});
const loading = ref(false); // 新增加载状态
const error = ref<string | null>(null); // 新增错误状态

// 原有重置功能
const resetSelection = () => {
  selectedChoice.value = null;
  viewAnswer.value = false;
};

// 原有题目加载功能
function loadQuestion(id: number) {
  const sectionQuestions = questionSectionMap[props.currentSection] || [];
  currentQuestion.value = sectionQuestions.find(q => q.id === id) || null;
  viewAnswer.value = false;
  selectedChoice.value = null;

  if (currentQuestion.value) {
    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${currentQuestion.value.id}`;
    currentQuestion.value.lastResult = storedResults[resultKey] ?? null;
  }
}

// 核心：刷新题目列表（完整兼容版）
async function refreshQuestionList() {
  loading.value = true;
  error.value = null;
  try {
    // 验证参数
    if (!props.chapterId || !props.currentSection) {
      throw new Error('章节参数不完整');
    }

    // 调用API获取数据
    const response = await fetchQuestionListApi(97);
    console.log('API返回:', response);
    const apiQuestions = response.questions || [];
    console.log('获取题目列表:', apiQuestions);

    // 转换为本地题目格式（保留原有结构）
    const formattedQuestions = apiQuestions.map((question: { id: any; content: any; difficulty: any; }) => ({
      id: question.id,
      category: '',
      content: question.content,
      choices: [], // 按要求不加载选项
      analysis: '',
      knowledgePoint: '',
      difficulty: question.difficulty,
      lastResult: null
    }));
    console.log('格式化题目列表:', formattedQuestions);

    // 更新题目映射表（兼容原有数据结构）
    questionSectionMap['1.1'] = formattedQuestions;
    console.log('刷新题目列表:', questionSectionMap);
    
    // 自动加载第一题（保持原有交互）
    if (formattedQuestions.length > 0 && (!currentQuestion.value || !props.questionId)) {
      const firstId = formattedQuestions[0].id;
      loadQuestion(firstId);
      emit('update:questionId', firstId);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载题目失败';
    console.error('刷新题目列表错误:', err);
  } finally {
    loading.value = false;
  }
}

// 原有提交功能
function handleSubmit() {
  viewAnswer.value = !viewAnswer.value;
  if (viewAnswer.value && selectedChoice.value !== null && currentQuestion.value) {
    const correct = selectedChoice.value === 0; // 兼容无选项场景
    userResults.value[currentQuestion.value.id] = correct;

    const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
    const resultKey = `${props.currentSection}-${currentQuestion.value.id}`;
    storedResults[resultKey] = correct;
    localStorage.setItem('questionResults', JSON.stringify(storedResults));
    currentQuestion.value.lastResult = correct;
  }
}

// 原有导航功能
function prevQuestion() {
  if (!currentQuestion.value) return;
  const sectionQuestions = questionSectionMap[props.currentSection] || [];
  const currentIndex = sectionQuestions.findIndex(q => q.id === currentQuestion.value!.id);
  if (currentIndex > 0) {
    const prevId = sectionQuestions[currentIndex - 1].id;
    loadQuestion(prevId);
    emit('update:questionId', prevId);
  }
}

function nextQuestion() {
  if (!currentQuestion.value) return;
  const sectionQuestions = questionSectionMap[props.currentSection] || [];
  const currentIndex = sectionQuestions.findIndex(q => q.id === currentQuestion.value!.id);
  if (currentIndex < sectionQuestions.length - 1) {
    const nextId = sectionQuestions[currentIndex + 1].id;
    loadQuestion(nextId);
    emit('update:questionId', nextId);
  }
}

// 暴露原有接口
defineExpose({
  loadQuestion,
  getUserResults: () => userResults.value,
  questionSectionMap
});

// 原有生命周期和监听
onMounted(() => {
  refreshQuestionList(); // 初始化时刷新题目
  if (props.questionId) {
    loadQuestion(props.questionId);
  }
});

watch(
  () => props.currentSection,
  (newSection, oldSection) => {
    if (newSection && newSection !== oldSection) {
      refreshQuestionList(); // 章节变化时刷新题目
    }
  }
);
</script>

<style scoped>
/* 优化图标显示 */
::v-deep .pi {
  font-size: 1.2rem;
}
</style>