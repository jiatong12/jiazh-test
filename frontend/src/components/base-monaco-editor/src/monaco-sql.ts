import type * as Monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

let workerReady = false
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
    getWorker() {
      return new EditorWorker()
    },
  }

  workerReady = true
}

async function loadSqlMonaco() {
  await import('monaco-editor/esm/nls.messages.zh-cn.js')
  await import('monaco-editor/min/vs/editor/editor.main.css')

  const [monaco] = await Promise.all([
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/editor/editor.api'),
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/basic-languages/sql/sql.contribution'),
  ])

  ensureMonacoEnvironment()

  return monaco as typeof Monaco
}

export function ensureSqlMonaco() {
  monacoPromise ??= loadSqlMonaco()
  return monacoPromise
}
