<script setup>
    import { DataTable, Column, Button, useConfirm, useToast, Card, Toolbar, Breadcrumb, ConfirmDialog } from 'primevue'
    import CreateUpdateCompanyDialog from './CreateUpdateCompanyDialog.vue';
    import { ref } from 'vue'

    const dialog = ref(false);

    const confirm = useConfirm();
    const toast = useToast();

    const customers = ref([
        {
            'name': 'Progressive Medical Corporation',
            'address': 'C. Reymundo, Pasig City, Metro Manila'
        }
    ])

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
                        <Button icon="pi pi-plus" label="Add" @click="dialog = true"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="customers">
                    <Column field="name" header="Name"></Column>
                    <Column field="address" header="Address"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <RouterLink :to="{ name: 'view-company' }">
                                    <Button severity="success" icon="pi pi-eye" label="View" />
                                </RouterLink>
                                
                                <Button severity="info" icon="pi pi-pencil" label="Edit" @click="dialog = true"/>
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete()" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <CreateUpdateCompanyDialog v-model:dialog="dialog"></CreateUpdateCompanyDialog>
   </div>
   <ConfirmDialog></ConfirmDialog>
</template>