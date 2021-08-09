<template>
  <form @submit.prevent="$emit('submit')">
    <div v-for="(field, i) in fields" :key="i">
      <FormInput v-if="field.type !== 'group'" :field="field" />
      <FormGroup v-else :field="field" />
    </div>

    <div class="form-actions">
      <slot />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

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
  emits: ['submit']
})
</script>
