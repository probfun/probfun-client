<script setup lang="ts">
import { loginApi } from '@/api/user/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store';
import { setLocalToken } from '@/utils/auth';
import { vAutoAnimate } from '@formkit/auto-animate';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const studentId = ref('');
const password = ref('');

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();

// 登录函数
async function login() {
  if (!studentId.value || !password.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请填写所有字段', life: 3000 });
    return;
  }

  try {
    const data = await loginApi(studentId.value, password.value);
    toast.add({ severity: 'success', summary: '成功', detail: '登录成功', group: 'br', life: 3000 });
    const { token, ...user } = data.user;

    setLocalToken(token);
    userStore.user = user;
    await router.push('/dashboard');
  }
  catch (error: any) {
    console.error('Error:', error);
    const errorMessage = error.response?.data?.msg || '登录失败，请重试';
    toast.add({ severity: 'error', summary: '错误', detail: errorMessage, life: 3000 });
  }
};
</script>

<template>
  <div v-auto-animate class="rounded-lg w-full max-w-sm items-center ">
    <h1 class="text-center text-3xl font-bold mb-4">
      嗨！别来无恙啊
    </h1>
    <div class="text-center text-muted-foreground">
      我们需要你的学工号和密码以继续。
    </div>

    <div v-auto-animate class="w-full my-4">
      <div class="grid gap-2">
        <Label for="studentId"> 学工号 </Label>
        <Input id="studentId" v-model="studentId" class="transition-all" placeholder="" />
      </div>
    </div>

    <div class="w-full grid gap-4 mb-6">
      <div class="grid gap-2">
        <Label for="password"> 密码 </Label>
        <Input id="password" v-model="password" type="password" class="transition-all" placeholder="" />
      </div>
    </div>

    <Button
      :disabled="isLoading" class="w-full" @click="() => {
        login();
      }"
    >
      登录
    </Button>

    <Label class="w-full flex justify-center mt-5">
      还没有账号？点击此处<router-link to="/register" class="underline underline-offset-4 hover:text-primary transition-all font-medium px-1"> 注册 </router-link>
    </Label>
  </div>
</template>

<style scoped>

</style>
