<script setup>
    import { Dialog, Button, InputText, Divider } from 'primevue';
    import { computed, ref, reactive } from 'vue'
    import { Form } from '@primevue/forms';

    const props = defineProps({
        dialog: Boolean,
        customerData: Object
    })
    
    const emit = defineEmits(['update:dialog'])

    const initialValues = reactive({
        id: props.customerData?.id ? props.companyData?.id : null,
        name: props?.customerData?.name,
        address: props?.customerData?.address,
        mobile_no: props?.customerData?.mobile_no,
        email: props?.customerData?.email,
    });


    const isVisible = computed({
        get() {
            return props.dialog
        },
        set(newValue) {
            emit('update:dialog', newValue)
        }
    })
</script>
<template>
    <div>
        <Dialog v-model:visible="isVisible" modal header="Customer" :style="{ width: '35rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Customers's Information</span>
            
            <Form v-slot="$form" class="flex flex-col gap-4 w-full" :initialValues="initialValues">
                <div class="flex items-center gap-4 mb-4">
                    <label for="name" class="font-semibold w-24">Name</label>
                    <InputText id="name" name="name" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <label for="name" class="font-semibold w-24">Address</label>
                    <InputText id="name" name="address" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <label for="number" name="number" class="font-semibold w-24">Mobile No.</label>
                    <InputText id="number" name="mobile_no" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex items-center gap-4 mb-8">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <InputText id="email" name="email" class="flex-auto" autocomplete="off" />
                </div>
                
                <div class="flex justify-end gap-2">
                    <Button type="submit" label="Cancel" severity="secondary"></Button>
                    <Button type="button" label="Save" @click="emit('update:dialog', false)"></Button>
                </div>
            </Form>
        </Dialog>
    </div>
</template>