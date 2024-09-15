<template>
  <div class="w-screen h-screen flex">
    <div class="w-2/5 flex items-center justify-center p-6">
      <div class="bg-base-200 border-4 rounded-xl w-full h-full flex flex-col items-center justify-center">
        <img src="/src/assets/Frame%208.svg" alt="logo" class="w-48 mb-12" />
        <span class="font-bold text-5xl text-primary tracking-wider">邮趣概率</span>
      </div>
    </div>
    <div class="flex-1 bg-base-100 flex items-center justify-center">
      <div class="flex flex-col rounded-lg w-full max-w-lg">
        <h1 class="text-6xl font-bold mb-16">登录</h1>
        <div class="w-full flex flex-col items-center">
          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-16 shadow-lg">
            <div class="text-2xl font-bold p-4 bg-secondary"> 学号 </div>
            <input v-model="id" class="input input-lg" placeholder="学号" />
          </div>

          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-10 shadow-lg">
            <div class="text-2xl font-bold p-4 bg-secondary"> 密码 </div>
            <input type="password" v-model="password" class="input input-lg" placeholder="密码" />
          </div>

          <button type="submit" class="btn btn-lg btn-primary rounded-full mt-2 w-full max-w-xs" @click="login"> 登录
          </button>
        </div>

        <div class="w-full flex justify-center mt-5 text-lg">
          没有账号？点击此处<router-link to="/register" class="text-blue-700 font-medium px-1">注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useUserStore } from '@/store/index'

const id = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();
const userStore = useUserStore();


// 登录函数
const login = async () => {
  if (!id.value || !password.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请填写所有字段', life: 3000 });
    return;
  }

  const requestData = {
    id: id.value,
    password: password.value,
  };

  try {
    const response = await axios.post('/api/usermanager/login', requestData);
    const data = response.data;

    toast.add({ severity: 'success', summary: '成功', detail: '登录成功', group: 'br', life: 3000 });

    localStorage.setItem('token', data.data.token); // 存储令牌
    userStore.login(data.data.user); // 更新 Pinia 状态，存储用户信息
    await router.push('/dashboard');

  } catch (error: any) {
    console.error('Error:', error);
    const errorMessage = error.response?.data?.msg || '登录失败，请重试';
    toast.add({ severity: 'error', summary: '错误', detail: errorMessage, life: 3000 });
  }
};
</script>

<style scoped></style>
