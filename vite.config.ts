import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

<<<<<<< Updated upstream
export default defineConfig({
<<<<<<< Updated upstream
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
})
=======
export default defineConfig(({ mode }) => {
  return {
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
        '/backend-api/ai': {
          target: 'wss://fun.prob-mind.online/backend-api/ai', // 本地调试 本地用这个
          // target: 'ws://127.0.0.1:8000', // 线上部署
          ws: true,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/backend-api\/ai/, ''),
        },
        '/backend-api': {
          target: 'https://fun.prob-mind.online',
          // target: 'http://127.0.0.1:4523/m1/4811506-4465979-default',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://192.144.199.178',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: mode === 'production'
            ? 'http://backend-server'
            : mode === 'development'
              ? 'https://prob-mind.online'
              : mode === 'mock'
                ? 'http://127.0.0.1:4523/m1/5147033-4811066-default'
                : 'http://127.0.0.1:8000',
          changeOrigin: true,
          // rewrite: path => path.replace(/^\/api/, ''), // mock 时打开， dev 时注释
        },
        '/files': {
          target: 'http://81.70.35.152',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/files/, '/files'),
        },
      },
    },
  }
=======
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
>>>>>>> Stashed changes
});
>>>>>>> Stashed changes
