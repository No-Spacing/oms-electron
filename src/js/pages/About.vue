<script setup>
    import { Card } from 'primevue';

</script>
<template>
    <div class="flex flex-col items-center h-48">
        <div class="border-2 border-solid border-surface-200 dark:border-surface-700 rounded-2xl bg-surface-50 dark:bg-surface-950 flex-auto flex flex-col justify-center items-center p-8 gap-6 shadow-sm w-200">
            <div class="p-4 bg-surface-0 dark:bg-surface-900 rounded-2xl shadow-sm border border-surface-200/60 dark:border-surface-800 flex items-center justify-center">
                <img src="../../assets/ico.png" alt="Company Logo" class="w-24 h-24 object-contain" />
            </div>
            <div class="text-center flex flex-col gap-1.5">
                <h1 class="text-xl font-bold tracking-wide text-surface-900 dark:text-surface-0 uppercase">
                    Progressive Medical Corporation
                </h1>
                <p class="text-base font-medium text-surface-600 dark:text-surface-400">
                    OSUS
                </p>
                <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 rounded-full border border-primary-200 dark:border-primary-800/50 uppercase">
                    Version 2.0
                </span>
            </div>
        </div>
    </div>
</template>