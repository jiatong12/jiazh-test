<script setup lang="ts">
import type { editor } from 'monaco-editor'
import { ensureJsonMonaco } from './monaco-json'
import { useMonacoEditorCore } from './useMonacoEditorCore'

interface BaseMonacoJsonEditorProps {
  options?: editor.IStandaloneEditorConstructionOptions
  path?: string
  placeholder?: string
  readonly?: boolean
  theme?: string
}

const props = withDefaults(defineProps<BaseMonacoJsonEditorProps>(), {
  options: () => ({}),
  path: '',
  placeholder: '',
  readonly: false,
  theme: '',
})

const emit = defineEmits<{
  markersChange: [markers: editor.IMarker[]]
  ready: [editor: editor.IStandaloneCodeEditor]
}>()

const modelValue = defineModel<string>({ default: '' })
const language = ref('json')

const editorCore = useMonacoEditorCore({
  language,
  loadMonaco: ensureJsonMonaco,
  modelValue,
  options: toRef(props, 'options'),
  path: toRef(props, 'path'),
  readonly: toRef(props, 'readonly'),
  theme: toRef(props, 'theme'),
  buildDefaultModelPath(editorId) {
    return `base-monaco-json-editor-${editorId}.json`
  },
  emitMarkersChange(markers) {
    emit('markersChange', markers)
  },
  emitReady(editorInstance) {
    emit('ready', editorInstance)
  },
})

defineExpose({
  focus: editorCore.focus,
  formatDocument: editorCore.formatDocument,
  getEditor: editorCore.getEditor,
  getModel: editorCore.getModel,
  layout: editorCore.layout,
})
</script>

<template>
  <div
    class="base-monaco-json-editor"
    :class="{ 'is-readonly': readonly }"
  >
    <div :ref="editorCore.containerRef" class="base-monaco-json-editor__container" />

    <div
      v-if="placeholder && !modelValue && !editorCore.isFocused"
      class="base-monaco-json-editor__placeholder"
    >
      {{ placeholder }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-monaco-json-editor {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  background-color: var(--el-bg-color);
  transition: border-color 0.2s ease;

  &.is-readonly {
    border-color: var(--el-border-color-light);
  }

  &:focus-within {
    border-color: var(--el-color-primary);
  }

  .base-monaco-json-editor__container {
    width: 100%;
    height: 100%;
  }

  .base-monaco-json-editor__placeholder {
    position: absolute;
    top: 14px;
    left: 54px;
    z-index: 1;
    color: var(--el-text-color-placeholder);
    font-size: 14px;
    pointer-events: none;
  }
}
</style>
