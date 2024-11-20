<script setup lang="ts">
import type { ChildComment, Comment } from '@/api/comment/commentType';
import { likeCommentApi } from '@/api/comment/commentApi';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store';
import { vAutoAnimate } from '@formkit/auto-animate';
import { Heart, MessageCircle, Trash2 } from 'lucide-vue-next';
import { format } from 'timeago.js';
import { ref } from 'vue';

const emit = defineEmits<{
  reply: [Comment]
  delete: [Comment]
}>();

const comment = defineModel<ChildComment>();

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
    <div class="pt-2 px-4 transition-all hover:bg-secondary/50 flex gap-2" @click="isOpen = !isOpen">
      <Avatar class="mt-1 size-7">
        <AvatarImage :src="comment.user.avatarUrl" alt="" />
        <AvatarFallback>{{ comment.user.nickname }}</AvatarFallback>
      </Avatar>
      <div class="flex flex-col gap-1 w-full">
        <div class="space-x-2 flex items-center">
          <span class=" font-bold text-[15px] cursor-pointer select-none hover:underline underline-offset-4 transition-all">
            {{ comment.user.nickname }}
          </span>
          <span class="text-sm text-muted-foreground">
            {{ comment.user.studentId }} · {{ format(comment.timestamp, 'zh_CN') }}
          </span>
          <div v-if="comment.pinned">
            <Badge> 置顶 </Badge>
          </div>
        </div>
        <div class="text-sm whitespace-pre-line leading-tight flex items-center gap-1">
          <div v-if="comment.parentComment" class="flex items-center gap-0.5">
            回复
            <div class="hover:underline underline-offset-4 cursor-pointer">
              {{ comment.parentComment.user.nickname }}
            </div>
            :
          </div>
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
            <Button :id="`reply-${comment.commentId}`" variant="ghost" size="icon" class="rounded-full size-8 hover:text-primary" @click.stop="emit('reply', comment)">
              <MessageCircle class="size-4" />
            </Button>
            <Label :for="`reply-${comment.commentId}`"> 回复 </Label>
          </div>
          <div v-if="comment.user.uid === useUserStore().user?.uid || useUserStore().user?.role !== '0'" class="flex items-center -space-x-0.5">
            <Button variant="ghost" size="icon" class="rounded-full size-8 hover:text-destructive" @click.stop="emit('delete', comment)">
              <Trash2 class="size-4" />
            </Button>
          </div>
          <!--          <div v-if="useUserStore().user?.role !== 0" class="flex items-center"> -->
          <!--            <Button variant="ghost" size="icon" :class="cn('rounded-full size-8 hover:text-green-500', comment.pinned && '!text-green-500')" @click.stop="emit('pin', comment)"> -->
          <!--              <ArrowUpFromLine class="size-4" /> -->
          <!--            </Button> -->
          <!--          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
