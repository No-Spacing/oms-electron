import { createMemoryHistory, createRouter } from 'vue-router'

import Home from './pages/Home.vue'
import About from './pages/About.vue'

import Customer from './pages/customer/Customer.vue'
import CustomerTable from './pages/customer/components/CustomerTable.vue'
import CustomerCreateUpdate from './pages/customer/components/CustomerCreateUpdate.vue'

import Company from './pages/company/Company.vue'
import CompanyTable from './pages/company/components/CompanyTable.vue'
import CompanyView from './pages/company/components/CompanyView.vue'

import Records from './pages/records/Records.vue'
import RecordsTable from './pages/records/components/RecordsTable.vue'
import RecordCreate from './pages/records/components/RecordCreate.vue'
import RecordView from './pages/records/components/RecordView.vue'


const routes = [
  { path: '/', component: Home, meta: { breadcrumb: 'Home' } },
  { path: '/about', component: About, meta: { breadcrumb: 'About' } },
  { 
    path: '/company', 
    component: Company, 
    meta: { breadcrumb: 'Company' },
    children: [
      { 
        path: '',
        name: 'company-table',
        component: CompanyTable, 
      },
      { 
        path: 'view-company', 
        name: 'view-company', 
        component: CompanyView, 
        meta: { breadcrumb: 'Customer' } 
      }
    ]
  },
  { 
    path: '/customers', 
    meta: { breadcrumb: 'Customer' } ,
    component: Customer,
    children: [
      {
        path: '',
        name: 'customer-table',
        component: CustomerTable
      },
      {
        path: 'customer-create-update',
        name: 'customer-create-update',
        component: CustomerCreateUpdate,
        meta: { breadcrumb: 'Customer Info' }
      },
    ]
  },
  { 
    path: '/records', 
    component: Records, 
    meta: { breadcrumb: 'Records' },
    children: [
      {
        path: '',
        name: 'records-table',
        component: RecordsTable
      },
      {
        path: 'record-create',
        name: 'record-create',
        component: RecordCreate,
        meta: { breadcrumb: 'Record Info'}
      },
      {
        path: 'record-view',
        name: 'record-view',
        component: RecordView,
        meta: { breadcrumb: 'Record Info'}
      },
    ]
  },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router;