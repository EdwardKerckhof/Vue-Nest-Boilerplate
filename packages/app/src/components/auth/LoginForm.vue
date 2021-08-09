<template>
  <h1>LoginForm</h1>
  <Form :fields="formFields" @submit="handleSubmit">
    <button type="submit">Login</button>
    <p>or</p>
    <Link :to="{ name: 'register' }">Register</Link>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { IFormInput } from '../../@types/IFormInput'
import Form from '../../components/common/form/Form.vue'
import Link from '../../components/common/nav/Link.vue'

export default defineComponent({
  name: 'LoginForm',
  components: { Form, Link },
  setup() {
    const formFields: IFormInput[] = [
      {
        type: 'email',
        required: true,
        inputs: [],
        labels: ['Email'],
        placeholders: [],
        validators: ['required', 'email']
      },
      {
        type: 'password',
        required: true,
        inputs: [],
        labels: ['Password'],
        placeholders: [],
        validators: ['required']
      },
      {
        type: 'group',
        required: true,
        inputs: ['text', 'text'],
        labels: ['Group 1', 'Group 2'],
        placeholders: ['placeholder 1', 'placeholder 2'],
        validators: ['required']
      }
    ]

    const handleSubmit = () => {
      console.log('submitted')
    }

    return { formFields, handleSubmit }
  }
})
</script>
