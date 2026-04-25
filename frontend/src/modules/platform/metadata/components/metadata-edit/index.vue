<script setup lang="tsx">
import MetaModelColumn from './components/meta-model-column/index.vue'
import MetaModelData from './components/meta-model-data/index.vue'
import MetaModelInfo from './components/metadata-info/index.vue'

defineOptions({
  components: {
    MetaModelInfo,
    MetaModelColumn,
    MetaModelData,
  },
})

const drawerRef = useTemplateRef('drawerRef')

const visible = ref(false)
const submitLoading = ref(false)
const activeName = ref('info')
const modelId = ref<number>(-1)
const tabsInfo = [
  { label: '字段列表', icon: 'i-ep:share', key: 'MetaModelColumn', value: 'field' },
  { label: '数据管理', icon: 'i-ep:calendar', key: 'MetaModelData', value: 'data' },
]

/**
 * 打开
 */
function open(_modelId: number): void {
  submitLoading.value = false
  modelId.value = _modelId
  activeName.value = 'info'
  visible.value = true
}

// function handleCancel() {
//   visible.value = false
// }

defineExpose({ open, drawerRef })
</script>

<template>
  <BaseDrawer ref="drawerRef" v-model="visible" title="编辑元数据" size="96%">
    <div v-if="visible" class="card h-full">
      <ElTabs v-model="activeName" class="h-full">
        <ElTabPane name="info" class="h-full overflow-y-auto">
          <template #label>
            <span><BaseIcon name="i-fa6-regular:rectangle-list" /> 基本信息</span>
          </template>
          <!-- 元数据基本信息 -->
          <MetaModelInfo :model-id="modelId" :tab-name="activeName" />
        </ElTabPane>
        <ElTabPane v-for="tab in tabsInfo" :key="tab.value" :name="tab.value" lazy class="h-full overflow-y-auto">
          <template #label>
            <span><BaseIcon :name="tab.icon" /> {{ tab.label }}</span>
          </template>
          <component :is="tab.key" :tab-name="activeName" :model-id="modelId" />
        </ElTabPane>
      </ElTabs>
    </div>
  </BaseDrawer>
</template>
