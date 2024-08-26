<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="/src/assets/Frame%208.svg" alt="Logo" class="w-36" />
      <span class="logo-text tracking-wider">邮趣概率</span>
    </div>
  </div>
  <div class="login-container">
    <div class="flex flex-col px-16 py-8 bg-white border-2 shadow-lg items-center rounded-lg">
      <h1 class="text-2xl font-bold mb-8">登录</h1>
      <div v-focustrap class="w-full sm:w-80 flex flex-col gap-6">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-pencil" />
          </InputGroupAddon>
          <InputText id="schoolID" v-model="id" type="schoolID" placeholder="学号" autofocus fluid />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-key" />
          </InputGroupAddon>
          <Password id="password" v-model="password" :feedback="false" type="password" placeholder="密码" fluid toggleMask />
        </InputGroup>

        <div class="flex items-center gap-2">
          <Checkbox id="accept" v-model="accept" name="accept" value="Accept" />
          <label for="accept">我同意隐私政策</label>
        </div>

        <Button type="submit" label="登录" class="mt-2" @click="login" />
      </div>

      <div class="w-full flex justify-center mt-5">
        没有账号？请先<router-link to="/register" class="text-blue-700"> 注册 </router-link>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import {useToast} from "primevue/usetoast";
const toast = useToast();

const id = ref('');
const password = ref('');
const accept = ref(false);
const router = useRouter();
const store = useStore();

async function login() {
  if (!id.value || !password.value || !accept.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请填写所有字段并接受隐私政策', life: 3000 });
    return;
  }

  const requestData = {
    id: id.value,
    password: password.value,
  };

  try {
    const response = await axios.post('http://8.154.34.171:8080/usermanager/login', requestData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 附加令牌
        'Content-Type': 'application/json',
      },
    });

    const data = response.data;
    toast.add({ severity: 'success', summary: '成功', detail: '登录成功', life: 3000 });
    localStorage.setItem('token', data.data.user.token); // 存储令牌
    await store.dispatch('login', data.data.user); // 更新 Vuex 状态
    await router.push('/dashboard');
  } catch (error) {
    console.error('Error:', error);
    toast.add({ severity: 'error', summary: '错误', detail: '学号或密码错误，请重试', life: 3000 });
  }
}
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
