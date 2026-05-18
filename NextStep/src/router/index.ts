import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SignUp from '@/components/Sign-up.vue'
import connexion from '@/components/connexion.vue'
import introduce from '@/components/introduce.vue'
import dashbord from '@/components/dashbord.vue'
import board from '@/components/board.vue'
import notes from '@/components/notes.vue'
import { next } from 'vue'

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
      path: '/dashboard',
      component:dashbord,
      meta: {requiresAuth: true},
      children: [
        {
          path: '',
          name: 'dashbord',
          component: board
        },
        {
          path: '/board',
          name: 'board',
          component: board
        },
        {
          path: '/notes',
          name: 'notes',
          component: notes
        },
      ]
    }, 
  ],
})

router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/connexion' 
  } 
})

export default router
