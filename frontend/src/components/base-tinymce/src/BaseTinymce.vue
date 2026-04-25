<script setup lang="ts">
import type { RawEditorOptions, Editor as TinyEditor } from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/wordcount'
import 'tinymce-i18n/langs6/zh-Hans.js'
import 'tinymce/plugins/help/js/i18n/keynav/en.js'
import 'tinymce/plugins/help/js/i18n/keynav/zh_CN.js'
import 'tinymce/skins/ui/oxide/skin.min.css'

const defaultPlugins = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'preview',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  'help',
  'wordcount',
]

const defaultToolbar = 'undo redo | blocks | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media table | removeformat code fullscreen'
const defaultMenubar = 'file edit view insert format tools table help'
const defaultContentStyle = 'body { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; font-size: 14px; line-height: 1.7; }'

const helpKeynavZhCnId = 'tinymce.html-i18n.help-keynav.zh_CN'
const helpKeynavZhHansId = 'tinymce.html-i18n.help-keynav.zh-Hans'
const helpKeynavZhCnContent = tinymce.Resource.get(helpKeynavZhCnId)
if (helpKeynavZhCnContent && !tinymce.Resource.has(helpKeynavZhHansId)) {
  tinymce.Resource.add(helpKeynavZhHansId, helpKeynavZhCnContent)
}

interface BaseTinymceProps {
  disabled?: boolean
  height?: number
  placeholder?: string
  options?: RawEditorOptions
}

interface TinyVueEditorInstance {
  rerender: (init: Record<string, any>) => void
  getEditor: () => TinyEditor | null
}

const props = withDefaults(defineProps<BaseTinymceProps>(), {
  disabled: false,
  height: 420,
  placeholder: '请输入内容',
})

const emit = defineEmits<{
  ready: [editor: TinyEditor]
}>()

const modelValue = defineModel<string>({ default: '' })
const editorRef = ref<TinyVueEditorInstance>()
const editorInstance = ref<TinyEditor | null>(null)

const mergedInit = computed<RawEditorOptions>(() => {
  const options = props.options ?? {}
  const resolvedPlugins = options.plugins ?? defaultPlugins
  const userSetup = options.setup

  return {
    ...options,
    height: props.height ?? options.height,
    language: options.language ?? 'zh-Hans',
    menubar: options.menubar ?? defaultMenubar,
    toolbar: typeof options.toolbar === 'string' ? options.toolbar : defaultToolbar,
    plugins: resolvedPlugins,
    placeholder: props.placeholder ?? options.placeholder,
    // 隐藏右上角更新
    promotion: options.promotion ?? false,
    // 隐藏右下角的 Powered by Tiny
    branding: options.branding ?? false,
    // 使用打包进来的 UI 皮肤，避免运行时再请求 skin 文件
    skin: options.skin ?? false,
    // 关闭内容区全局样式文件，避免把 body/table 等样式污染到业务页面
    content_css: options.content_css ?? false,
    content_style: options.content_style ?? defaultContentStyle,
    setup(editor) {
      editorInstance.value = editor
      editor.on('init', () => emit('ready', editor))
      if (typeof userSetup === 'function') {
        userSetup(editor)
      }
    },
  }
})

function getEditor() {
  return editorRef.value?.getEditor?.() ?? editorInstance.value
}

function rerender(init: Partial<RawEditorOptions>) {
  editorRef.value?.rerender?.(init as Record<string, any>)
}

defineExpose({
  getEditor,
  rerender,
})
</script>

<template>
  <Editor
    ref="editorRef"
    v-model="modelValue"
    :disabled="disabled"
    :init="mergedInit"
  />
</template>
