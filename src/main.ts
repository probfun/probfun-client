import { createApp } from 'vue'
import '@/input.css'
import '@/assets/index.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config';
import router from '@/router';
import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'
import store from './store';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
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
