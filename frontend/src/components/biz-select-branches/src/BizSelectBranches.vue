<script lang="ts" setup>
import axios from 'axios'

const modelValue = defineModel('modelValue', { type: String })
const getBranches = () => axios.get('/ui/branches/treebranchs').then(res => res.data.data)
</script>

<template>
  <BaseTreeSelect v-model="modelValue" :dict="getBranches" label-field="name" value-field="branchInnerCode" check-strictly clearable placeholder="选择机构" />
</template>

<style lang="scss" scoped>

</style>
