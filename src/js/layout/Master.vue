<script setup>
    import { 
        Toolbar, 
        Button, 
        Badge, 
        Menu, 
        Avatar, 
        Card, 
        ToggleButton,
        Divider,
        Toast,
    } from 'primevue'
    import { ref, computed } from 'vue'
    import AppBreadcrumb from './AppBreadcrumb.vue';

    const storedUserJson = localStorage.getItem('user');
    const user = JSON.parse(storedUserJson);

    const items = ref([
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            link: '/'
        },
        {
            label: 'Company',
            icon: 'pi pi-building',
            link: '/company'
        },
        {
            label: 'Customers',
            icon: 'pi pi-users',
            link: '/customers'
        },
        {
            label: 'Records',
            icon: 'pi pi-truck',
            link: '/records'
        },
        {
            label: 'Users',
            icon: 'pi pi-user',
            link: '/users',
            requiresAdmin: true
        },
        {
            label: 'About',
            icon: 'pi pi-exclamation-circle',
            link: '/about'
        },
    ]);

    const filteredItems = computed(() => {
    return items.value.filter(item => {
        if (item.requiresAdmin && user.role.name != 'Admin') {
            return false;
        }
        return true;
    });
});
</script>
<template>
   <div class="p-2">
        <main>
            <div class="flex flex-col gap-2">
                <div class="min-h-screen flex bg-surface-50 dark:bg-surface-950">
                    <!-- SIDEBAR (Independent & Fixed) -->
                    <aside class="w-60 flex-shrink-0 hidden md:block">
                        <Menu :model="filteredItems" class="w-full flex flex-col overflow-hidden">
                            <template #start>
                                <div class="flex items-center justify-center gap-2 px-4 py-6">
                                    <img src="../../assets/ico.png" alt="Company Logo" class="size-6 object-contain" />
                                    <span class="block font-semibold">OSUS PMC</span>
                                </div>
                            </template>
                            <template #submenulabel="{ item }">
                                <span class="text-primary font-bold">{{ item.label }}</span>
                            </template>
                            
                            <template #item="{ item, props }">
                                <RouterLink 
                                    v-ripple 
                                    class="flex items-center px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors duration-200"
                                    active-class="bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 font-semibold"
                                    exact-active-class="bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 font-bold"
                                    v-bind="props.action" 
                                    :to="item.link"
                                >
                                    <i :class="[item.icon, 'mr-2']" style="font-size: 1.1rem;"></i>
                                    <span>{{ item.label }}</span>
                                    <Badge v-if="item.badge" class="ml-auto" :value="item.badge"    />
                                    <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                                </RouterLink>
                            </template>

                            <template #end>
                                <div class="mt-auto">
                                    <Divider class="my-2"></Divider>
                                    <div class="flex flex-row items-center pl-5 pb-3 gap-1">
                                        <Avatar size="large" image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" class="mr-2 mt-1" shape="circle" />
                                        <span class="inline-flex flex-col items-start">
                                            <span class="font-bold">{{ user.name }}</span>
                                            <span class="text-sm">{{ user.role.name }}</span>
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </Menu>
                    </aside>

                    <!-- MAIN CONTENT AREA -->
                    <main class="flex-1 pl-2 overflow-y-auto ">
                        <AppBreadcrumb class="mb-4" />
                        <RouterView />
                    </main>
                </div>
            </div>
        </main>
        <Toast></Toast>
    </div>
</template>