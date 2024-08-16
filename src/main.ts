import { createApp } from 'vue'
import '@/input.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config';
import router from '@/router'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import store from './store';

const app = createApp(App);
// 恢复令牌
const token = localStorage.getItem('token');
if (token) {
  // 假设你有一个 `checkToken` 方法来验证令牌
  // 并将用户信息存储到 Vuex
  store.dispatch('restoreSession', token); // 自定义 action 恢复会话
}

app.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
            cssLayer: false
        }
    }
});
app.use(store);
app.use(router);
app.mount('#app');
