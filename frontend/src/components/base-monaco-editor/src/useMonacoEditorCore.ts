import type { editor, IDisposable } from 'monaco-editor'
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/store/modules/global'

let editorSeed = 0

export const defaultEditorOptions: editor.IStandaloneEditorConstructionOptions = {
  allowOverflow: true,
  automaticLayout: true,
  fixedOverflowWidgets: true,
  fontSize: 14,
  lineNumbersMinChars: 3,
  minimap: { enabled: false },
  parameterHints: { enabled: true },
  quickSuggestions: {
    comments: false,
    other: true,
    strings: true,
  },
  quickSuggestionsDelay: 120,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  snippetSuggestions: 'inline',
  suggestOnTriggerCharacters: true,
  tabCompletion: 'on',
  tabSize: 2,
  wordWrap: 'on',
}

interface UseMonacoEditorCoreOptions {
  language: Ref<string>
  loadMonaco: (language: string) => Promise<typeof import('monaco-editor')>
  modelValue: Ref<string>
  options: Ref<editor.IStandaloneEditorConstructionOptions>
  path: Ref<string>
  readonly: Ref<boolean>
  theme: Ref<string>
  buildDefaultModelPath?: (editorId: number, language: string) => string
  emitMarkersChange: (markers: editor.IMarker[]) => void
  emitReady: (editor: editor.IStandaloneCodeEditor) => void
}

function buildDefaultModelPath(editorId: number, language: string) {
  return `base-monaco-editor-${editorId}.${language || 'txt'}`
}

export function useMonacoEditorCore(options: UseMonacoEditorCoreOptions) {
  const containerRef = ref<HTMLElement>()
  const monacoRef = shallowRef<typeof import('monaco-editor') | null>(null)
  const editorRef = shallowRef<editor.IStandaloneCodeEditor | null>(null)
  const editorModelRef = shallowRef<editor.ITextModel | null>(null)
  const isFocused = ref(false)
  const syncingModelValue = ref(false)
  const editorId = ++editorSeed
  const editorDisposables: IDisposable[] = []
  let disposed = false

  const globalStore = useGlobalStore()
  const { isDark } = storeToRefs(globalStore)

  const resolvedTheme = computed(() => {
    return options.theme.value || (isDark.value ? 'vs-dark' : 'vs')
  })

  const resolvedOptions = computed<editor.IStandaloneEditorConstructionOptions>(() => {
    return {
      ...defaultEditorOptions,
      ...options.options.value,
      readOnly: options.readonly.value,
    }
  })

  function clearEditorDisposables() {
    while (editorDisposables.length) {
      editorDisposables.pop()?.dispose()
    }
  }

  function buildModelUri(path = options.path.value, language = options.language.value) {
    const monaco = monacoRef.value
    if (!monaco) {
      return null
    }

    // path 作为虚拟文件标识，让 Monaco 能区分不同文档模型。
    if (path) {
      const normalizedPath = path.replace(/^\/+/, '').replace(/\\/g, '/')
      return monaco.Uri.parse(`inmemory://model/${normalizedPath}?instance=${editorId}`)
    }

    const fallbackPath = options.buildDefaultModelPath?.(editorId, language)
      ?? buildDefaultModelPath(editorId, language)
    return monaco.Uri.parse(`inmemory://model/${fallbackPath}`)
  }

  function getOrCreateEditorModel(value: string, language = options.language.value, path = options.path.value) {
    const monaco = monacoRef.value
    const modelUri = buildModelUri(path, language)
    if (!monaco || !modelUri) {
      return null
    }

    const editorModel = monaco.editor.getModel(modelUri)
      ?? monaco.editor.createModel(value, language, modelUri)

    if (editorModel.getValue() !== value) {
      editorModel.setValue(value)
    }

    monaco.editor.setModelLanguage(editorModel, language)
    return editorModel
  }

  function emitMarkers() {
    const monaco = monacoRef.value
    const model = editorModelRef.value
    if (!monaco || !model) {
      options.emitMarkersChange([])
      return
    }

    // 父层通过事件直接拿到诊断，避免再次依赖 monaco 运行时查询 markers。
    options.emitMarkersChange(monaco.editor.getModelMarkers({ resource: model.uri }))
  }

  function syncValueFromOutside(nextValue: string) {
    const currentModel = editorModelRef.value
    if (!currentModel || currentModel.getValue() === nextValue) {
      return
    }

    syncingModelValue.value = true
    const viewState = editorRef.value?.saveViewState()
    currentModel.setValue(nextValue)
    if (viewState) {
      editorRef.value?.restoreViewState(viewState)
    }
    syncingModelValue.value = false
    emitMarkers()
  }

  function setEditorModel(nextValue: string, nextLanguage = options.language.value, nextPath = options.path.value) {
    const editorInstance = editorRef.value
    if (!editorInstance) {
      return
    }

    const previousModel = editorModelRef.value
    const nextModel = getOrCreateEditorModel(nextValue, nextLanguage, nextPath)
    if (!nextModel || previousModel === nextModel) {
      return
    }

    // 切换示例或文件时保留视口状态，避免光标和滚动位置突变。
    const viewState = editorInstance.saveViewState()
    editorInstance.setModel(nextModel)
    editorModelRef.value = nextModel

    if (viewState) {
      editorInstance.restoreViewState(viewState)
    }

    if (previousModel && previousModel !== nextModel) {
      previousModel.dispose()
    }

    emitMarkers()
  }

  let modelUpdateSeed = 0

  async function syncEditorModel(nextValue: string, nextLanguage = options.language.value, nextPath = options.path.value) {
    const editorInstance = editorRef.value
    if (!editorInstance) {
      return
    }

    const updateId = ++modelUpdateSeed
    const monaco = await options.loadMonaco(nextLanguage)
    if (disposed || updateId !== modelUpdateSeed || !editorRef.value) {
      return
    }

    monacoRef.value = monaco
    setEditorModel(nextValue, nextLanguage, nextPath)
  }

  async function formatDocument() {
    await editorRef.value?.getAction('editor.action.formatDocument')?.run()
  }

  function focus() {
    editorRef.value?.focus()
  }

  function layout() {
    editorRef.value?.layout()
  }

  function getEditor() {
    return editorRef.value
  }

  function getModel() {
    return editorModelRef.value
  }

  watch(options.modelValue, (nextValue) => {
    if (syncingModelValue.value) {
      return
    }

    syncValueFromOutside(nextValue)
  })

  watch(resolvedTheme, (nextTheme) => {
    monacoRef.value?.editor.setTheme(nextTheme)
  })

  watch(resolvedOptions, (nextOptions) => {
    editorRef.value?.updateOptions(nextOptions)
  }, { deep: true })

  watch(
    () => [options.path.value, options.language.value] as const,
    ([nextPath, nextLanguage], [prevPath, prevLanguage]) => {
      if (!editorRef.value || (nextPath === prevPath && nextLanguage === prevLanguage)) {
        return
      }

      void syncEditorModel(options.modelValue.value, nextLanguage, nextPath)
    },
  )

  onMounted(() => {
    const mountEditor = async () => {
      if (!containerRef.value) {
        return
      }

      const monaco = await options.loadMonaco(options.language.value)
      if (disposed || !containerRef.value) {
        return
      }

      monacoRef.value = monaco
      monaco.editor.setTheme(resolvedTheme.value)

      const editorModel = getOrCreateEditorModel(options.modelValue.value)
      if (!editorModel) {
        return
      }

      const editorInstance = monaco.editor.create(containerRef.value, {
        ...resolvedOptions.value,
        model: editorModel,
      })

      editorModelRef.value = editorModel
      editorRef.value = editorInstance

      editorDisposables.push(
        editorInstance.onDidFocusEditorText(() => {
          isFocused.value = true
        }),
        editorInstance.onDidBlurEditorText(() => {
          isFocused.value = false
        }),
        editorInstance.onDidChangeModelContent(() => {
          if (syncingModelValue.value) {
            return
          }

          const nextValue = editorInstance.getValue()
          if (nextValue !== options.modelValue.value) {
            options.modelValue.value = nextValue
          }
          emitMarkers()
        }),
        editorInstance.onDidChangeModel(() => {
          emitMarkers()
        }),
        monaco.editor.onDidChangeMarkers(() => {
          emitMarkers()
        }),
      )

      emitMarkers()
      options.emitReady(editorInstance)
    }

    void mountEditor()
  })

  onBeforeUnmount(() => {
    disposed = true
    clearEditorDisposables()
    editorRef.value?.dispose()
    editorModelRef.value?.dispose()
    editorRef.value = null
    editorModelRef.value = null
    monacoRef.value = null
  })

  return {
    containerRef,
    focus,
    formatDocument,
    getEditor,
    getModel,
    isFocused,
    layout,
  }
}
