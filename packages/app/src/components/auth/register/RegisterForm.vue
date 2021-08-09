<template>
  <pre>{{ registerData }}</pre>
  <FormLoader v-if="loading" />

  <FormErrors v-if="registerData?.statusCode" :data="registerData" />

  <Form @submit="handleSubmit">
    <button type="submit">Register</button>
  </Form>
</template>

<script lang="ts">
import { ErrorResponseDto, UserResponseDto } from '@vnbp/common/dist/models'
import { defineComponent, provide, ref } from 'vue'

import AuthService from '../../../services/auth/auth.service'
import Form from '../../common/form/Form.vue'
import FormErrors from '../../common/form/FormErrors.vue'
import FormLoader from '../../common/form/FormLoader.vue'
import { registerFormFields } from '../register/registerFormFields'

export default defineComponent({
  name: 'RegisterForm',
  components: { Form, FormErrors, FormLoader },
  setup() {
    const authService = new AuthService()

    const registerData = ref<UserResponseDto | ErrorResponseDto | undefined>(
      undefined
    )
    const loading = ref(false)

    provide('formFields', registerFormFields)

    const handleSubmit = async () => {
      loading.value = true

      const { email, firstname, lastname, password, repeatPassword } =
        extractFormFields()

      if (password === repeatPassword) {
        registerData.value = await authService.register({
          firstName: firstname,
          lastName: lastname,
          email,
          password
        })
      }

      loading.value = false
    }

    const extractFormFields = () => {
      let email: string = '',
        password: string = '',
        repeatPassword: string = '',
        firstname: string = '',
        lastname: string = ''

      registerFormFields.forEach((field) => {
        switch (field.name) {
          case 'email': {
            email = field.values[0]
            break
          }
          case 'passwordGroup': {
            password = field.values[0]
            repeatPassword = field.values[1]
            break
          }
          case 'nameGroup': {
            firstname = field.values[0]
            lastname = field.values[1]
            break
          }
        }
      })

      return { email, password, repeatPassword, firstname, lastname }
    }

    return { handleSubmit, registerData, loading }
  }
})
</script>
