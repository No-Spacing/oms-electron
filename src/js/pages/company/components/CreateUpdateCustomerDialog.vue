<script setup>
    import { Dialog, Button, InputText, Divider } from 'primevue';
    import { computed, ref } from 'vue'

    const props = defineProps({
        dialog: Boolean
    })
    
    const emit = defineEmits(['update:dialog'])

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
            
            <div class="flex items-center gap-4 mb-4">
                <label for="name" class="font-semibold w-24">Name</label>
                <InputText id="name" class="flex-auto" autocomplete="off" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="number" class="font-semibold w-24">Number</label>
                <InputText id="number" class="flex-auto" autocomplete="off" />
            </div>

            <div class="flex items-center gap-4 mb-8">
                <label for="email" class="font-semibold w-24">Email</label>
                <InputText id="email" class="flex-auto" autocomplete="off" />
            </div>
            
            <div class="flex justify-end gap-2">
                <Button type="button" label="Cancel" severity="secondary" @click="emit('update:dialog', false)"></Button>
                <Button type="button" label="Save" @click="emit('update:dialog', false)"></Button>
            </div>
        </Dialog>
    </div>
</template>