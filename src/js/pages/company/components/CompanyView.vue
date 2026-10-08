<script setup>
    import { InputText, DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, ConfirmDialog, Paginator } from 'primevue'
    import { ref, onMounted, watch } from 'vue'
    import { useRoute } from 'vue-router'

    import CompanyService from '../CompanyService.js';
    import CustomerCreateUpdateDialog from './CustomerCreateUpdateDialog.vue';
    import SkeletonLoading from '../../../layout/SkeletonLoading.vue';

    const companyService = new CompanyService();
    const route = useRoute();
    const confirm = useConfirm();
    const toast = useToast();

    const dialog = ref(false);
    const loading = ref(false);
    const firstPage = ref();
    const rows = ref(10);
    const search = ref();

    const customerData = ref([]);
    const company = ref([]);
    const customers = ref([]);

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

    const fetchCompany = async (page = 1, per_page = rows.value, search = '') => {
        loading.value = true;
        try {
            const response = await companyService.getCompany(route.params.id, {
                page: page,
                per_page: per_page,
                search: search
            });
            company.value = response.company;
            customers.value = response.customers;
        } catch (error) {
            console.log(error);
        } finally {
            loading.value = false
        }
    }

    const onSearch = (event) => {
        // Usually, when searching, you want to reset back to the first page (0)
        rows.value = event.rows || rows.value;
        search.value = event.search;

        fetchCompany(1, rows.value, search.value);
    };

    const onPageChange = (event) => {
        firstPage.value = event.first;
        rows.value = event.rows;
        
        // PrimeVue is 0-indexed, Laravel is 1-indexed
        const targetPage = event.page + 1;
        fetchCompany(targetPage, event.rows, search.value);
    };

    const addDialog = (data) => {
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
</script>
<template>
    <div>
        <Card>
            <template #title>
                <Toolbar>
                    <template #start>
                        {{ company.name }}
                    </template>
                    <template #center>
                        <InputText v-model="search" class="w-100" placeholder="Search..." name="search" />
                    </template>
                    <template #end>
                        <Button label="Add" icon="pi pi-plus" @click="addDialog(company.id)"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <div v-if="loading" class="flex justify-center">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
                </div>
                <div v-else>
                    <DataTable :value="customers.data">
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
                    <Paginator  
                        v-model:first="firstPage"
                        v-model:rows="rows"
                        :totalRecords="customers?.meta?.total" 
                        :rowsPerPageOptions="[10, 20, 30]" 
                        @page="onPageChange" 
                    />
                </div>
            </template>
        </Card>
        <CustomerCreateUpdateDialog v-if="dialog" :customerData="customerData" :companyData="company" v-model:dialog="dialog" @saved="fetchCompany"></CustomerCreateUpdateDialog>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>