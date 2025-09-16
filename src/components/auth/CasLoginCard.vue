<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { visitorApi } from '@/api/track/trackApi.ts';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useConfigStore, useUserStore } from '@/store';

const isLoading = ref(false);

const router = useRouter();
const userStore = useUserStore();

function casLogin() {
  const CAS_SERVER = 'https://auth.bupt.edu.cn/authserver/login';
  // const SERVICE_URL = encodeURIComponent(`${window.location.origin}/callback`);
  const SERVICE_URL = encodeURIComponent(`http://192.144.199.178/callback`);
  window.location.href = `${CAS_SERVER}?service=${SERVICE_URL}`;
}

async function visitorLogin() {
  userStore.user = {
    uid: 'visitor-uid',
    username: 'visitor',
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
  let visitorId = Cookies.get('VISITOR_ID');
  if (!visitorId) {
    visitorId = uuidv4();
    Cookies.set('VISITOR_ID', visitorId, { expires: 365 }); // 有效期 1 年
  }
  try {
    await visitorApi();
  }
  catch (e: any) {
    console.error('Error:', e);
  }
  router.push('/dashboard');
}

const configStore = useConfigStore();
</script>

<template>
  <div
    v-auto-animate
    class="rounded-2xl w-full max-w-md items-center p-4 space-y-8"
  >
    <h1
      v-auto-animate
      class="text-center text-3xl font-bold select-none tracking-wide"
    >
      欢迎进入
      <span v-if="configStore.currentSubject === 'advanced-math-1'" class="text-primary transition-colors">邮趣高数（上）</span>
      <span v-else-if="configStore.currentSubject === 'advanced-math-2'" class="text-primary transition-colors">邮趣高数（下）</span>
      <span v-else-if="configStore.currentSubject === 'probability'" class="text-primary transition-colors">邮趣概率</span>
      <span v-else-if="configStore.currentSubject === 'linear-algebra'" class="text-primary transition-colors">邮趣线代</span>
      <span v-else-if="configStore.currentSubject === 'number-theory'" class="text-primary transition-colors">邮趣数论</span>
      <span v-else-if="configStore.currentSubject === 'statistics'" class="text-primary transition-colors">邮趣统计</span>
      ！
    </h1>

    <div class="flex flex-col gap-4">
      <Button
        :disabled="isLoading"
        :aria-busy="isLoading"
        class="w-full h-11 text-[15px] font-medium shadow-sm hover:shadow-md transition-all duration-200"
        @click="casLogin"
      >
        北邮统一认证
      </Button>

      <div class="flex items-center gap-3 px-2 select-none text-xs text-neutral-500 dark:text-neutral-400">
        <span class="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/70 dark:via-neutral-600/70 to-transparent" />
        或
        <span class="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300/70 dark:via-neutral-600/70 to-transparent" />
      </div>

      <Button
        variant="outline"
        :disabled="isLoading"
        :aria-busy="isLoading"
        class="w-full h-11 text-[15px] font-medium hover:border-blue-500/60 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        @click="visitorLogin"
      >
        游客模式登录
      </Button>
    </div>

    <Label
      class="w-full flex flex-col items-center text-center gap-1 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400"
    >
      <span>登录遇到问题？请添加 QQ 群</span>
      <span
        class="underline underline-offset-4 font-medium tracking-wide text-neutral-800 dark:text-neutral-200 cursor-text"
      >
        111293253
      </span>
      <span class="text-[11px] opacity-70">验证通过后联系管理员协助处理</span>
    </Label>
  </div>
</template>

<style scoped>

</style>
