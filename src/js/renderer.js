import '../css/app.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import router from './router.js'
import App from './layout/App.vue'

import PrimeVue from 'primevue/config';
import Lara from '@primeuix/themes/lara';

import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';


import Ripple from 'primevue/ripple';

createApp(App)
.use(router)
.use(ToastService)
.use(ConfirmationService)
.use(PrimeVue, {
    ripple: true,
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.my-app-dark',
        }
    }
})
.directive('ripple', Ripple)
.mount('#app')