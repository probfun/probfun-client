<script setup lang="ts">
import type { Class, Post } from '@/api/class/classType';
import { format } from 'timeago.js';
import { computed, onMounted, ref, watch } from 'vue';
import { fetchPostApi, fetchStudentClassListApi, joinClassApi, quitClassApi } from '@/api/class/classApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { error, success } from '@/utils/toast.ts';

const classes = ref<Class[]>([]);
const loadingClasses = ref(false);
const selectedClassId = ref<string | null>(null);

const posts = ref<Post[]>([]);
const loadingPosts = ref(false);

const joinCode = ref('');
const joining = ref(false);
const quittingId = ref<string>('');

// 加载班级列表
async function loadClasses() {
  loadingClasses.value = true;
  try {
    const { teachingClasses } = await fetchStudentClassListApi();
    classes.value = teachingClasses ?? [];
    // 保持或设置默认选中项
    if (!classes.value.length) {
      selectedClassId.value = null;
    }
    else if (!selectedClassId.value || !classes.value.find(c => c.id === selectedClassId.value)) {
      selectedClassId.value = classes.value[0].id;
    }
  }
  finally {
    loadingClasses.value = false;
  }
}

// 加载选中班级的公告
async function loadPosts() {
  const cid = selectedClassId.value;
  posts.value = [];
  if (!cid)
    return;
  loadingPosts.value = true;
  try {
    const { posts: ps } = await fetchPostApi(cid);
    posts.value = ps ?? [];
  }
  finally {
    loadingPosts.value = false;
  }
}

// 加入班级
async function handleJoin() {
  const code = joinCode.value.trim();
  if (!code || joining.value)
    return;
  joining.value = true;
  try {
    await joinClassApi(code);
    joinCode.value = '';
    await loadClasses();
    await loadPosts();
  }
  catch (e) {
    console.error('加入班级失败', e);
    error('加入班级失败，请检查班级码是否正确，或稍后再试。');
  }
  finally {
    joining.value = false;
  }
}

// 退出班级
async function handleQuit(cls: Class) {
  if (quittingId.value)
    return;
  quittingId.value = cls.id;
  try {
    await quitClassApi(cls.id);
    await loadClasses();
    await loadPosts();
  }
  finally {
    quittingId.value = '';
  }
}

function selectClass(id: string) {
  selectedClassId.value = id;
}

function copyCode(text: string) {
  if (!text)
    return;
  void navigator.clipboard?.writeText(text);
  success('班级码已复制到剪贴板');
}

const selectedClass = computed(() => classes.value.find(c => c.id === selectedClassId.value) ?? null);

watch(selectedClassId, () => {
  void loadPosts();
});

onMounted(() => {
  void loadClasses().then(loadPosts);
});
</script>

<template>
  <div class="px-6 pb-6 h-[700px]">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 h-full min-h-0">
      <!-- 左侧：加入 + 班级列表 -->
      <div class="flex flex-col gap-4 h-full">
        <!-- 加入班级卡片 -->
        <div class="rounded-xl border shadow-sm p-4">
          <div class="font-medium mb-4">
            加入班级
          </div>

          <div class="flex items-center gap-2">
            <div class="relative w-full">
              <Input
                id="account"
                v-model="joinCode"
                :disabled="joining"
                autocomplete="username"
                placeholder="班级码"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="account"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                班级码
              </Label>
            </div>
            <Button
              class="h-10 px-4"
              :disabled="joining || !joinCode.trim()"
              @click="handleJoin"
            >
              加入
            </Button>
          </div>
        </div>

        <!-- 班级列表 -->
        <div class="rounded-xl border shadow-sm p-4 flex-1">
          <div class="font-medium mb-4">
            我的班级
          </div>

          <div v-if="loadingClasses" class="text-sm text-neutral-500">
            加载中...
          </div>

          <div v-else-if="!classes.length" class="text-sm text-neutral-500">
            还没有加入班级，试试上面的班级码加入吧。
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="c in classes"
              :key="c.id"
              class="rounded-lg p-3 border cursor-pointer transition-colors"
              :class="selectedClassId === c.id ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'"
              @click="selectClass(c.id)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="w-full">
                  <div class="flex gap-2 items-center">
                    <div class="font-medium truncate">
                      {{ c.name }}
                    </div>
                    <div class="mb-1 ml-auto">
                      <span class="inline-flex items-center gap-1 bg-primary text-primary-foreground px-1.5 py-0.5 text-xs rounded-full ">
                        {{ c.code }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1 text-xs text-neutral-500">
                    创建时间：{{ format(c.createAt, 'zh_CN') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：公告面板 -->
      <div class="sm:col-span-2 rounded-xl border shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
        <div class="p-4 border-b">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="font-semibold text-lg">
                {{ selectedClass ? selectedClass.name : '请选择班级' }}
              </div>
              <div v-if="selectedClass" class="text-xs text-neutral-500 mt-0.5">
                班级码：{{ selectedClass.code }}
                <button
                  class="ml-2 text-blue-600 hover:underline underline-offset-2"
                  @click="copyCode(selectedClass.code)"
                >
                  复制
                </button>
              </div>
            </div>
            <Button
              v-if="selectedClass"
              variant="destructive"
              class="h-8 px-3"
              @click.stop="handleQuit(selectedClass)"
            >
              退出班级
            </Button>
          </div>
        </div>

        <div class="flex-1 flex min-h-0 overflow-y-auto">
          <div v-if="!selectedClass" class="p-4 text-sm text-neutral-500">
            选择一个班级以查看公告。
          </div>

          <div v-else class="h-full w-full">
            <div v-if="loadingPosts" class="p-4 text-sm text-neutral-500">
              公告加载中...
            </div>

            <div v-else-if="!posts.length" class="p-4 text-sm text-neutral-500">
              暂无公告。
            </div>

            <div v-else class="h-full pr-1">
              <div
                v-for="(p, idx) in posts"
                :key="idx"
                class="border-b p-4 hover:bg-muted transition-all"
              >
                <div class="flex items-center justify-between">
                  <div class="font-medium">
                    {{ p.title }}
                  </div>
                  <div class="text-xs text-neutral-500">
                    {{ format(p.timestamp, 'zh_CN') }}
                  </div>
                </div>
                <div class="mt-1 text-xs text-neutral-500">
                  发布人：{{ p.author?.realName ?? '老师' }}
                </div>
                <div class="mt-2 text-sm whitespace-pre-line leading-relaxed">
                  {{ p.content }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
