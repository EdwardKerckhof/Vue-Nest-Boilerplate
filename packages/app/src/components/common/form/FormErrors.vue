<template>
  <ul v-if="typeof data?.message !== 'string'">
    <li v-for="(errorMsg, i) in data?.message" :key="i">
      <p class="text-red-500">{{ $filters.capitalize(errorMsg) }}</p>
    </li>
  </ul>
  <ul v-else>
    <li>
      <p class="text-red-500">
        {{ $filters.capitalize(data?.message) }}
      </p>
    </li>
  </ul>
</template>

<script lang="ts">
import { ErrorResponseDto, UserResponseDto } from '@vnbp/common/dist/models'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'FormErrors',
  props: {
    data: {
      type: Object as PropType<UserResponseDto | ErrorResponseDto>,
      required: true
    }
  }
})
</script>
