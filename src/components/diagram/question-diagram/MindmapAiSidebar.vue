<script setup lang="ts">
import type { ChatData } from '@/api/ai/aiType';
import { Icon } from '@iconify/vue';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue';
import { ArrowDownToLine, Bot, CircleStop, Clipboard, PencilLine, RotateCcw, Send, Trash2 } from 'lucide-vue-next';
import { nextTick, onMounted, ref, watch } from 'vue';
import Tool from '@/components/ai/tool/Tool.vue';
import MarkdownDiv from '@/components/markdown-div/MarkdownDiv.vue';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  currentKnowledgePoint: string;
  aiMessages: Array<{ role: 'user' | 'ai'; data: ChatData[] }>;
  aiState: 'idle' | 'thinking' | 'error';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  quickAsk: [content: string];
  sendMessage: [content: string];
  close: [];
  stop: [];
  retryFrom: [content: string];
  deleteMessage: [index: number];
}>();

const currentMessage = ref('');
const isComposing = ref(false);
const tx = ref<typeof Textarea | null>(null);
const scrollContainer = ref<HTMLDivElement | null>(null);
const showScrollToBottom = ref(false);

const quickQuestions = [
  {
    title: '核心概念',
    content: '这个知识点的核心概念是什么？',
  },
  {
    title: '具体例子',
    content: '能举个具体的例子吗？',
  },
  {
    title: '应用场景',
    content: '这个知识点有什么应用场景？',
  },
  {
    title: '内容联系',
    content: '这个知识点和前面的内容有什么联系？',
  },
];

function handleQuickAsk(content: string) {
  emit('quickAsk', content);
}

function handleSendMessage() {
  if (currentMessage.value.trim() !== '') {
    emit('sendMessage', currentMessage.value.trim());
    currentMessage.value = '';
  }
}

function copyMessageAt(index: number) {
  const msg = props.aiMessages[index];
  const text = msg.data.map((d: any) => d.type === 'text' ? (d.text || '') : '').join('\n');
  navigator.clipboard.writeText(text);
}

function deleteMessageAt(index: number) {
  // 通过emit通知父组件删除消息
  emit('deleteMessage', index);
}

function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd() {
  isComposing.value = false;
}

function resetTextareaHeight() {
  if (tx.value?.root) {
    tx.value.root.style.height = 'auto';
    tx.value.root.style.height = `${tx.value.root.scrollHeight}px`;
  }
}

function setMessage(text: string) {
  currentMessage.value = text || '';
  nextTick(() => {
    resetTextareaHeight();
  });
}

function scrollToBottom(smooth: boolean = true) {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: smooth ? 'smooth' : 'instant' });
  }
}

function handleScroll() {
  const container = scrollContainer.value;
  if (!container)
    return;
  const bottomThreshold = 100;
  const distance = container.scrollHeight - container.scrollTop - container.clientHeight;
  showScrollToBottom.value = distance > bottomThreshold;
}

onMounted(() => {
  nextTick(() => {
    resetTextareaHeight();
    scrollToBottom(false);
    scrollContainer.value?.addEventListener('scroll', handleScroll);
  });
});

// 监听消息变化，自动滚动到底部
watch(() => props.aiMessages, () => {
  nextTick(() => {
    scrollToBottom();
  });
}, { deep: true });
</script>

<template>
  <div class="w-full h-full rounded-2xl border bg-background flex flex-col">
    <div class="p-4 border-b flex items-center gap-2">
      <div class="font-semibold">
        AI辅导
      </div>
      <div class="ml-auto text-xs text-muted-foreground">
        当前知识点：{{ currentKnowledgePoint }}
      </div>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 px-2"
        @click="emit('close')"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </Button>
    </div>

    <div ref="scrollContainer" v-auto-animate class="p-4 space-y-3 flex-1 overflow-auto relative">
      <div v-if="aiMessages.length === 0" class="text-xs text-muted-foreground">
        开始提问吧：可以描述你对该知识点的疑问或需要解释的内容。
      </div>
      <template v-for="(message, index) in aiMessages" :key="index">
        <div
          class="flex w-full"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div v-if="message.role === 'ai'" class="flex flex-col gap-2 w-full max-w-screen-md">
            <div class="flex gap-2 items-center">
              <div class="rounded-full p-1 bg-primary flex items-center justify-center text-primary-foreground">
                <Bot class="size-5" />
              </div>
              <div class="text-xs opacity-70">
                邮小率
              </div>
            </div>
            <ContextMenu>
              <ContextMenuTrigger>
                <div class="relative rounded-lg bg-muted text-foreground p-3 w-full border group">
                  <!-- 加载状态显示在最后一个AI消息块内部 -->
                  <div v-if="aiState === 'thinking' && index === aiMessages.length - 1" class="flex flex-col items-center justify-center">
                    <DotLottieVue class="size-32 mb-4" autoplay loop src="https://lottie.host/54344590-688a-4a46-970b-f8dbea72f5d1/3CdMHIQhDO.lottie" />
                    <div class="text-base mb-6">
                      AI 正在生成中 ...
                    </div>
                  </div>
                  <div v-else class="flex flex-col gap-4 overflow-x-auto">
                    <div v-for="(content, contentIndex) in message.data" :key="contentIndex">
                      <MarkdownDiv v-if="content.type === 'text'" :text="content.text || ''" />
                      <Tool v-else-if="content.type === 'tool'" :name="content.tool!.name" :args="content.tool!.args" />
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" class="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1 size-6" @click="() => copyMessageAt(index)">
                    <Clipboard class="size-4" />
                  </Button>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem class="flex gap-2" @click="() => copyMessageAt(index)">
                  <Clipboard class="size-4" />
                  复制
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => setMessage(message.data.map(d => d.type === 'text' ? (d.text || '') : '').join('\n'))">
                  <PencilLine class="size-4" />
                  设为输入
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => emit('retryFrom', message.data.map(d => d.type === 'text' ? (d.text || '') : '').join('\n'))">
                  <RotateCcw class="size-4" />
                  重新生成
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => deleteMessageAt(index)">
                  <Trash2 class="size-4" />
                  删除
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
          <div v-else class="ml-auto">
            <ContextMenu>
              <ContextMenuTrigger>
                <div
                  class="rounded-lg bg-primary text-primary-foreground p-2"
                  @dblclick="() => {
                    const text = message.data.map(d => d.type === 'text' ? (d.text || '') : '').join('\n');
                    setMessage(text);
                    emit('deleteMessage', index);
                  }"
                >
                  <div v-for="(content, contentIndex) in message.data" :key="contentIndex">
                    <div v-if="content.type === 'text'" class="text-base whitespace-pre-line">
                      {{ content.text || '' }}
                    </div>
                    <Tool v-else-if="content.type === 'tool'" :name="content.tool!.name" :args="content.tool!.args" />
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem class="flex gap-2" @click="() => copyMessageAt(index)">
                  <Clipboard class="size-4" />
                  复制
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => setMessage(message.data.map(d => d.type === 'text' ? (d.text || '') : '').join('\n'))">
                  <PencilLine class="size-4" />
                  设为输入
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => emit('retryFrom', message.data.map(d => d.type === 'text' ? (d.text || '') : '').join('\n'))">
                  <RotateCcw class="size-4" />
                  重新发送
                </ContextMenuItem>
                <ContextMenuItem class="flex gap-2" @click="() => deleteMessageAt(index)">
                  <Trash2 class="size-4" />
                  删除
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </div>
      </template>
      <Button v-if="showScrollToBottom" class="rounded-full absolute bottom-2 size-8 left-1/2 -translate-x-1/2 !text-primary" size="icon" variant="outline">
        <ArrowDownToLine class="size-6" @click="scrollToBottom(true)" />
      </Button>
    </div>

    <CardFooter class="p-2 border-t flex justify-center">
      <div class="max-w-screen-md flex w-full flex-col gap-2">
        <!-- 快捷问题：单行水平并列，可横向滚动 -->
        <div class="w-full flex gap-2 overflow-x-auto whitespace-nowrap">
          <Button
            v-for="question in quickQuestions"
            :key="question.title"
            :disabled="aiState !== 'idle'"
            variant="outline"
            size="sm"
            class="shrink-0"
            @click="handleQuickAsk(question.content)"
          >
            {{ question.title }}
          </Button>
        </div>

        <!-- 输入区域：单独占一行，整行铺满（对齐 AiPanel） -->
        <div class="w-full min-w-0 flex items-end gap-2">
          <Textarea
            ref="tx"
            v-model="currentMessage"
            :rows="1"
            placeholder="请输入您的问题"
            class="resize-none transition-all min-h-0 overflow-hidden w-full"
            :disabled="aiState === 'thinking'"
            @keydown="(e: KeyboardEvent) => {
              if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                e.preventDefault();
                handleSendMessage();
              }
            }"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @input="resetTextareaHeight"
          />
          <Button
            size="icon"
            class="transition-all"
            :disabled="(aiState === 'idle' && currentMessage.trim() === '')"
            @click="async () => {
              if (aiState !== 'idle') {
                emit('stop');
              }
              else {
                handleSendMessage();
              }
            }"
          >
            <Send v-if="aiState === 'idle'" class="size-4" />
            <CircleStop v-else class="size-4" />
          </Button>
        </div>
      </div>
    </CardFooter>
  </div>
</template>
