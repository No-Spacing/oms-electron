<script setup>
    import { computed, ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Breadcrumb, Card, ToggleButton, Button,Toolbar } from 'primevue'
    import axios from 'axios'

    const token = localStorage.getItem('authToken');

    const route = useRoute()
    const router = useRouter();

    // Root home icon configuration
    const home = ref({
        icon: 'pi pi-home',
        route: '/home'
    })

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

    const isDark = ref(false);
    
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('my-app-dark');
    };

    const handleLogout = async () => {
        const response = await axios.post('http://127.0.0.1:8000/api/logout', 
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

    onMounted(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
            document.documentElement.classList.add('my-app-dark')
        }
    })
</script>

<template>
    <Toolbar>
        <template #start>
            <Breadcrumb class="!bg-transparent border-none shadow-none" :home="home" :model="items">
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
            <div class="flex gap-2">
                <Button icon="pi pi-spin pi-spinner-dotted" severity="secondary"  rounded aria-label="Refresh" size="large" />
                <ToggleButton v-model="isDark" onLabel="Light" offLabel="Dark" @click="toggleDarkMode" onIcon="pi pi-sun" offIcon="pi pi-moon" class="w-36" />
                <Button icon="pi pi-sign-out" severity="secondary"  rounded aria-label="Refresh" size="large" @click="handleLogout()"/>
            </div>
        </template>
    </Toolbar>
</template>
