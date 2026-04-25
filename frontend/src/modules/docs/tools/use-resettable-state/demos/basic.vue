<!-- 演示 useResettableState 在新增 / 编辑弹框中的重置方式。 -->
<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useResettableState } from '@/hooks/useResettableState'

interface DraftForm {
  title: string
  owner: string
  remark: string
}

function createEmptyDraft(): DraftForm {
  return {
    title: '',
    owner: '',
    remark: '',
  }
}

const visible = ref(false)
const mode = ref<'create' | 'edit'>('create')
const [formData, resetFormData] = useResettableState(createEmptyDraft)

function openCreate() {
  mode.value = 'create'
  resetFormData()
  visible.value = true
}

function openEdit() {
  mode.value = 'edit'
  resetFormData()
  Object.assign(formData.value, {
    title: '重点项目复盘',
    owner: '王璐',
    remark: '这里模拟接口回填，先重置再覆盖当前值。',
  })
  visible.value = true
}

function handleClose() {
  visible.value = false
}

function handleSubmit() {
  ElMessage.success(`${mode.value === 'create' ? '新增' : '编辑'}数据已提交`)
  handleClose()
}
</script>

<template>
  <div class="flex-column-layout">
    <ElAlert
      title="先试一下“打开新增弹框”输入内容，再关闭并点击“模拟编辑回填”，可以看到每次都会先回到干净初始值。"
      type="info"
      :closable="false"
    />

    <ElSpace wrap>
      <BaseButton type="primary" @click="openCreate">
        打开新增弹框
      </BaseButton>
      <BaseButton @click="openEdit">
        模拟编辑回填
      </BaseButton>
    </ElSpace>

    <BaseDialog
      v-model="visible"
      :title="mode === 'create' ? '新增草稿' : '编辑草稿'"
      width="560px"
    >
      <BaseForm
        :datasource="formData"
        :enabled-leave-check="false"
        label-width="88px"
        width="100%"
      >
        <BaseFormItem label="标题" prop="title" widget="input" />
        <BaseFormItem label="负责人" prop="owner" widget="input" />
        <BaseFormItem label="备注" prop="remark" widget="textarea" />
      </BaseForm>

      <template #footer>
        <BaseButton @click="handleClose">
          取消
        </BaseButton>
        <BaseButton type="primary" @click="handleSubmit">
          保存
        </BaseButton>
      </template>
    </BaseDialog>
  </div>
</template>
