import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    optimizeDeps: {
      exclude: ['js-big-decimal', ''],
    },
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
          target: 'http://8.154.34.171:8080',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://8.154.34.171:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
