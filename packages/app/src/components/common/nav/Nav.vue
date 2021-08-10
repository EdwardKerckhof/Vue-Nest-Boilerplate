<template>
  <nav class="border">
    <ul class="flex">
      <li>
        <Link :to="{ name: 'index' }">Home</Link>
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
      <li class="authenticated">
        <button @click="logout">Logout</button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import AuthService from '../../../services/auth/auth.service'
import Link from './Link.vue'

export default defineComponent({
  name: 'Nav',
  components: { Link },
  setup() {
    const authService = new AuthService()

    const user = null
    const router = useRouter()

    const logout = async () => {
      await authService.logout()
    }

    return { user, logout }
  }
})
</script>
