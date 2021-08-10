<template>
  <nav class="border">
    <ul class="flex">
      <li>
        <Link :to="{ name: 'home' }">Home</Link>
      </li>
      <div v-if="!isAuthenticated" class="flex">
        &nbsp;|&nbsp;
        <li>
          <Link :to="{ name: 'login' }">Login</Link>
        </li>
        &nbsp;|&nbsp;
        <li>
          <Link :to="{ name: 'register' }">Register</Link>
        </li>
      </div>
      <div v-else class="flex">
        &nbsp;|&nbsp;
        <li>
          <Link :to="{ name: 'auth' }">Auth</Link>
        </li>
        &nbsp;|&nbsp;
        <li class="authenticated">
          <button @click="logout">Logout</button>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import AuthService from '../../../services/auth/auth.service'
import { useAuthStore } from '../../../store/auth'
import Link from './Link.vue'

export default defineComponent({
  name: 'Nav',
  components: { Link },
  setup() {
    const authService = new AuthService()
    const authStore = useAuthStore()
    const router = useRouter()

    const isAuthenticated = computed(() => authStore.tokenAlive)

    const logout = async () => {
      await authService.logout()
      router.push('/')
    }

    return { logout, isAuthenticated }
  }
})
</script>
