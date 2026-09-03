<script setup>
    import { InputText, InputGroup, DataTable, Column, Button, useConfirm, useToast, Card, Toolbar } from 'primevue'
    import { ref } from 'vue'
    
    import CreateUpdateCustomerDialog from './CreateUpdateCustomerDialog.vue';

    const confirm = useConfirm();
    const toast = useToast();

    const dialog = ref(false);

    const customers = ref([
        {
            'name': 'Testing',
            'company': 'Progressive Medical Corporation',
            'mobile_no': '09202137722',
            'email': 'test@email.com',
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
                        List of Customer
                    </template>
                    <template #end>
                        <Button label="Add" icon="pi pi-plus" @click="dialog = true"/>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <DataTable :value="customers">
                    <Column field="name" header="Name"></Column>
                    <Column field="mobile_no" header="Mobile No."></Column>
                    <Column field="email" header="Email Address"></Column>
                    <Column field="" header="Actions">
                        <template #body="data">
                            <div class="flex gap-2">
                                <Button severity="info" icon="pi pi-pencil" label="Edit" @click="dialog=true" />
                                <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete()" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
        <CreateUpdateCustomerDialog v-model:dialog="dialog"></CreateUpdateCustomerDialog>
    </div>
</template>