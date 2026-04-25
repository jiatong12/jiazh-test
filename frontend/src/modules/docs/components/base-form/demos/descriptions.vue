<script setup lang="ts">
import { getBaseFormDetailData, projectCategoryDict, projectShelfStatusDict } from './data'

type DetailScene = 'standard' | 'service'

const detailFormRef = useTemplateRef<any>('detailFormRef')
const activeScene = ref<DetailScene>('standard')

function switchScene(scene: DetailScene): void {
  activeScene.value = scene
  detailFormRef.value?.loadData()
}

function reloadDetail(): void {
  detailFormRef.value?.loadData()
}

async function loadDetail(): Promise<any> {
  return getBaseFormDetailData(activeScene.value)
}
</script>

<template>
  <div>
    <ElAlert
      class="mb-3"
      title="displayMode=descriptions 适合详情、审核、抽屉只读查看场景；同一套字段可以随 loadData 重新加载不同记录。"
      type="info"
      :closable="false"
      show-icon
    />

    <ElSpace wrap class="mb-3">
      <BaseButton :type="activeScene === 'standard' ? 'primary' : 'default'" @click="switchScene('standard')">
        标准项目
      </BaseButton>
      <BaseButton :type="activeScene === 'service' ? 'primary' : 'default'" @click="switchScene('service')">
        服务项目
      </BaseButton>
      <BaseButton @click="reloadDetail">
        重新加载
      </BaseButton>
    </ElSpace>

    <BaseForm
      ref="detailFormRef"
      :datasource="loadDetail"
      :enabled-leave-check="false"
      :cols="{ xs: 1, md: 2 }"
      display-mode="descriptions"
      label-width="120px"
      width="100%"
    >
      <BaseCol :col="1">
        <BaseFormItem label="项目封面" prop="cover" widget="image" :widget-props="{ width: 120, height: 120 }" is-readonly />
      </BaseCol>
      <BaseCol :col="1">
        <BaseFormItem label="项目名称" prop="projectName" widget="input" is-readonly />
      </BaseCol>
      <BaseFormItem label="项目编码" prop="projectCode" widget="input" is-readonly />
      <BaseFormItem label="负责人" prop="owner" widget="input" is-readonly />
      <BaseFormItem label="项目分类" prop="category" widget="tag" :dict="projectCategoryDict" is-readonly />
      <BaseFormItem label="发布状态" prop="shelfStatus" widget="tag" :dict="projectShelfStatusDict" is-readonly />
      <BaseFormItem label="交付时效" prop="deliveryTime" widget="input" is-readonly />
      <BaseFormItem label="创建时间" prop="createdAt" widget="input" is-readonly />
      <BaseCol :col="1">
        <BaseFormItem label="更新时间" prop="updatedAt" widget="input" is-readonly />
      </BaseCol>

      <BaseCol :col="1">
        <BaseFormItem label="项目说明" prop="summary" widget="textarea" is-readonly />
      </BaseCol>
    </BaseForm>
  </div>
</template>
