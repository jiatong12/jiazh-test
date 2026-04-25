import type * as Monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

let workerReady = false
let javascriptDefaultsReady = false
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
      // Monaco 的 JavaScript 语言服务复用 TypeScript worker。
      if (label === 'javascript' || label === 'typescript') {
        return new TsWorker()
      }

      return new EditorWorker()
    },
  }

  workerReady = true
}

function ensureJavascriptDefaults(monaco: typeof Monaco) {
  if (javascriptDefaultsReady) {
    return
  }

  const {
    ModuleKind,
    ModuleResolutionKind,
    ScriptTarget,
    javascriptDefaults,
  } = monaco.typescript

  javascriptDefaults.setEagerModelSync(true)
  javascriptDefaults.setCompilerOptions({
    ...javascriptDefaults.getCompilerOptions(),
    allowJs: true,
    allowNonTsExtensions: true,
    checkJs: true,
    module: ModuleKind.ESNext,
    moduleResolution: ModuleResolutionKind.NodeJs,
    noEmit: true,
    target: ScriptTarget.Latest,
  })
  javascriptDefaults.setDiagnosticsOptions({
    ...javascriptDefaults.getDiagnosticsOptions(),
    noSemanticValidation: false,
    noSyntaxValidation: false,
    onlyVisible: false,
  })
  javascriptDefaults.setModeConfiguration({
    ...javascriptDefaults.modeConfiguration,
    codeActions: true,
    completionItems: true,
    definitions: true,
    diagnostics: true,
    documentHighlights: true,
    documentRangeFormattingEdits: true,
    documentSymbols: true,
    hovers: true,
    inlayHints: true,
    onTypeFormattingEdits: true,
    references: true,
    rename: true,
    signatureHelp: true,
  })

  javascriptDefaultsReady = true
}

async function loadJavascriptMonaco() {
  await import('monaco-editor/esm/nls.messages.zh-cn.js')
  await import('monaco-editor/min/vs/editor/editor.main.css')

  const [monaco, typescript] = await Promise.all([
    // Vite 可解析这些 Monaco ESM 子路径，但 TypeScript 不直接提供对应声明。
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/editor/editor.api'),
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/language/typescript/monaco.contribution'),
    // editor.api 不会像 editor.main 那样自动注册 JavaScript 的基础高亮能力。
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'),
  ])

  const monacoInstance = {
    ...monaco,
    typescript,
  } as typeof Monaco

  ensureMonacoEnvironment()
  ensureJavascriptDefaults(monacoInstance)

  return monacoInstance
}

export function ensureJavascriptMonaco() {
  monacoPromise ??= loadJavascriptMonaco()
  return monacoPromise
}
