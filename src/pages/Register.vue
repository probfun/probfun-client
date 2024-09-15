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
        <h1 class="text-5xl font-bold mb-10">注册</h1>
        <div class="w-full flex flex-col items-center">
          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-5 shadow-lg">
            <div class="text-xl font-bold p-4 bg-secondary"> 学号 </div>
            <input v-model="schoolID" class="input input-lg" placeholder="学号" />
          </div>

          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-5 shadow-lg">
            <div class="text-xl font-bold p-4 bg-secondary"> 用户名 </div>
            <input v-model="username" class="input input-lg" placeholder="用户名" />
          </div>


          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-5 shadow-lg">
            <div class="text-xl font-bold p-4 bg-secondary"> 密码 </div>
            <input type="password" v-model="password" class="input input-lg" placeholder="密码" />
          </div>

          <div class="rounded-xl border-2 flex flex-col overflow-hidden w-full mb-5 shadow-lg">
            <div class="text-xl font-bold p-4 bg-secondary"> 邮箱 </div>
            <input v-model="email" class="input input-lg" placeholder="邮箱" />
          </div>

          <button type="submit" class="btn btn-lg btn-primary rounded-full mt-2 w-full max-w-xs" @click="register"> 注册
          </button>
        </div>

        <div class="w-full flex justify-center mt-5 text-lg">
          已有账号？点击此处<router-link to="/login" class="text-blue-700 font-medium px-1"> 登录 </router-link>
        </div>
      </div>
    </div>
  </div>

  <!--  <div class="h-screen w-screen flex">-->
  <!--    <div class="w-1/3 h-full flex items-center justify-center">-->
  <!--      <div class="logo-container">-->
  <!--        <img src="/src/assets/Frame%208.svg" alt="Logo" class="logo-icon" />-->
  <!--        <span class="text-primary text-3xl">邮趣概率</span>-->
  <!--      </div>-->
  <!--    </div>-->

  <!--    <div class="flex items-center justify-center h-full flex-1">-->
  <!--      <div class="flex flex-col px-16 py-8 bg-base-100 border-2 shadow-lg items-center rounded-lg">-->
  <!--        <h1 class="text-2xl font-bold mb-8">注册</h1>-->
  <!--        <div v-focustrap class="w-full sm:w-80 flex flex-col gap-6">-->
  <!--          <InputGroup>-->
  <!--            <InputGroupAddon>-->
  <!--              <i class="pi pi-pencil" />-->
  <!--            </InputGroupAddon>-->
  <!--            <InputText id="schoolID" v-model="schoolID" type="schoolID" placeholder="学号" autofocus fluid />-->
  <!--          </InputGroup>-->

  <!--          <InputGroup>-->
  <!--            <InputGroupAddon>-->
  <!--              <i class="pi pi-user" />-->
  <!--            </InputGroupAddon>-->
  <!--            <InputText id="input" v-model="username" type="text" placeholder="用户名" fluid />-->
  <!--          </InputGroup>-->

  <!--          <InputGroup>-->
  <!--            <InputGroupAddon>-->
  <!--              <i class="pi pi-key" />-->
  <!--            </InputGroupAddon>-->
  <!--            <Password id="password" v-model="password" type="password" placeholder="密码" fluid toggleMask />-->
  <!--          </InputGroup>-->

  <!--          <InputGroup>-->
  <!--            <InputGroupAddon>-->
  <!--              <i class="pi pi-envelope" />-->
  <!--            </InputGroupAddon>-->
  <!--            <InputText id="email" v-model="email" type="email" placeholder="邮箱" fluid />-->
  <!--          </InputGroup>-->

  <!--          <div class="flex items-center gap-2">-->
  <!--            <Checkbox id="accept" v-model="accept" name="accept" value="Accept" />-->
  <!--            <label for="accept">我同意隐私政策</label>-->
  <!--          </div>-->

  <!--          <button type="submit" class="btn btn-primary mt-2" @click="register"> 注册 </button>-->
  <!--        </div>-->

  <!--        <div class="w-full flex justify-center mt-5">-->
  <!--          已有账号？点击<router-link to="/login" class="text-blue-700"> 登录 </router-link>-->
  <!--        </div>-->
  <!--      </div>-->

  <!--    </div>-->

  <!--  </div>-->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const schoolID = ref('');
const username = ref('');
const password = ref('');
const email = ref('');
const router = useRouter();
const toast = useToast();

// 注册方法
const register = async () => {
  // 校验所有字段是否填写
  if (!schoolID.value || !username.value || !password.value || !email.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请填写所有字段', life: 3000 });
    return;
  }

  // 准备请求数据
  const requestData = {
    studentId: schoolID.value,
    password: password.value,
    nickname: username.value,
    gender: '未知', // 可根据需要调整字段
    phone: '随意',   // 确认是否需要
    introduction: '',
    email: email.value,
  };

  try {
    // 发送注册请求
    const response = await axios.post('/api/usermanager/register', requestData);

    // 注册成功后的提示信息
    toast.add({ severity: 'success', summary: '成功', detail: '注册成功，请登录', life: 3000 });

    // 跳转到登录页面
    await router.push('/login');
  } catch (error) {
    console.error('Error during registration:', error);

    // 根据后端返回的具体错误信息进行提示
    const errorMessage = error.response?.data?.msg || '注册失败，请重试';
    toast.add({ severity: 'error', summary: '错误', detail: errorMessage, life: 3000 });
  }
};
</script>

<style scoped>
.login-container {
  position: fixed;
  /* 固定在页面的右侧 */
  top: 0;
  right: 0;
  width: 66.67%;
  /* 占据右侧 2/3 屏幕宽度 */
  height: 100vh;
  /* 高度占满整个视口 */
  background-color: #f9f9f9;
  /* 背景色 */
  padding: 40px;
  /* 内边距 */
  box-sizing: border-box;
  /* 包含边框和内边距在宽度和高度计算中 */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 水平居中对齐 */
  justify-content: center;
  /* 垂直居中对齐 */
}



/* 媒体查询: 对于较小的屏幕 */
@media (max-width: 768px) {
  .login-container {
    padding: 20px;
    /* 减少内边距 */
  }
}

.sidebar {
  position: fixed;
  /* 固定在页面的左侧 */
  top: 0;
  /* 从页面顶部开始 */
  left: 0;
  /* 从页面左侧开始 */
  width: 33.33%;
  /* 占据整个屏幕的 1/3 */
  height: 100vh;
  /* 高度占满整个视口 */
  background-color: hsla(0, 0%, 97%, 0.987);
  /* 浅灰色背景 */
  border: 2px solid #dcdcdc;
  /* 深灰色边框 */
  border-radius: 10px;
  /* 边缘圆角 10px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 可选：阴影效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  /* 内边距 */
  box-sizing: border-box;
  /* 包含边框和内边距在宽度和高度计算中 */
}

/* 调整 Logo 和文字的样式 */
.logo-container {
  text-align: center;
}

.logo-icon {
  width: 100px;
  /* 图标宽度 */
  height: auto;
  display: block;
  margin: 0 auto;
}

.logo-text {
  display: block;
  margin-top: 10px;
  font-size: 36px;
  /* 字体大小 */
  font-weight: bold;
  /* 字体加粗 */
  color: rgba(34, 13, 224, 0.921);
  /* 文字颜色 */
}

/* 媒体查询: 对于较小的屏幕 */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    /* 在小屏幕上全宽 */
    height: auto;
    /* 高度自适应 */
    padding: 10px;
    /* 减少内边距 */
    border: none;
    /* 移除边框 */
    border-radius: 0;
    /* 移除圆角 */
    box-shadow: none;
    /* 移除阴影效果 */
  }

  .logo-icon {
    width: 80px;
    /* 缩小图标 */
  }

  .logo-text {
    font-size: 24px;
    /* 缩小文字 */
  }
}
</style>
