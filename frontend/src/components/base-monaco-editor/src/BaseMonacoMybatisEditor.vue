<script setup lang="ts">
import type { editor, IDisposable } from 'monaco-editor'
import { ensureMybatisMonaco } from './monaco-mybatis'
import { useMonacoEditorCore } from './useMonacoEditorCore'

interface BaseMonacoMybatisEditorProps {
  options?: editor.IStandaloneEditorConstructionOptions
  path?: string
  placeholder?: string
  readonly?: boolean
  theme?: string
}

const props = withDefaults(defineProps<BaseMonacoMybatisEditorProps>(), {
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
const language = ref('mybatis')
const suggestDisposables = shallowRef<IDisposable[]>([])
let suggestTimer: ReturnType<typeof setTimeout> | null = null
const editorOptions = computed<editor.IStandaloneEditorConstructionOptions>(() => {
  const mergedSuggest = {
    showSnippets: true,
    showWords: false,
    snippetsPreventQuickSuggestions: false,
    ...(props.options.suggest ?? {}),
  }

  return {
    autoClosingBrackets: 'languageDefined',
    autoClosingQuotes: 'languageDefined',
    snippetSuggestions: 'top',
    suggestSelection: 'first',
    tabCompletion: 'onlySnippets',
    wordBasedSuggestions: 'off',
    ...props.options,
    suggest: mergedSuggest,
  }
})

const editorCore = useMonacoEditorCore({
  language,
  loadMonaco: ensureMybatisMonaco,
  modelValue,
  options: editorOptions,
  path: toRef(props, 'path'),
  readonly: toRef(props, 'readonly'),
  theme: toRef(props, 'theme'),
  buildDefaultModelPath(editorId) {
    return `base-monaco-mybatis-editor-${editorId}.xml`
  },
  emitMarkersChange(markers) {
    emit('markersChange', markers)
  },
  emitReady(editorInstance) {
    setupMybatisSuggest(editorInstance)
    emit('ready', editorInstance)
  },
})

function clearSuggestDisposables() {
  suggestDisposables.value.forEach(item => item.dispose())
  suggestDisposables.value = []
}

function clearSuggestTimer() {
  if (suggestTimer !== null) {
    clearTimeout(suggestTimer)
    suggestTimer = null
  }
}

function shouldTriggerSuggest(editorInstance: editor.IStandaloneCodeEditor) {
  const position = editorInstance.getPosition()
  const model = editorInstance.getModel()
  if (!position || !model) {
    return false
  }

  const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)

  return linePrefix.endsWith('<')
    || /\bmy[a-z]*$/i.test(linePrefix)
    || /<[a-z]+\s+[\w-]*$/i.test(linePrefix)
    || /[#$]\{[\w.]*$/.test(linePrefix)
    || /\b(?:resultMap|refid|parameterType|resultType|type|ofType|javaType|namespace|test|collection|item|index|property)\s*=\s*["'][^"']*$/i.test(linePrefix)
}

function setupMybatisSuggest(editorInstance: editor.IStandaloneCodeEditor) {
  clearSuggestDisposables()
  clearSuggestTimer()

  suggestDisposables.value = [
    editorInstance.onDidChangeModelContent((event) => {
      const lastChange = event.changes[event.changes.length - 1]
      if (!lastChange?.text) {
        return
      }

      if (!shouldTriggerSuggest(editorInstance)) {
        return
      }

      clearSuggestTimer()
      suggestTimer = setTimeout(() => {
        if (!shouldTriggerSuggest(editorInstance)) {
          return
        }

        editorInstance.trigger('mybatis', 'editor.action.triggerSuggest', {})
      }, 0)
    }),
  ]
}

onBeforeUnmount(() => {
  clearSuggestTimer()
  clearSuggestDisposables()
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
    class="base-monaco-mybatis-editor"
    :class="{ 'is-readonly': readonly }"
  >
    <div :ref="editorCore.containerRef" class="base-monaco-mybatis-editor__container" />

    <div
      v-if="placeholder && !modelValue && !editorCore.isFocused"
      class="base-monaco-mybatis-editor__placeholder"
    >
      {{ placeholder }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-monaco-mybatis-editor {
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

  .base-monaco-mybatis-editor__container {
    width: 100%;
    height: 100%;
  }

  .base-monaco-mybatis-editor__placeholder {
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
