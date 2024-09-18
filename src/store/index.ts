import type { User } from '@/api/user/userType';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const user = ref<User | null>(null);
  return {
    user,
  }
});
