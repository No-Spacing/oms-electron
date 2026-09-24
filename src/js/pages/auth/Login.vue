<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Card, InputText, Password, Button, Checkbox, FloatLabel, useToast, Toast, ConfirmDialog, useConfirm }from 'primevue';

import apiClient from '../../services/axios';

const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const loading = ref(false);
const errors = ref([]);

// Form state
const form = reactive({
    email: null,
    password: null,
})
const rememberMe = ref(false);

// Computed background image based on AM/PM
const backgroundImage = ref('../../../assets/welcome.jpg');

async function handleLogin () {
    loading.value = true;

    try {
        const response = await apiClient.post('login', form);

        // Save auth state
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Redirect
        router.push({ name: 'Home' });
    } catch (error) {
        if(error?.response?.status === 422) {
             toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: "We couldn't find an account matching those details. Please verify your info and try again.", 
                life: 10000 
            });
        }
        
        if(error?.response?.status == 500){
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: "API connection failed. Please verify your network status or try again later. If the problem persists, please contact the developers.", 
                life: 10000 
            });
        }
        
    } finally {
        loading.value = false; // Runs whether it succeeds or fails
    }
}

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
                    <form @submit.prevent="handleLogin()" class="space-y-6 pt-2">
                        <div class="field">
                            <FloatLabel variant="on">
                                <InputText 
                                    id="email" 
                                    v-model="form.email" 
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
                                    v-model="form.password" 
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
                            severity="success"
                            :loading="loading"
                        />
                    </form>
                </template>
            </Card>
        </div>
    </div>
    <Toast position="top-center"></Toast>
    <ConfirmDialog></ConfirmDialog>
</template>