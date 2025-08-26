<template>
  <div class="w-full h-screen bg-gray-50 overflow-auto">
    <!-- 顶部操作栏 -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div class="flex items-center gap-4">
        <span class="text-gray-700">在 【{{ currentChapterTitle }}】 中</span>
        <Button 
          ref="questionListTrigger" 
          severity="secondary" 
          class="text-sm text-gray-600"
          @click="toggleQuestionList"
          :disabled="!questionLoaded"
        >
          <List class="w-4 h-4 mr-2" />选择试题
        </Button>
      </div>
      <Button severity="primary" class="text-white bg-indigo-600 hover:bg-indigo-700" @click="viewReleaseDialog = true">
        发布一个自测
      </Button>
    </div>

    <!-- 题目选择弹窗 -->
    <div 
      v-if="showQuestionList && questionCount > 0"
      class="absolute left-6 mt-2 w-auto bg-white border border-gray-200 rounded-md shadow-lg z-50"
    >
      <div class="p-3 flex flex-wrap gap-2 min-w-[200px]">
        <Button 
          v-for="i in questionCount" 
          :key="i" 
          :label="i.toString()" 
          :severity="getButtonSeverity(i)" 
          size="sm"
          @click.stop="handleSelectQuestion(i)"
        />
      </div>
    </div>

    <!-- 题目查看区 -->
    <div class="flex h-[calc(100vh-150px)] p-5">
      <ChoiceQuestionViewer 
        ref="questionViewer" 
        :current-section="currentSection"
        @update:questionId="(id) => currentQuestionId = id"
        @update:questionCount="(count) => questionCount = count"
        @questionLoaded="(loaded) => questionLoaded = loaded"
      />
    </div>

    <!-- 发布弹窗 -->
    <Dialog v-model:visible="viewReleaseDialog" header="发布新的自测" :style="{ width: '60%' }">
      <div class="p-6 text-center text-gray-600">
        <p>自测发布功能正在开发中</p>
      </div>
      <template #footer>
        <Button severity="secondary" @click="viewReleaseDialog = false">
          取消
        </Button>
        <Button severity="primary" class="ml-2" @click="viewReleaseDialog = false">
          确认
        </Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ChoiceQuestionViewer from './ChoiceQuestionViewer.vue';
import { List } from 'lucide-vue-next';
import { questionItems, experimentItems } from '@/components/sidebar/DrawerItem.ts';
import type { DrawerItem } from '@/components/sidebar/DrawerItem.ts';

// 状态管理
const showQuestionList = ref(false);
const viewReleaseDialog = ref(false);
const currentQuestionId = ref<number | null>(null);
const questionViewer = ref<any>(null);
const questionListTrigger = ref<any>(null);
const questionResults = ref<Record<number, boolean>>({});
const route = useRoute();
const currentChapterTitle = ref('');
const currentSection = ref('');
const questionCount = ref(0);
const questionLoaded = ref(false); // 标记题目是否加载完成

// 查找章节标题
const findTitleByRoute = (routePath: string, items: DrawerItem[]): string => {
  // 精确匹配
  for (const item of items) {
    if (item.route === routePath) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }
  
  // 模糊匹配
  for (const item of items) {
    if (item.route && routePath.startsWith(item.route.replace(/\/$/, ''))) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }
  
  // 从路由参数获取
  if (route.params && route.params.chapter) {
    return route.params.chapter as string;
  }
  
  // 从本地存储恢复
  const savedTitle = localStorage.getItem('lastChapterTitle');
  return savedTitle || '选择章节';
};

// 初始化章节信息
const initChapterInfo = async (path: string) => {
  let title = '';
  const pathMatch = path.match(/\/dashboard\/question\/([\d.]+)%20/);
  currentSection.value = pathMatch ? pathMatch[1] : '';

  if (path.startsWith('/dashboard/question/')) {
    title = findTitleByRoute(path, questionItems.value);
    currentQuestionId.value = null; // 重置题目ID，等待子组件加载

    await nextTick();

    // 保存标题到本地存储
    if (title && title !== '选择章节') {
      localStorage.setItem('lastChapterTitle', title);
    }
  } else if (path.startsWith('/dashboard/experiment/')) {
    title = findTitleByRoute(path, experimentItems.value);
  }

  currentChapterTitle.value = title;
};

// 组件挂载时初始化
onMounted(async () => {
  await nextTick();
  initChapterInfo(route.path);
});

// 监听路由变化
watch(
  () => route.path,
  async (newPath) => {
    await initChapterInfo(newPath);
  }
);

// 切换题目选择弹窗
function toggleQuestionList() {
  if (!questionLoaded.value) return; // 未加载完成不允许打开
  showQuestionList.value = !showQuestionList.value;
}

// 处理题目选择
function handleSelectQuestion(index: number) {
  if (!questionViewer.value) return;
  
  // 获取当前章节的题目列表
  const questions = questionViewer.value.getCurrentSectionQuestions();
  if (questions && questions[index - 1]) {
    const questionId = questions[index - 1].id;
    currentQuestionId.value = questionId;
    questionViewer.value.loadQuestion(questionId);
    showQuestionList.value = false;
  }
}

// 获取按钮样式
function getButtonSeverity(index: number): string {
  if (!questionViewer.value) return 'secondary';
  
  // 获取当前章节的题目列表
  const questions = questionViewer.value.getCurrentSectionQuestions();
  if (!questions || !questions[index - 1]) return 'secondary';
  
  const questionId = questions[index - 1].id;
  
  // 当前选中题目
  if (currentQuestionId.value === questionId) return 'primary';
  
  // 题目结果
  const result = questionViewer.value.getQuestionResult(questionId);
  if (result === true) return 'success';
  if (result === false) return 'danger';
  
  return 'secondary';
}
</script>

<style scoped>
/* 调整弹窗位置 */
::v-deep .p-dialog {
  z-index: 1000 !important;
}
</style>