import type * as Monaco from 'monaco-editor'
import type { languages } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'

const EJS_LANGUAGE_ID = 'ejs'
const snippetMark = '$'
const ejsTagPrefixPattern = /<%?[#=_-]?$/
const ejsSnippetPrefixPattern = /\bejs[a-z]*$/i

interface EjsLanguageRegistrationStore {
  completionDisposable?: { dispose: () => void }
  htmlServiceDisposable?: { dispose: () => void }
  languageConfigDisposable?: { dispose: () => void }
  monarchDisposable?: { dispose: () => void }
}

function ejsSnippet(strings: TemplateStringsArray, ...placeholders: string[]) {
  return strings.reduce((result, part, index) => {
    const nextPlaceholder = placeholders[index]
    if (!nextPlaceholder) {
      return `${result}${part}`
    }

    return `${result}${part}${snippetMark}{${nextPlaceholder}}`
  }, '')
}

interface EjsLanguageDependencies {
  htmlConf: languages.LanguageConfiguration
  htmlLanguage: languages.IMonarchLanguage
  registerHTMLLanguageService: (
    languageId: string,
    options?: Record<string, any>,
    modeConfiguration?: Record<string, boolean>,
  ) => { dispose: () => void }
}

interface EjsSnippetDefinition {
  documentation: string
  insertText: string
  label: string
}

const ejsTagSuggestions = [
  {
    documentation: 'EJS 执行语句块',
    insertText: ejsSnippet`<% ${'1:// logic'} %>`,
    label: '<% %>',
  },
  {
    documentation: '输出转义后的内容',
    insertText: ejsSnippet`<%= ${'1:expression'} %>`,
    label: '<%= %>',
  },
  {
    documentation: '输出原始 HTML',
    insertText: ejsSnippet`<%- ${'1:html'} %>`,
    label: '<%- %>',
  },
  {
    documentation: 'EJS 注释块',
    insertText: ejsSnippet`<%# ${'1:comment'} %>`,
    label: '<%# %>',
  },
  {
    documentation: 'if 语句模板',
    insertText: ejsSnippet`<% if (${'1:condition'}) { %>
	$0
<% } %>`,
    label: 'if block',
  },
  {
    documentation: 'for...of 语句模板',
    insertText: ejsSnippet`<% for (const ${'1:item'} of ${'2:list'}) { %>
	$0
<% } %>`,
    label: 'for...of block',
  },
] as const

const ejsPrefixSuggestions: EjsSnippetDefinition[] = [
  {
    documentation: 'EJS 执行语句块',
    insertText: ejsSnippet`<% ${'1:// logic'} %>`,
    label: 'ejs',
  },
  {
    documentation: 'if 语句片段',
    insertText: ejsSnippet`<% if (${'1:condition'}) { %>
	$0
<% } %>`,
    label: 'ejsif',
  },
  {
    documentation: 'if / else 语句片段',
    insertText: ejsSnippet`<% if (${'1:condition'}) { %>
	${'2'}
<% } else { %>
	$0
<% } %>`,
    label: 'ejsifelse',
  },
  {
    documentation: '经典 for 循环片段',
    insertText: ejsSnippet`<% for (let ${'1:index'} = 0; ${'1:index'} < ${'2:list'}.length; ${'1:index'} += 1) { %>
	$0
<% } %>`,
    label: 'ejsfor',
  },
  {
    documentation: 'for...of 循环片段',
    insertText: ejsSnippet`<% for (const ${'1:item'} of ${'2:list'}) { %>
	$0
<% } %>`,
    label: 'ejsforof',
  },
  {
    documentation: '数组 forEach 循环片段',
    insertText: ejsSnippet`<% ${'1:list'}.forEach((${'2:item'}, ${'3:index'}) => { %>
	$0
<% }) %>`,
    label: 'ejseach',
  },
  {
    documentation: 'include 子模板片段',
    insertText: ejsSnippet`<%- include('${'1:partial'}', ${'2:data'}) %>`,
    label: 'ejsinc',
  },
  {
    documentation: '输出转义后的内容',
    insertText: ejsSnippet`<%= ${'1:expression'} %>`,
    label: 'ejsout',
  },
  {
    documentation: '输出原始 HTML',
    insertText: ejsSnippet`<%- ${'1:html'} %>`,
    label: 'ejsraw',
  },
  {
    documentation: 'EJS 注释块',
    insertText: ejsSnippet`<%# ${'1:comment'} %>`,
    label: 'ejscomment',
  },
]

const ejsBlockSuggestions = [
  {
    documentation: '输出转义后的内容',
    insertText: ejsSnippet`= ${'1:expression'} %>`,
    label: '= output',
  },
  {
    documentation: '输出原始 HTML',
    insertText: ejsSnippet`- ${'1:html'} %>`,
    label: '- raw output',
  },
  {
    documentation: 'if 语句片段',
    insertText: ejsSnippet`if (${'1:condition'}) { %>
	$0
<% }`,
    label: 'if',
  },
  {
    documentation: 'for...of 语句片段',
    insertText: ejsSnippet`for (const ${'1:item'} of ${'2:list'}) { %>
	$0
<% }`,
    label: 'for...of',
  },
  {
    documentation: '数组循环片段',
    insertText: ejsSnippet`${'1:list'}.forEach((${'2:item'}) => { %>
	$0
<% })`,
    label: 'forEach',
  },
  {
    documentation: '包含子模板',
    insertText: ejsSnippet`include('${'1:partial'}', ${'2:data'})`,
    label: 'include',
  },
  {
    documentation: '局部变量对象',
    insertText: 'locals',
    label: 'locals',
  },
] as const

const javascriptKeywordSuggestions = [
  'await',
  'const',
  'else',
  'false',
  'for',
  'if',
  'let',
  'null',
  'return',
  'true',
  'typeof',
]

let workerReady = false
let ejsLanguageReady = false
let monacoPromise: Promise<typeof Monaco> | null = null

function getRegistrationStore() {
  const target = globalThis as typeof globalThis & {
    __zvMonacoEjsRegistration__?: EjsLanguageRegistrationStore
  }

  target.__zvMonacoEjsRegistration__ ??= {}
  return target.__zvMonacoEjsRegistration__
}

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
      if (label === 'html' || label === 'handlebars' || label === 'razor' || label === EJS_LANGUAGE_ID) {
        return new HtmlWorker()
      }

      return new EditorWorker()
    },
  }

  workerReady = true
}

function getCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const word = model.getWordUntilPosition(position)

  return {
    endColumn: word.endColumn,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    startLineNumber: position.lineNumber,
  }
}

function getTagCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
  const prefixMatch = linePrefix.match(ejsTagPrefixPattern)
  const prefix = prefixMatch?.[0] ?? ''

  return {
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: position.column - prefix.length,
    startLineNumber: position.lineNumber,
  }
}

function getPrefixCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
  const prefixMatch = linePrefix.match(ejsSnippetPrefixPattern)
  const prefix = prefixMatch?.[0] ?? ''

  return {
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: position.column - prefix.length,
    startLineNumber: position.lineNumber,
  }
}

function getEjsOpenTag(text: string) {
  const tagPattern = /<%[#=_-]?|[-_]?%>/g
  const stack: string[] = []

  let match = tagPattern.exec(text)
  while (match) {
    const token = match[0]

    if (token.startsWith('<%')) {
      stack.push(token)
    }
    else if (stack.length) {
      stack.pop()
    }

    match = tagPattern.exec(text)
  }

  return stack[stack.length - 1] ?? ''
}

function registerEjsCompletions(monaco: typeof Monaco) {
  return monaco.languages.registerCompletionItemProvider(EJS_LANGUAGE_ID, {
    triggerCharacters: ['<', '%', '.', '#', '='],
    provideCompletionItems(model, position) {
      const textBeforeCursor = model.getValueInRange({
        endColumn: position.column,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        startLineNumber: 1,
      })
      const openTag = getEjsOpenTag(textBeforeCursor)
      const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)

      if (openTag === '<%#') {
        return { suggestions: [] }
      }

      if (openTag) {
        const range = getCompletionRange(model, position)
        const snippetSuggestions = ejsBlockSuggestions.map((item, index) => {
          return {
            detail: 'EJS',
            documentation: item.documentation,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Snippet,
            label: item.label,
            range,
            sortText: `0${index}`,
          }
        })
        const keywordSuggestions = javascriptKeywordSuggestions.map((item, index) => {
          return {
            detail: 'JavaScript',
            insertText: item,
            kind: monaco.languages.CompletionItemKind.Keyword,
            label: item,
            range,
            sortText: `1${index.toString().padStart(2, '0')}`,
          }
        })

        return {
          suggestions: [
            ...snippetSuggestions,
            ...keywordSuggestions,
          ],
        }
      }

      if (!ejsTagPrefixPattern.test(linePrefix)) {
        if (!ejsSnippetPrefixPattern.test(linePrefix)) {
          return { suggestions: [] }
        }

        const range = getPrefixCompletionRange(model, position)

        return {
          suggestions: ejsPrefixSuggestions.map((item, index) => {
            return {
              detail: 'EJS Snippet',
              documentation: item.documentation,
              filterText: item.label,
              insertText: item.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              kind: monaco.languages.CompletionItemKind.Snippet,
              label: item.label,
              range,
              sortText: `00${index.toString().padStart(2, '0')}`,
            }
          }),
        }
      }

      const range = getTagCompletionRange(model, position)

      return {
        suggestions: ejsTagSuggestions.map((item, index) => {
          return {
            detail: 'EJS',
            documentation: item.documentation,
            insertText: item.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            kind: monaco.languages.CompletionItemKind.Snippet,
            label: item.label,
            range,
            sortText: `0${index}`,
          }
        }),
      }
    },
  })
}

function ensureEjsLanguage(monaco: typeof Monaco, dependencies: EjsLanguageDependencies) {
  if (ejsLanguageReady) {
    return
  }

  const { htmlConf, htmlLanguage, registerHTMLLanguageService } = dependencies
  const registrationStore = getRegistrationStore()

  registrationStore.completionDisposable?.dispose()
  registrationStore.htmlServiceDisposable?.dispose()
  registrationStore.languageConfigDisposable?.dispose()
  registrationStore.monarchDisposable?.dispose()

  monaco.languages.register({
    aliases: ['EJS', 'ejs'],
    extensions: ['.ejs'],
    id: EJS_LANGUAGE_ID,
  })

  registrationStore.htmlServiceDisposable = registerHTMLLanguageService(
    EJS_LANGUAGE_ID,
    {
      data: { useDefaultDataProvider: true },
      format: {
        contentUnformatted: 'pre',
        endWithNewline: false,
        extraLiners: 'head, body, /html',
        indentHandlebars: false,
        indentInnerHtml: false,
        insertSpaces: false,
        maxPreserveNewLines: undefined,
        preserveNewLines: true,
        tabSize: 4,
        unformatted: 'default": "a, abbr, acronym, b, bdo, big, br, button, cite, code, dfn, em, i, img, input, kbd, label, map, object, q, samp, select, small, span, strong, sub, sup, textarea, tt, var',
        wrapAttributes: 'auto',
        wrapLineLength: 120,
      },
      suggest: {},
    },
    {
      colors: true,
      completionItems: true,
      diagnostics: false,
      documentFormattingEdits: true,
      documentHighlights: true,
      documentRangeFormattingEdits: true,
      documentSymbols: true,
      foldingRanges: true,
      hovers: true,
      links: true,
      rename: true,
      selectionRanges: true,
    },
  )

  const ejsConf: languages.LanguageConfiguration = {
    ...htmlConf,
    autoClosingPairs: [
      ...(htmlConf.autoClosingPairs ?? []),
      { close: '%>', open: '<%' },
      { close: '%>', open: '<%=' },
      { close: '%>', open: '<%-' },
      { close: '%>', open: '<%#' },
    ],
    brackets: [
      ['<%', '%>'],
      ...(htmlConf.brackets ?? []),
    ],
    comments: {
      ...htmlConf.comments,
      blockComment: ['<%#', '%>'],
    },
    surroundingPairs: [
      ...(htmlConf.surroundingPairs ?? []),
      { close: '%>', open: '<%' },
    ],
  }

  const ejsLanguage: languages.IMonarchLanguage = {
    ...htmlLanguage,
    tokenPostfix: '.ejs',
    tokenizer: {
      ...htmlLanguage.tokenizer,
      ejsComment: [
        [/(?:-|_)?%>/, 'comment.ejs', '@pop'],
        [/./, 'comment.ejs'],
      ],
      ejsEmbedded: [
        [/(?:-|_)?%>/, { next: '@pop', nextEmbedded: '@pop', token: 'delimiter.ejs' }],
        [/[^%]+/, ''],
        [/%(?!>)/, ''],
      ],
      otherTag: [
        [/<%#/, { next: '@ejsComment', token: 'comment.ejs' }],
        [/<%[=_-]?/, { next: '@ejsEmbedded', nextEmbedded: 'text/javascript', token: 'delimiter.ejs' }],
        ...(htmlLanguage.tokenizer.otherTag ?? []),
      ],
      root: [
        [/<%#/, { next: '@ejsComment', token: 'comment.ejs' }],
        [/<%[=_-]?/, { next: '@ejsEmbedded', nextEmbedded: 'text/javascript', token: 'delimiter.ejs' }],
        ...(htmlLanguage.tokenizer.root ?? []),
      ],
    },
  }

  registrationStore.languageConfigDisposable = monaco.languages.setLanguageConfiguration(EJS_LANGUAGE_ID, ejsConf)
  registrationStore.monarchDisposable = monaco.languages.setMonarchTokensProvider(EJS_LANGUAGE_ID, ejsLanguage)
  registrationStore.completionDisposable = registerEjsCompletions(monaco)

  ejsLanguageReady = true
}

async function loadEjsMonaco() {
  await import('monaco-editor/esm/nls.messages.zh-cn.js')
  await import('monaco-editor/min/vs/editor/editor.main.css')

  const [monaco, htmlBasicLanguage, htmlContribution] = await Promise.all([
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/editor/editor.api'),
    // 让 EJS 复用 HTML 基础语法定义。
    import('monaco-editor/esm/vs/basic-languages/html/html.js'),
    // 让 EJS 复用 HTML language service，并具备 HTML 标签补全、hover、folding 等能力。
    import('monaco-editor/esm/vs/language/html/monaco.contribution.js'),
    // EJS 的 <% %> 内部嵌入 JavaScript tokenization，需要先注册 JS 基础语言。
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution'),
  ])
  const htmlBasicLanguageModule = 'default' in htmlBasicLanguage ? htmlBasicLanguage.default : htmlBasicLanguage
  const htmlContributionModule = 'default' in htmlContribution ? htmlContribution.default : htmlContribution

  ensureMonacoEnvironment()
  ensureEjsLanguage(monaco as typeof Monaco, {
    htmlConf: (htmlBasicLanguageModule as { conf: languages.LanguageConfiguration }).conf,
    htmlLanguage: (htmlBasicLanguageModule as { language: languages.IMonarchLanguage }).language,
    registerHTMLLanguageService: (htmlContributionModule as { registerHTMLLanguageService: EjsLanguageDependencies['registerHTMLLanguageService'] }).registerHTMLLanguageService,
  })

  return monaco as typeof Monaco
}

export function ensureEjsMonaco() {
  monacoPromise ??= loadEjsMonaco()
  return monacoPromise
}
