<script setup>
    import { Button, Card, Divider, useConfirm, useToast, ConfirmDialog, InputText, Select, Message, Panel, BlockUI } from 'primevue';
    import { ref, computed, onMounted, reactive } from 'vue';
    import { useRoute } from 'vue-router';
    import RecordService from '../RecordService';
    import { useRecordConfirm } from '../composable/useRecordConfirm';

    const { triggerConfirm } = useRecordConfirm();

    const recordService = new RecordService();

    const route = useRoute();

    const confirm = useConfirm();
    const toast = useToast();

    const loading = ref(false);
    const record = ref([]);

    const form = reactive({
        id: route.params.id,
        invoice_no: null,
        courier: null,
        reference_no: null,
        rider_name: null
    })

    const invoiceNoValid = ref(false);
    const deliveryValid = ref(false);

    const confirm1 = (params) => {
        const values = ref(null);
        const inputValid = ref(false);
        switch(params) {
            case 'invoice':
                if (form.invoice_no == null) {
                    invoiceNoValid.value = true;
                    inputValid.value = false
                } else {
                    values.value = {
                        invoice_no: form.invoice_no
                    }
                    invoiceNoValid.value = false;
                    inputValid.value = true
                }
            break;
            case 'delivery': 
                if(form.courier == null) {
                    deliveryValid.value = true;
                    inputValid.value = false
                } else {
                    deliveryValid.value = false;
                    inputValid.value = true;
                    values.value = {
                        courier: form.courier,
                        reference_no: form.reference_no,
                        rider_name: form.rider_name,
                    };
                }
            break;
            default:
                inputValid.value = true;
        }

        if(inputValid.value) {
            triggerConfirm(
                {
                    id: route.params.id,
                    status: params,
                    values: values.value
                },
                () => {
                    fetchRecord();
                },
                () => {
                    fetchRecord();
                }
            )
        }
    };
    
    const fetchRecord = async() => {
        loading.value = true;
        const response = await recordService.getRecord(route.params.id).finally(() => {
            loading.value = false;
        });
        record.value = response.data
        form.invoice_no = response.data.invoice_no ? response.data.invoice_no : null;
        form.courier = response.data.courier ? response.data.courier : null;
        form.reference_no = response.data.reference_no ? response.data.reference_no : null;
        form.rider_name = response.data.rider_name ? response.data.rider_name : null;
    }

    const formattedAmount = computed(() => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0 // Change to 2 if you want decimal places (e.g., ₱15,000.00)
        }).format(record.value.order_amount)
    })

    onMounted(() => {
        fetchRecord();
    })

</script>
<template>
    <ConfirmDialog></ConfirmDialog>
    <div>
        <BlockUI pt:mask:class="!bg-black/20" :blocked="record.status == 'completed' || record.status == 'canceled'">
            <Card>
                <template #title>
                    {{ record.order_no }}
                </template>
                <template #content>
                    <div v-if="loading" class="flex justify-center">
                        <i class="pi pi-spin pi-spinner" style="font-size: 2.5rem"></i>
                    </div>
                    <div v-else class="flex flex-col pt-2">
                        <div class="flex items-center justify-between">
                            <div class="flex gap-12">
                                <div>
                                    <span class="font-bold">Name: </span>
                                    <span class="">{{ record.customer?.name }}</span>
                                </div>
                                <div>
                                    <span class="font-bold">Company: </span>
                                    <span>{{ record.customer?.company?.name }}</span>
                                </div>
                                <div>
                                    <span class="font-bold">Order Amount: </span>
                                    <span>{{ formattedAmount }}</span>
                                </div>
                                <div>
                                    <span class="font-bold">Created at: </span>
                                    <span>{{ record.created_at }}</span>
                                </div>
                            </div>
                        </div>
                        <Divider></Divider>
                        <div class="flex flex-col items-center">
                            <!-- ORDER ACKNOWLEDGEMENT CHECKBOX -->
                            <Panel  class="w-280">
                                <template #header>
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
                                        <span class="font-bold text-md gap-5">
                                            Order Processing
                                        </span>
                                    </div>
                                </template>
                                <template #icons>
                                    <div v-if="record.status == 'completed' || record.status == 'canceled'">
                                       {{ record.status.toUpperCase() }} - {{ record.completed_at || record.canceled_at }}
                                    </div>
                                    <div v-else class="flex items-center gap-3">
                                        <Button label="Complete" severity="success" @click="confirm1('completed')"/>
                                        <Button label="Cancel" severity="danger" @click="confirm1('canceled')" />
                                    </div>
                                </template>
                                <div>
                                    <div class="flex flex-col p-2 gap-2">
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-2 ml-3">
                                                <label for="acknowledge" class="">Acknowledge</label>
                                            </div>
                                            <div class="flex gap-2">
                                                <Button v-if="!record.acknowledge_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('acknowledge')"></Button>
                                                <span v-else>{{ record.acknowledge_send_status.toUpperCase() }} - {{ record.acknowledge_at }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            <!-- Pick and Pack -->
                            <Panel :collapsed="!record.acknowledge_at" class="w-280">
                                <template #header>
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-box" style="font-size: 1.5rem"></i>
                                        <span class="font-bold text-md gap-5">
                                            Pick & Pack
                                        </span>
                                    </div>
                                </template>
                                <div class="flex flex-col gap-2 p-2">
                                    <div class="flex flex-col gap-2">
                                        <div class=" flex justify-between items-center ">
                                            <div class="flex items-center gap-2">
                                                <label for="partial" class="ml-3">Partial</label>
                                            </div>
                                            <div class="flex gap-2">
                                                <Button v-if="!record.pack_partial_at && !record.pack_completed_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('pack_partial')"></Button>
                                                <span v-else>{{ record?.pack_partial_send_status?.toUpperCase() }} - {{ record?.pack_partial_at }}</span>
                                            </div>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-2">
                                                <label for="complete" class="text-md ml-3">Complete</label>
                                            </div>
                                            <div class="flex gap-2">
                                                <Button v-if="!record.pack_completed_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('pack_complete')"></Button>
                                                <span v-else>{{ record.pack_completed_send_status.toUpperCase() }} - {{ record.pack_completed_at }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                            <!-- Invoice Settings -->
                            <Panel :collapsed="!record.pack_completed_at" class="w-280">
                                <template #header>
                                    <div class="flex items-center gap-2">
                                        <i class="pi pi-receipt" style="font-size: 1.5rem"></i>
                                        <span class="font-bold text-md gap-5">
                                            Invoice
                                        </span>
                                    </div>
                                </template>
                                <div class="flex items-center justify-between p-2">
                                    <div class="flex flex-col gap-2 ml-2">
                                        <InputText v-model="form.invoice_no" placeholder="Invoice No." class="w-75" name="invoice_no" type="text" :invalid="invoiceNoValid"/>
                                        <Message v-show="invoiceNoValid" severity="error" variant="simple" size="small">Invoice No. field is required</Message>
                                    </div>
                                    <Button v-if="!record.invoice_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('invoice')"></Button>
                                    <span v-else>{{ record.invoice_send_status.toUpperCase() }} - {{ record.invoice_at }}</span>
                                </div>
                            </Panel>
                            <!-- Delivery Options -->
                            <Panel :collapsed="!record.invoice_at" class="w-280">
                                <template #header>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <i class="pi pi-truck pr-2" style="font-size: 1.5rem"></i>
                                            <span class="font-bold text-md gap-5">
                                                Delivery Options
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <div >
                                    <div class="flex flex-col p-2 gap-2 ml-2">
                                        <div class="flex items-start justify-between">
                                            <div class="flex flex-col gap-2">
                                                <label for="delivery_option" class="">Courier Details</label>
                                                <Select v-model="form.courier" class="w-75" :options="['Delivery Truck', 'LBC', 'Freight Forward', 'Borzo', 'Grab', 'Lalamove', 'Lex PH']" placeholder="Select a courier" :invalid="deliveryValid"/>
                                                <Message v-show="deliveryValid" severity="error" variant="simple" size="small">Please select a courier</Message>
                                            </div>
                                            <div class="flex">
                                                <Button v-if="!record.delivery_at && !record.customer_pickup_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('delivery')"></Button>
                                                <span v-else>{{ record?.delivery_send_status?.toUpperCase() }} - {{ record?.delivery_at }}</span>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <div class="flex gap-2 items-center">
                                                <InputText v-model="form.reference_no" class="w-75" placeholder="Enter Reference/Tracking No."/>
                                                <i v-tooltip.bottom="{ 
                                                    value: 'Leave as blank if none.', 
                                                    pt: { 
                                                    text: { style: { 'max-width': '250px', 'width': 'max-content' } } 
                                                    } 
                                                }" 
                                                class="pi pi-info-circle">
                                                </i>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <InputText v-model="form.rider_name" class="w-75" placeholder="Delivery Rider Name" />
                                                <i v-tooltip.bottom="{ 
                                                    value: 'Leave as blank if none.', 
                                                    pt: { 
                                                    text: { style: { 'max-width': '250px', 'width': 'max-content' } } 
                                                    } 
                                                }" 
                                                class="pi pi-info-circle">
                                                </i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col p-2 gap-2 ml-2">
                                        <div class="flex items-center justify-between">
                                            <div class="flex gap-2 items-center">
                                                <span>Customer Pick-up</span>
                                            </div>   
                                            <Button v-if="!record.delivery_at && !record.customer_pickup_at" label="Send" icon="pi pi-send" severity="info" @click="confirm1('customer_pickup')"></Button>
                                            <span v-else>{{ record?.customer_pickup_send_status?.toUpperCase() }} - {{ record?.customer_pickup_at }}</span>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </div>                 
                    </div>
                </template>
            </Card>
        </BlockUI> 
    </div>
</template>