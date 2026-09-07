import '../css/app.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'

import PrimeVue from 'primevue/config';
import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primevue/themes'

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import Ripple from 'primevue/ripple';

const MyPreset = definePreset(Lara, {})

createApp(App)
.use(router)
.use(ToastService)
.use(ConfirmationService)
.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})
.directive('tooltip', Tooltip)
.directive('ripple', Ripple)
.mount('#app')