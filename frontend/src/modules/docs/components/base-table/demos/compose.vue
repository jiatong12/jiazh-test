<script setup lang="ts">
import { ElInput, ElMessage } from 'element-plus'
import { useTableSetup } from '@/components/base-table'
import { baseTableRows, getBaseTableDemoList, projectCategoryDict, projectShelfStatusDict } from './data'

const tableRef = useTemplateRef<any>('tableRef')
const activeCategory = ref('')

const categoryTabs = [
  { label: '全部分类', value: '' },
  ...projectCategoryDict.map(item => ({ label: item.label, value: item.value })),
]

const summary = computed(() => {
  const currentRows = activeCategory.value
    ? baseTableRows.filter(item => item.category === activeCategory.value)
    : baseTableRows

  return [
    { title: '模块数量', value: `${currentRows.length}`, description: '当前 externalParams 生效后的记录数。' },
    { title: '已发布', value: `${currentRows.filter(item => item.shelfStatus === 1).length}`, description: '可直接用于 beforeTable 顶部摘要。' },
    { title: '待整理', value: `${currentRows.filter(item => item.shelfStatus === 0).length}`, description: '切换分类后不会重置搜索表单。' },
  ]
})

const tableConfig = useTableSetup({
  rowKey: 'id',
  showCard: false,
  showPagination: true,
  showHeader: true,
  pageSize: 5,
  actionsWidth: '140px',
  defaultSearchFormState: () => ({
    keyword: '',
  }),
  externalParams: () => ({
    category: activeCategory.value,
  }),
  datasource: params => getBaseTableDemoList(params),
  columns: [
    { label: '模块名称', prop: 'name', minWidth: 220 },
    { label: '维护团队', prop: 'owner', minWidth: 180 },
    { label: '发布状态', prop: 'shelfStatus', width: '120', align: 'center', widget: 'tag', dict: projectShelfStatusDict },
    { label: '更新时间', prop: 'updatedAt', minWidth: 180, align: 'center' },
  ],
  rowActions: [
    {
      name: '刷新',
      handle({ row }) {
        ElMessage.success(`已刷新 ${row.name}`)
        tableRef.value?.search()
      },
    },
  ],
})

function handleChangeCategory(value: string, searchFirstPage: () => void): void {
  activeCategory.value = value
  searchFirstPage()
}
</script>

<template>
  <BaseTable ref="tableRef" v-bind="tableConfig">
    <template #simpleSearch="{ searchFirstPage, searchFormState }">
      <ElInput
        v-model="searchFormState.keyword"
        placeholder="通过关键词筛选模块名称或维护团队"
        clearable
        :suffix-icon="$$renderIcon('i-ep:search')"
        @clear="searchFirstPage"
        @keyup.enter="searchFirstPage"
      />
    </template>

    <template #beforeTable="{ searchFirstPage, hasSearchFormState, resetSearchFormState }">
      <div class="flex-column">
        <ElSpace wrap>
          <BaseButton
            v-for="item in categoryTabs"
            :key="item.value || 'all'"
            :type="activeCategory === item.value ? 'primary' : 'default'"
            @click="handleChangeCategory(item.value, searchFirstPage)"
          >
            {{ item.label }}
          </BaseButton>
          <BaseButton v-if="hasSearchFormState" @click="resetSearchFormState">
            重置搜索表单
          </BaseButton>
        </ElSpace>

        <BaseRow :cols="{ xs: 1, md: 3 }">
          <div v-for="item in summary" :key="item.title" class="card flex-column h-full">
            <strong>{{ item.title }}</strong>
            <span>{{ item.value }}</span>
            <ElText type="info">
              {{ item.description }}
            </ElText>
          </div>
        </BaseRow>
      </div>
    </template>
  </BaseTable>
</template>
