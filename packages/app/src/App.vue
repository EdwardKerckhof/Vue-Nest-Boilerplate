<template>
  <Nav />
  <router-view></router-view>
</template>

<script lang="ts">
import { ErrorResponseDto, UserDto } from '@vnbp/common/dist/models'
import { defineComponent, onMounted, ref } from 'vue'

import Nav from './components/common/nav/Nav.vue'
import AuthService from './services/auth/auth.service'
import { useUserStore } from './store/user'

export default defineComponent({
  name: 'App',
  components: { Nav },
  setup() {
    const userStore = useUserStore()
    const authService = new AuthService()

    onMounted(async () => {
      const data = await authService.getCurrentUser()

      if (!(data as ErrorResponseDto).statusCode)
        userStore.setCurrentUser(data as UserDto)
    })
  }
})
</script>
