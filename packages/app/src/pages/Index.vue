<template>
  <h1>Home</h1>
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <p v-if="authenticated">Hello, {{ currentUser.firstName }}</p>
  <p v-else>You are not logged in.</p>

  <IconIcRoundShoppingCart style="font-size: 2em; color: red" />
</template>

<script lang="ts">
import IconIcRoundShoppingCart from 'virtual:vite-icons/majesticons/shopping-cart-line'
import { computed, defineComponent, ref } from 'vue'

import { useAuthStore } from '../store/auth'

export default defineComponent({
  name: 'Home',
  components: { IconIcRoundShoppingCart },
  setup() {
    const authStore = useAuthStore()

    const currentUser = computed(() => authStore.currentUser)
    const authenticated = computed(() => authStore.tokenAlive)

    const counter = ref(0)

    return { counter, currentUser, authenticated }
  }
})
</script>
