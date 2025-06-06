<script setup lang="ts">
import { isValidApi, loginApi, registerApi } from '@/api/user/userApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserStore } from '@/store';
import { setLocalToken } from '@/utils/auth';
import { error, success, warning } from '@/utils/toast';
import { vAutoAnimate } from '@formkit/auto-animate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const isValid = ref(false);
const isLoading = ref(false);
const studentId = ref('');
const nickname = ref('');
const password = ref('');
const gender = ref('0');
const email = ref('');
const phone = ref('');
const major = ref('');
const school = ref('');

async function checkValid() {
  try {
    isLoading.value = true;
    const response = await isValidApi(studentId.value);
    if (response.isValid === 0) {
      isValid.value = true;
    }
    else if (response.isValid === 1) {
      warning('学工号已被注册');
    }
    else {
      warning('学工号无效');
    }
  }
  catch (e: any) {
    console.error('Error during validation:', e);
    error('学工号校验失败，请重试');
  }
  isLoading.value = false;
}

// 注册方法
async function register() {
  // 校验所有字段是否填写
  if (!studentId.value || !nickname.value || !password.value) {
    warning('请填写所有必要信息');
    return;
  }

  try {
    await registerApi(
      studentId.value,
      password.value,
      nickname.value,
      Number.parseInt(gender.value),
      email.value,
      phone.value,
      major.value,
      school.value,
    );
    const data = await loginApi(studentId.value, password.value);
    const { token, ...user } = data.user;
    setLocalToken(token);
    userStore.user = user;
    await router.push('/dashboard-prob');
    success('注册成功');
    await router.push('/dashboard-prob');
  }
  catch (e: any) {
    console.error('Error during registration:', e);
    error('注册失败');
  }
}
</script>

<template>
  <form
    v-auto-animate class="rounded-lg w-full max-w-sm items-center" @submit.prevent="() => {
      console.log(isValid);
      if (isValid) {
        register();
      }
      else {
        checkValid();
      }
    }"
  >
    <h1 class="text-center text-3xl font-bold mb-4">
      让我们从创建账号开始
    </h1>
    <div v-if="!isValid" class="text-center text-muted-foreground">
      请输入你的学工号来进行初步校验。
    </div>

    <div v-else class="text-center text-muted-foreground">
      请补全其他信息来完善你的账号。
    </div>

    <div v-auto-animate class="w-full my-4">
      <div class="grid gap-2">
        <Label v-if="isValid" for="studentId"> 学工号 </Label>
        <Input id="studentId" v-model="studentId" class="transition-all" placeholder="请输入学工号" :disabled="isValid" required />
      </div>
    </div>

    <div v-if="isValid" class="w-full grid gap-4 mb-6">
      <div class="grid gap-2">
        <Label for="password"> 密码 </Label>
        <Input id="password" v-model="password" type="password" class="transition-all" placeholder="" required />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="nickname"> 昵称 </Label>
          <Input id="nickname" v-model="nickname" class="transition-all" placeholder="" required />
        </div>

        <div class="grid gap-2">
          <Label for="gender"> 性别 </Label>
          <Select v-model="gender">
            <SelectTrigger>
              <SelectValue class="transition-all" placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">
                保密
              </SelectItem>
              <SelectItem value="1">
                男
              </SelectItem>
              <SelectItem value="2">
                女
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="grid gap-4 grid-cols-2">
        <div class="grid gap-2">
          <Label for="school"> 学院（选填） </Label>
          <Input id="school" v-model="school" class="transition-all" placeholder="" />
        </div>

        <div class="grid gap-2">
          <Label for="school"> 专业（选填） </Label>
          <Input id="school" v-model="major" class="transition-all" placeholder="" />
        </div>
      </div>

      <div class="grid gap-2">
        <Label for="email"> 邮箱（选填） </Label>
        <Input id="email" v-model="email" type="email" class="transition-all" placeholder="m@example.com" />
      </div>

      <div class="grid gap-2">
        <Label for="phone"> 手机号（选填） </Label>
        <Input id="phone" v-model="phone" class="transition-all" placeholder="" />
      </div>
    </div>

    <div v-auto-animate class="flex gap-4">
      <Button
        v-if="isValid"
        type="button" class="w-full" :disabled="isLoading" @click="() => {
          isValid = false;
          password = '';
          nickname = '';
          gender = '0';
          email = '';
          phone = '';
          major = '';
          school = '';
        }"
      >
        上一步
      </Button>
      <Button
        type="submit"
        :disabled="isLoading" class="w-full"
      >
        {{ isValid ? '注册' : '下一步' }}
      </Button>
    </div>

    <Label class="w-full flex justify-center mt-5">
      已有账号？点击此处<router-link to="/login-test" class="underline underline-offset-4 hover:text-primary transition-all font-medium px-1"> 登录 </router-link>
    </Label>
    <Label class="w-full flex justify-center mt-3">
      注册遇到问题？请添加QQ群<div class="underline underline-offset-4 px-1 cursor-text">111293253</div>以联系管理员。
    </Label>
  </form>
</template>

<style scoped>

</style>
