<script setup lang="ts">
import { ElMessage } from 'element-plus'
import {
  createFilledSearchFormDemoState,
  createSearchFormDemoState,
  projectCategoryDict,
  projectShelfStatusDict,
} from './data'

const searchFormState = reactive(createSearchFormDemoState())
const submitSnapshot = ref<Record<string, any> | null>(null)

function handleSearch(): void {
  submitSnapshot.value = { ...searchFormState }
  ElMessage.success('已触发搜索')
}

function resetDemo(): void {
  Object.assign(searchFormState, createSearchFormDemoState())
  submitSnapshot.value = null
}

function fillDemo(): void {
  Object.assign(searchFormState, createFilledSearchFormDemoState())
}
</script>

<template>
  <div class="flex-column-layout">
    <BaseTableSearchForm
      v-model="searchFormState"
      :handle-search="handleSearch"
    >
      <BaseTableSearchFormItem label="关键词" prop="keyword" widget="input" />
      <BaseTableSearchFormItem label="业务分类" prop="category" widget="select" :dict="projectCategoryDict" />
      <BaseTableSearchFormItem label="发布状态" prop="shelfStatus" widget="select" :dict="projectShelfStatusDict" />
      <BaseTableSearchFormItem label="更新时间" prop="startDate,endDate" widget="dateRange" />
    </BaseTableSearchForm>

    <ElSpace wrap>
      <BaseButton @click="resetDemo">
        重置示例
      </BaseButton>
      <BaseButton @click="fillDemo">
        填充示例值
      </BaseButton>
      <BaseButton type="primary" @click="handleSearch">
        手动触发搜索
      </BaseButton>
    </ElSpace>

    <BaseCard title="当前搜索状态">
      <ElDescriptions :column="2" border size="small">
        <ElDescriptionsItem label="关键词">
          {{ searchFormState.keyword || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="业务分类">
          {{ searchFormState.category || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="发布状态">
          {{ searchFormState.shelfStatus === '' ? '--' : searchFormState.shelfStatus }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="开始日期">
          {{ searchFormState.startDate || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="结束日期">
          {{ searchFormState.endDate || '--' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="最近一次提交">
          {{ submitSnapshot ? JSON.stringify(submitSnapshot) : '--' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </BaseCard>
  </div>
</template>
