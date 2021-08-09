<template>
  <label class="form-label">{{ field.labels[0] }}</label>
  <input
    :type="field.type"
    :placeholder="field.placeholders[0]"
    class="form-input"
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
  }
})
</script>
