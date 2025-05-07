import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/register/index.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index.vue'),
      children: [
        {
          path: '/allAccounting',
          name: 'allAccounting',
          component: () => import('@/views/allAccounting/index.vue'),
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: () => import('@/views/statistics/index.vue'),
        },
      ],
    },
  ],
})

export default router
