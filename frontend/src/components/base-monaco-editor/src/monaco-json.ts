import type * as Monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

let workerReady = false
let jsonDefaultsReady = false
let monacoPromise: Promise<typeof Monaco> | null = null

function ensureMonacoEnvironment() {
  if (workerReady) {
    return
  }

  const target = globalThis as typeof globalThis & {
    MonacoEnvironment?: {
      getWorker: (_: string, label: string) => Worker
    }
  }

  target.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'json') {
        return new JsonWorker()
      }

      return new EditorWorker()
    },
  }

  workerReady = true
}

function ensureJsonDefaults(monaco: typeof Monaco) {
  if (jsonDefaultsReady) {
    return
  }

  monaco.json.jsonDefaults.setDiagnosticsOptions({
    ...monaco.json.jsonDefaults.diagnosticsOptions,
    allowComments: true,
    validate: true,
  })

  monaco.json.jsonDefaults.setModeConfiguration({
    ...monaco.json.jsonDefaults.modeConfiguration,
    colors: true,
    completionItems: true,
    diagnostics: true,
    documentFormattingEdits: true,
    documentRangeFormattingEdits: true,
    documentSymbols: true,
    foldingRanges: true,
    hovers: true,
    selectionRanges: true,
    tokens: true,
  })

  jsonDefaultsReady = true
}

async function loadJsonMonaco() {
  await import('monaco-editor/esm/nls.messages.zh-cn.js')
  await import('monaco-editor/min/vs/editor/editor.main.css')

  const [monaco, json] = await Promise.all([
    // Vite 可解析这些 Monaco ESM 子路径，但 TypeScript 不直接提供对应声明。
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/editor/editor.api'),
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/language/json/monaco.contribution'),
  ])

  const monacoInstance = {
    ...monaco,
    json,
  } as typeof Monaco

  ensureMonacoEnvironment()
  ensureJsonDefaults(monacoInstance)

  return monacoInstance
}

export function ensureJsonMonaco() {
  monacoPromise ??= loadJsonMonaco()
  return monacoPromise
}
