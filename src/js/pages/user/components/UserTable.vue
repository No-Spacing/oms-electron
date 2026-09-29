<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, Paginator, ConfirmDialog, InputText, InputGroup, Skeleton } from 'primevue';
    import { ref, onMounted, watch } from 'vue';
    import UserCreateUpdateDialog from './UserCreateUpdateDialog.vue';
    import UserService from '../UserService.js';
    import { usePagination } from '../../../composable/usePagination.js';
    import SkeletonLoading from '../../../layout/SkeletonLoading.vue';

    const userService = new UserService();

    const { 
        data: users, 
        first, 
        rows, 
        loading, 
        search,
        onSearch,
        onPageChange, 
        init 
    } = usePagination((params) => userService.getUsers(params));

    const confirm = useConfirm();
    const toast = useToast();

    const dialog = ref(false);
    const editUser = ref([]);

    const addButton = (() => {
        dialog.value = true;
        editUser.value = null;
    });

    const editButton = ((data) => {
        dialog.value = true;
        editUser.value = data;
    });

    const confirmDelete = (data) => {
        confirm.require({
            message: 'Do you want to delete this record?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                userService.deleteUser(data);
                init();
                toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            },
            reject: () => {
                toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    };

    let debounceTimer = null;

    watch(search, (newVal) => {
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(() => {
            // Automatically trigger search after user stops typing for 400ms
            onSearch({
                search: newVal || '',
                rows: rows.value,
                first: 0
            });
        }, 600); // 400ms delay
    });

    onMounted(() => {
        init();
    });
</script>
<template>
    <div>
        
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        Users
                    </template>
                    <template #center>
                        <InputText class="w-100" placeholder="Search..." name="search" v-model="search" />
                    </template>
                    <template #end>
                        <Button icon="pi pi-plus" label="Add" @click="addButton()"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <div v-if="loading" class="flex justify-center">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
                </div>
                <DataTable v-else :value="users.data">
                    <Column field="name" header="Name"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="role.name" header="Role"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <Button severity="info" icon="pi pi-pencil" label="Edit" @click="editButton(data.data)"/>
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(data.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="users?.meta?.total" :rowsPerPageOptions="[10, 30, 50]" @page="onPageChange"></Paginator>
            </template>
        </Card>
        <UserCreateUpdateDialog v-if="dialog" v-model:dialog="dialog" :userData="editUser" @saved="init"></UserCreateUpdateDialog>
   </div>
   <ConfirmDialog></ConfirmDialog>
</template>