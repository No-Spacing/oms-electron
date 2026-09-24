<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, Paginator, ConfirmDialog } from 'primevue';
    import { ref, onMounted } from 'vue';
    import UserCreateUpdateDialog from './UserCreateUpdateDialog.vue';
    import UserService from '../UserService.js'

    const userService = new UserService();
    const confirm = useConfirm();
    const toast = useToast();

    const users = ref([]);
    const dialog = ref(false);
    const editUser = ref([]);

    const fetchUsers = async () => {
        users.value = await userService.getUsers();
    }

    onMounted(() => {
        fetchUsers();
    }) 

    const addButton = (() => {
        dialog.value = true;
        editUser.value = null;
    })

    const editButton = ((data) => {
        dialog.value = true;
        editUser.value = data;
    })

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
                fetchUsers();
                toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            },
            reject: () => {
                toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }
    
</script>
<template>
    <div>
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        Users
                    </template>
                    <template #end>
                        <Button icon="pi pi-plus" label="Add" @click="addButton()"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="users.data">
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
                <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
            </template>
        </Card>
        <UserCreateUpdateDialog v-if="dialog" v-model:dialog="dialog" :userData="editUser" @saved="fetchUsers"></UserCreateUpdateDialog>
   </div>
   <ConfirmDialog></ConfirmDialog>
</template>