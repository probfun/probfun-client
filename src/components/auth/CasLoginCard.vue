<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUserStore } from '@/store';
import { vAutoAnimate } from '@formkit/auto-animate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(false);

const router = useRouter();
const userStore = useUserStore();

function casLogin() {
  const CAS_SERVER = 'https://auth.bupt.edu.cn/authserver/login';
  // const SERVICE_URL = encodeURIComponent(`${window.location.origin}/callback`);
  const SERVICE_URL = encodeURIComponent(`http://192.144.199.178/callback`);
  window.location.href = `${CAS_SERVER}?service=${SERVICE_URL}`;
}

function visitorLogin() {
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
  router.push('/dashboard');
}
</script>

<template>
  <div v-auto-animate class="rounded-lg w-full max-w-sm items-center">
    <h1 class="text-center text-3xl font-bold mb-12 select-none">
      嗨！别来无恙啊
    </h1>

    <div class="text-center flex flex-col mb-6">
      <Button
        :disabled="isLoading"
        class="w-full mb-4"
        @click="casLogin"
      >
        北邮统一认证
      </Button>

      <Button
        variant="outline"
        :disabled="isLoading"
        class="w-full mb-3"
        @click="visitorLogin"
      >
        游客模式登录
      </Button>
    </div>

    <!-- <Label class="w-full flex justify-center mt-5">
      还没有账号？点击此处<router-link to="/register" class="underline underline-offset-4 hover:text-primary transition-all font-medium px-1"> 注册 </router-link>
    </Label> -->
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
  </div>
</template>

<style scoped>

</style>
