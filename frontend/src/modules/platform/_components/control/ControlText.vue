<script setup lang="ts">
import { computed } from 'vue'

// data
const inputValue = defineModel({
  type: [String, Number, Boolean, Object],
  default: '',
})
// props
const { config } = defineProps(['config'])

// computed
const max = computed(() => {
  if (config.dataType === 'ShortText') {
    return 200
  }
  if (config.dataType === 'LargeText') {
    return 500
  }

  return void 0
})

// methods
function inputHandler(val) {
  inputValue.value = val
}
</script>

<template>
  <ElInput v-model="inputValue" :maxlength="max" @input="inputHandler" />
</template>
