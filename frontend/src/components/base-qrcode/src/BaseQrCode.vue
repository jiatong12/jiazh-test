<script setup lang="ts">
import type { FileExtension, Options } from 'qr-code-styling'
import type { BaseQrCodeLogo, BaseQrCodeLogoConfig, BaseQrCodeProps, BaseQrCodeThemePalette } from './types'
import { storeToRefs } from 'pinia'
import QRCodeStyling from 'qr-code-styling'
import { useGlobalStore } from '@/store/modules/global'
import { getCssVar } from '@/utils/color'
import { getBaseQrCodePresetOptions } from './presets'

const FALLBACK_THEME: BaseQrCodeThemePalette = {
  primary: '#409eff',
  primaryLight: '#79bbff',
  primaryDark: '#337ecc',
}

const props = withDefaults(defineProps<BaseQrCodeProps>(), {
  size: 300,
  type: 'svg',
  shape: 'square',
  margin: 10,
  errorCorrectionLevel: 'H',
  preset: 'default',
  themeAware: false,
  logo: false,
  className: '',
})

const emit = defineEmits<{
  (e: 'ready', instance: QRCodeStyling): void
}>()

const qrMountRef = useTemplateRef<HTMLDivElement>('qrMountRef')
const qrInstance = shallowRef<QRCodeStyling | null>(null)

const globalStore = useGlobalStore()
const { primary, isDark } = storeToRefs(globalStore)

const themeTrigger = computed(() => {
  if (!props.themeAware) { return '' }
  return `${primary.value}-${isDark.value}`
})

function isDataUrl(url?: string) {
  return !!url && url.startsWith('data:')
}

function encodeUtf8BinaryString(value: string) {
  const bytes = new TextEncoder().encode(value)
  let result = ''
  for (const byte of bytes) {
    result += String.fromCharCode(byte)
  }
  return result
}

function readThemePalette(): BaseQrCodeThemePalette {
  if (!props.themeAware) { return FALLBACK_THEME }

  // 依赖全局主题状态，保证主题切换时二维码能重新计算配色
  void themeTrigger.value

  return {
    primary: getCssVar('--el-color-primary').trim() || FALLBACK_THEME.primary,
    primaryLight: getCssVar('--el-color-primary-light-3').trim() || FALLBACK_THEME.primaryLight,
    primaryDark: getCssVar('--el-color-primary-dark-2').trim() || FALLBACK_THEME.primaryDark,
  }
}

function resolveLogo(logo: BaseQrCodeLogo): BaseQrCodeLogoConfig | undefined {
  if (!logo) { return undefined }
  if (typeof logo === 'string') {
    const src = logo.trim()
    return src ? { src } : undefined
  }
  const src = logo.src?.trim()
  if (!src) { return undefined }
  return {
    src,
    size: logo.size,
    margin: logo.margin,
    hideBackgroundDots: logo.hideBackgroundDots,
    saveAsBlob: logo.saveAsBlob,
    crossOrigin: logo.crossOrigin,
  }
}

function mergeOptions(...sources: Array<Partial<Options> | undefined>) {
  let result: Partial<Options> = {}
  for (const source of sources) {
    if (!source) { continue }

    result = {
      ...result,
      ...source,
      qrOptions: {
        ...(result.qrOptions || {}),
        ...(source.qrOptions || {}),
      },
      dotsOptions: {
        ...(result.dotsOptions || {}),
        ...(source.dotsOptions || {}),
      },
      cornersSquareOptions: {
        ...(result.cornersSquareOptions || {}),
        ...(source.cornersSquareOptions || {}),
      },
      cornersDotOptions: {
        ...(result.cornersDotOptions || {}),
        ...(source.cornersDotOptions || {}),
      },
      backgroundOptions: {
        ...(result.backgroundOptions || {}),
        ...(source.backgroundOptions || {}),
      },
      imageOptions: {
        ...(result.imageOptions || {}),
        ...(source.imageOptions || {}),
      },
    }
  }
  return result
}

const qrOptions = computed<Partial<Options>>(() => {
  const width = props.width ?? props.size
  const height = props.height ?? props.size
  const logo = resolveLogo(props.logo)
  const presetOptions = getBaseQrCodePresetOptions(props.preset, readThemePalette())

  const simpleOptions: Partial<Options> = {
    width,
    height,
    type: props.type,
    shape: props.shape,
    margin: props.margin,
    // 统一以 UTF-8 字节写入，保证中文扫码结果不乱码
    data: encodeUtf8BinaryString(props.value),
    qrOptions: {
      errorCorrectionLevel: props.errorCorrectionLevel,
    },
  }

  const logoOptions: Partial<Options> = {
    image: logo?.src || '',
    imageOptions: {
      hideBackgroundDots: logo?.hideBackgroundDots ?? presetOptions.imageOptions?.hideBackgroundDots ?? true,
      imageSize: logo?.size ?? presetOptions.imageOptions?.imageSize ?? 0.24,
      margin: logo?.margin ?? presetOptions.imageOptions?.margin ?? 4,
      crossOrigin: logo?.crossOrigin ?? presetOptions.imageOptions?.crossOrigin ?? 'anonymous',
      saveAsBlob: logo?.src && isDataUrl(logo.src)
        ? false
        : (logo?.saveAsBlob ?? presetOptions.imageOptions?.saveAsBlob ?? false),
    },
  }

  return mergeOptions(
    presetOptions,
    simpleOptions,
    logoOptions,
    props.advancedOptions,
  )
})

function renderQrCode() {
  const mountEl = qrMountRef.value
  if (!mountEl) { return }

  if (!qrInstance.value) {
    mountEl.innerHTML = ''
    qrInstance.value = new QRCodeStyling(qrOptions.value)
    qrInstance.value.append(mountEl)
    emit('ready', qrInstance.value)
    return
  }

  qrInstance.value.update(qrOptions.value)
}

function download(fileName?: string, extension: FileExtension = 'png') {
  if (!qrInstance.value) { return Promise.resolve() }
  return qrInstance.value.download({
    name: fileName || `qrcode-${Date.now()}`,
    extension,
  })
}

async function getDataUrl(): Promise<string | undefined> {
  if (!qrInstance.value) { return undefined }
  const blob = await qrInstance.value.getRawData('png')
  if (!blob || typeof blob === 'string') { return undefined }
  const blobData = blob as Blob
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blobData)
  })
}

async function getBlob(): Promise<Blob | undefined> {
  if (!qrInstance.value) { return undefined }
  const result = await qrInstance.value.getRawData('png')
  if (!result || typeof result === 'string') { return undefined }
  return result as Blob
}

defineExpose({
  download,
  getDataUrl,
  getBlob,
  getInstance: () => qrInstance.value,
})

watch(qrOptions, () => {
  renderQrCode()
}, { deep: true })

onMounted(() => {
  renderQrCode()
})

onBeforeUnmount(() => {
  if (qrMountRef.value) {
    qrMountRef.value.innerHTML = ''
  }
  qrInstance.value = null
})
</script>

<template>
  <div ref="qrMountRef" :class="className" />
</template>
