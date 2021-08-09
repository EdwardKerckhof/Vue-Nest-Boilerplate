<template>
  <RegisterForm />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RegisterForm from '../components/auth/register/RegisterForm.vue'

export default defineComponent({
  name: 'Register',
  components: { RegisterForm }
})
</script>
