import type { User } from '@/api/user/userType';
import type { AiMessage, ChatBlock } from '@/components/ai/aiType';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null);
  return {
    user,
  }
}, {
  persist: true,
});

export const useAiStore = defineStore('aiStore', () => {
  const aiMessages = ref<AiMessage[]>([
    {
      role: 'assistant',
      content: '我是“邮小率”，你的智能助手，专门帮助学生解决概率论实验相关的问题。如果你有关于概率论的概念、实验步骤或者具体问题需要解答，随时告诉我，我会尽力帮助你！',
    },
  ]);
  const currentChatBlock = ref<ChatBlock | null>(null);
  const chatBlockList = ref<ChatBlock[]>([]);
  return {
    aiMessages,
    currentChatBlock,
    chatBlockList,
  }
}, {
  persist: true,
});
