<template>
  <div class="w-full h-screen bg-gray-50 overflow-auto">
    <!-- 顶部操作栏 -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div class="flex items-center gap-4">
        <span class="text-gray-700">在 【{{ currentChapterTitle }}】 中</span>
        <Button ref="questionListTrigger" severity="secondary" class="text-sm text-gray-600"
          @click="toggleQuestionList">
          <List class="w-4 h-4 mr-2" />选择试题
        </Button>
      </div>
      <Button severity="primary" class="text-white bg-indigo-600 hover:bg-indigo-700" @click="viewReleaseDialog = true">
        发布一个自测
      </Button>
    </div>

    <div v-if="showQuestionList"
      class="absolute left-[485px] bottom-[567px] mt-3 w-180 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <div class="p-3 flex flex-wrap gap-2 min-w-[200px]">
        <!-- 修改按钮循环逻辑 -->
        <Button v-for="i in questionCount" :key="i" :label="i.toString()" :severity="getButtonSeverity(i)" size="sm"
          @click.stop="handleSelectQuestion(i)" />
      </div>
    </div>

    <div class="flex h-[calc(100vh-150px)] p-5">
      <ChoiceQuestionViewer ref="questionViewer" :question-id="currentQuestionId" :current-section="currentSection"
        :chapter-id="chapterId" @update:questionId="(id) => currentQuestionId = id" />
    </div>

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
import { ref, watch, nextTick } from 'vue';
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
let chapterId = ref(1);

const findTitleByRoute = (routePath: string, items: DrawerItem[]): string => {
  for (const item of items) {
    if (item.route === routePath) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }
  return '';
};

watch(
  () => route.path,
  async (newPath) => {
    let title = '';
    const pathMatch = newPath.match(/\/dashboard\/question\/([\d.]+)%20/);
    currentSection.value = pathMatch ? pathMatch[1] : '';

    if (newPath.startsWith('/dashboard/question/')) {
      const pathWithoutPrefix = newPath.replace('/dashboard/question/', '');
      title = findTitleByRoute(newPath, questionItems.value);
      currentQuestionId.value = 1;

      // 等待组件初始化完成
      await nextTick();

      // 获取当前章节题目数量
      const sectionQuestions = questionViewer.value?.questionSectionMap[currentSection.value] || [];
      questionCount.value = sectionQuestions.length;

      if (questionViewer.value) {
        questionViewer.value.loadQuestion(1);
      }
    } else if (newPath.startsWith('/dashboard/experiment/')) {
      title = findTitleByRoute(newPath, experimentItems.value);
    }

    currentChapterTitle.value = title || '选择章节';
  },
  { immediate: true }
);

// 切换试题弹窗显示/隐藏
function toggleQuestionList() {
  showQuestionList.value = !showQuestionList.value;
  console.log('showQuestionList:', showQuestionList.value);
  console.log('questionListTrigger element:', questionListTrigger.value);
  if (showQuestionList.value && !questionListTrigger.value) {
    console.error('questionListTrigger ref未初始化');
  }
}

// 选择试题
function handleSelectQuestion(id: number) {
  currentQuestionId.value = id;
  showQuestionList.value = false;
  // 调用子组件加载题目
  if (questionViewer.value) {
    questionViewer.value.loadQuestion(id);
    // 新增：获取答题结果
    questionResults.value = questionViewer.value.getUserResults();
  }
}

function getButtonSeverity(id: number): string {
  if (currentQuestionId.value === id) return 'primary'; // 当前选中题目

  // 直接从localStorage读取结果
  const storedResults = JSON.parse(localStorage.getItem('questionResults') || '{}');
  const resultKey = `${currentSection.value}-${id}`;
  const lastResult = storedResults[resultKey];

  // 根据上次结果显示不同颜色
  if (lastResult === true) return 'success'; // 上次做对
  if (lastResult === false) return 'danger'; // 上次做错
  return 'secondary'; // 未做过
}
</script>

<style scoped></style>