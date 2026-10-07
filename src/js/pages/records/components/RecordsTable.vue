
<script setup>
import { ref, onMounted, watch } from "vue";
import { 
    Tag,
    InputText, 
    InputGroup,
    InputGroupAddon,
    Toolbar,
    Menubar, 
    Card, 
    DataTable, 
    Column, 
    Button,
    Select,
    useConfirm, 
    useToast,
    ConfirmDialog,
    Paginator,
} from "primevue";
import RecordService from '../RecordService'
import { usePagination } from '../../../composable/usePagination'

const recordService = new RecordService();

const { 
    data: records, 
    first, 
    rows, 
    loading, 
    search,
    onSearch,
    onPageChange, 
    filters, 
    setFilter, 
    resetFilters,
    init 
} = usePagination((params) => recordService.getRecords(params));

const confirm = useConfirm();
const toast = useToast();

const items = ref([
    {
        id: 'on_process',
        label: 'On Process',
        icon: 'pi pi-shopping-cart'
    },
    {
        id: 'delivery',
        label: 'Delivery',
        icon: 'pi pi-truck'
    },
    {
        id: 'canceled',
        label: 'Canceled',
        icon: 'pi pi-times-circle'
    },
    {
        id: 'completed',
        label: 'Completed',
        icon: 'pi pi-check-circle'
    },
]);

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
}

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
}) 
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
                                <div class="w-60">
                                    <InputGroup class="w-full">
                                        <Select v-model="filters" placeholder="Select order status" class="w-full" :options="items" @update:modelValue="setFilter">
                                            <!-- Template for options inside the dropdown list -->
                                            <template #option="slotProps">
                                                <div class="flex items-center gap-2">
                                                    <i :class="slotProps.option.icon" />
                                                    <span>{{ slotProps.option.label }}</span>
                                                </div>
                                            </template>

                                            <!-- Template for the currently selected value -->
                                            <template #value="slotProps">
                                                <div v-if="slotProps.value" class="flex items-center gap-2">
                                                    <i :class="slotProps.value.icon" />
                                                    <span>{{ slotProps.value.label }}</span>
                                                </div>
                                                <span v-else>{{ slotProps.placeholder }}</span>
                                            </template>
                                            <template #dropdownicon>
                                                <i class="pi pi-filter" />
                                            </template>
                                        </Select>
                                        
                                    </InputGroup>
                                </div>
                                <Button label="Reset" severity="info" @click="resetFilters"/>
                            </div>
                        </template>
                        <template #end>
                            <InputGroup>
                                <InputText placeholder="Keyword" v-model="search"/>
                                <InputGroupAddon>
                                    <i class="pi pi-search"></i>
                                </InputGroupAddon>
                            </InputGroup>
                        </template>
                    </Menubar>
                
                    <div v-if="loading" class="flex justify-center">
                        <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
                    </div>
                    <div v-else>
                        <DataTable :value="records.data">
                            <Column field="order_no" header="PO/Order No."></Column>
                            <Column field="customer.name" header="Name"></Column>
                            <Column field="status" header="Status">
                                <template #body="{data}">
                                    <Tag v-if="data.status == 'on_process'" value="ON PROCESS" severity="info"></Tag>
                                    <Tag v-else-if="data.status == 'delivery'" value="DELIVERY" severity="warn"></Tag>
                                    <Tag v-else-if="data.status == 'completed'" value="COMPLETED" severity="success"></Tag>
                                    <Tag v-else-if="data.status == 'canceled'" value="CANCELED" severity="danger"></Tag>
                                    <Tag v-else value="N/A" severity="secondary"></Tag>
                                </template>
                            </Column> 
                            <Column field="updated_at" header="Update At"></Column>
                            <Column field="created_at" header="Created At"></Column>
                            <Column field="" header="Actions">
                                <template #body="data">
                                    <div class="flex gap-2">
                                        <RouterLink :to="{ name:'record-view', params: { id: data.data.id }  }">
                                            <Button severity="success" icon="pi pi-eye" label="View"/>
                                        </RouterLink>
                                        <Button severity="danger" icon="pi pi-trash" label="Delete" @click="confirmDelete()" />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                        <Paginator
                            v-model:first="first"
                            v-model:rows="rows"
                            :totalRecords="records.meta?.total || 0" 
                            @page="onPageChange" 
                            :rowsPerPageOptions="[10, 30, 50]"
                        />
                    </div>
                </div>
            </template>
        </Card>
    </div>
    <ConfirmDialog></ConfirmDialog>
</template>