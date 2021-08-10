<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <IconIcRoundShoppingCart style="font-size: 2em; color: red" />

  <p v-if="user">Hello, {{ user.firstName }}!</p>
  <p v-else>You are not logged in.</p>
</template>

<script lang="ts">
import IconIcRoundShoppingCart from 'virtual:vite-icons/majesticons/shopping-cart-line'
import { defineComponent, onMounted, ref, watchEffect } from 'vue'

import Hello from '../components/Hello.vue'
import { useUserStore } from '../store/user'

export default defineComponent({
  name: 'Home',
  components: { Hello, IconIcRoundShoppingCart },
  setup() {
    const userStore = useUserStore()

    const user = ref(null)

    setTimeout(() => {
      user.value = userStore.getCurrentUser
    }, 0)

    const counter = ref(0)

    return { counter, user }
  }
})
</script>
