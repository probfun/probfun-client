<template>
  <div id="app">
    <div class="container">
      <!-- Sidebar Component -->
      <div class="sidebar">
        <div class="logo-container">
          <img src="/src/assets/Frame 8.svg" alt="Logo" class="logo-icon" />
          <span class="logo-text">ProbFUN</span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content">
        <!-- Login Component -->
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
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 全局样式 */
.container {
  display: flex;
}

/* Sidebar 样式 */
.sidebar {
  position: fixed; /* 固定在页面的左侧 */
  top: 0; /* 从页面顶部开始 */
  left: 0; /* 从页面左侧开始 */
  width: 33.33%; /* 占据整个屏幕的 1/3 */
  height: 100vh; /* 高度占满整个视口 */
  background-color: hsla(0, 0%, 97%, 0.987); /* 浅灰色背景 */
  border: 2px solid #dcdcdc; /* 深灰色边框 */
  border-radius: 10px; /* 边缘圆角 10px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 可选：阴影效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px; /* 内边距 */
  box-sizing: border-box; /* 包含边框和内边距在宽度和高度计算中 */
}

.logo-container {
  text-align: center;
}

.logo-icon {
  width: 100px; /* 图标宽度 */
  height: auto;
  display: block;
  margin: 0 auto;
}

.logo-text {
  display: block;
  margin-top: 10px;
  font-size: 36px; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: rgba(34, 13, 224, 0.921); /* 文字颜色 */
}

/* Login 样式 */
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
  .container {
    flex-direction: column; /* 垂直排列侧边栏和内容 */
  }

  .content {
    padding: 20px; /* 减少内边距 */
  }

  .sidebar {
    width: 100%; /* 在小屏幕上全宽 */
    height: auto; /* 高度自适应 */
    padding: 10px; /* 减少内边距 */
    border: none; /* 移除边框 */
    border-radius: 0; /* 移除圆角 */
    box-shadow: none; /* 移除阴影效果 */
  }

  .logo-icon {
    width: 80px; /* 缩小图标 */
  }

  .logo-text {
    font-size: 24px; /* 缩小文字 */
  }

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
