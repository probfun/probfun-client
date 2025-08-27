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
        <Button v-for="(id, index) in questionIds" :key="id" :label="(index + 1).toString()"
          :severity="getButtonSeverity(id)" size="sm" @click.stop="handleSelectQuestion(id)" />
      </div>
    </div>

    <div class="flex h-[calc(100vh-150px)] p-5">
      <ChoiceQuestionViewer ref="questionViewer" :question-id="currentQuestionId" :current-section="currentSection"
        @update:questionId="(id: number) => currentQuestionId = id"
        @update:questionCount="(count) => questionCount = count" />
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
const questionIds = ref<number[]>([]);

// 改进：更可靠的路径解析函数
const findTitleByRoute = (routePath: string, items: DrawerItem[]): string => {
  // 先尝试精确匹配
  for (const item of items) {
    if (item.route === routePath) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }

  // 如果精确匹配失败，尝试模糊匹配（处理可能的路由参数差异）
  for (const item of items) {
    if (item.route && routePath.startsWith(item.route.replace(/\/$/, ''))) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }

  return '';
};

// 改进：分离初始化逻辑为独立函数
const initChapterInfo = async (path: string) => {
  let title = '';
  const pathMatch = path.match(/\/dashboard\/question\/([\d.]+)%20/);
  currentSection.value = pathMatch ? pathMatch[1] : '';

  if (path.startsWith('/dashboard/question/')) {
    title = findTitleByRoute(path, questionItems.value);
    // 如果找不到标题，尝试从路由参数中获取
    if (!title && route.params && route.params.chapter) {
      title = route.params.chapter as string;
    }

    currentQuestionId.value = 1;

    await nextTick();

    // 获取当前章节题目数量
    if (questionViewer.value) {
      questionCount.value = questionViewer.value.getQuestionCount();
      if (questionCount.value > 0) {
        questionViewer.value.loadQuestion(1);
      }
    }
  } else if (path.startsWith('/dashboard/experiment/')) {
    title = findTitleByRoute(path, experimentItems.value);
  }

  // 如果仍然没有标题，尝试从本地存储恢复
  if (!title) {
    const savedTitle = localStorage.getItem('lastChapterTitle');
    if (savedTitle) {
      title = savedTitle;
    } else {
      title = '选择章节';
    }
  } else {
    // 保存标题到本地存储，用于刷新时恢复
    localStorage.setItem('lastChapterTitle', title);
  }

  currentChapterTitle.value = title;
};

// 改进：使用onMounted确保路由已准备好
onMounted(async () => {
  // 等待路由完全就绪
  await nextTick();
  initChapterInfo(route.path);
});

// 监听路由变化
watch(
  () => route.path,
  async (newPath: string) => {
    await initChapterInfo(newPath);
  }
);

watch(
  () => questionItems.value,
  async (newItems: any[]) => {
    if (newItems.length > 0) {
      initChapterInfo(route.path);
    }
  },
  { deep: true }
);

watch(
  () => questionCount.value,
  async (newCount: number) => {
    if (questionViewer.value) {
      // 从子组件获取真实题目ID列表，替换之前的连续数字生成逻辑
      questionIds.value = await questionViewer.value.getQuestionIds();
    }
  }
);

// 切换试题弹窗显示/隐藏
function toggleQuestionList() {
  showQuestionList.value = !showQuestionList.value;
  if (showQuestionList.value && !questionListTrigger.value) {
    console.error('questionListTrigger ref未初始化');
  }
}

// 选择试题
function handleSelectQuestion(id: number) {
  currentQuestionId.value = id;
  showQuestionList.value = false;
  if (questionViewer.value) {
    questionViewer.value.loadQuestion(id);
    questionResults.value = questionViewer.value.getUserResults();
  }
}

function getButtonSeverity(id: number): string {
  if (currentQuestionId.value === id) return 'primary';
  if (questionViewer.value) {
    const result = questionViewer.value.getQuestionResult(id);
    if (result === true) return 'success';
    if (result === false) return 'danger';
  }
  return 'secondary';
}
</script>

<style scoped></style>