<template>
  <label v-if="field.labels[0]" class="form-label">{{ field.labels[0] }}</label>
  <input
    :value="field.values[0]"
    :type="field.type"
    :placeholder="field.placeholders[0]"
    class="form-input"
    @input="$emit('input', { value: $event.target.value, field, valIndex: 0 })"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { IFormInput } from '../../../@types/IFormInput'

export default defineComponent({
  name: 'FormInput',
  props: {
    field: {
      type: Object as PropType<IFormInput>,
      required: true
    }
  },
  emits: ['input']
})
</script>
