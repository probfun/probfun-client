<script setup lang="ts">
import type { Chat } from '@/api/ai/aiType';
import AiQuestions from '@/components/ai/AiQuestions.vue';
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

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAiStore } from '@/store';
import { Ellipsis, Plus } from 'lucide-vue-next';
import { ref, watch } from 'vue';

defineProps < {
  disabled: boolean
}>();

const emit = defineEmits<{
  send: [question: string]
}>();

const isOpen = ref(false);
const editChatBlock = ref<Chat | null>(null);
const readyToDeleteChat = ref<Chat | null>(null);

const aiStore = useAiStore();
const tempChatTitle = ref('');
const isComposing = ref(false);

function switchToChatBlock(chat: Chat) {
  aiStore.currentChat = chat;
}

function switchToNewChatBlock() {
  aiStore.currentChat = null;
}

const chatBlockList = ref<Chat[]>([...aiStore.chatList].sort((a, b) => new Date(b.lastChatTime).getTime() - new Date(a.lastChatTime).getTime()));

watch(() => aiStore.chatList, (newChatList) => {
  chatBlockList.value = [...newChatList].sort((a, b) => new Date(b.lastChatTime).getTime() - new Date(a.lastChatTime).getTime());
}, { deep: true });
function handleCompositionStart() {
  isComposing.value = true;
}

function handleCompositionEnd() {
  isComposing.value = false;
}
</script>

<template>
  <div class="sticky left-0 h-full w-72 grid grid-rows-[1fr_2fr] gap-2">
    <Card class="overflow-y-hidden flex flex-col hover:border-primary transition-all duration-300">
      <CardHeader class="px-4 py-2">
        <CardTitle class="flex items-center">
          历史聊天
          <Button size="icon" variant="outline" class="size-6 ml-auto" @click="switchToNewChatBlock">
            <Plus class="size-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent class="px-3 py-2 border-t flex flex-col gap-1 overflow-y-auto h-full">
        <div v-for="item in chatBlockList" :key="item.chatTitle" class="flex gap-2 group">
          <Button
            variant="ghost" :class="cn('text-left flex-1', aiStore.currentChat?.chatId === item.chatId && 'bg-secondary')" @click="switchToChatBlock(item)"
            @dblclick="() => {
              tempChatTitle = item.chatTitle;
              editChatBlock = item;
            }"
          >
            <div v-if="!editChatBlock || editChatBlock !== item" class="w-full text-left">
              {{ item.chatTitle }}
            </div>
            <Input
              v-else v-model="tempChatTitle" class="h-7 p-0 w-full max-w-none" @blur="() => {
                item.chatTitle = tempChatTitle;
                editChatBlock = null
              }"
              @keydown.enter.exact="() => {
                if (!isComposing) {
                  item.chatTitle = tempChatTitle;
                  editChatBlock = null
                }
              }"
              @compositionstart="handleCompositionStart"
              @compositionend="handleCompositionEnd"
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button :class="cn('size-6 opacity-0 group-hover:opacity-100 transition-all', aiStore.currentChat?.chatId === item.chatId && 'opacity-100')" variant="outline" size="icon">
                <Ellipsis class="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                @click="() => {
                  tempChatTitle = item.chatTitle;
                  editChatBlock = item;
                }"
              >
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem
                class="!text-destructive" @click="() => {
                  isOpen = true;
                  readyToDeleteChat = item;
                }"
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
    <AiQuestions
      :disabled="disabled"
      @send="(question) => {
        emit('send', question);
      }"
    />

    <AlertDialog v-model:open="isOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除该聊天吗？</AlertDialogTitle>
          <AlertDialogDescription>
            该操作将永久删除该聊天，并且无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="readyToDeleteChat = null">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground"
            @click="() => {
              if (readyToDeleteChat?.chatId === aiStore.currentChat?.chatId) {
                aiStore.currentChat = null;
              }
              aiStore.chatList = aiStore.chatList.filter((chat: Chat) => chat.chatId !== readyToDeleteChat?.chatId);
              readyToDeleteChat = null;
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
