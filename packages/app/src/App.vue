<template>
  <Nav />
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Nav from './components/common/nav/Nav.vue'
import AuthService from './services/auth/auth.service'

export default defineComponent({
  name: 'App',
  components: { Nav },
  setup() {
    const authService = new AuthService()
  }
})
</script>
