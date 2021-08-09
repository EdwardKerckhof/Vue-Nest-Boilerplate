<template>
  <form @submit.prevent="handleSubmit">
    <div v-for="(field, i) in fields" :key="i">
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
import { defineComponent, PropType, provide } from 'vue'

import { IFormInput } from '../../../@types/IFormInput'
import FormGroup from '../../common/form/FormGroup.vue'
import FormInput from '../../common/form/FormInput.vue'

export default defineComponent({
  name: 'Form',
  components: { FormGroup, FormInput },
  props: {
    fields: {
      type: Array as PropType<Array<IFormInput>>,
      required: true,
      default: () => []
    }
  },
  emits: ['submit', 'handleInput', 'handleGroupInput'],
  setup(_, { emit }) {
    provide('formValues', [])

    const handleSubmit = (e) => {
      emit('submit')
    }

    const handleInput = ({ value, field, valIndex }) => {
      emit('handleInput', { value, field, valIndex })
    }

    return { handleSubmit, handleInput }
  }
})
</script>
