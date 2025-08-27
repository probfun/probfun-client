<template>
  <div class="w-full h-screen bg-gray-50 overflow-auto">
    <!-- 顶部操作栏 -->
    <div class="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
      <div class="flex items-center gap-4">
        <span class="text-gray-700">在 【{{ currentChapterTitle }}】 中</span>
        
        <!-- 关键修改：添加相对定位容器 -->
        <div class="relative">
          <Button ref="questionListTrigger" severity="secondary" class="text-sm text-gray-600"
            @click="toggleQuestionList">
            <List class="w-4 h-4 mr-2" />选择试题
          </Button>

          <!-- 选择试题弹出框 - 使用Tailwind定位 -->
          <div 
            v-if="showQuestionList"
            class="absolute left-full top-0 ml-2 mt-0 w-[750px] bg-white border border-gray-200 rounded-md shadow-lg z-50"
            :class="{ 'right-full left-auto': shouldFlipPosition }"
          >
            <div class="p-3 flex flex-wrap gap-2 min-w-[750px]">
              <Button v-for="(id, index) in questionIds" :key="id" :label="(index + 1).toString()"
                :severity="getButtonSeverity(id)" size="sm" @click.stop="handleSelectQuestion(id)" />
            </div>
          </div>
        </div>
      </div>
      <Button severity="primary" class="text-white bg-indigo-600 hover:bg-indigo-700" @click="viewReleaseDialog = true">
        发布一个自测
      </Button>
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
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue';
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
const shouldFlipPosition = ref(false); // 控制弹窗是否需要翻转到左侧

// 检查弹窗是否会超出视口右侧
const checkPosition = () => {
  if (questionListTrigger.value && questionListTrigger.value.$el) {
    const buttonRect = questionListTrigger.value.$el.getBoundingClientRect();
    // 弹窗宽度约为200px，检查右侧空间是否足够
    shouldFlipPosition.value = (window.innerWidth - buttonRect.right) < 220;
  }
};

// 路径解析函数
const findTitleByRoute = (routePath: string, items: DrawerItem[]): string => {
  // 保持原有实现...
  for (const item of items) {
    if (item.route === routePath) {
      return item.title;
    }
    if (item.children) {
      const childTitle = findTitleByRoute(routePath, item.children);
      if (childTitle) return childTitle;
    }
  }

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

// 初始化章节信息
const initChapterInfo = async (path: string) => {
  // 保持原有实现...
  let title = '';
  const pathMatch = path.match(/\/dashboard\/question\/([\d.]+)%20/);
  currentSection.value = pathMatch ? pathMatch[1] : '';

  if (path.startsWith('/dashboard/question/')) {
    title = findTitleByRoute(path, questionItems.value);
    if (!title && route.params && route.params.chapter) {
      title = route.params.chapter as string;
    }

    currentQuestionId.value = 1;

    await nextTick();

    if (questionViewer.value) {
      questionCount.value = questionViewer.value.getQuestionCount();
      if (questionCount.value > 0) {
        questionViewer.value.loadQuestion(1);
      }
    }
  } else if (path.startsWith('/dashboard/experiment/')) {
    title = findTitleByRoute(path, experimentItems.value);
  }

  if (!title) {
    const savedTitle = localStorage.getItem('lastChapterTitle');
    if (savedTitle) {
      title = savedTitle;
    } else {
      title = '选择章节';
    }
  } else {
    localStorage.setItem('lastChapterTitle', title);
  }

  currentChapterTitle.value = title;
};

// 生命周期
onMounted(async () => {
  await nextTick();
  initChapterInfo(route.path);
  window.addEventListener('resize', checkPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkPosition);
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
      questionIds.value = await questionViewer.value.getQuestionIds();
    }
  }
);

// 切换试题弹窗
function toggleQuestionList() {
  showQuestionList.value = !showQuestionList.value;
  if (showQuestionList.value) {
    checkPosition(); // 显示时检查位置
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
