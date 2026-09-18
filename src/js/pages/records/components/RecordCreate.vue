<script setup>
    import { Card, Button, InputText, InputNumber, InputGroup, InputGroupAddon, Message, Select, Divider } from 'primevue';
    import { Form, FormField } from '@primevue/forms';
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
                    <Form class="flex flex-col gap-6 w-full">
                        <!-- Customer Section -->
                        <div class="flex flex-col gap-4">
                            <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                Customer Details
                                <Divider class="my-2" />
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="company" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Company</label>
                                    <Select :options="['Progressive Medical Corporation']" placeholder="Select a company..." fluid />
                                </FormField>
                                
                                <FormField name="name" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Customer Name</label>
                                    <Select :options="['Web Developer']" placeholder="Select a customer..." fluid />
                                </FormField>
                            </div>

                            <FormField name="address" initialValue="" class="flex flex-col gap-1.5">
                                <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Address</label>
                                <InputText type="text" placeholder="Address auto-fill" disabled fluid />
                            </FormField>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="mobile_no" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Mobile No.</label>
                                    <InputText type="text" placeholder="Mobile No. auto-fill" disabled fluid />
                                </FormField>

                                <FormField name="email" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Email Address</label>
                                    <InputText type="text" placeholder="Email auto-fill" disabled fluid />
                                </FormField>
                            </div>
                        </div>

                        <!-- Order Section -->
                        <div class="flex flex-col gap-4 mt-2">
                            <div class="text-lg font-semibold text-surface-900 dark:text-surface-0">
                                Order Details
                                <Divider class="my-2" />
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField name="po_no" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">PO/Order No.</label>
                                    <InputText type="text" placeholder="Customer PO No. / Order No." fluid />
                                </FormField>

                                <FormField name="price" initialValue="" class="flex flex-col gap-1.5">
                                    <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Order Amount</label>
                                    <InputGroup>
                                        <InputGroupAddon>₱</InputGroupAddon>
                                        <InputNumber placeholder="0.00" :minFractionDigits="2" :maxFractionDigits="5" fluid />
                                    </InputGroup>
                                </FormField>
                            </div>
                        </div>
                        <div class="flex gap-2 justify-center mt-4">
                            <Button label="Save" class="w-75"/>
                        </div>
                    </Form>
                </div>
            </template>
        </Card>
    </div>
</template>