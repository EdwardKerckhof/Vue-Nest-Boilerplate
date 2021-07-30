<template>
  <nav class="border">
    <ul class="flex">
      <li>
        <router-link to="/">Home</router-link>
      </li>
      &nbsp;|&nbsp;
      <li>
        <router-link to="/login">Login</router-link>
      </li>
      &nbsp;|&nbsp;
      <li>
        <router-link to="/register">Register</router-link>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>
