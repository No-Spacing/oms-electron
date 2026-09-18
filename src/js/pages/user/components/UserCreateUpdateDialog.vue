<script setup>
    import { Dialog, Button, InputText, Password, Divider } from 'primevue';
    import { computed, ref, reactive } from 'vue'
    import { Form } from '@primevue/forms';

    const props = defineProps({
        dialog: Boolean,
        userData: Object
    })
    
    const initialValues = reactive({
        name: props?.userData?.name,
        email: props?.userData?.email,
    });
    
    const emit = defineEmits(['update:dialog']);

    const isVisible = computed({
        get() {
            return props.dialog
        },
        set(newValue) {
            emit('update:dialog', newValue)
        }
    });
</script>
<template>
    <div>
        <Dialog v-model:visible="isVisible" modal header="Customer" :style="{ width: '35rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Customers's Information</span>
            
           <Form v-slot="$form" :initialValues>
                <div class="flex items-center gap-4 mb-4">
                    <label for="name" class="font-semibold w-24">Name</label>
                    <InputText id="name" name="name" class="flex-auto" autocomplete="off" />
                </div>
                <div class="flex items-center gap-4 mb-4">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <InputText id="email" name="email" class="flex-auto" autocomplete="off" />
                </div>

                <div class="flex items-center gap-4 mb-8">
                    <label for="password" class="font-semibold w-24">Password</label>
                    <Password id="password" name="password" class="flex-auto" />
                </div>
                
                <div class="flex justify-end gap-2">
                    <Button type="button" label="Cancel" severity="secondary" @click="emit('update:dialog', false)"></Button>
                    <Button type="button" label="Save" @click="emit('update:dialog', false)"></Button>
                </div>
           </Form>
        </Dialog>
    </div>
</template>