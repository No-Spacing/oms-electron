<script setup>
    import { Card, Button, InputText, InputNumber, InputGroup, InputGroupAddon, Message, useToast, Divider, AutoComplete } from 'primevue';
    import { Form } from '@primevue/forms';
    import { ref, onMounted, reactive, watch } from 'vue';
    import { useRouter } from 'vue-router';

    import CustomerService from '../../customer/CustomerService';
    import RecordService from '../RecordService';

    const toast = useToast();
    const router = useRouter();

    const recordService = new RecordService();

    const customers = ref([]);
    const items = ref([]);
    const error = ref([]);

    const form = reactive({
        address: null,
        mobile_no: null,
        email: null
    })

    const selectedCustomer = ref(null);
    const initialValues = reactive({
        customer: null,
        order_no: null,
        order_amount: 0,
    });

    const search = async (event) => {
        try {
            // Fetch the data from the API using the search query
            const response = await recordService.getCustomers({ search: event.query });
            
            // Safely extract the array from the response
            const data = Array.isArray(response.data) ? response.data : (response?.data || []);
            
            // Update both state arrays so they stay in sync
            customers.value = data;
            items.value = data;
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            customers.value = [];
            items.value = []; // Fallback to empty array on error
        }
    };

    const fetchCustomer  = async () => {  
        try {
            const response = await recordService.getCustomers();  
            customers.value = Array.isArray(response.data) ? response.data : (response?.data || []);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            customers.value = []; // Fallback to empty array on error
        }

    };

    const onCustomerSelect = (event) => {
        form.address = event.address;
        form.mobile_no = event.mobile_no;
        form.email = event.email;
    };

    const resolver = ({ values }) => {
        const errors = {};

        if (!values.customer) {
            errors.customer = [{ message: 'Customer field is required.' }];
        }
        if (!values.order_no) {
            errors.order_no = [{ message: 'PO/Order No. field is required.' }];
        }
        if (!values.order_amount) {
            errors.order_amount = [{ message: 'Order amount field is required.' }];
        }

        return {
            errors
        };
    };

    const onFormSubmit = ({ valid, values }) => {
        if(valid) {
            recordService.saveRecord(values).then((response) => {
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Record has been saved!', life: 3000 });
                router.push('/records');
            }).catch((errors) => {
                error.value = errors.response?.data
            })
        }
    }

    onMounted(() => {
        fetchCustomer();
    });
</script>
<template>
    <div>
        <Card>
            <template #title>
                Record Information
            </template>
            <template #subtitle>
                Input your record information.
            </template>
            <template #content>
                <div class="card max-w mx-auto p-6 bg-surface-0 dark:bg-surface-900 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 my-5 w-280">
                    <Form v-slot="$form" class="flex flex-col gap-4 w-full" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit">
                        <!-- Customer Section -->
                        <div class="flex flex-col gap-4">
                            <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                Customer Details
                                <Divider class="my-2" />
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div  class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Customer Name</label>
                                    <AutoComplete v-model="selectedCustomer"  name="customer" optionLabel="name" dropdown :suggestions="items" @update:modelValue="onCustomerSelect" @complete="search" :invalid="error?.errors?.customer_id" />
                                    <Message v-if="$form.customer?.invalid || error?.errors?.customer_id" severity="error" size="small" variant="simple">{{ $form.customer.error?.message || error?.errors?.customer_id[0] }}</Message>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Address</label>
                                    <InputText v-model="form.address" type="text" placeholder="Address auto-fill" disabled fluid />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Mobile No.</label>
                                    <InputText v-model="form.mobile_no" type="text" placeholder="Mobile No. auto-fill" disabled fluid />
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Email Address</label>
                                    <InputText v-model="form.email" type="text" placeholder="Email auto-fill" disabled fluid />
                                </div>
                            </div>
                        </div>

                        <!-- Order Section -->
                        <div class="flex flex-col gap-4 mt-2">
                            <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                Order Details
                                <Divider class="my-2" />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">PO/Order No.</label>
                                    <InputText name="order_no" type="text" placeholder="Customer PO No. / Order No." fluid :invalid="error?.errors?.order_no"/>
                                    <Message v-if="$form.order_no?.invalid || error?.errors?.order_no" severity="error" size="small" variant="simple">{{ $form.order_no.error?.message || error?.errors?.order_no[0] }}</Message>
                                </div>

                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Order Amount</label>
                                    <InputGroup>
                                        <InputGroupAddon>₱</InputGroupAddon>
                                        <InputNumber name="order_amount" placeholder="0.00" :minFractionDigits="2" :maxFractionDigits="5" fluid :invalid="error?.errors?.order_amount"/>
                                    </InputGroup>
                                    <Message v-if="$form.order_amount?.invalid || error?.errors?.order_amount" severity="error" size="small" variant="simple">{{ $form.order_amount.error?.message || error?.errors?.order_amount[0] }}</Message>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 justify-center mt-4">
                            <Button type="submit" label="Save" class="w-75"/>
                        </div>
                    </Form>
                </div>
            </template>
        </Card>
    </div>
</template>