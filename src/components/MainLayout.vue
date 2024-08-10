<template>
    <div class="container">
      <Sidebar />
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import Sidebar from './Sidebar.vue'
  </script>
  
  <style scoped>
  .container {
    display: flex;
  }
  
  /* 媒体查询: 对于较小的屏幕 */
  @media (max-width: 768px) {
    .container {
      flex-direction: column; /* 垂直排列侧边栏和内容 */
    }
  
    .content {
      padding: 10px; /* 减少内边距 */
    }
  }
  </style>
  