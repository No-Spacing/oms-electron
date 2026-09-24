<script setup>
    import { InputText, InputGroup, DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, ConfirmDialog } from 'primevue'
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import CompanyService from '../CompanyService.js';
 
    import CustomerCreateUpdateDialog from './CustomerCreateUpdateDialog.vue';

    const companyService = new CompanyService();
    const route = useRoute();
    const confirm = useConfirm();
    const toast = useToast();

    const dialog = ref(false);
    const customerData = ref([]);

    const company = ref([]);

    const confirmDelete = () => {
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

    const fetchCompany = async () => {
        const response = await companyService.getCompany(route.params.id);
        company.value = response.data;
    }

    const addDialog = () => {
        customerData.value = null;
        dialog.value = true;
    }

    const editDialog = (data) => {
        customerData.value = data.data
        dialog.value = true;
    }

    onMounted (() => {
        fetchCompany();
    })
</script>
<template>
    <div>
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        List of Customer
                    </template>
                    <template #end>
                        <Button label="Add" icon="pi pi-plus" @click="addDialog"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="company.customers">
                    <Column field="name" header="Name"></Column>
                    <Column field="address" header="Address"></Column>
                    <Column field="mobile_no" header="Mobile No."></Column>
                    <Column field="email" header="Email Address"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <Button severity="info" icon="pi pi-pencil" label="Edit" @click="editDialog(data)" />
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete()" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <CustomerCreateUpdateDialog v-if="dialog" :customerData="customerData" v-model:dialog="dialog" @save="fetchCompany"></CustomerCreateUpdateDialog>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>