<script setup lang="ts">
import type { AssemblySizeType } from '@/store/modules/global'
import { computed } from 'vue'
import { useGlobalStore } from '@/store/modules/global'

const globalStore = useGlobalStore()
const assemblySize = computed(() => globalStore.assemblySize)

const assemblySizeList = [
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' },
]

function setAssemblySize(item: AssemblySizeType) {
  if (assemblySize.value === item) { return }
  globalStore.assemblySize = item
}
</script>

<template>
  <ElDropdown trigger="click" @command="setAssemblySize">
    <BaseIcon name="i-ri:custom-size" class="iconfont" />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="item in assemblySizeList"
          :key="item.value"
          :command="item.value"
          :disabled="assemblySize === item.value"
        >
          {{ item.label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>
