<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, ConfirmDialog, Paginator, InputText } from 'primevue';
    import { onMounted, watch } from 'vue';
    import CustomerService from '../CustomerService';
    import { usePagination } from '../../../composable/usePagination.js';

    const customerService = new CustomerService();

    const { 
        data: customers, 
        first, 
        rows, 
        loading, 
        search,
        onSearch,
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

    let debounceTimer = null;

    watch(search, (newVal) => {
        clearTimeout(debounceTimer);
        
        debounceTimer = setTimeout(() => {
            onSearch({
                search: newVal || '',
                rows: rows.value,
                first: 0
            });
        }, 600);
    });

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
                    <template #center>
                        <InputText class="w-100" placeholder="Search..." name="search" v-model="search" />
                    </template>
                    <template #end>
                        <RouterLink :to="{ name: 'customer-create-update' }">
                            <Button icon="pi pi-plus" label="Add" />
                        </RouterLink>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <div v-if="loading" class="flex justify-center">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
                </div>
                <DataTable v-else :value="customers.data">
                    <Column field="name" header="Name"></Column>
                    <Column field="company.name" header="Company"></Column>
                    <Column field="mobile_no" header="Mobile No.">
                        <template #body="data">
                           <span>+63{{ data.data.mobile_no }}</span>
                        </template>
                    </Column>
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
                <Paginator
                    v-model:first="first"
                    v-model:rows="rows"
                    :totalRecords="customers.meta?.total || 0" 
                    @page="onPageChange" 
                    :rowsPerPageOptions="[10, 30, 50]"
                />
            </template>
        </Card>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>