<script setup lang="ts">
import type { ChatBlock, ChatData, ReceiveData, Tool as ToolType } from '@/api/ai/aiType.ts';
import type { Textarea } from '@/components/ui/textarea';
import { vAutoAnimate } from '@formkit/auto-animate';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { ArrowDownToLine, Bot, CircleStop, Clipboard, PencilLine, RotateCcw, Send, Trash2 } from 'lucide-vue-next';
import { v4 as uuidv4 } from 'uuid';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { aiApi, fetchWordCloudApi, generateTitleApi } from '@/api/ai/aiApi';
import { ReceiveDataType } from '@/api/ai/aiType.ts';
import AiSidebar from '@/components/ai/AiSidebar.vue';
import Tool from '@/components/ai/tool/Tool.vue';
import MarkdownDiv from '@/components/markdown-div/MarkdownDiv.vue';
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
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import ContextMenu from '@/components/ui/context-menu/ContextMenu.vue';
import { Label } from '@/components/ui/label';
import { useAiStore, useConfigStore } from '@/store';
import {
  copyMessage,
  createChat,
  createUserBlock,
  DEFAULT_CHAT_TITLE,
  deleteMessage,
  getChatMessages,
  START_BLOCK,
} from '@/utils/ai';
import { isVisitor } from '@/utils/auth.ts';

const message = ref('');
const aiStore = useAiStore();
const scrollContainer = ref<HTMLDivElement | null>(null);
const status = ref<'idle' | 'connecting' | 'generating' | 'loading' | 'aborted' | 'error'>('idle');
const abortController = ref<AbortController | null>(null);
const hasReceivedFirstMessage = ref(false);
// const messageQueue = ref<string[]>([]);
// const messageInterval = ref<number | null>(null);
const tx = ref<typeof Textarea | null>(null);
const autoScroll = ref(true);
const lastScrollTop = ref(0);
const showScrollToBottom = ref(false);
const tempChatTitle = ref('');
const isEditChatTitle = ref(false);
const isOpen = ref(false);

const isComposing = ref(false);

function isValidChatData(data: ChatData): boolean {
  return (data.type === 'text' && Boolean(data.text?.trim()))
    || (data.type === 'tool' && Boolean(data.tool && data.tool.name && data.tool.args));
}

function scrollToBottom(smooth: boolean = true) {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
  }
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

async function send(question: string) {
  createUserBlock(question);
  await sendMessages();
}

async function sendMessages() {
  if (status.value === 'loading') {
    return;
  }
  if (status.value === 'generating') {
    abortController.value?.abort();
  }
  if (!aiStore.currentChat) {
    aiStore.currentChat = createChat();
    aiStore.chatList.push(aiStore.currentChat);
  }
  const chatBlocks = aiStore.currentChat?.chatBlocks;
  try {
    const newAiBlock: ChatBlock = {
      role: 'ai',
      data: [],
      blockId: uuidv4(),
    };
    chatBlocks.push(newAiBlock);
    status.value = 'connecting';
    hasReceivedFirstMessage.value = false;
    autoScroll.value = true;
    await nextTick(() => {
      scrollToBottom();
      resetTextareaHeight();
    });

    abortController.value = new AbortController();

    const requestData: any = {
      messages: [{ role: 'user' as const, content: getLastUserMessage() }],
    };

    if (aiStore.currentChat?.conversationId) {
      requestData.conversationId = aiStore.currentChat.conversationId;
    }

    requestData.subjectId = useConfigStore().currentSubject?.id_;

    await aiApi(requestData, () => status.value = 'loading', receiveMessage, finishGenerating, abortController.value);
  }
  catch (error: any) {
    status.value = 'error';
    console.error('Error during test:', error);
  }
}

function getRouteQuery() {
  const route = useRoute();
  return route.query.query as string | undefined;
}

function getLastUserMessage(): string {
  const chat = aiStore.currentChat;
  if (!chat)
    return '';

  for (let i = chat.chatBlocks.length - 1; i >= 0; i--) {
    const block = chat.chatBlocks[i];
    if (block.role === 'user') {
      for (const data of block.data) {
        if (data.type === 'text' && data.text) {
          return data.text;
        }
      }
    }
  }
  return '';
}

function stopGenerating() {
  if (status.value !== 'idle') {
    status.value = 'idle';
    abortController.value?.abort();
  }
}

async function finishGenerating() {
  const chat = aiStore.currentChat;
  if (!chat) {
    return;
  }
  chat.lastChatTime = new Date().toLocaleString();
  if (chat.chatTitle === DEFAULT_CHAT_TITLE) {
    try {
      const chatMessages = getChatMessages();
      const response = await generateTitleApi(chatMessages);
      chat.chatTitle = response.title;
    }
    catch (e: any) {
      console.error('Error during generating title:', e);
    }
  }
  status.value = 'idle';
}

function receiveMessage(data: ReceiveData) {
  const chat = aiStore.currentChat;

  switch (data.type) {
    case ReceiveDataType.TEXT: {
      if (status.value === 'loading') {
        status.value = 'generating';
      }
      hasReceivedFirstMessage.value = true;
      const message = data.content;
      const lastBlock = chat?.chatBlocks[chat.chatBlocks.length - 1];
      const lastChatData = lastBlock?.data[lastBlock.data.length - 1];

      if (lastChatData && lastChatData.type === 'text') {
        lastChatData.text += message;
      }
      else if (message.trim()) {
        const newChatData: ChatData = {
          type: 'text',
          text: message,
        };
        lastBlock?.data.push(newChatData);
      }
      break;
    }
    case ReceiveDataType.TOOL:{
      const tool = JSON.parse(data.content) as ToolType;
      const chatData: ChatData = {
        type: 'tool',
        tool,
      };
      chat?.chatBlocks[chat.chatBlocks.length - 1].data.push(chatData);
      break;
    }
    case ReceiveDataType.ERROR:
      break;
    case ReceiveDataType.CONVERSATION_INFO:
      console.log('conversation info:', data);
      if (aiStore.currentChat) {
        aiStore.currentChat.conversationId = data.content;
      }
      break;
    case ReceiveDataType.TITLE_GENERATION:
      if (aiStore.currentChat) {
        aiStore.currentChat.chatTitle += data.content;
      }
      break;
    case ReceiveDataType.THINKING:
      break;
    default:
      break;
  }
  if (autoScroll.value) {
    scrollToBottom();
  }
}

watch(status, () => {
  console.log('status:', status.value);
});

function resetTextareaHeight() {
  if (tx.value) {
    tx.value.root.style.height = 'auto';
    tx.value.root.style.height = `${tx.value.root.scrollHeight}px`;
  }
}

const wordCloudUrl = ref('');

onMounted(async () => {
  scrollContainer.value?.addEventListener('scroll', handleScroll);
  scrollToBottom(false);
  resetTextareaHeight();
  tx.value?.root.addEventListener('input', resetTextareaHeight, false);
  const query = getRouteQuery();
  if (query) {
    aiStore.currentChat = null;
    send(query);
    const router = useRouter();
    router.push({ query: undefined });
  }
  try {
    const response = await fetchWordCloudApi();
    wordCloudUrl.value = response.imageUrl;
  }
  catch (e: any) {
    console.error('Error during fetching word cloud:', e);
  }
});

watch(() => aiStore.currentChat, () => {
  stopGenerating();
  nextTick(() => {
    scrollToBottom(false);
    handleScroll();
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
  <div v-if="!isVisitor()" class="flex p-2 gap-2">
    <AiSidebar :word-cloud="wordCloudUrl" :disabled="status !== 'idle'" @send="(question) => send(question)" />
    <Card class="flex-1 flex hover:border-primary flex-col transition-all duration-300">
      <CardHeader v-auto-animate class="py-2 px-4 flex flex-row items-center h-10">
        <CardTitle v-if="!aiStore.currentChat || !isEditChatTitle">
          {{ aiStore.currentChat?.chatTitle ?? DEFAULT_CHAT_TITLE }}
        </CardTitle>
        <Input
          v-else v-model="tempChatTitle" class="h-7 max-w-xs" @blur="() => {
            aiStore.currentChat!.chatTitle = tempChatTitle;
            isEditChatTitle = false;
          }"
          @keydown.enter.exact="() => {
            if (!isComposing) {
              aiStore.currentChat!.chatTitle = tempChatTitle;
              isEditChatTitle = false;
            }
          }"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
        />
        <div v-if="aiStore.currentChat" class="flex gap-2 ml-3">
          <Button
            v-if="!isEditChatTitle"
            size="icon" variant="outline" class="size-6"
          >
            <PencilLine
              class="size-4" @click="() => {
                tempChatTitle = aiStore.currentChat?.chatTitle ?? '';
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
        <div class="grid grid-cols-[1fr_3fr]1 w-full">
          <div ref="scrollContainer" class="flex w-full flex-col items-center gap-3 overflow-y-auto pt-4 px-6 pb-24">
            <div v-for="(block, index) in aiStore.currentChat?.chatBlocks ?? [START_BLOCK]" :key="block.blockId" v-auto-animate class="flex w-full max-w-screen-md">
              <div v-if="block.role === 'user'" class="ml-auto">
                <ContextMenu>
                  <ContextMenuTrigger>
                    <div
                      class="rounded-lg bg-primary text-primary-foreground p-2" @dblclick="() => {
                        message = block.data[0].text as string;
                        aiStore.currentChat?.chatBlocks.splice(index);
                        stopGenerating();
                        nextTick(() => {
                          resetTextareaHeight();
                        });
                      }"
                    >
                      <Label class="text-base whitespace-pre-line">{{ block.data[0].text }}</Label>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem class="flex gap-2" @click="copyMessage(block)">
                      <Clipboard class="size-4" />
                      复制
                    </ContextMenuItem>
                    <ContextMenuItem
                      class="flex gap-2"
                      @click="() => {
                        message = block.data[0].text as string;
                        aiStore.currentChat?.chatBlocks.splice(index);
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
                        aiStore.currentChat?.chatBlocks.splice(index + 1);
                        sendMessages();
                      }"
                    >
                      <RotateCcw class="size-4" />
                      重新发送
                    </ContextMenuItem>
                    <ContextMenuItem
                      class="flex gap-2" @click="deleteMessage(block)"
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
                  <ContextMenuTrigger :disabled="status !== 'idle' && aiStore.currentChat !== null && index === aiStore.currentChat.chatBlocks.length - 1">
                    <div v-auto-animate class="rounded-lg bg-muted text-foreground p-3 w-full border">
                      <div v-if="status === 'loading' && !hasReceivedFirstMessage && aiStore.currentChat && index === aiStore.currentChat.chatBlocks.length - 1" class="flex flex-col items-center justify-center">
                        <DotLottieVue class="size-32 mb-4" autoplay loop src="https://lottie.host/54344590-688a-4a46-970b-f8dbea72f5d1/3CdMHIQhDO.lottie" />
                        <Label class="mb-6 text-base">
                          AI 正在生成中 ...
                        </Label>
                      </div>
                      <div v-else class="flex flex-col gap-4 overflow-x-auto">
                        <div v-for="(data, index_) in block.data.filter(isValidChatData)" :key="index_">
                          <MarkdownDiv v-if="data.type === 'text'" :text="data.text ?? ''" />
                          <Tool v-else-if="data.type === 'tool' && data.tool" :name="data.tool.name" :args="data.tool.args" />
                        </div>
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      class="flex gap-2" @click="copyMessage(block)"
                    >
                      <Clipboard class="size-4" />
                      复制
                    </ContextMenuItem>
                    <ContextMenuItem
                      class="flex gap-2" @click="() => {
                        aiStore.currentChat?.chatBlocks.splice(index);
                        sendMessages();
                      }"
                    >
                      <RotateCcw class="size-4" />
                      重新生成
                    </ContextMenuItem>
                    <ContextMenuItem class="flex gap-2" @click="deleteMessage(block)">
                      <Trash2 class="size-4" />
                      删除
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>
        </div>
        <Button v-if="showScrollToBottom" class="rounded-full absolute bottom-2 size-8 left-1/2 -translate-x-1/2 !text-primary" size="icon" variant="outline">
          <ArrowDownToLine class="size-6" @click="scrollToBottom(true)" />
        </Button>
      </CardContent>
      <CardFooter class="p-2 border-t flex justify-center">
        <div class="max-w-screen-md flex w-full gap-2 items-end">
          <Textarea
            ref="tx"
            v-model="message"
            :rows="1"
            class="resize-none transition-all min-h-0 overflow-hidden"
            placeholder="请输入您的问题"
            @keydown.enter.exact="(event: KeyboardEvent) => {
              if (!event.shiftKey) {
                if (!isComposing) {
                  event.preventDefault();
                  if (status === 'idle' && message.trim() !== '') {
                    createUserBlock(message);
                    sendMessages();
                    message = '';
                  }
                }
              }
            }"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
          />
          <Button
            size="icon" :disabled="(status === 'idle' && message.trim() === '')" class="transition-all"
            @click="async () => {
              if (status !== 'idle') {
                stopGenerating();
              }
              else if (status === 'idle') {
                createUserBlock(message);
                await sendMessages();
                message = '';
              }
            }"
          >
            <Send v-if="status === 'idle'" class="size-4" />
            <CircleStop v-else class="size-4" />
          </Button>
        </div>
      </CardFooter>
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
              aiStore.chatList = aiStore.chatList.filter((chat) => chat.chatId !== aiStore.currentChat?.chatId);
              aiStore.currentChat = null;
            }"
          >
            确定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
  <div v-else class="flex items-center justify-center">
    <Label>
      游客用户无法使用 AI 助手，请先

      <router-link to="/login" class="size-48 underline text-primary underline-offset-4 hover:text-primary transition-all font-medium px-1"> 登录 </router-link>
    </Label>
  </div>
</template>

<style scoped>
</style>
