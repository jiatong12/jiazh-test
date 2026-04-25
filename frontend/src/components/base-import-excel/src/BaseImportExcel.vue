<script setup lang="ts">
import type { UploadRawFile, UploadRequestOptions } from 'element-plus'
import { ElNotification } from 'element-plus'
import { ref } from 'vue'
import { useDownload } from '@/hooks/useDownload'

export interface Props {
  title?: string // 标题
  fileSize?: number // 上传文件的大小 (M)
  showCover?: boolean // 显示覆盖
  templateApi?: () => Promise<any> // 下载模板的Api
  importApi: (params: any) => Promise<any> // 批量导入的Api
}

const emit = defineEmits(['importSuccess'])

// 是否覆盖数据
const isCover = ref(false)
// dialog状态
const visible = ref(false)

const fileType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

const defaultParameter = {
  title: '导入',
  fileSize: 5,
  showCover: true,
} as Props
// 父组件传过来的参数
const parameter = ref<Props>({ ...defaultParameter })

// 接收父组件参数
function open(params: Props) {
  parameter.value = { ...defaultParameter, ...params }
  isCover.value = false
  visible.value = true
}

// Excel 导入模板下载
function downloadTemp() {
  if (!parameter.value.templateApi) { return }
  useDownload({
    api: parameter.value.templateApi,
    fileName: `${parameter.value.title}模板`,
  })
}

// 文件上传
async function uploadExcel(param: UploadRequestOptions) {
  const excelFormData = { file: param.file } as any
  if (parameter.value.showCover) {
    excelFormData.isCover = isCover.value
  }
  await parameter.value.importApi!(excelFormData)
  emit('importSuccess')
  visible.value = false
}

/**
 * @description 文件上传之前判断
 * @param file 上传的文件
 */
function beforeExcelUpload(file: UploadRawFile) {
  const isExcel = fileType!.includes(file.type as FileType.ExcelMimeType)
  const fileSize = file.size / 1024 / 1024 < parameter.value.fileSize!
  if (!isExcel) {
    ElNotification({
      title: '温馨提示',
      message: '上传文件只能是 xls / xlsx 格式！',
      type: 'warning',
    })
  }
  if (!fileSize) {
    setTimeout(() => {
      ElNotification({
        title: '温馨提示',
        message: `上传文件大小不能超过 ${parameter.value.fileSize}MB！`,
        type: 'warning',
      })
    }, 0)
  }
  return isExcel && fileSize
}

// 文件数超出提示
function handleExceed() {
  ElNotification({
    title: '温馨提示',
    message: '最多只能上传一个文件！',
    type: 'warning',
  })
}

// 上传错误提示
function excelUploadError() {
  ElNotification({
    title: '温馨提示',
    message: `批量添加${parameter.value.title}失败，请您重新上传！`,
    type: 'error',
  })
}

// 上传成功提示
function excelUploadSuccess() {
  ElNotification({
    title: '温馨提示',
    message: `批量添加${parameter.value.title}成功！`,
    type: 'success',
  })
}

const acceptStr = computed(() => fileType!.join(','))

defineExpose({
  open,
})
</script>

<template>
  <BaseDialog v-model="visible" :title="parameter.title" :destroy-on-close="true" width="580px" draggable>
    <ElForm class="drawer-multiColumn-form" label-width="100px">
      <ElFormItem v-if="parameter.templateApi" label="模板下载：">
        <BaseButton type="primary" :icon="$$renderIcon('i-ep:download')" @click="downloadTemp">
          点击下载
        </BaseButton>
      </ElFormItem>
      <ElFormItem label="文件上传：">
        <ElUpload
          action="#"
          class="upload"
          :drag="true"
          :limit="1"
          :multiple="true"
          :show-file-list="true"
          :http-request="uploadExcel"
          :before-upload="beforeExcelUpload"
          :on-exceed="handleExceed"
          :on-success="excelUploadSuccess"
          :on-error="excelUploadError"
          :accept="acceptStr"
        >
          <slot name="empty">
            <ElIcon class="el-icon--upload">
              <BaseIcon name="i-ep:upload-filled" />
            </ElIcon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </slot>
          <template #tip>
            <slot name="tip">
              <div class="el-upload__tip">
                请上传 .xls , .xlsx 标准格式文件，文件最大为 {{ parameter.fileSize }}M
              </div>
            </slot>
          </template>
        </ElUpload>
      </ElFormItem>
      <ElFormItem v-if="parameter.showCover" label="数据覆盖：">
        <ElSwitch v-model="isCover" />
      </ElFormItem>
    </ElForm>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.upload {
  width: 80%;
}
</style>
