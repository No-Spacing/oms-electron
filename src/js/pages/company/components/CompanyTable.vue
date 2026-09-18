<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, Paginator, ConfirmDialog } from 'primevue'
    import CreateUpdateCompanyDialog from './CreateUpdateCompanyDialog.vue';
    import { ref, onMounted } from 'vue'
    import CompanyService from '../CompanyService.js';
    
    const companyService = new CompanyService();

    const dialog = ref(false);

    const confirm = useConfirm();
    const toast = useToast();
    const companies = ref([]);

    const editCompany = ref([]);

    const fetchCompanies = async () => {
        companies.value = await companyService.getCompanies();
    };

    const addButton = () => {
        dialog.value = true;
        editCompany.value = null;
    }

    const editButton = (data) => {
        dialog.value = true
        editCompany.value = data;
    }

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
        fetchCompanies();
    });
</script>
<template>
   <div>
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        Company
                    </template>
                    <template #end>
                        <Button icon="pi pi-plus" label="Add" @click="addButton()"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="companies.data">
                    <Column field="name" header="Name"></Column>
                    <Column field="address" header="Address"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <RouterLink :to="{ name: 'view-company' }">
                                    <Button severity="success" icon="pi pi-eye" label="View"/>
                                </RouterLink>
                                <Button severity="info" icon="pi pi-pencil" label="Edit" @click="editButton(data.data)"/>
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(data.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
            </template>
        </Card>
        <CreateUpdateCompanyDialog v-if="dialog" v-model:dialog="dialog" :companyData="editCompany" @saved="fetchCompanies"></CreateUpdateCompanyDialog>
   </div>
   <ConfirmDialog></ConfirmDialog>
</template>