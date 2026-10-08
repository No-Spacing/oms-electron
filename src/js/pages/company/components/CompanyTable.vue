<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, ConfirmDialog, Paginator, InputText } from 'primevue';
    import CompanyCreateUpdateDialog from './CompanyCreateUpdateDialog.vue';
    import { ref, onMounted, watch } from 'vue';
    import CompanyService from '../CompanyService.js';
    import { useFilteredPagination } from '../../../composable/useFilteredPagination.js';
    import SkeletonLoading from '../../../layout/SkeletonLoading.vue';

    const { 
        data: companies, 
        first, 
        rows, 
        loading, 
        search,
        onSearch,
        onPageChange, 
        init 
    } = useFilteredPagination((params) => companyService.getCompanies(params));
    
    const companyService = new CompanyService();

    const dialog = ref(false);

    const confirm = useConfirm();
    const toast = useToast();

    const editCompany = ref([]);

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
                companyService.deleteCompany(data)
                init()
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
                        Company
                    </template>
                    <template #center>
                        <InputText v-model="search" class="w-100" placeholder="Search..." name="search" />
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
                <div v-else>
                    <DataTable :value="companies.data">
                        <Column field="name" header="Name"></Column>
                        <Column field="address" header="Address"></Column>
                        <Column field="" header="Actions">
                            <template #body="data">
                                <div class="flex gap-2">
                                    <RouterLink :to="{ name: 'view-company', params: { id: data.data.id } }">
                                        <Button severity="success" icon="pi pi-eye" label="View"/>
                                    </RouterLink>
                                    <Button severity="info" icon="pi pi-pencil" label="Edit" @click="editButton(data.data)"/>
                                    <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete(data.data)" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                    <Paginator
                        v-model:first="first"
                        v-model:rows="rows"
                        :totalRecords="companies.meta?.total || 0" 
                        @page="onPageChange" 
                        :rowsPerPageOptions="[10, 30, 50]"
                    />
                </div>
            </template>
        </Card>
        <CompanyCreateUpdateDialog v-if="dialog" v-model:dialog="dialog" :companyData="editCompany" @saved="init"></CompanyCreateUpdateDialog>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>