<script setup>
    import { Dialog, Button, InputText, Password, Message, Select, useToast } from 'primevue';
    import { computed, ref, reactive, onMounted } from 'vue'
    import { Form } from '@primevue/forms';
    import UserService from '../UserService.js'

    const userService = new UserService();
    const toast = useToast();

    const roles = ref([]);
    const errors = ref([]);

    const props = defineProps({
        dialog: Boolean,
        userData: Object
    })

    const emit = defineEmits(['update:dialog', 'saved']);
    
    const initialValues = reactive({
        id: props.userData?.id ? props.userData?.id : null,
        name: props?.userData?.name,
        email: props?.userData?.email,
        role_id: props?.userData?.role?.id,
        password: null 
    });

    const isVisible = computed({
        get() {
            return props.dialog
        },
        set(newValue) {
            emit('update:dialog', newValue)
        }
    });

    const fetchRole = async () => {
        roles.value = await userService.getRoles();
    }

    const resolver = ({ values }) => {
        const errors = {};

        if (!values.name) {
            errors.name = [{ message: 'Name field is required.' }];
        }
        if (!values.email) {
            errors.email = [{ message: 'Email field is required.' }];
        }
        if (!values.role_id) {
            errors.role_id = [{ message: 'Role field is required.' }];
        }
        if (!values.password) {
            errors.password = [{ message: 'Password field is required.' }];
        }

        return {
            errors
        };
    };

    const onFormSubmit = ({ valid, values }) => {
        if(valid) {
            userService.saveUser(values).then((response) => {
                toast.add({ severity: 'success', summary: 'Confirmed', detail: 'User has been saved!', life: 3000 });
                emit('saved');
                emit('update:dialog', false);
            }).catch((error) => {
                errors.value = error.response?.data
            })
        }
    }

    onMounted(() => {
        fetchRole();
    })
</script>
<template>
    <div>
        <Dialog v-model:visible="isVisible" modal header="Customer" :style="{ width: '35rem' }">
            <span class="text-surface-500 dark:text-surface-400 block mb-8">Customers's Information</span>
            
           <Form v-slot="$form" :initialValues :resolver @submit="onFormSubmit">
                <InputText id="id" name="id" class="flex-auto" autocomplete="off" hidden/>
                <div class="flex flex-col gap-2 mb-4">
                    <label for="name" class="font-semibold w-24">Name</label>
                    <div class="flex flex-col gap-1">
                        <InputText id="name" name="name" class="flex-auto" autocomplete="off" />
                        <Message v-if="$form.name?.invalid" severity="error" size="small" variant="simple">{{ $form.name.error?.message }}</Message>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mb-4">
                    <label for="email" class="font-semibold w-24">Email</label>
                    <div class="flex flex-col gap-1">
                        <InputText id="email" name="email" class="flex-auto" autocomplete="off" />
                        <Message v-if="$form.email?.invalid || errors.errors?.email" severity="error" size="small" variant="simple">{{ $form.email.error?.message || errors.errors?.email[0] }}</Message>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mb-4">
                    <label for="role" class="font-semibold w-24">Role</label>
                    <div class="flex flex-col gap-1">
                        <Select :options="roles.data" optionLabel="name" optionValue="id" id="role" name="role_id" class="flex-auto" autocomplete="off" />
                        <Message v-if="$form.role_id?.invalid" severity="error" size="small" variant="simple">{{ $form.role_id.error?.message }}</Message>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mb-8">
                    <label for="password" class="font-semibold w-24">Password</label>
                    <div class="flex flex-col gap-1">
                        <Password id="password" name="password" class="flex-auto" autocomplete="off" inputClass="w-full"/>
                        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple" >{{ $form.password.error?.message }}</Message>
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