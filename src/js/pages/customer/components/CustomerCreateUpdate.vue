<script setup>
    import { Card, Button, InputText, Message, Select } from 'primevue';
    import { Form, FormField } from '@primevue/forms';
</script>
<template>
    <div class="flex justify-center">
        <Card class="w-280">
            <template #title>
                Customer's Information
            </template>
            <template #content>
                 <div class="card flex justify-center mt-8">
                    <Form class="flex flex-col gap-4 w-full">
                        <FormField name="name" initialValue=""  class="flex flex-col gap-1">
                            <InputText type="text" placeholder="Name" />
                        </FormField>
                        <FormField name="company" initialValue="" class="flex flex-col gap-1">
                            <Select :options="['Progressive Medical Corporation']" placeholder="Select a company" />
                        </FormField>
                        <FormField name="address" initialValue="" class="flex flex-col gap-1">
                            <InputText type="text" placeholder="Address" />
                        </FormField>
                        <FormField name="mobile_no" initialValue="" class="flex flex-col gap-1">
                            <InputText type="text" placeholder="Mobile No." />
                        </FormField>
                        <FormField name="email" initialValue="" class="flex flex-col gap-1">
                            <InputText type="text" placeholder="Email" />
                        </FormField>
                    </Form>
                </div>
            </template>
            <template #footer>
                <div class="flex gap-2 justify-center mt-8">
                    <Button label="Save" class="w-75"/>
                </div>
            </template>
        </Card>
    </div>
</template>