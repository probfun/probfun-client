<script setup lang="ts">
import type { Comment } from '@/api/comment/commentType'
import { fetchCommentApi, postCommentApi } from '@/api/comment/commentApi';
import CommentCard from '@/components/comment/CommentCard.vue';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast'
import { vAutoAnimate } from '@formkit/auto-animate';
// import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  expId: string
}>();

const { toast } = useToast();

const commentList = ref<Comment[] | null>(null);

async function refreshComment() {
  try {
    const result = await fetchCommentApi(props.expId);
    commentList.value = result.comments;
    commentList.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  catch (error) {
    console.error('Error during fetching comments:', error);
  }
}

onMounted(() => {
  refreshComment();
});

const content = ref<string>('');
const isSending = ref(false);

async function send() {
  if (isSending.value)
    return;
  if (content.value === '') {
    toast({
      title: '提示',
      description: '评论不能为空',
      variant: 'warning',
    });
    // toast.add({ severity: 'warn', summary: '提示', detail: '评论不能为空', life: 3000 });
    return;
  }
  if (content.value.length > 5000) {
    toast({
      title: '提示',
      description: '评论内容不能多于5000字',
      variant: 'warning',
    });
    // toast.add({ severity: 'warn', summary: '提示', detail: '评论过长', life: 3000 });
    return;
  }
  try {
    isSending.value = true;
    await postCommentApi(props.expId, content.value, null);
    await refreshComment();
    toast({
      title: '成功',
      description: '评论成功',
      variant: 'success',
    })
    // toast.add({ severity: 'success', summary: '成功', detail: '评论成功', life: 3000 });
    content.value = '';
  }
  catch (error: any) {
    console.error(error);
    toast({
      title: '错误',
      description: '评论失败，请重试',
      variant: 'destructive',
    });
    // toast.add({ severity: 'error', summary: '错误', detail: '评论失败，请重试', life: 3000 });
  }
  isSending.value = false;
}
</script>

<template>
  <div v-auto-animate class="h-full w-full flex flex-col">
    <ScrollArea v-if="commentList" v-auto-animate class="h-full w-full">
      <CommentCard v-for="(item, index) in commentList" :key="item.commentId" v-model="commentList![index]" />
    </ScrollArea>
    <div v-else v-auto-animate class="h-full w-full overflow-y-auto">
      <div v-for="item in 10" :key="item" class="border-y pt-4 px-4 transition-all hover:bg-secondary/50 hover:border-primary flex gap-2">
        <Skeleton class="mt-1 rounded-full size-8" />
        <div class="flex flex-col gap-1 w-full">
          <div class="space-x-1">
            <Skeleton class="rounded-lg h-5 w-52" />
          </div>
          <Skeleton class="rounded-lg h-16 w-full" />
          <div class="pb-4 flex text-muted-foreground gap-5">
            <Skeleton class="rounded-lg h-5 w-32" />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-0 sticky w-full border-y p-4 space-y-4">
      <Textarea
        v-model="content" placeholder="请输入要讨论的内容..." rows="3" class="resize-none transition-all"
        @keydown.enter="(event: KeyboardEvent) => {
          if (!event.shiftKey) {
            event.preventDefault();
            if (content.trim() !== '') {
              send();
            }
          }
        }"
      />

      <div>
        <Button :disabled="isSending" @click="send">
          评论
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
