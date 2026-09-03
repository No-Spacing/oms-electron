<script setup>
    import { Button, Card, Checkbox, Divider, InputGroup, InputGroupAddon, InputNumber, InputText, StepList ,Stepper, Step, StepPanels, StepPanel, Timeline } from 'primevue';
    import { ref } from 'vue';

    const number = ref(1500.25);

    const events = ref([
        { status: 'Ordered', date: '15/10/2020', icon: 'pi pi-shopping-cart', color: '#9C27B0',},
        { status: 'Processing', date: '15/10/2020', icon: 'pi pi-cog', color: '#673AB7' },
        { status: 'Shipped', date: '15/10/2020', icon: 'pi pi-shopping-cart', color: '#FF9800' },
        { status: 'Delivered', date: '16/10/2020', icon: 'pi pi-check', color: '#607D8B' }
    ]);

</script>
<template>
    <div>
        <Card>
            <template #title>
                TMS-1000
            </template>
            <template #content>
                <div class="flex flex-col pt-2">
                    <div>
                        <div class="flex gap-12">
                            <div>
                                <span class="font-bold">Name: </span>
                                <span class="">Web Developer</span>
                            </div>
                            <div>
                                <span class="font-bold">Company: </span>
                                <span>Progressive Medical Corporation</span>
                            </div>
                            <div>
                                <span class="font-bold">Order Amount: </span>
                                <span>1,500.55</span>
                            </div>
                        </div>
                    </div>
                    <Divider></Divider>
                    <div>
                        <div class="pb-5">
                            <span class="font-bold">Order Status</span>
                        </div>

                        <div class="card">
                            <Timeline :value="events" layout="horizontal">
                                 <template #marker="slotProps">
                                    <span class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm" :style="{ backgroundColor: slotProps.item.color }">
                                        <i :class="slotProps.item.icon"></i>
                                    </span>
                                </template>
                                <template #content="slotProps">
                                    <div class="flex flex-col">
                                        <span>
                                            {{ slotProps.item.status }}
                                        </span>
                                        <span>
                                            {{ slotProps.item.date }}
                                        </span>
                                        <div>
                                            <Checkbox label="Send" />
                                        </div>
                                    </div>
                                </template>
                            </Timeline>
                            
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>