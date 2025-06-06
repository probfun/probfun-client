<script setup lang="ts">
import { visitorApi } from '@/api/track/trackApi.ts';
import { loginApi } from '@/api/user/userApi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUserStore, useThemeStore } from '@/store';
import { setLocalToken } from '@/utils/auth';
import { error, success, warning } from '@/utils/toast';
import { vAutoAnimate } from '@formkit/auto-animate';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Input } from '@/components/ui/input';

const isLoading = ref(false);
const studentId = ref('');
const password = ref('');

const router = useRouter();
const userStore = useUserStore();
const themeStore = useThemeStore();
// 登录函数
async function login() {
  if (!studentId.value || !password.value) {
    warning('请填写所有字段');
    return;
  }
  try {
    const data = await loginApi(studentId.value, password.value);
    success('登录成功');
    const { token, ...user } = data.user;

    setLocalToken(token);
    userStore.user = user;
    let target = 'dashboard-prob';
    if (themeStore.currentColor === 'rgb(34, 168, 109)') {
      target = 'dashboard-advanced';
    } else if (themeStore.currentColor === 'rgb(142, 68, 173)') {
      target = 'dashboard-linear';
    }
    await router.push(target);
  }
  catch (e: any) {
    console.error('Error:', e);
    error('登录失败，请重试');
  }
}

// function casLogin() {
//   const CAS_SERVER = 'https://auth.bupt.edu.cn/authserver/login';
//   // const SERVICE_URL = encodeURIComponent(`${window.location.origin}/callback`);
//   const SERVICE_URL = encodeURIComponent(`http://192.144.199.178/callback`);
//   window.location.href = `${CAS_SERVER}?service=${SERVICE_URL}`;
// }

async function visitorLogin() {
  userStore.user = {
    uid: 'visitor-uid',
    studentId: 'visitor',
    classId: 'visitor-class',
    nickname: 'Visitor',
    gender: '0',
    email: 'visitor@example.com',
    phone: '000-000-0000',
    school: 'Visitor School',
    major: 'Visitor Major',
    grade: 0,
    avatarUrl: 'https://example.com/visitor-avatar.png',
    role: -1,
  };
  let visitorId = Cookies.get('VISITOR_ID')
  if (!visitorId) {
    visitorId = uuidv4()
    Cookies.set('VISITOR_ID', visitorId, { expires: 365 }) // 有效期 1 年
  }
  try {
    await visitorApi();
  }
  catch (e: any) {
    console.error('Error:', e);
  }
  router.push('/dashboard');
}
</script>

<template>
  <form v-auto-animate class="rounded-lg w-full max-w-sm items-center" @submit.prevent="login">
    <h1 class="text-center text-3xl font-bold mb-12 select-none">
      嗨！别来无恙啊
    </h1>

    <div v-auto-animate class="w-full my-4">
      <div class="grid gap-2">
        <Label for="studentId"> 学工号 </Label>
        <Input id="studentId" v-model="studentId" class="transition-all" placeholder="" required />
      </div>
    </div>

    <div class="w-full grid gap-4 mb-6">
      <div class="grid gap-2">
        <Label for="password"> 密码 </Label>
        <Input id="password" v-model="password" type="password" class="transition-all" placeholder="" required />
      </div>
    </div>

    <div class="text-center flex flex-col mb-6">
      <Button
        type="submit"
        :disabled="isLoading" 
        class="w-full mb-4 transition-colors duration-800"
        :style="{ backgroundColor: themeStore.currentColor }"
      >
        登录
      </Button>
      <!--      <Button -->
      <!--        type="button" -->

      <!--        :disabled="isLoading" -->
      <!--        class="w-full mb-4" -->
      <!--        @click="casLogin" -->
      <!--      > -->
      <!--        北邮统一认证 -->
      <!--      </Button> -->

      <Button
        type="submit"
        variant="outline"
        :disabled="isLoading"
        class="w-full mb-3"
        @click="visitorLogin"
      >
        游客模式登录
      </Button>
    </div>

    <Label class="w-full flex justify-center mt-5">
      还没有账号？点击此处<router-link to="/register-test" class="underline underline-offset-4 hover:text-primary transition-all font-medium px-1"> 注册 </router-link>
    </Label>
    <Label class="w-full flex justify-center mt-3">
      点击查看
      <a
        href="https://ecnyphosrl4i.feishu.cn/wiki/VpHuwRJ53iDKIUkhfFVcqX9fnVe?from=from_copylink"
        target="_blank"
        class="underline underline-offset-4 px-1 cursor-pointer text-black-600 hover:text-blue-800"
      >
        用户手册
      </a>
    </Label>

    <Label class="w-full flex justify-center mt-3">
      登录遇到问题？请添加QQ群<div class="underline underline-offset-4 px-1 cursor-text">111293253</div>以联系管理员。
    </Label>
  </form>
</template>

<style scoped>
:deep(.button) {
  transition: background-color 0.8s ease;
}
</style>
