<script setup lang="ts">
import type { AiMessage } from '@/components/ai/aiType';
import type { Textarea } from '@/components/ui/textarea';
import { aiApi } from '@/api/ai/aiApi';
import { Button } from '@/components/ui/button'
import { ContextMenuTrigger } from '@/components/ui/context-menu';
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton';
import { useAiStore } from '@/store';
import { toMarkdown } from '@/utils/markdown'
import { error, success } from '@/utils/toast';
import { vAutoAnimate } from '@formkit/auto-animate';
import { ArrowDownToLine, Bot, CircleStop, Clipboard, PencilLine, RotateCcw, Send, Trash2 } from 'lucide-vue-next';
import { nextTick, onMounted, ref, watch } from 'vue'

const message = ref('');
const aiStore = useAiStore();
const scrollContainer = ref<HTMLDivElement | null>(null);
const status = ref<'idle' | 'generating' | 'loading' | 'aborted' | 'error'>('idle');
const abortController = ref<AbortController | null>(null);
const messageQueue = ref<string[]>([]);
const messageInterval = ref<number | null>(null);
const tx = ref<typeof Textarea | null>(null);
const autoScroll = ref(true);
const lastScrollTop = ref(0);
const showScrollToBottom = ref(false);

function scrollToBottom() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'smooth' });
  }
}

function addMessage(message: string) {
  aiStore.aiMessages.push({ role: 'user', content: message });
  nextTick(() => {
    scrollToBottom();
  });
}

function handleScroll() {
  if (scrollContainer.value == null)
    return;
  const currentScrollTop = scrollContainer.value.scrollTop;
  const container = scrollContainer.value;
  const bottomThreshold = 100;
  const scrollHeight = container.scrollHeight;
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  if (currentScrollTop < lastScrollTop.value) {
    autoScroll.value = false;
  }
  else if (scrollHeight - scrollTop - clientHeight < bottomThreshold) {
    autoScroll.value = true;
  }
  lastScrollTop.value = currentScrollTop <= 0 ? 0 : currentScrollTop;
  showScrollToBottom.value = scrollHeight - scrollTop - clientHeight > bottomThreshold;
}

async function sendMessages() {
  if (status.value === 'loading') {
    return;
  }
  if (status.value === 'generating') {
    abortController.value?.abort();
  }
  try {
    message.value = '';
    aiStore.aiMessages.push({ role: 'assistant', content: '' });
    status.value = 'loading';
    await nextTick(() => {
      scrollToBottom();
      resetTextareaHeight();
    });

    abortController.value = new AbortController();
    messageInterval.value = setInterval(() => {
      if (messageQueue.value.length > 0) {
        aiStore.aiMessages[aiStore.aiMessages.length - 1].content += messageQueue.value.shift()!;
        scrollToBottom();
      }
    }, 30);
    await aiApi(aiStore.aiMessages, receiveMessage, finishGenerating, abortController.value);
  }
  catch (error: any) {
    status.value = 'error';
    console.error('Error during test:', error);
  }
}

function stopGenerating() {
  if (status.value === 'generating') {
    status.value = 'aborted';
    abortController.value?.abort();
    messageQueue.value = [];
  }
}

async function finishGenerating() {
  if (messageInterval.value) {
    while (messageQueue.value.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    clearInterval(messageInterval.value);
  }
  status.value = 'idle';
}

function receiveMessage(msg: string) {
  if (status.value === 'loading') {
    status.value = 'generating';
  }
  messageQueue.value.push(msg);
  scrollToBottom();
}

watch(status, () => {
  console.log('status:', status.value);
})

function deleteMessage(msg: AiMessage) {
  aiStore.aiMessages = aiStore.aiMessages.filter(m => m !== msg);
}

function copyMessage(msg: AiMessage) {
  try {
    navigator.clipboard.writeText(msg.content);
    success('复制成功');
  }
  catch (e: any) {
    console.error('Error:', e);
    error('复制失败');
  }
}

function resetTextareaHeight() {
  if (tx.value) {
    tx.value.root.style.height = 'auto';
    tx.value.root.style.height = `${tx.value.root.scrollHeight}px`;
  }
}

onMounted(() => {
  scrollContainer.value?.addEventListener('scroll', handleScroll);
  scrollContainer.value?.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'instant' });
  resetTextareaHeight();
  tx.value?.root.addEventListener('input', resetTextareaHeight, false);
});
</script>

<template>
  <div class="flex justify-center">
    <div class="flex flex-col w-full h-full">
      <div ref="scrollContainer" class="flex-1 flex w-full flex-col items-center gap-3 overflow-y-auto p-5 pt-4">
        <div v-for="(msg, index) in aiStore.aiMessages" :key="msg.content" class="flex w-full max-w-screen-md">
          <div v-if="msg.role === 'user'" class="ml-auto">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  class="rounded-lg bg-primary text-primary-foreground p-2" @dblclick="() => {
                    message = msg.content;
                    aiStore.aiMessages.splice(index);
                    stopGenerating();
                    nextTick(() => {
                      resetTextareaHeight();
                    });
                  }"
                >
                  <Label class="text-base whitespace-pre-line">{{ msg.content }}</Label>
                  <!--                  <Input v-model="msg.content" class="p-0 text-base min-w-none w-auto h-auto py-1" /> -->
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem class="flex gap-2" @click="copyMessage(msg)">
                  <Clipboard class="size-4" />
                  复制
                </ContextMenuItem>
                <ContextMenuItem
                  class="flex gap-2"
                  @click="() => {
                    message = msg.content;
                    aiStore.aiMessages.splice(index);
                    stopGenerating();
                    nextTick(() => {
                      resetTextareaHeight();
                    });
                  }"
                >
                  <PencilLine class="size-4" />
                  编辑
                </ContextMenuItem>
                <ContextMenuItem
                  class="flex gap-2" @click="() => {
                    aiStore.aiMessages.splice(index + 1);
                    sendMessages();
                  }"
                >
                  <RotateCcw class="size-4" />
                  重新发送
                </ContextMenuItem>
                <ContextMenuItem
                  class="flex gap-2" @click="deleteMessage(msg)"
                >
                  <Trash2 class="size-4" />
                  删除
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
          <div v-else class="flex flex-col gap-3 w-full mb-4">
            <div class="flex gap-2 items-center">
              <div class="rounded-full p-1 bg-primary flex items-center justify-center text-primary-foreground">
                <Bot class="size-6" />
              </div>
              <Label class="text-base"> 邮小率 </Label>
            </div>
            <ContextMenu>
              <ContextMenuTrigger :disabled="status !== 'idle' && index === aiStore.aiMessages.length - 1">
                <div v-auto-animate class="rounded-lg bg-muted text-foreground p-3 w-full border hover:border-primary transition-all">
                  <div v-if="status === 'loading' && index === aiStore.aiMessages.length - 1" class="space-y-2">
                    <Skeleton class="w-32 h-5" />
                    <Skeleton class="w-full h-5" />
                    <Skeleton class="w-full h-5" />
                    <Skeleton class="w-full h-5" />
                  </div>
                  <div v-else class="prose max-w-none" v-html="toMarkdown(msg.content)" />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  class="flex gap-2" @click="copyMessage(msg)"
                >
                  <Clipboard class="size-4" />
                  复制
                </ContextMenuItem>
                <ContextMenuItem
                  class="flex gap-2" @click="() => {
                    aiStore.aiMessages.splice(index);
                    sendMessages();
                  }"
                >
                  <RotateCcw class="size-4" />
                  重新生成
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="deleteMessage(msg)">
                  <Trash2 class="size-4" />
                  删除
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
      </div>

      <div
        class="sticky bottom-0 w-full justify-center flex p-2 border-t"
      >
        <Button v-if="showScrollToBottom" class="rounded-full absolute -top-12 size-8 left-1/2 -translate-x-1/2 !text-primary" size="icon" variant="outline">
          <ArrowDownToLine class="size-6" @click="scrollToBottom" />
        </Button>
        <div class="max-w-screen-md flex w-full gap-2 items-end">
          <Textarea
            ref="tx"
            v-model="message"
            :rows="1" class="resize-none transition-all min-h-0 overflow-hidden"
            placeholder="请输入您的问题"
            @keydown.enter.exact="(event: KeyboardEvent) => {
              if (!event.shiftKey) {
                event.preventDefault();
                if (status === 'idle' && message.trim() !== '') {
                  addMessage(message);
                  sendMessages();
                }
              }
            }"
          />
          <Button
            size="icon" :disabled="status === 'loading' || (status === 'idle' && message.trim() === '')" class="transition-all"
            @click="async () => {
              if (status === 'generating') {
                stopGenerating();
              }
              else if (status === 'idle') {
                addMessage(message);
                await sendMessages();
              }
            }"
          >
            <Send v-if="status === 'idle'" class="size-4" />
            <CircleStop v-else class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
