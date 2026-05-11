import { createRouter, createWebHistory } from 'vue-router'
import SignUp from '@/components/Sign-up.vue'
import connexion from '@/components/connexion.vue'
import introduce from '@/components/introduce.vue'

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
    
  ],
})

export default router
