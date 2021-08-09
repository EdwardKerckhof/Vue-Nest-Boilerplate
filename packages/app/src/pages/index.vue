<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <icon-ic-round-shopping-cart style="font-size: 2em; color: red" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Hello from '../components/Hello.vue'
// import AuthService from '../services/auth/auth.service'

export default defineComponent({
  name: 'Home',
  components: { Hello },
  setup() {
    // const authService = new AuthService()

    const counter = ref(0)

    // const data = ref<UserResponseDto | ErrorResponseDto>(undefined)

    // onBeforeMount(async () => {
    //   const res = await authService.login()
    //   data.value = res
    // })

    return { counter }
  }
})
</script>
