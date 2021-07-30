import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
  }
})

router.beforeResolve((to) => {
  const title = to.meta.title as string
  const titleCapitalized = title.charAt(0).toUpperCase() + title.slice(1)
  document.title = `${titleCapitalized} - App`
})

export default router
