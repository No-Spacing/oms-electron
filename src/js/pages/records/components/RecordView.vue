<script setup>
    import { Button, Card, Checkbox, Divider, useConfirm, useToast, ConfirmPopup, InputText, Select } from 'primevue';
    import { ref, computed } from 'vue';

    const now = ref(new Date())

    const confirm = useConfirm();
    const toast = useToast();

    // Format options to remove the time completely
    const formattedDate = computed(() => {
        return now.value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    })

    const confirm1 = (event) => {
        confirm.require({
            target: event.currentTarget,
            message: 'Are you sure you want to send?',
            icon: 'pi pi-exclamation-triangle',
            rejectProps: {
                label: 'No',
                severity: 'danger',
                outlined: true
            },
            acceptProps: {
                label: 'Send'
            },
            accept: () => {
                toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            },
            reject: () => {
                toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    };
</script>
<template>
    <ConfirmPopup></ConfirmPopup>
    <div>
        <Card>
            <template #title>
                TMS-1000
            </template>
            <template #content>
                <div class="flex flex-col pt-2">
                    <div class="flex items-center justify-between">
                        <div class="flex gap-12">
                            <div>
                                <span class="font-bold">Name: </span>
                                <span class="">Web Developer</span>
                            </div>
                            <div>
                                <span class="font-bold">Company: </span>
                                <span>Progressive Medical Corporation</span>
                            </div>
                            <div>
                                <span class="font-bold">Order Amount: </span>
                                <span>1,500.55</span>
                            </div>
                            <div>
                                <span class="font-bold">Created at: </span>
                                <span>{{ formattedDate }}</span>
                            </div>
                        </div>
                    </div>
                    <Divider></Divider>
                    <Card>
                        <template #title>
                            <div class="flex items-center gap-4">
                                Order Checklist
                                <div class="flex items-center gap-2">
                                    <Button label="Complete" severity="success" size="small"/>
                                    <Button label="Cancel" severity="danger" size="small"/>
                                </div>
                            </div>
                        </template>
                        <template #content>
                            <!-- ORDER ACKNOWLEDGEMENT CHECKBOX -->
                            <div class="flex gap-4">
                                <div class="w-180">
                                    <div class="border p-2 flex items-center justify-between">
                                        <div class="flex items-center">
                                            <i class="pi pi-shopping-cart pr-2" style="font-size: 1.5rem"></i>
                                            <span class="font-bold text-md gap-5">
                                                Order Processing
                                            </span>
                                        </div>
                                        <span class="font-bold text-sm">{{ formattedDate }}</span>
                                    </div>
                                    <div class="flex flex-col border p-2 gap-2 -mt-px">
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-2">
                                                <!-- <Checkbox id="acknowledge" name="acknowledge" size="small" /> -->
                                                <label for="acknowledge" class="text-sm">Acknowledge</label>
                                            </div>
                                            <div class="flex gap-2">
                                                <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Pick and Pack -->
                                    <div class="flex flex-col gap-2 border p-2 -mt-px">
                                        <span class="text-sm">Pick & Pack</span>
                                        <div class="flex flex-col gap-1">
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <!-- <Checkbox id="partial" name="partial" size="small" /> -->
                                                    <label for="partial" class="text-sm ml-3">Partial</label>
                                                </div>
                                                <div class="flex gap-2">
                                                    <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                                </div>
                                            </div>
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-2">
                                                    <!-- <Checkbox id="complete" name="complete" size="small" /> -->
                                                    <label for="complete" class="text-sm ml-3">Complete</label>
                                                </div>
                                                <div class="flex gap-2">
                                                    <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Invoice Settings -->
                                    <div class="border flex items-center justify-between p-2 -mt-px">
                                        <div class="flex items-center gap-2 justify-between">
                                            <!-- <Checkbox id="acknowledge" name="acknowledge" size="small" /> -->
                                            <span class="text-sm">Invoice</span>
                                            <InputText placeholder="Invoice No." class="w-50" name="invoice_no" type="text" size="small"/>
                                        </div>
                                            
                                        <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                    </div>
                                </div>
                                <!-- Delivery Options -->
                                <div class="w-180">
                                    <div class="border p-2 flex items-center justify-between">
                                        <div class="flex items-center">
                                            <i class="pi pi-truck pr-2" style="font-size: 1.5rem"></i>
                                            <span class="font-bold text-md gap-5">
                                                Delivery Options
                                            </span>
                                        </div>
                                        <span class="font-bold text-sm">{{ formattedDate }}</span>
                                    </div>
                                    <div class="flex flex-col border p-2 gap-2 -mt-px">
                                        <div class="flex items-start justify-between">
                                            <div class="flex flex-col gap-2">
                                                <label for="delivery_option" class="text-sm">Courier</label>
                                                <Select class="w-50" :options="['Delivery Truck', 'LBC', 'Freight Forward', 'Borzo', 'Grab', 'Lalamove', 'Lex PH']" placeholder="Select a courier" size="small"/>
                                            </div>
                                            <div class="flex">
                                                <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                            </div>
                                        </div>
                                        <div class="flex flex-col gap-2">
                                            <div class="flex items-center gap-2">
                                                <InputText class="w-50" placeholder="Delivery Rider Name" size="small"/>
                                                <i v-tooltip.bottom="{ 
                                                    value: 'Leave as blank if none.', 
                                                    pt: { 
                                                    text: { style: { 'max-width': '250px', 'width': 'max-content' } } 
                                                    } 
                                                }" 
                                                class="pi pi-info-circle">
                                                </i>
                                            </div>
                                            <div class="flex gap-2 items-center">
                                                <InputText class="w-50" placeholder="Enter Reference/Tracking No." size="small"/>
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
                                    <div class="flex flex-col border p-2 gap-2 -mt-px">
                                        <div class="flex items-center justify-between">
                                            <label for="delivery_option" class="text-sm">Customer Pick-up</label>       
                                                         
                                            <Button size="small" label="Send" icon="pi pi-send" severity="info" @click="confirm1($event)"></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </Card>
    </div>
</template>