import { defineStore } from 'pinia';
import { User } from '@/api/user/userType';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,  // 使用你的 User 类型
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        login(userData: User) {
            this.user = userData;
            this.token = userData.token;  // 假设 userData 包含 token
        },
        logout() {
            this.user = null;
            this.token = null;
        },
    },
});
