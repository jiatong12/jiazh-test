<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useEnv } from '@/env/useEnv'
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/store/modules/global'

const { changePrimary } = useTheme()
const { PRIMARY_COLOR } = useEnv()

const globalStore = useGlobalStore()
const {
  primary,
} = storeToRefs(globalStore)

// 预定义主题颜色 - 主流色调选择，避免与 Element Plus 状态颜色冲突
const colorList = [
  PRIMARY_COLOR,
  '#5d87ff',
  '#196fd6',
  '#0c819f',
  '#21a076',
  '#8a48a4',
  '#bf3f32',
  '#cb5e1a',
  '#a36e2e',
  '#e066a6',
  // '#a964c5',
  // '#7166f0',
  // '#0c819f',
  // '#3b82f6',
  // '#409eff',
  // '#06b6d4',
  // '#10b981',
  // '#14b8a6',
  // '#e74c3c',
  // '#bf3f32',
  // '#ff5c93',
  // '#f472b6',
  // '#daa96e',
  // '#a36e2e',
  // '#6b7280', // 中性灰
  // '#4b5563', // 深灰色
]
</script>

<template>
  <ElColorPicker v-model="primary" :predefine="colorList" @change="changePrimary" />
</template>

<style lang="scss" scoped>

</style>
