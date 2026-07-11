import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import introduce from '@/components/introduce.vue'
import SignUp from '@/components/Sign-up.vue'
import connexion from '@/components/connexion.vue'
import dashbord from '@/components/dashbord.vue'
import admin from '@/components/admin.vue'
import privacy from '@/components/privacy.vue'
import board from '@/components/board.vue'
import notes from '@/components/notes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: introduce,
    },
    {
      path: '/sign',
      name: 'Sign-Up',
      component: SignUp,
    },
    {
      path: '/connexion',
      name: 'connexion',
      component: connexion,
    },
    {
      path: '/politique-confidentialite',
      name: 'politique-confidentialite',
      component: privacy,
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      meta: { requiresAuth: true, roles: ['admin'] },
    },
    {
      path: '/dashboard',
      component: dashbord,
      meta: { requiresAuth: true, roles: ['user'] },
      children: [
        {
          path: '',
          name: 'dashbord-default',
          component: board,
        },
        {
          path: '/board',
          name: 'board',
          component: board,
        },
        {
          path: '/notes',
          name: 'notes',
          component: notes,
        },
      ],
    },
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth)
  const roles = to.matched.flatMap((route) => (route.meta.roles as string[] | undefined) || [])
  const userRole = authStore.user?.role

  if (requiresAuth && !authStore.isAuthenticated) {
    return '/connexion'
  }

  if (roles.length > 0 && !roles.includes(userRole)) {
    return '/'
  }

  if (authStore.isAuthenticated && userRole === 'admin' && to.path !== '/admin') {
    return '/admin'
  }
})

export default router
