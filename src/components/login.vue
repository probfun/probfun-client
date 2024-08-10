<template>
  <div class="login-container">
    <h1 class="login-title">登录</h1>
    <div class="input-wrapper">
      <div class="input-container">
        <div class="input-box">
          <div class="input-header">密码</div>
          <input type="password" placeholder="请输入密码" class="input-field" />
        </div>
        <div class="input-box">
          <div class="input-header">用户名</div>
          <input type="text" placeholder="请输入用户名" class="input-field" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.login-container {
  position: fixed; /* 固定在页面的右侧 */
  top: 0;
  right: 0;
  width: 66.67%; /* 占据右侧 2/3 屏幕宽度 */
  height: 100vh; /* 高度占满整个视口 */
  background-color: #f9f9f9; /* 背景色 */
  padding: 40px; /* 内边距 */
  box-sizing: border-box; /* 包含边框和内边距在宽度和高度计算中 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中对齐 */
  justify-content: center; /* 垂直居中对齐 */
}

.login-title {
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 40px; /* 使标题与输入框之间有足够的间距 */
}

.input-wrapper {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中对齐输入框容器 */
}

.input-container {
  width: 100%;
  max-width: 500px; /* 最大宽度 */
}

.input-box {
  margin-bottom: 20px; /* 方框之间的间距 */
  border: 1px solid #000; /* 黑色边框 */
  border-radius: 10px; /* 边缘圆角 10px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

.input-header {
  background-color: #aeadf0; /* 浅紫色背景 */
  color: #333; /* 文字颜色 */
  padding: 10px;
  border-top-left-radius: 10px; /* 圆角 */
  border-top-right-radius: 10px; /* 圆角 */
  font-size: 18px;
}

.input-field {
  width: 100%;
  border: none; /* 去除默认边框 */
  padding: 10px;
  border-bottom-left-radius: 10px; /* 圆角 */
  border-bottom-right-radius: 10px; /* 圆角 */
  font-size: 16px;
  box-sizing: border-box; /* 包含内边距在宽度计算中 */
}

.input-field::placeholder {
  color: #888; /* 占位符颜色 */
}

/* 媒体查询: 对于较小的屏幕 */
@media (max-width: 768px) {
  .login-container {
    padding: 20px; /* 减少内边距 */
  }

  .input-box {
    margin-bottom: 10px; /* 缩小方框之间的间距 */
  }

  .input-header {
    font-size: 16px; /* 缩小字体 */
  }

  .input-field {
    font-size: 14px; /* 缩小字体 */
  }
}
</style>
