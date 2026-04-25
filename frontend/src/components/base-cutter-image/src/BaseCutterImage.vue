<!--
  图片裁剪组件
  基于 vue-cropper 实现图片裁剪功能，支持实时预览
-->
<script lang="ts" setup>
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper'
import { useResettableState } from '@/hooks/useResettableState'
import 'vue-cropper/dist/index.css'

// 组件属性定义
interface Props {
  autoCropWidth?: number // 默认生成截图框宽度
  autoCropHeight?: number // 默认生成截图框高度
  fixed?: boolean // 是否开启截图框宽高固定比例
  fixedNumber?: string // 截图框的宽高比例
  outputType?: 'jpeg' | 'png' | 'webp' // 输出格式
  outputSize?: number // 生成图片的质量

  accept?: string // 限制的上传文件类型
  title?: string // 标题
  submitApi: (data: Blob) => Promise<any> // 上传 api
}

const props = withDefaults(defineProps<Props>(), {
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: '1:1', // 截图框的宽高比例

  accept: 'image/jpeg,image/png,image/webp',
  title: '图片裁剪',
})

const visible = ref(false)
const submitLoading = ref(false)
// 裁剪器实例引用
const cropperRef = useTemplateRef('cropperRef')

// 裁剪图片的地址
const img = ref('')

const [formData, resetFormData] = useResettableState(() => {
  const { autoCropWidth, autoCropHeight, fixed, fixedNumber } = props

  return {
    autoCropWidth, // 默认生成截图框宽度
    autoCropHeight, // 默认生成截图框高度
    fixed, // 是否开启截图框宽高固定比例
    fixedNumber,
  }
})

// 预设比例
const fixedNumberOptions = [
  [1, 1],
  [1, 2],
  [2, 1],
  [4, 3],
  [3, 4],
  [16, 9],
]
const fixedNumberDict = fixedNumberOptions.map((e) => {
  const str = e.join(':')
  return { label: str, value: str }
})
// 预设尺寸
const presetSizes = [
  [60, 60],
  [80, 60],
  [80, 80],
  [136, 96],
  [200, 100],
  [310, 230],
  [360, 270],
  [450, 250],
  [480, 270],
  // [700, 350],
  // [750, 1000],
  // [1200, 675],
]
const presetSizeDict = presetSizes.map((e) => {
  const str = e.join('x')
  return { label: str, value: str }
})

// 裁剪选项配置
const option = computed(() => {
  const { accept, title, submitApi, ...other } = props
  const result = {
    autoCrop: true, // 是否默认生成截图框
    full: true, // 是否输出原图比例截图
    canMove: true, // 上传图片是否可以移动
    canMoveBox: true, // 截图框能否拖动
    original: false, // 上传图片按照原始比例渲染
    centerBox: true, // 截图框是否被限制在图片里面
    infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    ...other,
    ...formData.value,
  }

  result.fixedNumber = result.fixedNumber.split(':') as any

  return result
})

/* 通过改变宽度来实现，fixed 和 fixedNumber 的触发 */
watch(() => [formData.value.fixed, formData.value.fixedNumber], () => {
  formData.value.autoCropWidth++
  nextTick(() => {
    formData.value.autoCropWidth--
  })
})

// 关闭弹框
function handleClose() {
  visible.value = false
  nextTick(() => {
    img.value = ''
    submitLoading.value = false
  })
}

// 确认裁剪
function handleConfirm() {
  cropperRef.value?.getCropBlob((data: Blob) => {
    submitLoading.value = true
    props.submitApi(data).then(() => {
      handleClose()
    }).finally(() => {
      submitLoading.value = false
    })
  })
}

// 修改图片大小 正数为变大 负数变小
function changeScale(num) {
  num = num || 1
  cropperRef.value?.changeScale(num)
}
// 向左边旋转90度
function rotateLeft() {
  cropperRef.value?.rotateLeft()
}
// 向右边旋转90度
function rotateRight() {
  cropperRef.value?.rotateRight()
}
// 上下翻转
function flipVertical() {
  cropperRef.value?.scaleY(-1)
}

// 左右翻转
function flipHorizontal() {
  cropperRef.value?.scaleX(-1)
}

// 上传图片处理
function beforeUpload(rawFile) {
  if (!rawFile.type.includes('image/')) {
    ElMessage.error('请上传图片类型文件!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('文件大小不能超过2MB!')
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onload = () => {
    // 图片在这里
    img.value = reader.result as string
  }
}

const toolDisabled = computed(() => !img.value || submitLoading.value)

const fixedDict = [{ label: '比例', value: true }, { label: '尺寸', value: false }]

function presetSizeProps(model) {
  return {
    'modelValue': `${model.autoCropWidth}x${model.autoCropHeight}`,
    'onUpdate:modelValue': (item) => {
      const arr = item.split('x')
      model.autoCropWidth = arr[0]
      model.autoCropHeight = arr[1]
    },
  }
}

function open() {
  resetFormData()
  visible.value = true
}

defineExpose({
  open,
})
</script>

<template>
  <BaseDialog
    v-model="visible"
    :title="title"
    width="900px"
    :show-fullscreen="false"
    @close="handleClose"
  >
    <div class="cutter-container">
      <!-- 左侧操作区域 -->
      <div class="cutter-left">
        <VueCropper
          ref="cropperRef"
          :img="img"
          v-bind="option"
          class="cropper-content"
        />
      </div>

      <!-- 右侧配置区域 -->
      <div class="cutter-right">
        <BaseForm :datasource="formData" label-position="top" :enabled-leave-check="false">
          <template #default="{ model }">
            <BaseFormItem label="高宽模式" prop="fixed" widget="radio" :dict="fixedDict" />
            <template v-if="model.fixed === false">
              <BaseFormItem label="宽度" prop="autoCropWidth" widget="number" />
              <BaseFormItem label="高度" prop="autoCropHeight" widget="number" />
              <BaseFormItem label="预设尺寸" :dict="presetSizeDict" widget="radio" :widget-props="presetSizeProps(model)" />
            </template>
            <template v-else>
              <BaseFormItem label="预设比例" prop="fixedNumber" :dict="fixedNumberDict" widget="radio" />
            </template>
          </template>
        </BaseForm>
      </div>
    </div>
    <div class="footer flex-justify-between mt-3">
      <div class="tools">
        <ElSpace>
          <ElUpload
            action="#"
            :http-request="() => { return null as any }"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :accept="accept"
          >
            <ElButton type="primary" :disabled="submitLoading">
              选择
            </ElButton>
          </ElUpload>

          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:plus')" @click="changeScale(1)" />
          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:minus')" @click="changeScale(-1)" />
          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:refresh-left')" @click="rotateLeft()" />
          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:refresh-right')" @click="rotateRight()" />
          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:arrow-up')" title="上下翻转" @click="flipVertical()" />
          <ElButton :disabled="toolDisabled" :icon="$$renderIcon('i-ep:arrow-left')" title="左右翻转" @click="flipHorizontal()" />
        </ElSpace>
      </div>

      <div>
        <ElButton v-loading="submitLoading" type="primary" @click="handleConfirm()">
          提 交
        </ElButton>
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.cutter-container {
  display: flex;
  height: 500px;

  .cutter-left {
    flex: 1;
    height: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    overflow: hidden;

    .cropper-content {
      width: 100%;
      height: 100%;
    }
  }

  .cutter-right {
    width: 300px;
    margin-left: 20px;
  }
}
</style>
