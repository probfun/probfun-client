import { createApp } from 'vue'
import '@/input.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config';
import router from '@/router'
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'

const app = createApp(App);

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
app.use(router);
app.mount('#app');
