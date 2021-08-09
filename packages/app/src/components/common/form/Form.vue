<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="(field, i) in formFields" :key="i">
      <FormInput
        v-if="field.type !== 'group'"
        :field="field"
        @input="handleInput"
      />
      <FormGroup v-else :field="field" @input="handleInput" />
    </div>

    <div class="form-actions">
      <slot />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

import FormGroup from '../../common/form/FormGroup.vue'
import FormInput from '../../common/form/FormInput.vue'

export default defineComponent({
  name: 'Form',
  components: { FormGroup, FormInput },
  emits: ['submit'],
  setup(_, { emit }) {
    const formFields = inject('formFields')

    const handleSubmit = () => {
      emit('submit')
    }

    const handleInput = ({ value, field, valIndex }) => {
      const index = formFields.findIndex((f) => f.id === field.id)
      if (index > -1) formFields[index].values[valIndex] = value
    }

    return { handleSubmit, handleInput, formFields }
  }
})
</script>
