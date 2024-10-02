<script setup lang="ts">
import type { Comment } from '@/api/comment/commentType';
import { likeCommentApi } from '@/api/comment/commentApi';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { Heart, MessageCircle } from 'lucide-vue-next';
import { format } from 'timeago.js';

const comment = defineModel<Comment>();

async function like() {
  if (!comment.value)
    return;
  try {
    const result = await likeCommentApi(comment.value.commentId);
    comment.value.likes = result.likes;
    // comment.value.liked = result.liked;
  }
  catch (error: any) {
    console.error('Error during liking comment:', error);
  }
}
</script>

<template>
  <div v-if="comment" class="border-y pt-4 px-4 transition-all hover:bg-secondary/50 hover:border-primary flex gap-2">
    <Avatar class="mt-1">
      <AvatarImage :src="comment.user.avatarUrl" alt="" />
      <AvatarFallback>{{ comment.user.nickname }}</AvatarFallback>
    </Avatar>
    <div class="flex flex-col gap-1 w-full">
      <div class="space-x-1">
        <Label class="font-bold text-[15px]">{{ comment.user.nickname }}</Label>
        <Label class="text-muted-foreground"> @{{ comment.user.uid }} · {{ format(comment.timestamp, 'zh_CN') }}</Label>
      </div>
      <Label class="whitespace-pre-line leading-tight"> {{ comment.content }} </Label>

      <div class="py-1 flex text-muted-foreground gap-5 -mx-1">
        <div class="flex items-center -space-x-0.5">
          <Button variant="ghost" size="icon" class="rounded-full size-8 hover:text-red-500" @click="like">
            <Heart class="size-4" />
          </Button>
          <Label> {{ comment.likes }} </Label>
        </div>
        <div class="flex items-center -space-x-0.5">
          <Button variant="ghost" size="icon" class="rounded-full size-8 hover:text-primary">
            <MessageCircle class="size-4" />
          </Button>
          <Label> {{ 0 }} </Label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
