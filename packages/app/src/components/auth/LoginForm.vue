<template>
  <h1>LoginForm</h1>
  <Form :fields="formFields" @submit="handleSubmit" @handleInput="handleInput">
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
        id: 0,
        type: 'email',
        required: true,
        inputs: [],
        values: [''],
        labels: ['Email'],
        placeholders: [],
        validators: ['required', 'email']
      },
      {
        id: 1,
        type: 'password',
        required: true,
        inputs: [],
        values: [''],
        labels: ['Password'],
        placeholders: [],
        validators: ['required']
      },
      {
        id: 2,
        type: 'group',
        required: true,
        inputs: ['text', 'text'],
        labels: ['Full name'],
        values: ['', ''],
        placeholders: ['first name', 'last name'],
        validators: ['required']
      }
    ]

    const handleSubmit = () => {
      console.log('submitted')
      console.log('test', formFields[0].values)
      console.log('test', formFields[2].values)
    }

    const handleInput = ({ value, field, valIndex }) => {
      const index = formFields.findIndex((f) => f.id === field.id)
      if (index > -1) formFields[index].values[valIndex] = value
    }

    return { formFields, handleSubmit, handleInput }
  }
})
</script>
