<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <icon-ic-round-shopping-cart style="font-size: 2em; color: red" />

  <div v-if="data.error">
    <ul>
      <li v-for="(errorMsg, i) in data.message" :key="i" style="color: red">
        {{ errorMsg }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ErrorResponseDto, UserResponseDto } from '@vnbp/common/dist/models'
import { onBeforeMount, ref } from 'vue'

import AuthService from '../services/auth/auth.service'

const authService = new AuthService()

const counter = ref(0)

const data = ref<UserResponseDto | ErrorResponseDto>(undefined)

onBeforeMount(async () => {
  const res = await authService.login()
  data.value = res
})
</script>
