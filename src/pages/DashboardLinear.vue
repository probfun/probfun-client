<template>
  <div class="dashboard-linear">
    <h1>邮趣线代</h1>
    <p>这里是邮趣线代的主页，内容敬请期待。</p>
  </div>
</template>

<script setup lang="ts">
// 可根据需要引入 store 或其它逻辑
</script>

<style scoped>
.dashboard-linear {
  min-height: 100vh;
  background: rgb(142, 68, 173); /* 与 left 面一致 */
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif;
}
h1 {
  font-size: 2.5em;
  margin-bottom: 1em;
}
</style>