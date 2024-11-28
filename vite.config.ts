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
      '/llm': {
        target: 'ws://192.144.199.178',
        ws: true,
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
})
