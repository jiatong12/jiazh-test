<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { baseFormDemoFilledData, baseFormDemoRules, createBaseFormDemoData, projectCategoryDict, projectShelfStatusDict } from './data'

const formRef = useTemplateRef<any>('formRef')
const formData = reactive(createBaseFormDemoData())

function fillDemoData(): void {
  Object.assign(formData, baseFormDemoFilledData)
}

function resetDemoData(): void {
  Object.assign(formData, createBaseFormDemoData())
}

async function validateDemoData(): Promise<void> {
  try {
    await formRef.value?.validate()
    ElMessage.success('表单校验通过')
  }
  catch {
    ElMessage.warning('请先完善必填项')
  }
}
</script>

<template>
  <BaseForm
    ref="formRef"
    :datasource="formData"
    :immediate="false"
    :enabled-leave-check="false"
    :rules="baseFormDemoRules"
    :cols="{ xs: 1, md: 2 }"
    label-width="110px"
    width="100%"
  >
    <BaseFormItem prop="projectName" label="项目名称" widget="input" required />
    <BaseFormItem prop="owner" label="负责人" widget="input" required />
    <BaseFormItem prop="branch" label="发布分支" widget="input" />
    <BaseFormItem prop="launchDate" label="上线日期" widget="date" />
    <BaseFormItem prop="category" label="项目分类" widget="select" :dict="projectCategoryDict" required />
    <BaseFormItem prop="shelfStatus" label="发布状态" widget="select" :dict="projectShelfStatusDict" />

    <BaseCol :col="1">
      <BaseFormItem
        prop="remark"
        label="项目说明"
        widget="textarea"
        :widget-props="{ rows: 3, placeholder: '长文本字段建议通过 BaseCol 独占一行' }"
      />
    </BaseCol>

    <template #footer>
      <BaseButton @click="resetDemoData">
        重置
      </BaseButton>
      <BaseButton @click="fillDemoData">
        填充示例数据
      </BaseButton>
      <BaseButton type="primary" @click="validateDemoData">
        校验表单
      </BaseButton>
    </template>
  </BaseForm>
</template>
