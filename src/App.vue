<template>
    <div id="app">
    <Sidebar />
    <Login />
  </div>
</template>

<script setup>
import MainLayout from './components/MainLayout.vue'
import Sidebar from './components/Sidebar.vue';
import Login from './components/Login.vue';
</script>

<style>
/* 全局样式 */

/* 媒体查询: 对于较小的屏幕 */
@media (max-width: 768px) {
  /* 如果需要特定的全局样式调整，可以在这里添加 */
}
</style>
