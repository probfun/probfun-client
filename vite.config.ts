import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['js-big-decimal', ''],
  },

  base: '/',

  plugins: [vue(), Components({
    resolvers: [
      PrimeVueResolver(),
    ],
  }), sentryVitePlugin({
    org: 'umaster',
    project: 'umath-fe',
    url: 'https://sentry.umaster.top',
    authToken: process.env.SENTRY_AUTH_TOKEN,
  })],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    open: true,
    proxy: {
      '/backend-api/ai': {
        target: 'wss://umath.cc',
        ws: true,
        changeOrigin: true,
      },
      '/backend-api': {
        target: 'https://umath.cc',
        changeOrigin: true,
      },
      '/media': {
        target: 'https://umath.cc',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://192.144.199.178',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    sourcemap: true,
  },
});
