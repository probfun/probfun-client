<template>
    <div class="sidebar">
      <div class="logo-container">
        <img src="/src/assets/Frame 8.svg" alt="Logo" class="logo-icon" />
        <span class="logo-text">ProbFUN</span>
      </div>
    </div>
  </template>
  
  <script setup>
 
  </script>
  
  <style scoped>
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
  
  /* 调整 Logo 和文字的样式 */
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
  
  /* 媒体查询: 对于较小的屏幕 */
  @media (max-width: 768px) {
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
  }
  </style>
  