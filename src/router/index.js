import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/userPage',
      name: 'userPage',
      component: () => import('@/views/userPage/index.vue'),
    },
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
      redirect: '/statistics',
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

// 配置路由拦截器
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
