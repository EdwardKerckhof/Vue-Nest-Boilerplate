<template>
  <h1>auth</h1>
  <pre>{{ data }}</pre>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import AuthService from '../services/auth/auth.service'

export default defineComponent({
  name: 'Auth',
  setup() {
    const authService = new AuthService()

    const data = ref(null)

    onMounted(async () => {
      data.value = await authService.getAllUsers()
    })

    return { data }
  }
})
</script>
