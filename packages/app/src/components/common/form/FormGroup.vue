<template>
  <div class="form-group">
    <span v-for="(input, j) in field.inputs" :key="j" class="input-group">
      <label class="form-label">{{ field.labels[j] }}</label>
      <input
        :type="input"
        :placeholder="field.placeholders[j]"
        class="form-input"
      />
    </span>
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
  }
})
</script>
