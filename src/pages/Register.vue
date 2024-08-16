<template>
  <div class="sidebar">
    <div class="logo-container">
      <img src="/src/assets/Frame%208.svg" alt="Logo" class="logo-icon" />
      <span class="logo-text">ProbFUN</span>
    </div>
  </div>
  <div class="login-container">
    <div class="flex flex-col px-16 py-8 bg-white border-2 shadow-lg items-center rounded-lg">
      <h1 class="text-2xl font-bold mb-8">注册</h1>
      <div v-focustrap class="w-full sm:w-80 flex flex-col gap-6">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-pencil" />
          </InputGroupAddon>
          <InputText id="schoolID" v-model="schoolID" type="schoolID" placeholder="学号" autofocus fluid />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user" />
          </InputGroupAddon>
          <InputText id="input" v-model="username" type="text" placeholder="用户名" fluid />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-key" />
          </InputGroupAddon>
          <Password id="password" v-model="password" type="password" placeholder="密码" fluid toggleMask />
        </InputGroup>

        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-envelope" />
          </InputGroupAddon>
          <InputText id="email" v-model="email" type="email" placeholder="邮箱" fluid />
        </InputGroup>

        <div class="flex items-center gap-2">
          <Checkbox id="accept" v-model="accept" name="accept" value="Accept" />
          <label for="accept">我同意隐私政策</label>
        </div>

        <Button type="submit" label="注册" class="mt-2" @click="register" severity="help" />
      </div>

      <div class="w-full flex justify-center mt-5">
        已有账号？点击<router-link to="/login" class="text-blue-700"> 登录 </router-link>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Pass } from 'three/examples/jsm/postprocessing/Pass';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const schoolID = ref('');
const username = ref('');
const password = ref('');
const email = ref('');
const accept = ref(false);
const router = useRouter();

function register() {
  if (!schoolID.value || !username.value || !password.value || !email.value || !accept.value) {
    alert('请填写所有字段并接受隐私政策');
    return;
  }

  const requestData = {
    id: schoolID.value,
    password: password.value,
    username: username.value,
    gender: '未知',
    number: '随意',
    introduction: '',
    email: email.value,
  };

  fetch('/usermanager/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(response => {
      // 检查响应状态码
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // 先以文本方式读取响应
    })
    .then(text => {
      try {
        const data = JSON.parse(text); // 尝试解析 JSON
        if (data.status === 200) {
          alert('注册成功');
          router.push('/login');
        } else {
          alert('注册失败，请重试');
        }
      } catch (error) {
        console.error('Failed to parse JSON:', error);
        alert('注册失败，请重试');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('注册失败，请重试');
    });
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

.login-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px;
  /* 使标题与输入框之间有足够的间距 */
}

.input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  /* 水平居中对齐输入框容器 */
}

.input-container {
  width: 100%;
  max-width: 500px;
  /* 最大宽度 */
}

.input-box {
  margin-bottom: 20px;
  /* 方框之间的间距 */
  border: 1px solid #000;
  /* 黑色边框 */
  border-radius: 10px;
  /* 边缘圆角 10px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* 阴影效果 */
}

.input-header {
  background-color: #aeadf0;
  /* 浅紫色背景 */
  color: #333;
  /* 文字颜色 */
  padding: 10px;
  border-top-left-radius: 10px;
  /* 圆角 */
  border-top-right-radius: 10px;
  /* 圆角 */
  font-size: 18px;
}

.input-field {
  width: 100%;
  border: none;
  /* 去除默认边框 */
  padding: 10px;
  border-bottom-left-radius: 10px;
  /* 圆角 */
  border-bottom-right-radius: 10px;
  /* 圆角 */
  font-size: 16px;
  box-sizing: border-box;
  /* 包含内边距在宽度计算中 */
}

.input-field::placeholder {
  color: #888;
  /* 占位符颜色 */
}

/* 媒体查询: 对于较小的屏幕 */
@media (max-width: 768px) {
  .login-container {
    padding: 20px;
    /* 减少内边距 */
  }

  .input-box {
    margin-bottom: 10px;
    /* 缩小方框之间的间距 */
  }

  .input-header {
    font-size: 16px;
    /* 缩小字体 */
  }

  .input-field {
    font-size: 14px;
    /* 缩小字体 */
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
