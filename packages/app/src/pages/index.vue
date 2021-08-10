<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <pre>{{ currentUser }}</pre>

  <IconIcRoundShoppingCart style="font-size: 2em; color: red" />
</template>

<script lang="ts">
import IconIcRoundShoppingCart from 'virtual:vite-icons/majesticons/shopping-cart-line'
import { computed, defineComponent, ref } from 'vue'

import Hello from '../components/Hello.vue'
import { useAuthStore } from '../store/auth'

export default defineComponent({
  name: 'Home',
  components: { Hello, IconIcRoundShoppingCart },
  setup() {
    const authStore = useAuthStore()

    const currentUser = computed(() => authStore.currentUser)

    const counter = ref(0)

    return { counter, currentUser }
  }
})
</script>
