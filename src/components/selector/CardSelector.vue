<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { subjectConfig } from '@/components/subject/configs.ts';
import { useConfigStore } from '@/store';

const props = withDefaults(defineProps<{
  immediate?: boolean;
  hintColor?: string;
}>(), {
  immediate: true,
  hintColor: 'text-primary-foreground',
});

const configStore = useConfigStore();
const currentIndex = ref(0);
const subjectList = Object.values(subjectConfig);

const currentSubject = computed(() => subjectList[currentIndex.value] ?? null);

function updateConfigSubject() {
  if (currentSubject.value)
    configStore.currentSubjectId = currentSubject.value.id;
}

onMounted(() => {
  const savedIndex = localStorage.getItem('cube-current-index');
  if (savedIndex !== null) {
    const i = Number(savedIndex);
    if (!Number.isNaN(i) && i >= 0 && i < subjectList.length) {
      currentIndex.value = i;
    }
  }
  if (props.immediate) {
    updateConfigSubject();
  }
});

function selectSubject(i: number) {
  if (i < 0 || i >= subjectList.length)
    return;
  currentIndex.value = i;
  localStorage.setItem('cube-current-index', String(currentIndex.value));
  if (props.immediate) {
    updateConfigSubject();
  }
}

defineExpose({
  currentSubject,
  updateConfigSubject,
});
</script>

<template>
  <div class="min-h-full flex items-center p-8 pl-10 justify-center">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <div
        v-for="(subject, i) in subjectList"
        :key="subject.id"
        class="subject-card group relative rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        :class="{ 'ring-4 ring-white/50 scale-105': currentIndex === i }"
        :style="{ background: subject.color }"
        @click="selectSubject(i)"
      >
        <!-- Logo圆圈 -->
        <div
          class="absolute -top-4 -left-4 size-12 rounded-full bg-white/95 border shadow-lg flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-110"
          :class="{ 'scale-110': currentIndex === i }"
        >
          <component :is="subject.icon" class="size-8" :style="{ color: subject.color }" />
        </div>

        <!-- 选中标记 -->
        <div
          v-if="currentIndex === i"
          class="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 bg-white"
        >
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>

        <!-- 内容区域 -->
        <div class="relative pt-10 pb-6 px-6 text-white h-full flex flex-col">
          <!-- 学科名称 -->
          <h3 class="text-2xl font-bold mb-3 text-shadow-lg whitespace-nowrap">
            {{ subject.name }}
          </h3>

          <!-- 学科描述 -->
          <p class="text-base mb-4 text-white/90 text-shadow line-clamp-3">
            {{ subject.description }}
          </p>

          <!-- 任课教师 -->
          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
            <svg class="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-white/90">
              {{ subject.teacher || '待分配' }}
            </span>
          </div>

          <!-- 悬停效果指示 -->
          <div class="absolute bottom-2 right-4 text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            点击选择
          </div>
        </div>

        <!-- 悬停边框光效 -->
        <div class="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/40 transition-all duration-300" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,.3);
}

.text-shadow-lg {
    text-shadow: 2px 2px 6px rgba(0,0,0,.4);
}

.subject-card {
    min-height: 160px;
}

.hint-fade {
    animation: hintPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes hintPulse {
    0%, 100% {
        opacity: 0.3;
    }
    50% {
        opacity: 0.9;
    }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
