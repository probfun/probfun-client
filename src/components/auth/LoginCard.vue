<script setup lang="ts">
import { loginApi } from '@/api/user/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';
import { useUserStore } from '@/store';
import { setLocalToken } from '@/utils/auth';
import { vAutoAnimate } from '@formkit/auto-animate';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-vue-next';
import { useToast as useToast2 } from 'primevue/usetoast'
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const studentId = ref('');
const password = ref('');

const { toast } = useToast();
const toast2 = useToast2();
const router = useRouter();
const userStore = useUserStore();

// 登录函数
async function login() {
  if (!studentId.value || !password.value) {
    toast({
      icon: h(CircleAlert),
      title: '提示',
      description: '请填写所有字段',
      variant: 'warning',
    });
    return;
  }

  try {
    const data = await loginApi(studentId.value, password.value);
    toast({
      icon: h(CircleCheck),
      title: '成功',
      description: '登录成功',
      variant: 'success',
    });
    const { token, ...user } = data.user;

    setLocalToken(token);
    userStore.user = user;
    await router.push('/dashboard/home');
  }
  catch (error: any) {
    console.error('Error:', error);
    const errorMessage = error.response?.data?.msg || '登录失败，请重试';
    toast({
      icon: h(CircleX),
      title: '错误',
      description: errorMessage,
      variant: 'destructive',
    });
  }
};
</script>

<template>
  <div v-auto-animate class="rounded-lg w-full max-w-sm items-center ">
    <h1 class="text-center text-3xl font-bold mb-4 select-none">
      嗨！别来无恙啊
    </h1>
    <div class="text-center text-muted-foreground select-none">
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
        <Label for="password" > 密码 </Label>
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
