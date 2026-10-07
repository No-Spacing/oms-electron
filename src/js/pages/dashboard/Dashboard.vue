<script setup>
  import { ref, onMounted, computed } from 'vue';
  import Card from 'primevue/card';
  import Chart from 'primevue/chart';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import Tag from 'primevue/tag';
  import DashboardService from './DashboardService';

  const dashboardService = new DashboardService();
  const loading = ref(false);
  const recordTable = ref([]);
  const lineChartRaw = ref({ labels: [], data: [] });

  // --- Dashboard Metrics Data ---
  const metrics = ref([
    { title: 'On Process', count: 0, icon: 'pi pi-clock', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { title: 'Delivery', count: 0, icon: 'pi pi-truck', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30' },
    { title: 'Completed', count: 0, icon: 'pi pi-verified', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30' },
    { title: 'Canceled', count: 0, icon: 'pi pi-check-square', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  ]);

  // --- Computed Chart Configurations ---
  const lineChartData = computed(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    return {
      labels: lineChartRaw.value.labels,
      datasets: [{
        label: 'Orders Processed',
        data: lineChartRaw.value.data,
        fill: true,
        tension: 0.4,
        borderColor: documentStyle.getPropertyValue('--p-primary-500').trim() || '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }]
    };
  });

  const pieChartData = computed(() => ({
    labels: metrics.value.map(m => m.title === 'Canceled' ? 'Cancel' : m.title),
    datasets: [{
      data: metrics.value.map(m => m.count),
      backgroundColor: ['#3b82f6', '#f97316', '#21E619', '#FF0000'],
      hoverBackgroundColor: ['#2563eb', '#ea580c', '#3ABD35', '#BF1515']
    }]
  }));

  // --- Chart Options ---
  const textColor = '#9ca3af';
  const surfaceBorder = getComputedStyle(document.documentElement).getPropertyValue('--p-content-border') || '#e2e8f0';

  const baseChartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1.8,
    plugins: { legend: { labels: { color: textColor } } }
  };

  const lineChartOptions = ref({
    ...baseChartOptions,
    scales: {
      x: { ticks: { color: textColor }, grid: { color: surfaceBorder } },
      y: { ticks: { color: textColor }, grid: { color: surfaceBorder } }
    }
  });

  const pieChartOptions = ref({
    ...baseChartOptions,
    plugins: { ...baseChartOptions.plugins, legend: { position: 'bottom', labels: { color: textColor } } }
  });

  // --- Data Fetching ---
  const fetchRecordsData = async () => {
    loading.value = true;
    try {
      const [recordResponse, statsResponse] = await Promise.all([
        dashboardService.getData(),
        dashboardService.getOrderStats()
      ]);

      recordTable.value = recordResponse.records;

      // Dynamically assign metrics using property key matching (e.g., 'On Process' -> countOnProcess)
      metrics.value.forEach(m => {
        const responseKey = `count${m.title.replace(/\s+/g, '')}`;
        m.count = recordResponse[responseKey] ?? 0;
      });

      lineChartRaw.value = statsResponse;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      loading.value = false;
    }
  };

  // --- Utilities ---
  const formatPeso = (value) => {
    if (value == null) return '₱0.00';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  onMounted(fetchRecordsData);
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
          :value="recordTable"
          tableStyle="min-width: 50rem"
        >
          <Column field="order_no" header="PO/Order No."  style="width: 20%"></Column>
          <Column field="customer.name" header="Customer"  style="width: 25%"></Column>
          <Column field="created_at" header="Date"  style="width: 20%"></Column>
          <Column field="order_amount" header="Total" style="width: 15%">
            <template #body="slotProps">
              {{ formatPeso(slotProps.data.order_amount) }}
            </template>
          </Column>
          <Column field="status" header="Status">
              <template #body="{data}">
                  <Tag v-if="data.status == 'on_process'" value="ON PROCESS" severity="info"></Tag>
                  <Tag v-else-if="data.status == 'delivery'" value="DELIVERY" severity="warn"></Tag>
                  <Tag v-else-if="data.status == 'completed'" value="COMPLETED" severity="success"></Tag>
                  <Tag v-else-if="data.status == 'canceled'" value="CANCELED" severity="danger"></Tag>
                  <Tag v-else value="N/A" severity="secondary"></Tag>
              </template>
          </Column> 
        </DataTable>
      </template>
    </Card>
  </div>
</template>