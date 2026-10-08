<script setup>
    import { Dialog, Button, InputText, InputGroup, InputGroupAddon, Message, useToast, ToggleSwitch } from 'primevue';
    import { computed, ref, reactive } from 'vue'
    import CompanyService from '../CompanyService';
    import { Form } from '@primevue/forms';

    const companyService = new CompanyService();
    const toast = useToast();

    const props = defineProps({
        dialog: Boolean,
        customerData: Object,
        companyData: Object
    })

    
    const emit = defineEmits(['update:dialog', 'saved'])
    const error = ref([]);
    
    const initialValues = reactive({
        id: props.customerData?.id ? props.customerData?.id : null,
        company_id: props?.companyData?.id,
        name: props?.customerData?.name,
        address: props?.customerData?.address,
        mobile_no: props?.customerData?.mobile_no,
        email: props?.customerData?.email,
        status: props?.customerData?.status
    });

    const isVisible = computed({
        get() {
            return props.dialog
        },
        set(newValue) {
            emit('update:dialog', newValue)
        }
    })

    const resolver = ({ values }) => {
        const errors = {};

        if (!values.name) {
            errors.name = [{ message: 'Name field is required.' }];
        }

        if (!values.address) {
            errors.address = [{ message: 'Address field is required.'}]
        }

        if (!values.mobile_no || String(values.mobile_no).length !== 10) {
            errors.mobile_no = [{ message: 'Mobile No. must be exactly 10 digits.' }];
        }

        if (!values.email) {
            errors.email = [{ message: 'Email field is required.'}]
        }

        return {
            errors
        };
    };

    const onFormSubmit = ({ valid, values }) => {
        console.log(values)
        // if(valid) {
        //     companyService.saveCustomer(values).then((response) => {
        //         toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Company has been added!', life: 3000 });
        //         emit('saved');
        //         emit('update:dialog', false);
        //     }).catch((errors) => {
        //         error.value = errors.response.data
        //     })
        // }
    }
</script>
<template>
    <div>
        <Dialog v-model:visible="isVisible" modal header="Customer" :style="{ width: '35rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Customers's Information</span>
            
            <Form v-slot="$form" class="flex flex-col gap-2 w-full" :initialValues="initialValues" :resolver="resolver" @submit="onFormSubmit">
                <InputText type="text" name="id" hidden />
                <InputText type="text" name="company_id" hidden />
                <div class="flex flex-col gap-2">
                    <label for="name" class="font-semibold w-24">Name</label>
                    <InputText id="name" name="name" class="flex-auto" autocomplete="off" />
                    <Message v-if="$form.name?.invalid || error.errors?.name" severity="error" size="small" variant="simple">{{ $form.name.error?.message || error.errors?.name[0] }}</Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="address" class="font-semibold w-24">Address</label>
                    <InputText id="address" name="address" class="flex-auto" autocomplete="off" />
                    <Message v-if="$form.address?.invalid || error.errors?.address" severity="error" size="small" variant="simple">{{ $form.address.error?.message || error.errors?.address[0] }}</Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="mobile_no" class="font-semibold w-24">Mobile No.</label>
                    <InputGroup>
                        <InputGroupAddon>
                            <span>+63</span>
                        </InputGroupAddon>
                        <InputText id="mobile_no" name="mobile_no" placeholder="9XXXXXXXXX"/>
                    </InputGroup>
                    <Message v-if="$form.mobile_no?.invalid || error.errors?.mobile_no" severity="error" size="small" variant="simple">{{ $form.mobile_no.error?.message || error.errors?.mobile_no[0] }}</Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <InputText id="email" name="email" class="flex-auto" autocomplete="off" />
                    <Message v-if="$form.email?.invalid || error.errors?.email" severity="error" size="small" variant="simple">{{ $form.email.error?.message || error.errors?.email[0] }}</Message>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="status" class="font-semibold w-24">Status</label>
                    <ToggleSwitch id="status" name="status" :true-value="1" :false-value="0"/>
                </div>
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="emit('update:dialog', false)"></Button>
                    <Button type="submit" label="Save"></Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>