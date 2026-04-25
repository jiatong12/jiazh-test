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
    return 50
  }
  if (config.dataType === 'LargeText') {
    return 200
  }

  return void 0
})

// methods
function inputHandler(val) {
  inputValue.value = val
}
</script>

<template>
  <ElInput v-model="inputValue" type="textarea" :rows="6" :maxlength="max" @input="inputHandler" />
</template>
