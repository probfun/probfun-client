<!-- 'src/components/class/ClassDialog.vue' -->
<script setup lang="ts">
import { computed } from 'vue';
import StudentClassPanel from '@/components/class/StudentClassPanel.vue';

import TeacherClassPanel from '@/components/class/TeacherClassPanel.vue';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUserStore } from '@/store';

const props = withDefaults(defineProps<{
  open?: boolean;
}>(), { open: false });

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
}>();

const dialogOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v),
});

const userStore = useUserStore();
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="max-w-screen-lg mx-auto p-0 overflow-hidden">
      <DialogHeader class="px-6 pt-6">
        <DialogTitle class="text-xl">
          班级管理
        </DialogTitle>
        <DialogDescription>
          {{ userStore.user?.role === 1
            ? '加入班级，查看老师布置的作业和公告。'
            : '创建和管理班级，布置作业和发布公告。'
          }}
        </DialogDescription>
      </DialogHeader>
      <StudentClassPanel v-if="userStore.user?.role === 1" />
      <TeacherClassPanel v-if="userStore.user?.role === 2" />
    </DialogContent>
  </Dialog>
</template>

<style scoped>
</style>
