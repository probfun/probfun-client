<script setup lang="ts">
import type { AiMessage, ChatBlock } from '@/components/ai/aiType';
import type { Textarea } from '@/components/ui/textarea';
import { aiApi } from '@/api/ai/aiApi';
import AiSidebar from '@/components/ai/AiSidebar.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContextMenuTrigger } from '@/components/ui/context-menu';
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton';
import { useAiStore } from '@/store';
import { toMarkdown } from '@/utils/markdown'
import { error, success } from '@/utils/toast';
import { vAutoAnimate } from '@formkit/auto-animate';
import { ArrowDownToLine, Bot, CircleStop, Clipboard, PencilLine, RotateCcw, Send, Trash2 } from 'lucide-vue-next';
import { v4 as uuidv4 } from 'uuid';
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
const tempChatTitle = ref('');
const isEditChatTitle = ref(false);
const isOpen = ref(false);

const startMessage: AiMessage = {
  role: 'assistant',
  content: '我是“邮小率”，你的智能助手，专门帮助学生解决概率论实验相关的问题。如果你有关于概率论的概念、实验步骤或者具体问题需要解答，随时告诉我，我会尽力帮助你！',
  messageId: uuidv4(),
};

const isComposing = ref(false);

function scrollToBottom(smooth: boolean = true) {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
  }
}

function addMessage(message: string) {
  if (!aiStore.currentChatBlock) {
    aiStore.currentChatBlock = createNewChatBlock();
    aiStore.chatBlockList.push(aiStore.currentChatBlock);
  }
  const chatBlock = aiStore.currentChatBlock;
  chatBlock.chatList.push({ role: 'user', content: message, messageId: uuidv4() });
  chatBlock.lastChatTime = new Date().toLocaleString();
  nextTick(() => {
    scrollToBottom();
  });
}

function createNewChatBlock() {
  const newChatBlock: ChatBlock = {
    chatList: [
      startMessage,
    ],
    chatId: uuidv4(),
    chatTitle: '概率论实验',
    lastChatTime: new Date().toLocaleString(),
  };
  return newChatBlock;
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
  if (!aiStore.currentChatBlock) {
    aiStore.currentChatBlock = createNewChatBlock();
    aiStore.chatBlockList.push(aiStore.currentChatBlock);
  }
  const aiMessages = aiStore.currentChatBlock?.chatList;
  try {
    message.value = '';
    aiMessages.push({ role: 'assistant', content: '', messageId: uuidv4() });
    status.value = 'loading';
    await nextTick(() => {
      scrollToBottom();
      resetTextareaHeight();
    });

    abortController.value = new AbortController();
    messageInterval.value = window.setInterval(() => {
      if (messageQueue.value.length > 0) {
        aiMessages[aiMessages.length - 1].content += messageQueue.value.shift()!;
        aiMessages[aiMessages.length - 1].content
            = aiMessages[aiMessages.length - 1].content
            .replace(/\\\[/g, '$$$')
            .replace(/\\\]/g, '$$$')
            .replace(/\\\(/g, '$')
            .replace(/\\\)/g, '$');
        scrollToBottom();
      }
    }, 30);
    await aiApi(aiMessages, receiveMessage, finishGenerating, abortController.value);
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
  const chatBlock = aiStore.currentChatBlock;
  if (!chatBlock) {
    return;
  }
  if (messageInterval.value) {
    while (messageQueue.value.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    clearInterval(messageInterval.value);
  }
  chatBlock.chatList[chatBlock.chatList.length - 1].content = chatBlock.chatList[chatBlock.chatList.length - 1].content.replace(/\$\$/g, '\n$$$\n');
  chatBlock.lastChatTime = new Date().toLocaleString();
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
  const currentChatBlock = aiStore.currentChatBlock;
  if (!currentChatBlock) {
    return;
  }
  currentChatBlock.chatList = currentChatBlock.chatList.filter(m => m !== msg);
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
  scrollToBottom(false);
  resetTextareaHeight();
  tx.value?.root.addEventListener('input', resetTextareaHeight, false);
});

watch(() => aiStore.currentChatBlock, () => {
  stopGenerating();
  nextTick(() => {
    scrollToBottom(false);
  });
});

function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd() {
  isComposing.value = false;
}
</script>

<template>
  <div class="flex p-2 gap-2">
    <AiSidebar />
    <Card class="flex-1 flex hover:border-primary flex-col transition-all duration-300">
      <CardHeader v-auto-animate class="py-2 px-4 flex flex-row items-center h-10">
        <CardTitle v-if="!aiStore.currentChatBlock || !isEditChatTitle">
          {{ aiStore.currentChatBlock?.chatTitle ?? '新对话' }}
        </CardTitle>
        <Input
          v-else v-model="tempChatTitle" class="h-7 max-w-xs" @blur="() => {
            aiStore.currentChatBlock!.chatTitle = tempChatTitle;
            isEditChatTitle = false;
          }"
          @keydown.enter.exact="() => {
            if (!isComposing) {
              aiStore.currentChatBlock!.chatTitle = tempChatTitle;
              isEditChatTitle = false;
            }
          }"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        />
        <div v-if="aiStore.currentChatBlock" class="flex gap-2 ml-3">
          <Button
            v-if="!isEditChatTitle"
            size="icon" variant="outline" class="size-6"
          >
            <PencilLine
              class="size-4" @click="() => {
                tempChatTitle = aiStore.currentChatBlock?.chatTitle ?? '';
                isEditChatTitle = true;
              }"
            />
          </Button>
          <Button size="icon" variant="outline" class="size-6">
            <Trash2
              class="size-4 text-destructive" @click="() => {
                isOpen = true;
              }"
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent class="overflow-y-hidden border-t flex pb-0 px-0 relative flex-1">
        <div ref="scrollContainer" class="flex w-full flex-col items-center gap-3 overflow-y-auto pt-4 px-6">
          <div v-for="(msg, index) in aiStore.currentChatBlock?.chatList ?? [startMessage]" :key="msg.messageId" v-auto-animate class="flex w-full max-w-screen-md">
            <div v-if="msg.role === 'user'" class="ml-auto">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    class="rounded-lg bg-primary text-primary-foreground p-2" @dblclick="() => {
                      message = msg.content;
                      aiStore.currentChatBlock?.chatList.splice(index);
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
                      aiStore.currentChatBlock?.chatList.splice(index);
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
                      aiStore.currentChatBlock?.chatList.splice(index + 1);
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
                <ContextMenuTrigger :disabled="status !== 'idle' && aiStore.currentChatBlock !== null && index === aiStore.currentChatBlock.chatList.length - 1">
                  <div v-auto-animate class="rounded-lg bg-muted text-foreground p-3 w-full border">
                    <div v-if="status === 'loading' && aiStore.currentChatBlock && index === aiStore.currentChatBlock.chatList.length - 1" class="space-y-2">
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
                      aiStore.currentChatBlock?.chatList.splice(index);
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
        <Button v-if="showScrollToBottom" class="rounded-full absolute bottom-2 size-8 left-1/2 -translate-x-1/2 !text-primary" size="icon" variant="outline">
          <ArrowDownToLine class="size-6" @click="scrollToBottom(true)" />
        </Button>
      </CardContent>
      <CardFooter class="p-2 border-t flex justify-center">
        <form class="max-w-screen-md flex w-full gap-2 items-end">
          <Textarea
            ref="tx"
            v-model="message"
            :rows="1" class="resize-none transition-all min-h-0 overflow-hidden"
            placeholder="请输入您的问题"
            @keydown.enter.exact="(event: KeyboardEvent) => {
              if (!event.shiftKey) {
                if (!isComposing) {
                  event.preventDefault();
                  if (status === 'idle' && message.trim() !== '') {
                    addMessage(message);
                    sendMessages();
                  }
                }
              }
            }"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
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
        </form>
      </CardFooter>
    </Card>
    <Card v-if="false" class="w-72">
      <CardHeader class="p-4">
        <CardTitle>
          实验面板
        </CardTitle>
      </CardHeader>
      <CardContent class="border-t" />
    </Card>

    <AlertDialog v-model:open="isOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除该聊天吗？</AlertDialogTitle>
          <AlertDialogDescription>
            该操作将永久删除该聊天，并且无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground"
            @click="() => {
              aiStore.chatBlockList = aiStore.chatBlockList.filter((chatBlock) => chatBlock.chatId !== aiStore.currentChatBlock?.chatId);
              aiStore.currentChatBlock = null;
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
