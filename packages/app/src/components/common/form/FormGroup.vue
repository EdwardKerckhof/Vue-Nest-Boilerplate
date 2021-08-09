<template>
  <label v-if="field.labels[0]" class="form-label">{{ field.labels[0] }}</label>
  <div class="form-group">
    <input
      v-for="(input, j) in field.inputs"
      :key="j"
      :value="field.values[j]"
      :type="input"
      :placeholder="field.placeholders[j]"
      class="form-input"
      @input="
        $emit('input', { value: $event.target.value, field, valIndex: j })
      "
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { IFormInput } from '../../../@types/IFormInput'

export default defineComponent({
  name: 'FormGroup',
  props: {
    field: {
      type: Object as PropType<IFormInput>,
      required: true
    }
  },
  emits: ['input']
})
</script>
