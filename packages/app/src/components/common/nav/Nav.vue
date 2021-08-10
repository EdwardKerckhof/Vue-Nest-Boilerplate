<template>
  <nav class="border">
    <ul class="flex">
      <li>
        <Link :to="{ name: 'home' }">Home</Link>
      </li>
      &nbsp;|&nbsp;
      <li>
        <Link :to="{ name: 'login' }">Login</Link>
      </li>
      &nbsp;|&nbsp;
      <li>
        <Link :to="{ name: 'register' }">Register</Link>
      </li>
      &nbsp;|&nbsp;
      <li>
        <Link :to="{ name: 'auth' }">Auth</Link>
      </li>
      &nbsp;|&nbsp;
      <li class="authenticated">
        <button @click="logout">Logout</button>
      </li>

      {{
        isAuthenticated
      }}
    </ul>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import AuthService from '../../../services/auth/auth.service'
import { useAuthStore } from '../../../store/auth'
import Link from './Link.vue'

export default defineComponent({
  name: 'Nav',
  components: { Link },
  setup() {
    const authService = new AuthService()
    const authStore = useAuthStore()

    const isAuthenticated = computed(() => authStore.tokenAlive)

    const logout = async () => {
      await authService.logout()
    }

    return { logout, isAuthenticated }
  }
})
</script>
