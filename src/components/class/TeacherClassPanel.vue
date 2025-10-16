<script setup lang="ts">
import type { Class } from '@/api/class/classType';
import type { User } from '@/api/user/userType';
import { format } from 'timeago.js';
import { computed, onMounted, ref, watch } from 'vue';
import {
  createClassApi,
  deleteClassApi,
  fetchStudentListApi,
  fetchTeacherClassListApi,
  postPostApi,
} from '@/api/class/classApi';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { error, success } from '@/utils/toast.ts';

const classes = ref<Class[]>([]);
const loadingClasses = ref(false);
const selectedClassId = ref<string | null>(null);

const students = ref<User[]>([]);
const loadingStudents = ref(false);

const createName = ref('');
const creating = ref(false);

const annTitle = ref('');
const annContent = ref('');
const posting = ref(false);

// 删除相关
const confirmDeleteOpen = ref(false);
const pendingDeleteId = ref<string | null>(null);
const deleting = ref(false);
const pendingDeleteClass = computed(
  () => classes.value.find(c => c.id === pendingDeleteId.value) ?? null,
);

// 加载教师班级列表
async function loadClasses() {
  loadingClasses.value = true;
  try {
    const { teachingClasses } = await fetchTeacherClassListApi();
    classes.value = teachingClasses ?? [];
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

// 加载选中班级的学生
async function loadStudents() {
  const cid = selectedClassId.value;
  students.value = [];
  if (!cid)
    return;
  loadingStudents.value = true;
  try {
    const { students: list } = await fetchStudentListApi(cid);
    students.value = list ?? [];
  }
  finally {
    loadingStudents.value = false;
  }
}

// 创建班级
async function handleCreate() {
  const name = createName.value.trim();
  if (!name || creating.value)
    return;
  creating.value = true;
  try {
    const created = await createClassApi(name);
    createName.value = '';
    // 选中新建的班级后再刷新列表与学生
    selectedClassId.value = created.teaching_class_id;
    await loadClasses();
    await loadStudents();
  }
  catch (e) {
    console.error('创建班级失败', e);
    error('创建班级失败，请稍后再试。');
  }
  finally {
    creating.value = false;
  }
}

// 发布公告（发布到当前选中的班级）
async function handlePost() {
  const cid = selectedClassId.value;
  if (!cid) {
    error('请先在左侧选择一个班级。');
    return;
  }
  const title = annTitle.value.trim();
  const content = annContent.value.trim();
  if (!title || !content || posting.value)
    return;

  posting.value = true;
  try {
    await postPostApi(title, content, [cid]);
    annTitle.value = '';
    annContent.value = '';
    success('公告发布成功');
  }
  catch (e) {
    console.error('发布公告失败', e);
    error('发布公告失败，请稍后再试。');
  }
  finally {
    posting.value = false;
  }
}

function selectClass(id: string) {
  selectedClassId.value = id;
}

// 触发删除确认
function askDelete(id: string) {
  pendingDeleteId.value = id;
  confirmDeleteOpen.value = true;
}

// 确认删除
async function confirmDelete() {
  const id = pendingDeleteId.value;
  if (!id || deleting.value)
    return;
  deleting.value = true;
  try {
    await deleteClassApi(id);
    success('删除成功');
    // 若删除的是当前选中班级，清空后让 loadClasses 重新选中
    if (selectedClassId.value === id) {
      selectedClassId.value = null;
    }
    confirmDeleteOpen.value = false;
    pendingDeleteId.value = null;
    await loadClasses();
    await loadStudents();
  }
  catch (e) {
    console.error('删除班级失败', e);
    error('删除班级失败，请稍后再试。');
  }
  finally {
    deleting.value = false;
  }
}

const selectedClass = computed(() => classes.value.find(c => c.id === selectedClassId.value) ?? null);

watch(selectedClassId, () => {
  void loadStudents();
});

onMounted(() => {
  void loadClasses().then(loadStudents);
});
</script>

<template>
  <div class="px-6 h-[720px] overflow-y-auto pb-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <!-- 左侧：创建 + 班级列表 -->
      <div class="flex flex-col gap-4">
        <!-- 创建班级 -->
        <div class="rounded-xl border bg-white/70 dark:bg-neutral-900/70 shadow-sm p-4">
          <div class="font-medium mb-3">
            创建班级
          </div>
          <div class="flex items-center gap-2">
            <div class="relative w-full">
              <Input
                id="class"
                v-model="createName"
                :disabled="creating"
                autocomplete="class"
                placeholder="班级名称"
                class="peer h-12 w-full max-w-none pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="class"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                班级名称
              </Label>
            </div>
            <Button class="h-10 px-4" :disabled="creating || !createName.trim()" @click="handleCreate">
              {{ creating ? '创建中...' : '创建' }}
            </Button>
          </div>
        </div>

        <!-- 班级列表 -->
        <div class="rounded-xl border bg-white/70 dark:bg-neutral-900/70 shadow-sm p-4 flex-1 overflow-hidden">
          <div class="font-medium mb-4">
            我的班级
          </div>

          <div v-if="loadingClasses" class="text-sm text-neutral-500">
            加载中...
          </div>
          <div v-else-if="!classes.length" class="text-sm text-neutral-500">
            暂无班级，请先创建。
          </div>

          <div v-else class="space-y-2 overflow-y-auto pr-1 h-full">
            <div
              v-for="c in classes"
              :key="c.id"
              class="rounded-lg p-3 border cursor-pointer transition-colors"
              :class="selectedClassId === c.id ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'"
              @click="selectClass(c.id)"
            >
              <div class="flex gap-2 items-center">
                <div class="font-medium truncate">
                  {{ c.name }}
                </div>
                <div class="mb-1 ml-auto flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 bg-primary text-primary-foreground px-1.5 py-0.5 text-xs rounded-full">
                    {{ c.code }}
                  </span>
                  <Button
                    class="h-5 px-2"
                    variant="destructive"
                    :disabled="deleting"
                    aria-label="删除班级"
                    title="删除班级"
                    @click.stop="askDelete(c.id)"
                  >
                    删除
                  </Button>
                </div>
              </div>
              <div class="mt-1 text-xs text-neutral-500">
                创建时间：{{ format(c.createAt, 'zh_CN') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：公告 + 学生列表 -->
      <div class="lg:col-span-2 flex flex-col gap-4">
        <!-- 公告发布 -->
        <div class="rounded-xl border bg-white/70 dark:bg-neutral-900/70 shadow-sm">
          <div class="p-4 border-b">
            <div class="font-semibold">
              发布公告
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              当前班级：{{ selectedClass ? selectedClass.name : '未选择' }}
            </div>
          </div>
          <div class="p-4 space-y-3">
            <Input
              v-model="annTitle"
              type="text"
              placeholder="公告标题"
              class="h-10 rounded-lg border px-3 outline-none focus:ring-2 ring-blue-500"
              :disabled="posting || !selectedClass"
            />
            <Textarea
              v-model="annContent"
              rows="5"
              placeholder="公告内容"
              class="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ring-blue-500 bg-white dark:bg-neutral-900"
              :disabled="posting || !selectedClass"
            />
            <div class="flex justify-end">
              <Button
                class="h-10 px-4"
                :disabled="posting || !selectedClass || !annTitle.trim() || !annContent.trim()"
                @click="handlePost"
              >
                发布公告
              </Button>
            </div>
          </div>
        </div>

        <!-- 学生列表 -->
        <div class="rounded-xl border shadow-sm flex-1 overflow-hidden">
          <div class="p-4 border-b">
            <div class="font-semibold">
              学生列表
            </div>
            <div class="text-xs text-neutral-500 mt-1">
              {{ selectedClass ? selectedClass.name : '请选择左侧班级' }}
            </div>
          </div>

          <div class="h-full overflow-y-auto">
            <div v-if="!selectedClass" class="p-4 text-sm text-neutral-500">
              选择一个班级查看学生。
            </div>
            <div v-else-if="loadingStudents" class="p-4 text-sm text-neutral-500">
              加载学生中...
            </div>
            <div v-else-if="!students.length" class="p-4 text-sm text-neutral-500">
              暂无学生。
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="s in students"
                :key="s.id ?? s.username"
                class="flex items-center justify-between border-b p-4 hover:bg-muted transition-all"
              >
                <div>
                  <div class="font-medium">
                    {{ s.realName ?? s.username ?? '未命名' }}
                  </div>
                  <div class="text-xs text-neutral-500">
                    {{ s.username ?? '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <AlertDialog v-model:open="confirmDeleteOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除班级</AlertDialogTitle>
          <AlertDialogDescription>
            确定删除
            <span class="font-medium">
              {{ pendingDeleteClass ? pendingDeleteClass.name : '' }}
            </span>
            吗？该操作不可恢复。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="deleting">
            取消
          </AlertDialogCancel>
          <Button variant="destructive" :disabled="deleting" @click="confirmDelete">
            {{ deleting ? '删除中...' : '删除' }}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped>
</style>
