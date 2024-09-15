import { defineStore } from 'pinia';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null as null | Record<string, any>, // 存储用户信息
  }),
  actions: {
    login(user: Record<string, any>) {
      this.user = user;
    },
    logout() {
      this.user = null;
      localStorage.removeItem('token');  // 清除 token
      localStorage.removeItem('user');   // 清除用户信息
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    getUser: (state) => state.user,
  },
});
