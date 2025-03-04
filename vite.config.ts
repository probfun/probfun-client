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
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://192.144.199.178',
        // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
        changeOrigin: true,
      },
      '/ai': {
        // target: 'ws://192.144.199.178:8000', // 本地调试 本地用这个 把下面的注释掉 推上去的时候再反过来然后现在能正常用ai了这个意思？
        target: 'ws://127.0.0.1:8000',    // 线上部署 
        ws: true,
        // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ai/, ''),
      },
      '/uploads': {
        target: 'http://192.144.199.178',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
