<script setup lang="ts">
import type { AxiosRequestConfig } from 'axios'
import type { UploadFile, UploadProps, UploadRequestOptions, UploadUserFile } from 'element-plus'
import { formContextKey, formItemContextKey } from 'element-plus'
import Sortable from 'sortablejs'
import { computed, inject, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import docIcon from '@/assets/images/file-type/doc.svg'
import excelIcon from '@/assets/images/file-type/excel.svg'
import pdfIcon from '@/assets/images/file-type/pdf.svg'
import pptIcon from '@/assets/images/file-type/ppt.svg'
import txtIcon from '@/assets/images/file-type/txt.svg'
import unknownFileIcon from '@/assets/images/file-type/unknownfile.svg'
import videoIcon from '@/assets/images/file-type/video.svg'
import { useDownload } from '@/hooks/useDownload'
// import PreviewFile from '@/components/i-preview-file/index.vue'
// import { useDownload } from '@/hooks/common/useDownload'
import { downloadFileByUrl } from '@/utils/download'
import { useUploadFeedback } from './composables/useUploadFeedback'

interface UploadUserFileItem extends UploadUserFile {
  id?: string
  name: string
  url: string
}

interface UploadFileItem extends UploadFile {
  id?: string
}

interface UploadFileProps {
  // 需要 id、name、url 三个参数
  modelValue?: UploadUserFileItem[]
  tip?: string
  api?: (params: UploadRequestOptions, config?: AxiosRequestConfig) => Promise<any> // 上传文件的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit?: number // 最大文件上传数 ==> 非必传（默认为 5张）
  fileSize?: number // 文件大小限制 ==> 非必传（默认为 5M）
  fileType?: FileType[] // 文件类型限制 ==> 非必传
  height?: string // 组件高度 ==> 非必传（默认为 150px）s
  width?: string // 组件宽度 ==> 非必传（默认为 150px）
  borderRadius?: string // 组件边框圆角 ==> 非必传（默认为 8px）
  draggable?: boolean // 是否支持拖拽
  downloadApi?: (params: { id: string, name: string, url: string }) => Promise<any> // 文件下载 api，不传则按 file.url 原生下载
}

const props = withDefaults(defineProps<UploadFileProps>(), {
  modelValue: () => [],
  tip: '',
  drag: true,
  disabled: false,
  limit: 5,
  fileSize: 5,
  fileType: () => [
    // 图片
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',

    // 视频
    '.mp4',
    '.avi',
    '.wmv',

    // office 文件
    '.doc',
    '.docx',

    // 其他
    '.pdf',
    // '.txt',
    // '.md'
  ],
  borderRadius: '8px',
  draggable: false,
})

const emit = defineEmits<UploadEmits>()
const { notifyWarning, notifySuccess, notifyError, notifyMissingApi } = useUploadFeedback()

// 获取图标
const _fileTypeArr = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.bmp',
  '.svg',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.csv',
  '.ppt',
  '.pptx',
  '.pdf',
  '.txt',
  '.md',
  '.json',
  '.xml',
  '.log',
  '.mp4',
  '.avi',
  '.wmv',
  '.mov',
  '.mkv',
  '.webm',
] as const
type FileType = (typeof _fileTypeArr)[number]
interface FileTypeSource {
  name?: string
  url?: string
  type?: string
  raw?: {
    type?: string
  }
}
const image: FileType[] = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg']
const docx: FileType[] = ['.doc', '.docx']
const excel: FileType[] = ['.xls', '.xlsx', '.csv']
const ppt: FileType[] = ['.ppt', '.pptx']
const pdf: FileType[] = ['.pdf']
const txt: FileType[] = ['.txt', '.md', '.json', '.xml', '.log']
const video: FileType[] = ['.mp4', '.avi', '.wmv', '.mov', '.mkv', '.webm']
const fileTypeIconMap = {
  doc: docIcon,
  excel: excelIcon,
  pdf: pdfIcon,
  ppt: pptIcon,
  txt: txtIcon,
  video: videoIcon,
  unknown: unknownFileIcon,
}
function isImage(file?: FileTypeSource) {
  const type = resolveFileType(file)
  return image.includes(type as FileType)
}
function getIcon(file?: FileTypeSource) {
  const type = resolveFileType(file) as FileType
  if (image.includes(type)) {
    return file?.url || fileTypeIconMap.unknown
  }
  else if (docx.includes(type)) {
    return fileTypeIconMap.doc
  }
  else if (excel.includes(type)) {
    return fileTypeIconMap.excel
  }
  else if (ppt.includes(type)) {
    return fileTypeIconMap.ppt
  }
  else if (pdf.includes(type)) {
    return fileTypeIconMap.pdf
  }
  else if (txt.includes(type)) {
    return fileTypeIconMap.txt
  }
  else if (video.includes(type)) {
    return fileTypeIconMap.video
  }
  else {
    return fileTypeIconMap.unknown
  }
}

// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0)
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0)
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled
})

const _fileList = ref<UploadUserFileItem[]>([...props.modelValue])

function emitModelValue() {
  emit('update:modelValue', [..._fileList.value])
}

function triggerFormValidate() {
  if (formItemContext?.prop) {
    formContext?.validateField([formItemContext.prop as string])
  }
}

// 监听 props.fileList 列表默认值改变
watch(
  () => props.modelValue,
  (n: UploadUserFileItem[]) => {
    _fileList.value = [...n]
  },
  { immediate: true },
)

// 预览的图片
const previewImages = computed(() => {
  return _fileList.value.filter(e => isImage(e)).map(v => v.url!)
})

const sortableInstance = ref<Sortable | null>(null)
// 拖拽
const uploader = ref()
watch(
  [() => props.draggable, self_disabled],
  ([draggable, disabled]) => {
    if (draggable && !disabled) {
      nextTick(() => {
        rowDrop()
      })
      return
    }
    sortableInstance.value?.destroy()
    sortableInstance.value = null
  },
  { immediate: true },
)
onBeforeUnmount(() => {
  sortableInstance.value?.destroy()
  sortableInstance.value = null
})
function rowDrop() {
  const itemBox = uploader.value?.$el.querySelector('.el-upload-list')
  if (!itemBox) { return }

  sortableInstance.value?.destroy()
  sortableInstance.value = Sortable.create(itemBox, {
    handle: '.el-upload-list__item',
    animation: 200,
    ghostClass: 'ghost',
    onEnd(param: any) {
      const newIndex = param.newIndex
      const oldIndex = param.oldIndex
      if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') {
        return
      }
      const tableData = _fileList.value
      const currRow = tableData.splice(oldIndex, 1)[0]!
      tableData.splice(newIndex, 0, currRow)
      emitModelValue()
    },
  })
}

function getFileType(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase()
  return ext ? `.${ext}` : ''
}

function getFileTypeFromUrl(url?: string) {
  if (!url) { return '' as FileType | '' }
  const cleanUrl = url.split(/[?#]/)[0] || url
  return getFileType(cleanUrl) as FileType | ''
}
function getFileTypeFromMime(mime?: string) {
  if (!mime) { return '' as FileType | '' }
  const mimeType = mime.toLowerCase()
  if (mimeType.startsWith('image/')) { return '.jpg' }
  if (mimeType.startsWith('video/')) { return '.mp4' }
  if (mimeType.includes('pdf')) { return '.pdf' }
  if (mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) { return '.docx' }
  if (mimeType.includes('excel') || mimeType.includes('spreadsheetml') || mimeType.includes('csv')) { return '.xlsx' }
  if (mimeType.includes('powerpoint') || mimeType.includes('presentationml')) { return '.pptx' }
  if (mimeType.startsWith('text/') || mimeType.includes('json') || mimeType.includes('xml')) { return '.txt' }
  return '' as FileType | ''
}
function resolveFileType(file?: FileTypeSource) {
  const typeByName = getFileType(file?.name || '')
  if (typeByName) { return typeByName as FileType }
  const typeByUrl = getFileTypeFromUrl(file?.url)
  if (typeByUrl) { return typeByUrl as FileType }
  return getFileTypeFromMime(file?.type || file?.raw?.type) as FileType | ''
}
/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const type = getFileType(rawFile.name) || getFileTypeFromMime(rawFile.type)
  const normalizedType = type.toLowerCase() as FileType
  const normalizedAllowType = props.fileType.map(v => v.toLowerCase()) as FileType[]
  // 限制文件类型，防止绕过 accept
  const isType = !normalizedAllowType.length || normalizedAllowType.includes(normalizedType)
  if (!isType) {
    notifyWarning('上传文件不符合所需的格式！')
    return false
  }

  // 限制文件大小
  const sizeValid = rawFile.size / 1024 / 1024 <= props.fileSize
  if (!sizeValid) {
    notifyWarning(`上传文件大小不能超过 ${props.fileSize}M！`)
    return false
  }

  return true
}

/**
 * @description 文件上传
 * @param options upload 所有配置项
 */
async function handleHttpUpload(options: UploadRequestOptions) {
  try {
    if (!props.api) {
      notifyMissingApi(options, '请先配置文件上传接口 api')
      return
    }
    const res = await props.api(options, {
      onUploadProgress: (e: any) => {
        const total = e.total || 1
        const percent = Number.parseInt(`${((e.loaded / total) * 100) | 0}`, 10)
        e.percent = percent
        options.onProgress(e)
        // options.onProgress({ percent: percent })
      },
    })
    options.onSuccess(res)
  }
  catch (error) {
    options.onError(error as any)
  }
}

/**
 * @description 文件上传成功
 * @param response 上传响应结果
 * @param uploadFile 上传的文件
 */
interface UploadEmits {
  (e: 'update:modelValue', value: UploadUserFileItem[]): void
}
function uploadSuccess(response: { fileUrl?: string, id?: string } | undefined, uploadFile: UploadFileItem) {
  if (!response) { return }
  if (!response.fileUrl) {
    notifyError('上传成功但未返回文件地址')
    _fileList.value = _fileList.value.filter(item => item.uid !== uploadFile.uid)
    emitModelValue()
    return
  }

  uploadFile.id = response.id
  uploadFile.url = response.fileUrl

  emitModelValue()
  // 上传成功后与表单校验态保持一致。
  triggerFormValidate()
  notifySuccess('文件上传成功！')
}

/**
 * @description 删除文件
 * @param file 删除的文件
 */
function handleRemove(file: UploadFile) {
  _fileList.value = _fileList.value.filter((item) => {
    if (item.uid && file.uid) {
      return item.uid !== file.uid
    }
    return item.url !== file.url || item.name !== file.name
  })
  emitModelValue()
  triggerFormValidate()
}

/**
 * @description 下载文件
 * @param file 下载的文件
 */
function handleDownload(file: UploadUserFileItem) {
  const downloadApi = props.downloadApi
  if (downloadApi) {
    useDownload({
      api: () => downloadApi({ id: file.id || '', name: file.name, url: file.url }),
      fileName: file.name,
    })
    return
  }

  if (file.url) {
    downloadFileByUrl({
      url: file.url,
      fileName: file.name,
      onError: message => notifyError(message || '下载失败'),
    })
    return
  }

  notifyWarning('未找到可下载的文件地址')
}

/**
 * @description 文件上传错误
 */
function uploadError() {
  notifyError('文件上传失败，请您重新上传！')
}

/**
 * @description 文件数超出
 */
function handleExceed() {
  notifyWarning(`当前最多只能上传 ${props.limit} 个文件，请移除后上传！`)
}

// /**
//  * @description 文件预览
//  * @param file 预览的文件
//  */
// const previewFileRef = ref<InstanceType<typeof PreviewFile>>()
// const handlePreview: UploadProps['onPreview'] = (file) => {
//   previewFileRef.value?.openUrl(file.url!, file.name)
// }
//
</script>

<template>
  <div class="upload-box">
    <template v-if="self_disabled && !_fileList?.length">
      --
    </template>
    <ElUpload
      ref="uploader"
      v-model:file-list="_fileList"
      action="#"
      list-type="picture"
      class="upload" :class="[self_disabled ? 'disabled' : '', drag ? 'no-border' : '']"
      :multiple="true"
      :disabled="self_disabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :drag="drag"
      :accept="fileType.join(',')"
    >
      <slot v-if="!self_disabled">
        <!-- 默认插槽 -->
        <div>
          <template v-if="drag">
            <ElIcon class="el-icon--upload">
              <BaseIcon name="i-ep:upload-filled" />
            </ElIcon>
            <div class="el-upload__text">
              拖拽或<em>点击上传</em>
            </div>
          </template>
          <template v-else>
            <ElButton type="primary" :disabled="disabled">
              点击上传
            </ElButton>
          </template>
        </div>
      </slot>

      <!-- <div class="upload-empty">
				<slot name="empty">
					<el-icon><BaseIcon name="i-ep:plus" /></el-icon>
				</slot>
			</div> -->
      <template #file="{ file }">
        <div class="upload__item">
          <div class="upload__item-content">
            <!-- 图片/图标 -->
            <ElImage
              class="upload__item-image"
              :src="getIcon(file)"
              fit="cover"
              :preview-src-list="isImage(file) ? previewImages : void 0"
              :initial-index="previewImages.findIndex(n => n === file.url)"

              append-to-body hide-on-click-modal preview-teleported
              :z-index="9999"
            >
              <template #placeholder>
                <div class="upload__item-image-slot">
                  Loading...
                </div>
              </template>
            </ElImage>
            <div class="center-content">
              <div class="center_content_ellipsis" :class="{ 'image-name': isImage(file) }">
                {{ file.name }}
              </div>
            </div>
            <!-- 操作 -->
            <div class="upload__item-handle" @click.stop>
              <ElSpace :size="10" spacer="|">
                <!-- 预览 -->
                <!-- <div class="upload__item-handle-icon" @click="handlePreview(file)">
                  <ElIcon><BaseIcon name="i-ep:view" /></ElIcon>
                </div> -->
                <!-- 下载 -->
                <div class="upload__item-handle-icon" @click="handleDownload(file as UploadUserFileItem)">
                  <ElIcon><BaseIcon name="i-ep:download" /></ElIcon>
                </div>
                <!-- 删除 -->
                <div v-if="!self_disabled" class="upload__item-handle-icon" @click="handleRemove(file)">
                  <ElIcon><BaseIcon name="i-ep:delete" /></ElIcon>
                </div>
              </ElSpace>
            </div>
          </div>
          <!-- 上传进度条 -->
          <div v-if="file.status === 'ready' || file.status === 'uploading'" class="upload__item-progress">
            <ElProgress :percentage="file.percentage" :text-inside="true" :stroke-width="16" />
          </div>
        </div>
      </template>

      <template #tip>
        <slot name="tip">
          <div v-if="tip" class="el-upload__tip">
            {{ tip }}
          </div>
        </slot>
      </template>
    </ElUpload>

    <!-- <PreviewFile ref="previewFileRef" /> -->
  </div>
</template>

<style scoped lang="scss">
// 异常时样式
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

// 禁用样式
:deep(.disabled) {
  .el-upload--picture-card,
  .el-upload-dragger {
    display: none; // 隐藏
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);

    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }

  .el-upload__tip {
    display: none; // 隐藏
  }
}

.upload-box {
  width: 100%;

  .no-border {
    :deep(.el-upload--picture-card) {
      border: none !important;
    }
  }

  .upload__item {
    width: 100%;
    height: 100%;

    &-content {
      display: flex;
      align-items: center;

      .upload__item-image {
        width: 60px;
        height: 60px;

        // object-fit: contain;
        // margin-right: 10px;

        .upload__item-image-slot {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 12px;
        }
      }

      .upload__item-handle {
        box-sizing: border-box;
        display: flex;
        flex: 0;
        align-items: center;
        justify-content: right;
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: var(--el-transition-duration-fast);

        .upload__item-handle-icon {
          display: flex;
          align-items: center;
          justify-content: center;

          .el-icon {
            font-size: 20px;
          }
        }
      }
    }

    &-progress {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 0 10px;
      background-color: var(--el-overlay-color-lighter);
    }
  }
}

.center-content {
  flex: 1;
  margin: 0 10px;
  overflow: hidden;
}

.center_content_ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 修改默认样式，让组件居中
.el-upload-list--picture .el-progress {
  top: 0;
}

// 	:deep(.upload) {
// 		.el-upload-dragger {
// 			display: flex;
// 			align-items: center;
// 			justify-content: center;
// 			width: 100%;
// 			height: 100%;
// 			padding: 0;
// 			overflow: hidden;
// 			border: 1px dashed var(--el-border-color-darker);
// 			/* stylelint-disable-next-line value-keyword-case */
// 			border-radius: v-bind(borderRadius);
// 			&:hover {
// 				border: 1px dashed var(--el-color-primary);
// 			}
// 		}
// 		.el-upload-dragger.is-dragover {
// 			background-color: var(--el-color-primary-light-9);
// 			border: 2px dashed var(--el-color-primary) !important;
// 		}
// 		.el-upload-list__item,
// 		.el-upload--picture-card {
// 			width: v-bind(width);
// 			height: v-bind(height);
// 			background-color: transparent;
// 			/* stylelint-disable-next-line value-keyword-case */
// 			border-radius: v-bind(borderRadius);
// 		}
// 		.el-upload-list__item {
// 			&:hover {
// 				.upload-handle {
// 					opacity: 1;
// 				}
// 			}
// 		}
// 		.upload-empty {
// 			display: flex;
// 			flex-direction: column;
// 			align-items: center;
// 			font-size: 12px;
// 			line-height: 30px;
// 			color: var(--el-color-info);
// 			.el-icon {
// 				font-size: 28px;
// 				color: var(--el-text-color-secondary);
// 			}
// 		}
// 	}
// 	.el-upload__tip {
// 		line-height: 15px;
// 		text-align: center;
// 	}
// }
</style>
