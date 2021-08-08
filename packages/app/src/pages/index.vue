<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <icon-ic-round-shopping-cart style="font-size: 2em; color: red" />
  <Suspense>
    <template #default>
      <div>
        <pre>{{ data }}</pre>
      </div>
    </template>
    <template #fallback>
      <h1>Loading...</h1>
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { useFetchCache } from '../services/useFetch'

const { data } = useFetchCache('test', 'http://localhost:3000/api/users/test', {
  skip: false,
  config: {}
})

const counter = ref(0)
</script>
