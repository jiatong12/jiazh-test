<script setup lang="ts">
import type { UploadFile, UploadRequestOptions, UploadUserFile } from 'element-plus'
import type { PropType } from 'vue'
import { formContextKey, formItemContextKey } from 'element-plus'
import { computed, inject, ref } from 'vue'
import { useImageUpload } from './composables/useImageUpload'
import { useUploadFeedback } from './composables/useUploadFeedback'

const modelValue = defineModel({ type: Array as PropType<string[]>, default: () => [] })

const props = withDefaults(defineProps<UploadFileProps>(), {
  drag: true,
  disabled: false,
  limit: 5,
  fileSize: 5,
  fileType: () => ['image/jpeg', 'image/png', 'image/webp'],
  height: '150px',
  width: '150px',
  borderRadius: '8px',
})

interface UploadFileProps {
  api?: (params: UploadRequestOptions) => Promise<any> // 上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit?: number // 最大图片上传数 ==> 非必传（默认为 5张）
  fileSize?: number // 图片大小限制 ==> 非必传（默认为 5M）
  fileType?: FileType.ImageMimeType[] // 图片类型限制 ==> 非必传（默认为 ["image/jpeg", "image/png", "image/gif"]）
  height?: string // 组件高度 ==> 非必传（默认为 150px）
  width?: string // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string // 组件边框圆角 ==> 非必传（默认为 8px）
}

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0)
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled
})
const { beforeUpload, notifyUploadError, notifyUploadSuccess, notifyMissingApi } = useImageUpload({
  getFileSize: () => props.fileSize,
  getFileType: () => props.fileType,
})
const { notifyWarning } = useUploadFeedback()
// 修改 _fileList 的定义，使用 ref 而不是 computed
const _fileList = ref<UploadUserFile[]>([])

// 监听 modelValue 变化，同步更新 _fileList
watch(() => modelValue.value, (newVal) => {
  _fileList.value = newVal.map((url, index) => ({ uid: index + 1, name: 'image', url }))
}, { immediate: true })

function syncModelValue() {
  modelValue.value = _fileList.value.map(e => e.url).filter(Boolean) as string[]
}

/**
 * @description 图片上传
 * @param options upload 所有配置项
 */
async function handleHttpUpload(options: UploadRequestOptions) {
  try {
    if (!props.api) {
      notifyMissingApi(options)
      return
    }
    const data = await props.api(options)
    if (!data?.fileUrl) {
      notifyWarning('上传成功但未返回图片地址')
      options.onError(new Error('上传成功但未返回图片地址') as any)
      return
    }
    options.onSuccess(data)
  }
  catch (error) {
    options.onError(error as any)
  }
}

function uploadSuccess(response: { fileUrl: string } | undefined, uploadFile: UploadFile) {
  if (!response) { return }
  uploadFile.url = response.fileUrl
  syncModelValue()
  // 调用 el-form 内部的校验方法（可自动校验）
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string])
  notifyUploadSuccess()
}

/**
 * @description 删除图片
 * @param file 删除的文件
 */
function handleRemove(file: UploadFile) {
  _fileList.value = _fileList.value.filter(item => item.uid !== file.uid)
  syncModelValue()
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string])
}

/**
 * @description 文件数超出
 */
function handleExceed() {
  notifyWarning(`当前最多只能上传 ${props.limit} 张图片，请移除后上传！`)
}

/**
 * @description 图片预览
 * @param file 预览的文件
 */
const currentIndex = ref<number>(0)
const imgViewVisible = ref(false)
function handlePictureCardPreview(index: number) {
  currentIndex.value = index
  imgViewVisible.value = true
}
</script>

<template>
  <div class="upload-box">
    <ElUpload
      v-model:file-list="_fileList"
      action="#"
      list-type="picture-card"
      class="upload" :class="[self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="true"
      :disabled="self_disabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="notifyUploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <div class="upload-empty">
        <slot name="empty">
          <ElIcon><BaseIcon name="i-ep:plus" /></ElIcon>
          <!-- <span>请上传图片</span> -->
        </slot>
      </div>
      <template #file="{ file, index }">
        <img :src="file.url" class="upload-image">
        <div class="upload-handle" @click.stop>
          <div class="handle-icon" @click="handlePictureCardPreview(index)">
            <ElIcon><BaseIcon name="i-ep:zoom-in" /></ElIcon>
            <span>查看</span>
          </div>
          <div v-if="!self_disabled" class="handle-icon" @click="handleRemove(file)">
            <ElIcon><BaseIcon name="i-ep:delete" /></ElIcon>
            <span>删除</span>
          </div>
        </div>
      </template>
    </ElUpload>
    <div class="el-upload__tip">
      <slot name="tip" />
    </div>
    <ElImageViewer v-if="imgViewVisible" :initial-index="currentIndex" :url-list="modelValue" @close="imgViewVisible = false" />
  </div>
</template>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload-dragger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 0;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      border-radius: v-bind(borderRadius);

      &:hover {
        border: 1px dashed var(--el-color-primary);
      }
    }

    .el-upload-dragger.is-dragover {
      background-color: var(--el-color-primary-light-9);
      border: 2px dashed var(--el-color-primary) !important;
    }

    .el-upload-list__item,
    .el-upload--picture-card {
      width: v-bind(width);
      height: v-bind(height);
      background-color: transparent;
      border-radius: v-bind(borderRadius);
    }

    .upload-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .upload-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 30px;
      color: var(--el-color-info);

      .el-icon {
        font-size: 28px;
        color: var(--el-text-color-secondary);
      }
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      transition: var(--el-transition-duration-fast);

      .handle-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6%;
        color: aliceblue;

        .el-icon {
          margin-bottom: 15%;
          font-size: 140%;
        }

        span {
          font-size: 100%;
        }
      }
    }

    .el-upload-list__item {
      &:hover {
        .upload-handle {
          opacity: 1;
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 15px;
    text-align: center;
  }
}
</style>
