<script setup lang="ts">
import axios from 'axios'

import { watch } from 'vue'

// data
const selectValue = defineModel({
  type: [String, Number, Boolean, Object, Array],
  default: '',
})
// props
const { config } = defineProps(['config'])

const options = ref<any[]>([])

// watch
watch(
  () => config,
  (val) => {
    updateOptions(val)
  },
)

// methods
function inputHandler(val) {
  selectValue.value = val
}

async function updateOptions(config) {
  if (config.options && config.options.length) {
    options.value = JSON.parse(JSON.stringify(config.options))
    return
  }

  if (config.listOptions) {
    const items = config.listOptions.split(':')
    if (items.length !== 2) {
      options.value = []
      return
    }

    if (items[0] === 'Input') {
      const list = items[1].split('<br>')
      options.value = list.map((val) => {
        return { value: val, key: val }
      })
      return
    }

    const res = await axios
      .get(`/ui/metadatas/fields/options/${items[0]}`, {
        params: {
          method: items[1],
        },
      })
      .then(res => res.data)
    options.value = res.data
  }
}

// created
(() => {
  updateOptions(config)
})()
</script>

<template>
  <ElSelect v-model="selectValue" placeholder="请选择" @input="inputHandler">
    <ElOption
      v-for="(item, index) in options"
      :key="index"
      :label="item.value"
      :value="item.key"
    />
  </ElSelect>
</template>
