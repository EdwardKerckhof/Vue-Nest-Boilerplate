<template>
  <router-link :to="to" :exact="exact"><slot /></router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Link',
  props: {
    to: {
      type: Object,
      required: true
    },
    exact: {
      type: Boolean,
      default: false
    }
  }
})
</script>
