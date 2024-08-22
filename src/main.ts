import { createApp } from 'vue'
import '@/input.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config';
import router from '@/router';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import store from './store';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
// 恢复令牌
const token = localStorage.getItem('token');
if (token) {
  // 假设你有一个 `checkToken` 方法来验证令牌
  // 并将用户信息存储到 Vuex
  void store.dispatch('restoreSession', token); // 自定义 action 恢复会话
}


const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{indigo.50}',
            100: '{indigo.100}',
            200: '{indigo.200}',
            300: '{indigo.300}',
            400: '{indigo.400}',
            500: '{indigo.600}',
            600: '{indigo.600}',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        }
    }
});

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: MyPreset,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
            cssLayer: false
        }
    }
});
app.use(ToastService);
app.use(store);
app.use(router);
app.mount('#app');
