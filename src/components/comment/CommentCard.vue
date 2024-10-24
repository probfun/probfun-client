<script setup lang="ts">
import type { CommentWithChild } from '@/api/comment/commentType';
import { likeCommentApi } from '@/api/comment/commentApi';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store';
import { vAutoAnimate } from '@formkit/auto-animate';
import { ArrowUpFromLine, Heart, MessageCircle, Sparkles, Trash2 } from 'lucide-vue-next';
import { format } from 'timeago.js';
import { ref } from 'vue';

const emit = defineEmits<{
  reply: [CommentWithChild]
  delete: [CommentWithChild]
  choose: [CommentWithChild]
  pin: [CommentWithChild]
}>();

const comment = defineModel<CommentWithChild>();

async function like() {
  if (!comment.value)
    return;
  try {
    const result = await likeCommentApi(comment.value.commentId);
    comment.value.likes = result.likes;
    comment.value.liked = result.liked;
  }
  catch (error: any) {
    console.error('Error during liking comment:', error);
  }
}

const isOpen = ref(false);
</script>

<template>
  <div v-if="comment" v-auto-animate>
    <div class="border-l border-b pt-4 px-4 transition-all hover:bg-secondary/50 hover:border-y-primary flex gap-2 cursor-pointer" @click="emit('reply', comment)">
      <Avatar class="mt-1">
        <AvatarImage :src="comment.user.avatarUrl" alt="" />
        <AvatarFallback>{{ comment.user.nickname }}</AvatarFallback>
      </Avatar>
      <div class="flex flex-col gap-1 w-full">
        <div class="space-x-2">
          <span class=" font-bold text-[15px] hover:underline underline-offset-4 transition-all">
            {{ comment.user.nickname }}
          </span>
          <span class="text-sm text-muted-foreground">
            {{ comment.user.studentId }} · {{ format(comment.timestamp, 'zh_CN') }}
          </span>
        </div>
        <div class="text-sm whitespace-pre-line leading-tight">
          {{ comment.content }}
        </div>

        <div class="py-1 flex text-muted-foreground gap-2 -mx-1">
          <div class="flex items-center -space-x-0.5 mr-2">
            <Button :id="`like-${comment.commentId}`" variant="ghost" size="icon" :class="cn('rounded-full size-8 hover:text-red-500', comment.liked && '!text-red-500')" @click.stop="like">
              <Heart class="size-4" :fill="comment.liked ? 'currentColor' : 'none'" />
            </Button>
            <Label :for="`like-${comment.commentId}`"> {{ comment.likes > 99 ? '99+' : comment.likes }} </Label>
          </div>
          <div class="flex items-center -space-x-0.5 mr-2">
            <Button :id="`reply-${comment.commentId}`" variant="ghost" size="icon" class="rounded-full size-8 hover:text-primary" @click.stop="isOpen = !isOpen">
              <MessageCircle class="size-4" />
            </Button>
            <Label :for="`reply-${comment.commentId}`"> {{ comment.childComments.length > 99 ? '99+' : comment.childComments.length }} </Label>
          </div>
          <div v-if="comment.user.uid === useUserStore().user?.uid || useUserStore().user?.role !== 0" class="flex items-center -space-x-0.5">
            <Button variant="ghost" size="icon" class="rounded-full size-8 hover:text-destructive" @click.stop="emit('delete', comment)">
              <Trash2 class="size-4" />
            </Button>
          </div>
          <div v-if="useUserStore().user?.role !== 0" class="flex items-center">
            <Button variant="ghost" size="icon" :class="cn('rounded-full size-8 hover:text-green-500', comment.pinned && '!text-green-500')" @click.stop="emit('pin', comment)">
              <ArrowUpFromLine class="size-4" />
            </Button>
          </div>
          <div v-if="useUserStore().user?.role !== 0" class="flex items-center">
            <Button variant="ghost" size="icon" :class="cn('rounded-full size-8 hover:text-orange-500', comment.chosen && '!text-orange-500')" @click.stop="emit('choose', comment)">
              <Sparkles class="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isOpen && comment.childComments.length">
      <CommentCard
        v-for="(child, index) in comment.childComments" :key="child.commentId" v-model="comment.childComments[index]" class="ml-8" @reply="(thisComment) => {
          emit('reply', thisComment);
        }"
        @delete="(thisComment) => {
          emit('delete', thisComment);
        }"
      />
      <!--      <div v-for="child in comment.childComments" :key="child.commentId" class="text-sm whitespace-pre-line leading-tight"> -->
      <!--        {{ child.content }} -->
      <!--      </div> -->
    </div>
  </div>
</template>

<style scoped>

</style>
