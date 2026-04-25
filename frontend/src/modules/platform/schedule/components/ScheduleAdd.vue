<script lang="ts" setup>
import type { FormRules } from 'element-plus'
import axios from 'axios'
import { ref } from 'vue'
import { useResettableState } from '@/hooks/useResettableState'
import util from '@/utils/util'

const emit = defineEmits(['submitSuccess'])
const dialogRef = useTemplateRef('dialogRef')
const formRef = useTemplateRef('formRef')

// 基础状态
const visible = ref(false)
const submitLoading = ref(false)

// 表单数据
const [formData, resetFormData] = useResettableState(() => ({
  ID: 0,
  typeCode: '',
  typeCodeName: '',
  sourceID: '',
  sourceIDName: '',
  startTime: '',
  nextRunTime: '',
  planType: 'Period',
  period: 1,
  periodType: 'Minute',
  cronExpression: '',
  isUsing: 'Y',
  description: '',
}))

const optionalSchedule = ref<any[]>([])
function open(): void {
  submitLoading.value = false
  // 重置
  resetFormData()
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
    axios.post('/ui/schedules', formData.value).then(({ data }) => {
      emit('submitSuccess')
      handleCancel()
      util.showResponseMessage(data)
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

const rules: FormRules = {
  cronExpression: [
    { required: true, trigger: 'blur', message: '请输入Cron表达式!' },
  ],
}

const scheduleTypes = () => axios.get('/ui/schedules/types', { params: { usable: 'Y' } }).then(res => res.data.data)

const typeCodeProps = {
  labelField: 'name',
  valueField: 'ID',
  onSyncItem: (val) => {
    optionalSchedule.value = val?.raw?.options ?? []
    console.log('onSyncItem', val)
  },
}

defineExpose({ open, dialogRef })
</script>

<template>
  <BaseDialog
    ref="dialogRef"
    v-model="visible"
    title="添加任务"
    width="600px"
  >
    <BaseForm
      ref="formRef"
      :datasource="formData"
      :rules="rules"
      :label-width="100"
      :col="1"
    >
      <template #default="{ model }">
        <BaseFormItem label="任务类别" prop="typeCode" widget="select" required :dict="scheduleTypes" :widget-props="typeCodeProps" />
        <BaseFormItem label="选择任务" prop="sourceID" widget="select" required :watch-clear="model.typeCode" :dict="optionalSchedule" :widget-props="{ labelField: 'name', valueField: 'ID' }" />
        <!-- {{ optionalSchedule }} -->
        <BaseFormItem label="起始时间" prop="startTime" widget="dateTime" required />
        <ElFormItem label="执行周期">
          <ElRadio v-model="model.planType" class="radio" label="Period">
            定时
          </ElRadio>
          <ElRadio v-model="model.planType" class="radio" label="cron">
            使用Cron表达式
          </ElRadio>
        </ElFormItem>
        <ElFormItem v-show="model.planType === 'Period'">
          <span>每隔</span>
          <ElInputNumber v-model="model.period" :min="1" class="ml-1 mr-1" />
          <ElSelect v-model="model.periodType" placeholder="请选择" style="width: 80px;">
            <ElOption label="分钟" value="Minute" />
            <ElOption label="小时" value="Hour" />
            <ElOption label="日" value="Day" />
            <ElOption label="月" value="Month" />
          </ElSelect>
        </ElFormItem>
        <BaseFormItem
          v-show="model.planType === 'cron' || model.typeCode === 'SYSTEM'"
          prop="cronExpression" widget="input" :widget-props="{ placeholder: '请输入Cron表达式' }"
        />
        <BaseFormItem label="状态" prop="isUsing" widget="switch" :widget-props="{ activeValue: 'Y', inactiveValue: 'N' }" />
        <BaseFormItem label="备注" prop="description" />
      </template>
    </BaseForm>

    <template #footer>
      <BaseButton @click="handleCancel">
        取消
      </BaseButton>
      <BaseButton priv="Platform.Schedule.Add" :disabled="submitLoading" type="primary" :loading="submitLoading" @click="handleSubmit">
        保存
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
</style>
