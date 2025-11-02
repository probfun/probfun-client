<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import { Icon } from '@iconify/vue';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi, signupApi } from '@/api/user/userApi.ts';
import CnUniversityCombobox from '@/components/auth/CnUniversityCombobox.vue';

import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { useConfigStore, useUserStore } from '@/store';
import { setLocalToken } from '@/utils/auth.ts';
import { error, success, warning } from '@/utils/toast.ts';

const isLoading = ref(false);

const router = useRouter();
const userStore = useUserStore();

function casLogin() {
  const CAS_SERVER = 'https://auth.bupt.edu.cn/authserver/login';
  const SERVICE_URL = encodeURIComponent(`https://umath.cc/callback`);
  window.location.href = `${CAS_SERVER}?service=${SERVICE_URL}`;
}

const loginForm = reactive({
  account: '',
  password: '',
});

const signupForm = reactive({
  account: '',
  nickname: '',
  password: '',
  school: '',
  confirmPassword: '',
});

async function login() {
  if (!loginForm.account) {
    warning('请填写账号');
    return;
  }
  if (!loginForm.password) {
    warning('请填写密码');
    return;
  }
  try {
    const data = await loginApi(loginForm.account, loginForm.password);
    success('登录成功');
    const { token, user } = data;

    setLocalToken(token);
    userStore.user = user;
    await router.push('/');
  }
  catch (e: any) {
    console.error('Error:', e);
    error(`登录失败：${e.response.data.message ?? '未知错误'}`);
  }
}

async function signup() {
  if (!signupForm.account) {
    warning('账号不能为空');
    return;
  }
  if (!signupForm.nickname) {
    warning('昵称不能为空');
    return;
  }
  if (!signupForm.school) {
    warning('学校不能为空');
    return;
  }
  if (!signupForm.password) {
    warning('密码不能为空');
    return;
  }
  if (signupForm.password !== signupForm.confirmPassword) {
    warning('两次输入的密码不一致');
    return;
  }

  try {
    await signupApi(signupForm.account, signupForm.password, signupForm.nickname, 0, '', '', '', signupForm.school);
    const data = await loginApi(signupForm.account, signupForm.password);
    const { token, user } = data;
    setLocalToken(token);
    userStore.user = user;
    await router.push('/');
    success('注册成功');
    await router.push('/');
  }
  catch (e: any) {
    console.error('Error during registration:', e);
    error(`注册失败：${e.response.data.message ?? '未知错误'}`);
  }
}

onMounted(() => {
  const configStore = useConfigStore();
  configStore.currentSubjectId = null;
});

const isLogin = computed(() => {
  return router.currentRoute.value.path === '/login';
});
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <div class="py-6 px-12 flex items-center border-b-2">
      <div class="h-10 flex items-center gap-3">
        <img src="/logo-math.svg" alt="" class="size-12">
        <div class="text-2xl font-bold text-primary">
          邮趣数学
        </div>
      </div>
      <!--      <Button variant="ghost" class="ml-auto text-lg h-full"> -->
      <!--        继续使用游客模式 -->
      <!--      </Button> -->
    </div>
    <div class="flex-1 px-8 py-4 bg-background flex h-full items-center justify-center">
      <div class="w-full max-w-md h-full mt-20 p-4">
        <h1 class="text-3xl font-semibold select-none tracking-wide mb-2">
          登录或创建账户
        </h1>

        <div class="text-base text-gray-600 mb-6">
          欢迎来到邮趣数学，让我们从这里开始你的数学之旅吧！
        </div>

        <div v-auto-animate class="space-y-5 mb-3">
          <div v-if="isLogin" class="space-y-5">
            <div class="relative">
              <Input
                id="account"
                v-model="loginForm.account"
                :disabled="isLoading"
                autocomplete="username"
                placeholder="账号"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
                @keydown.enter.prevent="login"
              />
              <Label
                for="account"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                账号
              </Label>
            </div>

            <div class="relative">
              <Input
                id="password"
                v-model="loginForm.password"
                :disabled="isLoading"
                type="password"
                autocomplete="password"
                placeholder="密码"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
                @keydown.enter.prevent="login"
              />
              <Label
                for="password"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                密码
              </Label>
            </div>

            <Button
              :disabled="isLoading"
              :aria-busy="isLoading"
              class="w-full text-base h-12 font-medium shadow-sm hover:shadow-md transition-all rounded-xl"
              @click="login"
            >
              登录
            </Button>

            <Button
              variant="outline"
              :disabled="isLoading"
              class="w-full text-base h-12 rounded-xl"
              @click="router.push('/signup')"
            >
              没有账号？点此创建
            </Button>
          </div>
          <div v-else class="space-y-5">
            <div class="relative">
              <Input
                id="accountSignup"
                v-model="signupForm.account"
                :disabled="isLoading"
                placeholder="账号"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="accountSignup"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                账号
              </Label>
            </div>

            <div class="relative">
              <Input
                id="nickname"
                v-model="signupForm.nickname"
                :disabled="isLoading"
                placeholder="昵称"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="nickname"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                昵称
              </Label>
            </div>

            <CnUniversityCombobox v-model="signupForm.school" src="/china_universities.json" placeholder="就读学校" />

            <div class="relative">
              <Input
                id="passwordSignup"
                v-model="signupForm.password"
                :disabled="isLoading"
                type="password"
                placeholder="密码"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="passwordSignup"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                密码
              </Label>
            </div>

            <div class="relative">
              <Input
                id="confirmPassword"
                v-model="signupForm.confirmPassword"
                :disabled="isLoading"
                type="password"
                placeholder="密码"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="confirmPassword"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
             peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
             -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                再次输入密码
              </Label>
            </div>

            <Button
              :disabled="isLoading"
              :aria-busy="isLoading"
              class="w-full h-12 text-base font-medium shadow-sm hover:shadow-md transition-all rounded-xl"
              @click="signup"
            >
              注册
            </Button>

            <Button
              variant="outline"
              :disabled="isLoading"
              class="w-full h-12 text-base rounded-xl"
              @click="router.push('/login')"
            >
              已有账号？点此登录
            </Button>
          </div>

          <div class="flex items-center gap-3 px-2 select-none text-sm text-neutral-500 dark:text-neutral-400">
            <span class="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/70 dark:via-neutral-600/70 to-transparent" />
            或者
            <span class="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/70 dark:via-neutral-600/70 to-transparent" />
          </div>

          <Button
            variant="outline"
            :disabled="isLoading"
            :aria-busy="isLoading"
            class="w-full h-12 text-base !text-primary font-medium shadow-sm hover:shadow-md transition-all rounded-xl border-primary"
            @click="casLogin"
          >
            <Icon icon="lucide:key-round" class="size-5 mr-2" />
            继续使用北邮统一认证
          </Button>
        </div>

        <Label class="w-full gap-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <span>登录遇到问题？请添加 QQ 群</span>
          <span class="underline underline-offset-4 font-medium tracking-wide text-neutral-800 dark:text-neutral-200 cursor-text">
            111293253
          </span>
        </Label>
      </div>
    </div>
  </div>
</template>
