import type { User } from '@/types/user.ts';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const role = computed(() => user.value?.role ?? 0);

  function login(newToken: string, newUser: User) {
    token.value = newToken;
    user.value = newUser;
    user.value.role = newUser.username.startsWith('2010') ? 1 : 0;
  }

  function logout() {
    token.value = null;
    user.value = null;
  }

  return {
    token,
    user,
    isAuthenticated,
    role,
    login,
    logout,
  };
}, {
  persist: true,
});
