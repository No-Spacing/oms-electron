<script setup>
    import { Dialog, Button, InputText, Message, useToast } from 'primevue';
    import { Form } from '@primevue/forms';
    import { computed, reactive } from 'vue';
    import CompanyService from '../CompanyService';

    const companyService = new CompanyService();

    const toast = useToast();

    const props = defineProps({
        dialog: Boolean,
        companyData: Object
    })
    
    const initialValues = reactive({
        name: props?.companyData?.name,
        address: props?.companyData?.address,
    });

    const emit = defineEmits(['update:dialog', 'saved'])

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
            errors.name = [{ message: 'Company name is required.' }];
            errors.address = [{ message: 'Address field is required.'}]
        }

        return {
            errors
        };
    };

    const onFormSubmit = ({ valid, values }) => {
        if(valid) {
            companyService.save(values).then(() => {
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'Company has been added!', life: 3000 });
                emit('saved');
                emit('update:dialog', false);
            })
        }
    }

</script>
<template>
    <div>
        <Dialog v-model:visible="isVisible" modal header="Company" :style="{ width: '35rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-6">Company's Information</span>
            <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                <div class="flex flex-col gap-2 mb-4">
                    <label for="name" class="font-semibold w-24">Name</label>
                    <div class="flex flex-col gap-1">
                        <InputText id="name" name="name" class="flex-auto" autocomplete="off" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
                    </div>
                </div>
                <div class="flex flex-col gap-2 mb-8">
                    <label for="address" class="font-semibold w-24">Address</label>
                    <div class="flex flex-col gap-1">
                        <InputText id="address" name="address" class="flex-auto" autocomplete="off" />
                        <Message v-if="$form.address?.invalid" severity="error" size="small" variant="simple">{{ $form.address.error?.message }}</Message>
                    </div>
                </div>
                
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="emit('update:dialog', false)"></Button>
                    <Button type="submit" label="Save"></Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>