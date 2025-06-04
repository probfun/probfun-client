<template>
  <div :id="elementId"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  filename: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 600
  },
  showToolBar: {
    type: Boolean,
    default: true
  },
  showAlgebraInput: {
    type: Boolean,
    default: false
  },
  showMenuBar: {
    type: Boolean,
    default: true
  }
  // 可以添加更多 GeoGebraApplet 的配置选项
});

const elementId = ref(`geogebra-applet-${Math.random().toString(36).substring(2, 15)}`);
let ggbApp = null;

onMounted(() => {
  const parameters = {
    appName: 'geometry', // 或 'graphing', '3d', 'cas', 'probability' 等
    // width: props.width,
    // height: props.height,
    showToolBar: props.showToolBar,
    showAlgebraInput: props.showAlgebraInput,
    showMenuBar: props.showMenuBar,
    filename: props.filename
  };

  if (typeof GGBApplet !== 'undefined') {
    ggbApp = new GGBApplet(parameters, true);
    ggbApp.inject(elementId.value);
  } else {
    // 如果 deployggb.js 尚未加载，则动态加载
    const script = document.createElement('script');
    script.src = 'https://cdn.geogebra.org/apps/deployggb.js';
    script.async = true;
    script.onload = () => {
      ggbApp = new GGBApplet(parameters, true);
      ggbApp.inject(elementId.value);
    };
    document.head.appendChild(script);
  }
});
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>