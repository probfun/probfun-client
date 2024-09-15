import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  // 1. state 定义：存储用户信息和 token
  state: () => ({
    user: null, // 用户信息，初始值为 null
    token: localStorage.getItem('token') || '', // 从 localStorage 读取 token
  }),

  // 2. actions 定义：用于更新状态的操作
  actions: {
    // 登录成功后更新用户信息
    login(userData: null) {
      this.user = userData; // 保存用户信息到 store
    },
    
    // 登出时清除用户信息和 token
    logout() {
      this.user = null; // 清空用户信息
      this.token = '';  // 清空 token
      localStorage.removeItem('token'); // 同时从 localStorage 移除 token
    }
  }
});
