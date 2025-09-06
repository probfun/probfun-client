import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['js-big-decimal', ''],
  },
  base: '/',
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver(),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
    proxy: {
      // 新的/langchain/chat代理配置
      '/langchain/chat/': {
        target: 'https://fun.prob-mind.online',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/langchain\/chat/, '/backend-api/langchain/chat/'),
      },
      '/backend-api/ai': {
        target: 'wss://fun.prob-mind.online', // 本地调试 本地用这个
        // target: 'ws://127.0.0.1:8000', // 线上部署
        ws: true,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/backend-api/, ''),
      },
      '/backend-api': {
        // target: 'http://127.0.0.1:8000',
        target: 'https://fun.prob-mind.online',
        // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://192.144.199.178',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
