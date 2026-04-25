<script setup lang="ts">
import axios from 'axios'
import { watch } from 'vue'

// data
const radioValue = defineModel({
  type: [String, Number, Boolean, Object],
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
  radioValue.value = val
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
  <div>
    <ElRadio v-for="(item, index) in options" :key="index" v-model="radioValue" class="radio" :label="item.key" @action="inputHandler">
      {{ item.value }}
    </ElRadio>
  </div>
</template>
