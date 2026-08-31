
<script setup>
import { ref } from "vue";
import { 
    Tag,
    InputText, 
    InputGroup,
    Toolbar,
    Menubar, 
    Card, 
    DataTable, 
    Column, 
    Button, 
    useConfirm, 
    useToast 
} from "primevue";

const confirm = useConfirm();
const toast = useToast();

const items = ref([
    {
        label: 'On Process',
        icon: 'pi pi-home'
    },
    {
        label: 'Collector',
        icon: 'pi pi-home'
    },
    {
        label: 'Cancelled',
        icon: 'pi pi-home'
    },
    {
        label: 'Completed',
        icon: 'pi pi-home'
    },
    
]);

const records = ref([
    {
        'po': 'TMS-1000',
        'name': 'Testing',
        'status': 'On Process',
        'update_at': '2026/8/28',
        'created_at': '2026/8/27'
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
                        Records
                    </template>
                    <template #end>
                        <RouterLink :to="{ name: 'record-create' }">
                            <Button icon="pi pi-plus" label="Add"/>
                        </RouterLink>
                    </template>
                </Toolbar>
            </template>
            <template #content>
                <div class="flex flex-col gap-2">
                    <Menubar>
                        <template #start>
                            <div class="flex gap-2">
                                <Button label="On Process" severity="info"/>
                                <Button label="Colletion" severity="warn"/>
                                <Button label="Cancelled" severity="danger"/>
                                <Button label="Completed" severity="success"/>
                            </div>
                        </template>
                        <template #end>
                            <InputGroup>
                                <InputText placeholder="Keyword" />
                                <Button label="Search" severity="help"/>
                            </InputGroup>
                        </template>
                    </Menubar>
                
                    <DataTable :value="records">
                        <Column field="po" header="PO#"></Column>
                        <Column field="name" header="Name"></Column>
                        <Column field="status" header="Status">
                            <template #body="{data}">
                                <Tag :value="data.status.toUpperCase()" severity="info"></Tag>
                            </template>
                        </Column>
                        <Column field="update_at" header="Update At"></Column>
                        <Column field="created_at" header="Created At"></Column>
                        <Column field="" header="Actions">
                                <template #body="data">
                                    <div class="flex gap-2">
                                        <RouterLink :to="{ name:'record-view' }">
                                            <Button severity="success" icon="pi pi-eye" label="View"/>
                                        </RouterLink>
                                        <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete()" />
                                    </div>
                                </template>
                            </Column>
                    </DataTable>
                </div>
            </template>
        </Card>
    </div>
</template>