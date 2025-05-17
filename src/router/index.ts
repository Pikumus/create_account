import { createRouter, createWebHistory } from 'vue-router'
import CreateAccountView from '@/views/CreateAccountView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CreateAccountView,
    },
  ],
})

export default router
