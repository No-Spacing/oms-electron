<script setup>
    import { Dialog, Button, InputText, Message } from 'primevue';
    import { Form } from '@primevue/forms';
    import { computed, reactive } from 'vue';
    import axios from 'axios';

    console.log('HEllo');

    const props = defineProps({
        dialog: Boolean,
        companyData: Object
    })
    
    const initialValues = reactive({
        name: props?.companyData?.name,
        address: props?.companyData?.address,
    });

    const emit = defineEmits(['update:dialog'])

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
            values, // (Optional) Used to pass current form values to submit event.
            errors
        };
    };

    const onFormSubmit = ({ valid, values }) => {
        if(valid) {
            axios.post('http://127.0.0.1:8000/api/save-company',values)
            .then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.log(error);
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