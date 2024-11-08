<script setup lang="ts">
import type { ChildComment, Comment, CommentWithChild, CommentWithParent } from '@/api/comment/commentType'
import {
  deleteCommentApi,
  fetchCommentApi,
  pinCommentApi,
  postCommentApi,
} from '@/api/comment/commentApi';
import CommentCard from '@/components/comment/CommentCard.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { error, success, warning } from '@/utils/toast';
import { vAutoAnimate } from '@formkit/auto-animate';
import { X } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  expId: string
}>();

const commentList = ref<CommentWithChild[] | null>(null);
const scrollArea = ref<typeof ScrollArea | null>(null);

function convertToCommentWithChild(comments: CommentWithParent[]): CommentWithChild[] {
  const sortedComments = comments.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const validCommentIds = new Set<string>();
  const validComments: CommentWithParent[] = [];
  for (const comment of sortedComments) {
    if (comment.parentId === null || validCommentIds.has(comment.parentId)) {
      validComments.push(comment);
      validCommentIds.add(comment.commentId);
    }
  }

  const commentMap: Record<string, CommentWithParent> = {};
  for (const comment of validComments) {
    commentMap[comment.commentId] = comment;
  }

  const resultMap: Record<string, ChildComment[]> = {};
  for (const comment of validComments) {
    if (!comment.parentId) {
      resultMap[comment.commentId] = [];
    }
  }

  for (const comment of validComments) {
    if (comment.parentId) {
      let parent = commentMap[comment.parentId];
      console.log(comment.parentId, parent);
      while (parent.parentId) {
        parent = commentMap[parent.parentId];
      }
      resultMap[parent.commentId].push({
        parentComment: commentMap[comment.parentId],
        ...comment,
      });
    }
  }

  const result: CommentWithChild[] = []
  for (const [commentId, children] of Object.entries(resultMap)) {
    result.push({
      ...commentMap[commentId],
      childComments: children,
    });
  }

  return result;
}

async function refreshComment() {
  try {
    const result = await fetchCommentApi(props.expId);
    const comments = result.comments;
    commentList.value = convertToCommentWithChild(comments);
    commentList.value.sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return a.pinned ? -1 : 1;
    });
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

const isOpen = ref(false);
const readyToDeleteComment = ref<Comment | null>(null);

const replyComment = ref<Comment | null>(null);
function reply(comment: Comment) {
  replyComment.value = comment;
}

async function send() {
  if (isSending.value)
    return;
  if (content.value === '') {
    warning('评论不能为空');
    return;
  }
  if (content.value.length > 5000) {
    warning('评论内容不能多于5000字');
    return;
  }
  try {
    isSending.value = true;
    await postCommentApi(props.expId, content.value, replyComment.value?.commentId ?? null);
    await refreshComment();
    success('评论成功');
    content.value = '';
    replyComment.value = null;
    scrollArea.value?.scrollToTop();
  }
  catch (e: any) {
    console.error(e);
    error('评论失败，请重试');
  }
  isSending.value = false;
}
</script>

<template>
  <div v-auto-animate class="h-full w-full flex flex-col">
    <ScrollArea v-if="commentList && commentList.length !== 0" ref="scrollArea" v-auto-animate class="h-full w-full">
      <CommentCard
        v-for="(item, index) in commentList" :key="item.commentId" v-model="commentList![index]" @reply="(comment) => {
          reply(comment);
        }"
        @delete="(comment) => {
          isOpen = true;
          readyToDeleteComment = comment;
        }"
        @pin="async (comment) => {
          try {
            const result = await pinCommentApi(comment.commentId);
            if (result.pinned) {
              success('置顶成功！');
            }
            else {
              success('取消置顶成功！');
            }
            await refreshComment();
          }
          catch (e: any) {
            console.error('Error during deleting comment:', e);
            error('置顶失败，请重试');
          }
        }"
      />
    </ScrollArea>
    <div v-else-if="commentList" class="flex items-center text-sm justify-center h-full text-muted-foreground">
      这里暂无评论
    </div>
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
    <div class="bottom-0 sticky w-full border-y p-2 space-y-2">
      <div v-if="replyComment" class="text-muted-foreground flex items-center gap-1 border-primary p-1 rounded-lg">
        <Label class="line-clamp-1">
          回复 {{ replyComment.user.nickname }}：{{ replyComment.content }}
        </Label>
        <Button variant="ghost" size="icon" class="ml-auto rounded-full size-5 text-muted-foreground" @click="replyComment = null">
          <X class="size-4" />
        </Button>
      </div>
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
      <div class="flex items-center">
        <Button :disabled="isSending" class="ml-auto" @click="send">
          评论
        </Button>
      </div>
    </div>

    <AlertDialog v-model:open="isOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除这条评论吗？</AlertDialogTitle>
          <AlertDialogDescription>
            该操作将永久删除您的评论以及该评论下的所有回复，并且无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            @click="async () => {
              if (!readyToDeleteComment) {
                return;
              }
              try {
                await deleteCommentApi(readyToDeleteComment.commentId);
                await refreshComment();
                success('删除成功！');
                if (replyComment?.commentId === readyToDeleteComment.commentId) {
                  replyComment = null;
                }
              }
              catch (e: any) {
                console.error('Error during deleting comment:', error);
                error('删除失败，请重试！');
              }
            }"
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<style scoped>

</style>
