<template>
  <pre>{{ loginData }}</pre>
  <FormLoader v-if="loading" />

  <FormErrors v-if="loginData?.statusCode" :login-data="loginData" />

  <Form @submit="handleSubmit">
    <button type="submit">Login</button>
  </Form>
</template>

<script lang="ts">
import { ErrorResponseDto, UserResponseDto } from '@vnbp/common/dist/models'
import { defineComponent, provide, ref } from 'vue'

import Form from '../../components/common/form/Form.vue'
import FormErrors from '../../components/common/form/FormErrors.vue'
import FormLoader from '../../components/common/form/FormLoader.vue'
import AuthService from '../../services/auth/auth.service'
import { loginFormFields } from './loginFormFields'

export default defineComponent({
  name: 'LoginForm',
  components: { Form, FormErrors, FormLoader },
  setup() {
    const authService = new AuthService()

    const loginData = ref<UserResponseDto | ErrorResponseDto>(undefined)
    const loading = ref(false)

    provide('formFields', loginFormFields)

    const handleSubmit = async () => {
      loading.value = true
      let email = ''
      let password = ''
      loginFormFields.forEach((field) => {
        switch (field.name) {
          case 'email': {
            email = field.values[0]
            break
          }
          case 'password': {
            password = field.values[0]
            break
          }
          default: {
            email = ''
            password = ''
          }
        }
      })

      loginData.value = await authService.login({ email, password })
      loading.value = false
    }

    return { handleSubmit, loginData, loading }
  }
})
</script>
