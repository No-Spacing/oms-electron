<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import { FilterMatchMode } from '@primevue/core/api';

// --- Dashboard Metrics Data ---
const metrics = ref([
  { title: 'Acknowledge', count: 12, icon: 'pi pi-check-square', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { title: 'On Process', count: 8, icon: 'pi pi-clock', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  { title: 'Deliveries', count: 24, icon: 'pi pi-truck', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30' },
  { title: 'Completed', count: 142, icon: 'pi pi-verified', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
]);

// --- Chart Configurations ---
const lineChartData = ref(null);
const lineChartOptions = ref(null);
const pieChartData = ref(null);
const pieChartOptions = ref(null);

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    line: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Orders Processed',
          data: [65, 59, 80, 81, 56, 55, 142],
          fill: true,
          tension: 0.4,
          borderColor: documentStyle.getPropertyValue('--p-primary-500') || '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
        }
      ]
    },
    pie: {
      labels: ['Acknowledge', 'On Process', 'Deliveries', 'Completed'],
      datasets: [
        {
          data: [12, 8, 24, 142],
          backgroundColor: [
            '#3b82f6', // blue
            '#f97316', // orange
            '#06b6d4', // cyan
            '#22c55e', // green
          ],
          hoverBackgroundColor: [
            '#2563eb',
            '#ea580c',
            '#0891b2',
            '#16a34a',
          ]
        }
      ]
    }
  };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = '#9ca3af';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border') || '#e2e8f0';

    return {
        line: {
        maintainAspectRatio: false,
        aspectRatio: 1.8,
        plugins: {
            legend: { labels: { color: textColor } }
        },
        scales: {
            x: {
                ticks: { color: textColor },
                grid: { color: surfaceBorder }
            },
            y: {
                ticks: { color: textColor },
                grid: { color: surfaceBorder }
            }
        }
        },
        pie: {
        maintainAspectRatio: false,
        aspectRatio: 1.8,
        plugins: {
            legend: { position: 'bottom', labels: { color: textColor } }
        }
        }
    };
};

onMounted(() => {
    const chartsData = setChartData();
    const chartsOptions = setChartOptions();
    lineChartData.value = chartsData.line;
    lineChartOptions.value = chartsOptions.line;
    pieChartData.value = chartsData.pie;
    pieChartOptions.value = chartsOptions.pie;
});

// --- Table Data & Filters ---
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const orders = ref([
    { id: 'ORD-9821', customer: 'Alice Johnson', status: 'Completed', total: '$420.00', date: '2026-06-12' },
    { id: 'ORD-9822', customer: 'Bob Smith', status: 'Deliveries', total: '$150.50', date: '2026-06-11' },
    { id: 'ORD-9823', customer: 'Charlie Davis', status: 'On Process', total: '$89.00', date: '2026-06-11' },
    { id: 'ORD-9824', customer: 'Diana Prince', status: 'Acknowledge', total: '$1,230.00', date: '2026-06-10' },
    { id: 'ORD-9825', customer: 'Ethan Hunt', status: 'Canceled', total: '$45.00', date: '2026-06-09' },
    { id: 'ORD-9826', customer: 'Fiona Gallagher', status: 'Completed', total: '$310.20', date: '2026-06-08' },
]);

const getSeverity = (status) => {
    switch (status) {
        case 'Completed': return 'success';
        case 'Deliveries': return 'info';
        case 'On Process': return 'warn';
        case 'Acknowledge': return 'secondary';
        case 'Canceled': return 'danger';
        default: return null;
    }
};
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card v-for="(metric, index) in metrics" :key="index" class="shadow-sm">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-surface-500 text-sm font-medium">{{ metric.title }}</span>
            <div :class="['p-2 rounded-lg', metric.bg]">
              <i :class="[metric.icon, metric.color]" style="font-size: 1.25rem;"></i>
            </div>
          </div>
        </template>
        <template #content>
          <div class="text-2xl font-bold text-surface-900 dark:text-surface-0">
            {{ metric.count }}
          </div>
        </template>
      </Card>
    </div>

    <!-- 2. Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Line Chart -->
      <Card class="lg:col-span-2 shadow-sm">
        <template #title>Order Growth Trend</template>
        <template #content>
          <div class="h-80">
            <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-full w-full" />
          </div>
        </template>
      </Card>

      <!-- Pie Chart -->
      <Card class="shadow-sm">
        <template #title>Status Breakdown</template>
        <template #content>
          <div class="h-80 flex items-center justify-center">
            <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="h-full w-full" />
          </div>
        </template>
      </Card>
    </div>

    <!-- 3. Data Table Section -->
    <Card class="shadow-sm">
      <template #title>Recent Orders</template>
      <template #content>
        <DataTable 
          :value="orders" 
          v-model:filters="filters" 
          paginator 
          :rows="5" 
          dataKey="id"
          :globalFilterFields="['id', 'customer', 'status']"
          tableStyle="min-width: 50rem"
        >
          
          <Column field="id" header="PO/Order No." sortable style="width: 20%"></Column>
          <Column field="customer" header="Customer" sortable style="width: 25%"></Column>
          <Column field="date" header="Date" sortable style="width: 20%"></Column>
          <Column field="total" header="Total" sortable style="width: 15%"></Column>
          <Column field="status" header="Status" sortable style="width: 20%">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>