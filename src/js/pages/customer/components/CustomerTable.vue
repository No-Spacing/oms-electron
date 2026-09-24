<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, ConfirmDialog } from 'primevue'
    import { ref, onMounted } from 'vue'
    import CustomerService from '../CustomerService';
    import { usePagination } from '../../../composable/usePagination.js';

    const customerService = new CustomerService();

    const { 
        data: customers, 
        first, 
        rows, 
        loading, 
        onPageChange, 
        init 
    } = usePagination((params) => customerService.getCustomers(params));
     
    const confirm = useConfirm();
    const toast = useToast();

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
                toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
            },
            reject: () => {
                toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    };

    onMounted(() => {
        init();
    })
</script>
<template>
    <div>
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        Customer
                    </template>
                    <template #end>
                        <RouterLink :to="{ name: 'customer-create-update' }">
                            <Button icon="pi pi-plus" label="Add" />
                        </RouterLink>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="customers.data">
                    <Column field="name" header="Name"></Column>
                    <Column field="company.name" header="Company"></Column>
                    <Column field="mobile_no" header="Mobile No."></Column>
                    <Column field="email" header="Email Address"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <RouterLink :to="{ name:'customer-create-update', params: { id: data.data.id } }">
                                    <Button severity="info" icon="pi pi-pencil" label="Edit" />
                                </RouterLink>
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>