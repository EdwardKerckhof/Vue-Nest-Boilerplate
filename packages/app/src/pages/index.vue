<template>
  <h1>Home</h1>
  <Hello />
  Counter: {{ counter }}
  <button @click="counter++">Increment</button>

  <icon-ic-round-shopping-cart style="font-size: 2em; color: red" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const counter = ref(0)
</script>
