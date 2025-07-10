<script setup>
defineProps({
  filename: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 600,
  },
  showToolBar: {
    type: Boolean,
    default: true,
  },
  showAlgebraInput: {
    type: Boolean,
    default: false,
  },
  showMenuBar: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <iframe title="二维向量场的线积分" src="https://www.geogebra.org/material/iframe/id/hvzq9ehw/width/870/height/905/border/888888/sfsb/true/smb/true/stb/true/stbh/true/ai/true/asb/true/sri/true/rc/true/ld/true/sdz/true/ctl/true" width="870px" height="905px" />
</template>

<style scoped>
/* 可以添加自定义样式 */
</style>
