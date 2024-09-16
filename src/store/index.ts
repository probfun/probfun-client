import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') as string) || null, // 从 localStorage 获取用户信息
  }),
  actions: {
    login(user: Record<string, any>, token: string) {
      this.user = user;
      localStorage.setItem('token', token); // 保存 token 到 localStorage
      localStorage.setItem('user', JSON.stringify(user)); // 保存用户信息到 localStorage
    },
    logout() {
      this.user = null;
      localStorage.removeItem('token');  // 清除 token
      localStorage.removeItem('user');   // 清除用户信息
    },
    initializeStore() {
      // 检查 localStorage 中是否有用户信息
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser); // 将用户信息恢复到状态
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
  },
});
