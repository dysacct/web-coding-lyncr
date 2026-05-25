import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/',
      component: () => import('@/views/Lyncr.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/lyncr/DashboardView.vue'),
          meta: { title: '仪表盘' },
        },
        {
          path: 'members',
          name: 'members',
          component: () => import('@/views/lyncr/MembersView.vue'),
          meta: { title: '成员管理' },
        },
        {
          path: 'models',
          name: 'models',
          component: () => import('@/views/lyncr/ModelsView.vue'),
          meta: { title: '模型列表' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/lyncr/SettingsView.vue'),
          meta: { title: '设置' },
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const { isLoggedIn } = useAuth()

  if (to.name === 'login' && isLoggedIn.value) {
    return { name: 'dashboard' }
  }
  if (to.name !== 'login' && !isLoggedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
