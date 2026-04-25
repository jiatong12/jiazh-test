<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { ref } from 'vue'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

const id = ref('')
const datasource = () => axios.get(`/ui/schedules/${id.value}`).then(r => r.data.data)

function open(_id: string): void {
  id.value = _id
  submitLoading.value = false
  nextTick(() => {
    visible.value = true
  })
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  formRef.value?.validate()?.then(() => {
    submitLoading.value = true
    axios.put(`/ui/schedules/${id.value}`, formRef.value?.model).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const isSys = computed<boolean>(() => formRef.value?.model?.typeCode === 'SYSTEM')

const rules: FormRules = {
  cronExpression: [
    { required: true, trigger: 'blur', message: '请输入Cron表达式!' },
  ],
}

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="编辑任务"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="datasource"
      :rules="rules"
      :label-width="100"
      :col="1"
    >
      <template #default="{ model }">
        <BaseFormItem label="任务类别" prop="typeCodeName" widget="text" required :is-readonly="isSys" />
        <BaseFormItem label="选择任务" prop="sourceIDName" widget="text" required :is-readonly="isSys" />
        <BaseFormItem label="起始时间" prop="startTime" widget="dateTime" required :is-readonly="isSys" />
        <ElFormItem label="执行周期">
          <ElRadio v-model="model.planType" class="radio" label="Period" :disabled="isSys">
            定时
          </ElRadio>
          <ElRadio v-model="model.planType" class="radio" label="cron" :disabled="isSys">
            使用Cron表达式
          </ElRadio>
        </ElFormItem>
        <ElFormItem v-show="model.planType === 'Period'">
          <span>每隔</span>
          <ElInputNumber v-model="model.period" :min="1" class="ml-1 mr-1" :disabled="isSys" />
          <ElSelect v-model="model.periodType" placeholder="请选择" style="width: 80px;" :disabled="isSys">
            <ElOption label="分钟" value="Minute" />
            <ElOption label="小时" value="Hour" />
            <ElOption label="日" value="Day" />
            <ElOption label="月" value="Month" />
          </ElSelect>
        </ElFormItem>
        <BaseFormItem
          v-show="model.planType === 'cron' || isSys"
          prop="cronExpression" widget="input" :widget-props="{ placeholder: '请输入Cron表达式' }"
        />
        <BaseFormItem label="状态" prop="isUsing" widget="switch" :widget-props="{ activeValue: 'Y', inactiveValue: 'N' }" />
        <BaseFormItem label="备注" prop="description" :is-readonly="isSys" />
      </template>
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Schedule.Edit" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>
