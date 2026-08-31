<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from 'primevue/breadcrumb'

const route = useRoute()

// Root home icon configuration
const home = ref({
  icon: 'pi pi-home',
  route: '/'
})

// Dynamically generate breadcrumbs based on matched route hierarchy
const items = computed(() => {
  return route.matched
    .filter((routeRecord) => routeRecord.meta && routeRecord.meta.breadcrumb)
    .map((routeRecord) => ({
      label: typeof routeRecord.meta.breadcrumb === 'function' 
        ? routeRecord.meta.breadcrumb(route) 
        : routeRecord.meta.breadcrumb,
      route: routeRecord.path
    }))
})
</script>

<template>
  <div class="card" v-if="items.length > 0">
    <Breadcrumb :home="home" :model="items">
      <!-- Optional: Custom item template to use Vue Router's router-link -->
      <template #item="{ item, props }">
        <router-link v-if="item.route" :to="item.route" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" v-bind="props.action">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span class="text-surface-500 dark:text-surface-400">{{ item.label }}</span>
        </a>
      </template>
    </Breadcrumb>
  </div>
</template>
