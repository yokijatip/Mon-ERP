import { createRouter, createWebHistory } from 'vue-router'
import HomeDashboard from '@/views/home/HomeDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router