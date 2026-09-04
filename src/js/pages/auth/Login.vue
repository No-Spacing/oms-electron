<script setup>
import { ref, onMounted, computed } from 'vue';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import FloatLabel from 'primevue/floatlabel';

// Form state
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const handleLogin = () => {
    // Implement your authentication logic here
    console.log('Logging in with:', email.value, password.value);
};

const sunrise = ref('../../../assets/sunrise.jpg');
const sunset = ref('../../../assets/sunset.jpg');

// Automatically check if current local hour is PM (12 PM or later)
const currentHour = new Date().getHours();
const isPmTime = currentHour >= 12;

// Computed background image based on AM/PM
const backgroundImage = computed(() => {
    return isPmTime ? sunset.value : sunrise.value;
});

onMounted(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
        document.documentElement.classList.add('my-app-dark')
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 px-4 py-8" 
        :style="{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: '100% 100%' 
        }">
        <div class="w-full max-w-md">
            <Card class="shadow-xl border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden">
                <template #title>
                    <div class="text-center pt-4 pb-2">
                        <h1 class="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-0">
                            Welcome Back
                        </h1>
                        <p class="text-sm font-normal text-surface-500 dark:text-surface-400 mt-1">
                            Please sign in to your account
                        </p>
                    </div>
                </template>
                
                <template #content>
                    <form @submit.prevent="handleLogin" class="space-y-6 pt-2">
                        <div class="field">
                            <FloatLabel variant="on">
                                <InputText 
                                    id="email" 
                                    v-model="email" 
                                    type="email" 
                                    class="w-full" 
                                    autocomplete="email"
                                    required 
                                />
                                <label for="email">Email Address</label>
                            </FloatLabel>
                        </div>

                        <div class="field">
                            <FloatLabel variant="on">
                                <Password 
                                    id="password" 
                                    v-model="password" 
                                    class="w-full" 
                                    inputClass="w-full" 
                                    :feedback="false" 
                                    toggleMask 
                                    autocomplete="current-password"
                                    required 
                                />
                                <label for="password">Password</label>
                            </FloatLabel>
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <div class="flex items-center gap-2">
                                <Checkbox 
                                    v-model="rememberMe" 
                                    inputId="rememberMe" 
                                    binary 
                                />
                                <label for="rememberMe" class="text-surface-700 dark:text-surface-300 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            label="Login" 
                            icon="pi pi-sign-in" 
                            class="w-full" 
                            :severity="isPmTime ? 'warn' : 'success'"
                        />
                    </form>
                </template>
            </Card>
        </div>
    </div>
</template>