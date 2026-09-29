<script setup>
    import { computed, ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Breadcrumb, Card, ToggleButton, Button,Toolbar } from 'primevue'
    import axios from 'axios'
    import apiClient from '../services/axios';

    const token = localStorage.getItem('authToken');

    const route = useRoute()
    const router = useRouter();

    // Dynamically generate breadcrumbs based on matched route hierarchy
    const items = computed(() => {
        return route.matched
        .filter((routeRecord) => routeRecord.meta && routeRecord.meta.breadcrumb)
        .map((routeRecord) => ({
            label: typeof routeRecord.meta.breadcrumb === 'function' 
            ? routeRecord.meta.breadcrumb(route) 
            : routeRecord.meta.breadcrumb,
            route: routeRecord.path
        }))
    })

    const handleLogout = async () => {
        const response = await apiClient.post('http://127.0.0.1:8000/api/logout', 
            {}, // <-- 2nd argument: Request body data (empty here)
            {   // <-- 3rd argument: Config object (headers go here!)
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        router.push({ name: 'Login' });
    };

    
    const isDark = ref(false);

    const toggleDarkMode = () => {
        // Toggle the class on the html element
        const root = document.documentElement;
        root.classList.toggle('my-app-dark');
        
        // Check if dark mode is now active
        const active = root.classList.contains('my-app-dark');
        
        // Update the button state and save to localStorage
        isDark.value = active;
        localStorage.setItem('theme', active ? 'dark' : 'light');
    };

    onMounted(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Determine if dark mode should be active
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('my-app-dark');
            isDark.value = true;  // Sync toggle button to 'ON' (Dark)
        } else {
            document.documentElement.classList.remove('my-app-dark');
            isDark.value = false; // Sync toggle button to 'OFF' (Light)
        }
    });
</script>

<template>
    <Toolbar>
        <template #start>
            <Breadcrumb class="!bg-transparent border-none shadow-none" :model="items">
                <!-- Optional: Custom item template to use Vue Router's router-link -->
                <template #item="{ item, props }">
                    <router-link v-if="item.route" :to="item.route" custom v-slot="{ href, navigate }">
                        <a :href="href" @click="navigate" v-bind="props.action">
                            <span :class="[item.icon, 'text-color']" />
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                        <span class="text-surface-500 dark:text-surface-400">{{ item.label }}</span>
                    </a>
                </template>
            </Breadcrumb>
        </template>
        <template #end>
            <div class="flex gap-4">
                <!-- <Button icon="pi pi-spin pi-spinner-dotted" severity="secondary"  rounded aria-label="Refresh" size="large" /> -->
                <Button 
                    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" 
                    severity="secondary" 
                    text 
                    rounded 
                    @click="toggleDarkMode" 
                    size="large"
                />
                <Button icon="pi pi-sign-out" severity="secondary"  rounded aria-label="Refresh" size="large" @click="handleLogout()"/>
            </div>
        </template>
    </Toolbar>
</template>
