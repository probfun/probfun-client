import type { Chat } from '@/api/ai/aiType';
import type { User } from '@/api/user/userType';
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
  const currentChat = ref<Chat | null>(null);
  const chatList = ref<Chat[]>([]);
  return {
    currentChat,
    chatList,
  }
}, {
  persist: true,
});

export const useConfigStore = defineStore('configStore', () => {
  const darkMode = ref<boolean>(false);
  const targetNodeId = ref<string | null>(null);
  const isMoving = ref(false);
  return {
    darkMode,
    targetNodeId,
    isMoving,
  }
}, {
  persist: true,
});
