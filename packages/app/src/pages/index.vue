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
import { computed, defineComponent, ref } from 'vue'

import Hello from '../components/Hello.vue'

export default defineComponent({
  name: 'Home',
  components: { Hello, IconIcRoundShoppingCart },
  setup() {
    const user = computed(null)

    const counter = ref(0)

    return { counter, user }
  }
})
</script>
