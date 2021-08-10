import { createRouter, createWebHistory } from 'vue-router'

import { getLocal } from '../services/useLocalStorage'
import { useAuthStore } from '../store/auth'

const Home = () => import('../pages/Index.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const Auth = () => import('../pages/Auth.vue')
const NotFound = () => import('../pages/NotFound.vue')

const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
    meta: {
      title: 'Home'
    }
  },
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      title: 'Login',
      requiresUnAuth: true
    }
  },
  {
    path: '/register',
    component: Register,
    name: 'register',
    meta: {
      title: 'Register',
      requiresUnAuth: true
    }
  },
  {
    path: '/auth',
    component: Auth,
    name: 'auth',
    meta: {
      title: 'Auth',
      requiresAuth: true
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Not Found',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
  }
})

router.beforeResolve((to, _, next) => {
  const authStore = useAuthStore()
  const title = to.meta.title as string
  const titleCapitalized = title.charAt(0).toUpperCase() + title.slice(1)
  document.title = `${titleCapitalized} - App`

  const authData = authStore.authData
  if (!authData.accessToken) {
    const accessToken = getLocal('vnbp_jwt')
    const refreshToken = getLocal('vnbp_refresh_token')

    if (accessToken && refreshToken) {
      authStore.setAuthData({
        accessToken,
        refreshToken
      })
    }
  }

  const isAuthenticated = authStore.tokenAlive
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresUnAuth = to.matched.some((record) => record.meta.requiresUnAuth)

  if (requiresAuth && !isAuthenticated) next({ path: '/login' })
  else if (requiresUnAuth && isAuthenticated) next({ path: '/' })
  else next()
})

export default router
