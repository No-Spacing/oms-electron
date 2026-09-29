<script setup>
    import { Card, Button, InputText, Message, Select, useToast } from 'primevue';
    import { Form, FormField } from '@primevue/forms';
    import { onMounted, reactive, ref, watch } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import SkeletonLoading from '../../../layout/SkeletonLoading.vue';

    import CustomerService from '../CustomerService';

    const customerService = new CustomerService();
    const route = useRoute();
    const router = useRouter();

    const toast = useToast();

    const isLoading = ref(true);
    const companies = ref([]);
    const errors = ref([]);
    
    const initialValues = reactive({
        id: null,
        company_id: null,
        name: null,
        address: null,
        mobile_no: null,
        email: null,
    });

    const resolver = ({ values }) => {
        const errors = {};

        if (!values.name) {
            errors.name = [{ message: 'Name field is required.' }];
        }
        if (!values.address) {
            errors.address = [{ message: 'Address field is required.' }];
        }
        if (!values.mobile_no) {
            errors.mobile_no = [{ message: 'Mobile No. field is required.' }];
        }
        if (!values.email) {
            errors.email = [{ message: 'Email field is required.' }];
        }

        return {
            errors
        };
    };

    const fetchCompanies = async () => {
        companies.value = await customerService.getCompanies();
    }

    const fetchCustomer = async () => {
        try {
            const response = await customerService.getCustomer(route.params.id);

            Object.assign(initialValues, {
                id: response.data.id,
                name: response.data.name,
                company_id: response.data?.company?.id,
                address: response.data.address,
                mobile_no: response.data.mobile_no,
                email: response.data.email
            });
        } catch (error) {
            console.error('Failed to fetch customer:', error);
        } finally {
            isLoading.value = false;
        }
    };

    onMounted(() => {
        fetchCompanies();
        if(route.params.id) {
            fetchCustomer();
        } else {
            isLoading.value = false
        }
    })

    const onFormSubmit = ({ valid, values }) => {
        if(valid) {
            customerService.saveCustomer(values).then((response) => {
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'User has been saved!', life: 3000 });
                router.push('/customers');
            }).catch((error) => {
                errors.value = error.response?.data
            })
        }
    }
</script>
<template>
    <div class="flex justify-center">
        <Card class="w-280">
            <template #title>
                Customer's Information
            </template>
            <template #content>
                <SkeletonLoading v-if="isLoading"></SkeletonLoading>
                 <div v-else class="card flex justify-center mt-8">
                    
                    <Form v-slot="$form" class="flex flex-col gap-4 w-full" :initialValues="initialValues" :resolver="resolver"  @submit="onFormSubmit">
                        <InputText type="text" name="id" hidden/>
                        <FormField name="name" class="flex flex-col gap-1">
                            <label for="name">Name</label>
                            <InputText type="text" id="name" name="name" placeholder="Name" />
                            <Message v-if="$form.name?.invalid || errors.errors?.name" severity="error" size="small" variant="simple">{{ $form.name.error?.message || errors.errors?.name[0] }}</Message>
                        </FormField>
                        
                        <FormField class="flex flex-col gap-1">
                            <label for="name">Company</label>
                            <Select name="company_id" :options="companies.data" optionLabel="name" optionValue="id" placeholder="Select a company" />
                        </FormField>
                        <FormField class="flex flex-col gap-1">
                            <label for="name">Address</label>
                            <InputText name="address" type="text" placeholder="Address" />
                            <Message v-if="$form.address?.invalid || errors.errors?.address" severity="error" size="small" variant="simple">{{ $form.address.error?.message || errors.errors?.address[0] }}</Message>
                        </FormField>
                        <FormField class="flex flex-col gap-1">
                            <label for="name">Mobile No.</label>
                            <InputText name="mobile_no" type="text" placeholder="Mobile No." />
                            <Message v-if="$form.mobile_no?.invalid || errors.errors?.mobile_no" severity="error" size="small" variant="simple">{{ $form.mobile_no.error?.message || errors.errors?.mobile_no[0] }}</Message>
                        </FormField>
                        <FormField class="flex flex-col gap-1">
                            <label for="name">Email</label>
                            <InputText type="text" name="email" placeholder="Email" />
                            <Message v-if="$form.email?.invalid || errors.errors?.email" severity="error" size="small" variant="simple">{{ $form.email.error?.message || errors.errors?.email[0] }}</Message>
                        </FormField>

                        <div class="flex gap-2 justify-center my-5">
                            <Button label="Save" type="submit" class="w-75"/>
                        </div>
                    </Form>
                </div>
            </template>
        </Card>
    </div>
</template>