import type * as Monaco from 'monaco-editor'
import type { languages } from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

const MYBATIS_LANGUAGE_ID = 'mybatis'
const snippetMark = '$'
const mybatisExpressionPattern = /[#$]\{([^}]*)$/
const mybatisTagPrefixPattern = /<\/?[a-z]*$/i
const mybatisSnippetPrefixPattern = /\bmy[a-z]*$/i
const mybatisTypeAttributeNames = ['parameterType', 'resultType', 'type', 'ofType', 'javaType']
const mybatisExpressionKeywordSet = new Set(['and', 'eq', 'false', 'gt', 'gte', 'instanceof', 'lt', 'lte', 'ne', 'new', 'not', 'null', 'or', 'true'])
const defaultJavaTypeSuggestions = [
  'java.lang.String',
  'java.lang.Integer',
  'java.lang.Long',
  'java.lang.Boolean',
  'java.lang.Double',
  'java.math.BigDecimal',
  'java.time.LocalDate',
  'java.time.LocalDateTime',
  'java.util.Date',
  'java.util.List',
  'java.util.Map',
]

const mybatisAttributeSuggestionsMap: Record<string, MybatisSnippetDefinition[]> = {
  delete: [
    { description: '方法 id', documentation: 'delete 标签方法名', insertText: mybatisSnippet`id="${'1:methodName'}"`, label: 'id' },
    { description: '参数类型', documentation: 'delete 标签参数类型', insertText: mybatisSnippet`parameterType="${'1:com.example.command.DeleteCommand'}"`, label: 'parameterType' },
  ],
  foreach: [
    { description: '集合名', documentation: 'foreach 集合来源', insertText: mybatisSnippet`collection="${'1:list'}"`, label: 'collection' },
    { description: '循环项', documentation: 'foreach 当前项变量', insertText: mybatisSnippet`item="${'1:item'}"`, label: 'item' },
    { description: '索引变量', documentation: 'foreach 索引变量', insertText: mybatisSnippet`index="${'1:index'}"`, label: 'index' },
    { description: '前缀', documentation: 'foreach open 属性', insertText: mybatisSnippet`open="${'1:('}"`, label: 'open' },
    { description: '分隔符', documentation: 'foreach separator 属性', insertText: mybatisSnippet`separator="${'1:,'}"`, label: 'separator' },
    { description: '后缀', documentation: 'foreach close 属性', insertText: mybatisSnippet`close="${'1:)'}"`, label: 'close' },
  ],
  id: [
    { description: '对象属性', documentation: '主键映射属性名', insertText: mybatisSnippet`property="${'1:id'}"`, label: 'property' },
    { description: '列名', documentation: '主键映射列名', insertText: mybatisSnippet`column="${'1:id'}"`, label: 'column' },
  ],
  if: [
    { description: '条件表达式', documentation: 'if 标签 test 表达式', insertText: mybatisSnippet`test="${'1:condition'}"`, label: 'test' },
  ],
  include: [
    { description: '片段引用', documentation: 'include 引用 sql 片段', insertText: mybatisSnippet`refid="${'1:BaseColumns'}"`, label: 'refid' },
  ],
  insert: [
    { description: '方法 id', documentation: 'insert 标签方法名', insertText: mybatisSnippet`id="${'1:methodName'}"`, label: 'id' },
    { description: '参数类型', documentation: 'insert 标签参数类型', insertText: mybatisSnippet`parameterType="${'1:com.example.command.CreateCommand'}"`, label: 'parameterType' },
  ],
  mapper: [
    { description: '命名空间', documentation: 'mapper 对应 Java 接口全限定名', insertText: mybatisSnippet`namespace="${'1:com.example.mapper.DemoMapper'}"`, label: 'namespace' },
  ],
  result: [
    { description: '对象属性', documentation: '字段映射属性名', insertText: mybatisSnippet`property="${'1:name'}"`, label: 'property' },
    { description: '列名', documentation: '字段映射列名', insertText: mybatisSnippet`column="${'1:name'}"`, label: 'column' },
  ],
  resultMap: [
    { description: '映射 id', documentation: 'resultMap 唯一标识', insertText: mybatisSnippet`id="${'1:BaseResultMap'}"`, label: 'id' },
    { description: '结果类型', documentation: 'resultMap 对应结果对象类型', insertText: mybatisSnippet`type="${'1:com.example.dto.ResultDto'}"`, label: 'type' },
  ],
  select: [
    { description: '方法 id', documentation: 'select 标签方法名', insertText: mybatisSnippet`id="${'1:methodName'}"`, label: 'id' },
    { description: '结果映射', documentation: 'select 结果映射 resultMap', insertText: mybatisSnippet`resultMap="${'1:BaseResultMap'}"`, label: 'resultMap' },
    { description: '结果类型', documentation: 'select 结果类型 resultType', insertText: mybatisSnippet`resultType="${'1:com.example.dto.ResultDto'}"`, label: 'resultType' },
    { description: '参数类型', documentation: 'select 参数类型 parameterType', insertText: mybatisSnippet`parameterType="${'1:com.example.query.QueryCommand'}"`, label: 'parameterType' },
  ],
  sql: [
    { description: '片段 id', documentation: 'sql 片段唯一标识', insertText: mybatisSnippet`id="${'1:BaseColumns'}"`, label: 'id' },
  ],
  trim: [
    { description: '前缀', documentation: 'trim prefix 属性', insertText: mybatisSnippet`prefix="${'1:WHERE'}"`, label: 'prefix' },
    { description: '去除前缀', documentation: 'trim prefixOverrides 属性', insertText: mybatisSnippet`prefixOverrides="${'1:AND |OR '}"`, label: 'prefixOverrides' },
    { description: '后缀', documentation: 'trim suffix 属性', insertText: mybatisSnippet`suffix="${'1:SET'}"`, label: 'suffix' },
    { description: '去除后缀', documentation: 'trim suffixOverrides 属性', insertText: mybatisSnippet`suffixOverrides="${'1:,'}"`, label: 'suffixOverrides' },
  ],
  update: [
    { description: '方法 id', documentation: 'update 标签方法名', insertText: mybatisSnippet`id="${'1:methodName'}"`, label: 'id' },
    { description: '参数类型', documentation: 'update 标签参数类型', insertText: mybatisSnippet`parameterType="${'1:com.example.command.UpdateCommand'}"`, label: 'parameterType' },
  ],
  when: [
    { description: '条件表达式', documentation: 'when 标签 test 表达式', insertText: mybatisSnippet`test="${'1:condition'}"`, label: 'test' },
  ],
}

interface MybatisRegistrationStore {
  completionDisposables?: Array<{ dispose: () => void }>
  languageConfigDisposable?: { dispose: () => void }
  monarchDisposable?: { dispose: () => void }
}

interface MybatisLanguageDependencies {
  xmlConf: languages.LanguageConfiguration
  xmlLanguage: languages.IMonarchLanguage
}

interface MybatisSnippetDefinition {
  description?: string
  documentation: string
  insertText: string
  label: string
}

interface MybatisDocumentIndex {
  namespace: string
  parameterPaths: string[]
  propertyNames: string[]
  resultMapIds: string[]
  sqlIds: string[]
  statementIds: string[]
  typeNames: string[]
}

interface MybatisTagContext {
  attributeName: string
  attributeValuePrefix: string
  currentTag: string
  inAttributeName: boolean
  inAttributeValue: boolean
}

const mybatisTagSuggestions: MybatisSnippetDefinition[] = [
  {
    documentation: 'MyBatis mapper 根标签',
    insertText: mybatisSnippet`<mapper namespace="${'1:com.example.mapper.DemoMapper'}">
	$0
</mapper>`,
    label: 'mapper',
  },
  {
    documentation: 'MyBatis resultMap 标签',
    insertText: mybatisSnippet`<resultMap id="${'1:BaseResultMap'}" type="${'2:com.example.dto.ResultDto'}">
	$0
</resultMap>`,
    label: 'resultMap',
  },
  {
    documentation: 'MyBatis sql 片段标签',
    insertText: mybatisSnippet`<sql id="${'1:BaseColumns'}">
	$0
</sql>`,
    label: 'sql',
  },
  {
    documentation: 'MyBatis include 片段引用',
    insertText: mybatisSnippet`<include refid="${'1:BaseColumns'}" />`,
    label: 'include',
  },
  {
    documentation: 'MyBatis select 标签',
    insertText: mybatisSnippet`<select id="${'1:methodName'}" resultType="${'2:com.example.dto.ResultDto'}">
	$0
</select>`,
    label: 'select',
  },
  {
    documentation: 'MyBatis insert 标签',
    insertText: mybatisSnippet`<insert id="${'1:methodName'}">
	$0
</insert>`,
    label: 'insert',
  },
  {
    documentation: 'MyBatis update 标签',
    insertText: mybatisSnippet`<update id="${'1:methodName'}">
	$0
</update>`,
    label: 'update',
  },
  {
    documentation: 'MyBatis delete 标签',
    insertText: mybatisSnippet`<delete id="${'1:methodName'}">
	$0
</delete>`,
    label: 'delete',
  },
  {
    documentation: 'if 条件标签',
    insertText: mybatisSnippet`<if test="${'1:condition'}">
	$0
</if>`,
    label: 'if',
  },
  {
    documentation: 'where 条件标签',
    insertText: mybatisSnippet`<where>
	$0
</where>`,
    label: 'where',
  },
  {
    documentation: 'set 更新字段标签',
    insertText: mybatisSnippet`<set>
	$0
</set>`,
    label: 'set',
  },
  {
    documentation: 'trim 条件修饰标签',
    insertText: mybatisSnippet`<trim prefix="${'1:WHERE'}" prefixOverrides="${'2:AND |OR '}">
	$0
</trim>`,
    label: 'trim',
  },
  {
    documentation: 'foreach 循环标签',
    insertText: mybatisSnippet`<foreach collection="${'1:list'}" item="${'2:item'}" open="(" separator="," close=")">
	$0
</foreach>`,
    label: 'foreach',
  },
  {
    documentation: 'choose 条件分支标签',
    insertText: mybatisSnippet`<choose>
	<when test="${'1:condition'}">
		${'2'}
	</when>
	<otherwise>
		$0
	</otherwise>
</choose>`,
    label: 'choose',
  },
  {
    documentation: 'when 分支标签',
    insertText: mybatisSnippet`<when test="${'1:condition'}">
	$0
</when>`,
    label: 'when',
  },
  {
    documentation: 'otherwise 默认分支标签',
    insertText: mybatisSnippet`<otherwise>
	$0
</otherwise>`,
    label: 'otherwise',
  },
  {
    documentation: 'result 字段映射标签',
    insertText: mybatisSnippet`<result property="${'1:name'}" column="${'2:name'}" />`,
    label: 'result',
  },
  {
    documentation: 'id 主键映射标签',
    insertText: mybatisSnippet`<id property="${'1:id'}" column="${'2:id'}" />`,
    label: 'id',
  },
  {
    documentation: 'association 关联对象映射标签',
    insertText: mybatisSnippet`<association property="${'1:detail'}" javaType="${'2:com.example.dto.DetailDto'}">
	$0
</association>`,
    label: 'association',
  },
  {
    documentation: 'collection 集合映射标签',
    insertText: mybatisSnippet`<collection property="${'1:list'}" ofType="${'2:com.example.dto.ItemDto'}">
	$0
</collection>`,
    label: 'collection',
  },
] as const

const mybatisPrefixSuggestions: MybatisSnippetDefinition[] = [
  {
    documentation: 'Mapper 文件骨架',
    insertText: mybatisSnippet`<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="${'1:com.example.mapper.DemoMapper'}">
	$0
</mapper>`,
    label: 'mybmapper',
  },
  {
    documentation: 'resultMap 定义',
    insertText: mybatisSnippet`<resultMap id="${'1:BaseResultMap'}" type="${'2:com.example.dto.ResultDto'}">
	<id property="${'3:id'}" column="${'4:id'}" />
	<result property="${'5:name'}" column="${'6:name'}" />
</resultMap>`,
    label: 'mybresultmap',
  },
  {
    documentation: 'select 查询',
    insertText: mybatisSnippet`<select id="${'1:methodName'}" resultMap="${'2:BaseResultMap'}">
	SELECT
		$0
</select>`,
    label: 'mybselect',
  },
  {
    documentation: 'insert 写入',
    insertText: mybatisSnippet`<insert id="${'1:methodName'}" parameterType="${'2:com.example.command.CreateCommand'}">
	INSERT INTO ${'3:table_name'} (
		$0
	)
</insert>`,
    label: 'mybinsert',
  },
  {
    documentation: 'update 更新',
    insertText: mybatisSnippet`<update id="${'1:methodName'}" parameterType="${'2:com.example.command.UpdateCommand'}">
	UPDATE ${'3:table_name'}
	<set>
		$0
	</set>
	WHERE id = ${'#'}{'4:id'}
</update>`,
    label: 'mybupdate',
  },
  {
    documentation: 'delete 删除',
    insertText: mybatisSnippet`<delete id="${'1:methodName'}">
	DELETE FROM ${'2:table_name'}
	WHERE id = ${'#'}{'3:id'}
</delete>`,
    label: 'mybdelete',
  },
  {
    documentation: 'if 条件块',
    insertText: mybatisSnippet`<if test="${'1:condition'}">
	$0
</if>`,
    label: 'mybif',
  },
  {
    documentation: 'where 条件块',
    insertText: mybatisSnippet`<where>
	$0
</where>`,
    label: 'mybwhere',
  },
  {
    documentation: 'set 更新块',
    insertText: mybatisSnippet`<set>
	$0
</set>`,
    label: 'mybset',
  },
  {
    documentation: 'trim 条件块',
    insertText: mybatisSnippet`<trim prefix="${'1:WHERE'}" prefixOverrides="${'2:AND |OR '}">
	$0
</trim>`,
    label: 'mybtrim',
  },
  {
    documentation: 'foreach 循环块',
    insertText: mybatisSnippet`<foreach collection="${'1:list'}" item="${'2:item'}" open="(" separator="," close=")">
	$0
</foreach>`,
    label: 'mybforeach',
  },
  {
    documentation: 'choose 分支块',
    insertText: mybatisSnippet`<choose>
	<when test="${'1:condition'}">
		${'2'}
	</when>
	<otherwise>
		$0
	</otherwise>
</choose>`,
    label: 'mybchoose',
  },
  {
    documentation: 'when 分支',
    insertText: mybatisSnippet`<when test="${'1:condition'}">
	$0
</when>`,
    label: 'mybwhen',
  },
  {
    documentation: 'otherwise 分支',
    insertText: mybatisSnippet`<otherwise>
	$0
</otherwise>`,
    label: 'mybotherwise',
  },
  {
    documentation: 'sql 片段定义',
    insertText: mybatisSnippet`<sql id="${'1:BaseColumns'}">
	$0
</sql>`,
    label: 'mybsql',
  },
  {
    documentation: 'include 引用片段',
    insertText: mybatisSnippet`<include refid="${'1:BaseColumns'}" />`,
    label: 'mybinclude',
  },
]

let workerReady = false
let mybatisLanguageReady = false
let monacoPromise: Promise<typeof Monaco> | null = null

function mybatisSnippet(strings: TemplateStringsArray, ...placeholders: string[]) {
  return strings.reduce((result, part, index) => {
    const nextPlaceholder = placeholders[index]
    if (!nextPlaceholder) {
      return `${result}${part}`
    }

    return `${result}${part}${snippetMark}{${nextPlaceholder}}`
  }, '')
}

function getRegistrationStore() {
  const target = globalThis as typeof globalThis & {
    __zvMonacoMybatisRegistration__?: MybatisRegistrationStore
  }

  target.__zvMonacoMybatisRegistration__ ??= {}
  return target.__zvMonacoMybatisRegistration__
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
    getWorker() {
      return new EditorWorker()
    },
  }

  workerReady = true
}

function getTagCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
  const prefixMatch = linePrefix.match(mybatisTagPrefixPattern)
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
  const prefixMatch = linePrefix.match(mybatisSnippetPrefixPattern)
  const prefix = prefixMatch?.[0] ?? ''

  return {
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: position.column - prefix.length,
    startLineNumber: position.lineNumber,
  }
}

function getWordCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const word = model.getWordUntilPosition(position)

  return {
    endColumn: word.endColumn,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    startLineNumber: position.lineNumber,
  }
}

function getExpressionCompletionRange(model: Monaco.editor.ITextModel, position: Monaco.Position) {
  const textBeforeCursor = model.getValueInRange({
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: 1,
    startLineNumber: 1,
  })
  const expressionMatch = textBeforeCursor.match(mybatisExpressionPattern)
  const expression = expressionMatch?.[1] ?? ''
  const expressionParts = expression.split(/[^\w.]+/)
  const expressionWord = expressionParts[expressionParts.length - 1] ?? ''

  return {
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: position.column - expressionWord.length,
    startLineNumber: position.lineNumber,
  }
}

function getCurrentTagContext(textBeforeCursor: string): MybatisTagContext {
  const lastLtIndex = textBeforeCursor.lastIndexOf('<')
  const lastGtIndex = textBeforeCursor.lastIndexOf('>')

  if (lastLtIndex === -1 || lastLtIndex < lastGtIndex) {
    return {
      attributeName: '',
      attributeValuePrefix: '',
      currentTag: '',
      inAttributeName: false,
      inAttributeValue: false,
    }
  }

  const tagText = textBeforeCursor.slice(lastLtIndex + 1)
  if (tagText.startsWith('/')) {
    return {
      attributeName: '',
      attributeValuePrefix: '',
      currentTag: '',
      inAttributeName: false,
      inAttributeValue: false,
    }
  }

  const currentTag = tagText.match(/^([a-z]+)/i)?.[1]?.toLowerCase() ?? ''
  const doubleQuoteValueMatch = tagText.match(/([:\w-]+)\s*=\s*"([^"]*)$/)
  const singleQuoteValueMatch = tagText.match(/([:\w-]+)\s*=\s*'([^']*)$/)
  const attributeValueMatch = doubleQuoteValueMatch ?? singleQuoteValueMatch
  if (attributeValueMatch) {
    return {
      attributeName: attributeValueMatch[1] ?? '',
      attributeValuePrefix: attributeValueMatch[2] ?? '',
      currentTag,
      inAttributeName: false,
      inAttributeValue: true,
    }
  }

  const attributeNameMatch = tagText.match(/\s+([:\w-]*)$/)

  return {
    attributeName: attributeNameMatch?.[1] ?? '',
    attributeValuePrefix: '',
    currentTag,
    inAttributeName: Boolean(attributeNameMatch && currentTag),
    inAttributeValue: false,
  }
}

function getAttributeSuggestions(monaco: typeof Monaco, tagName: string, range: ReturnType<typeof getWordCompletionRange>) {
  const suggestions = mybatisAttributeSuggestionsMap[tagName] ?? []

  return suggestions.map((item, index) => {
    return {
      detail: item.description ?? 'MyBatis Attribute',
      documentation: item.documentation,
      filterText: item.label,
      insertText: item.insertText,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      kind: monaco.languages.CompletionItemKind.Property,
      label: item.label,
      range,
      sortText: `015${index.toString().padStart(2, '0')}`,
    }
  })
}

function dedupeValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)))
}

function collectRegexMatches(text: string, pattern: RegExp, groupIndex = 1) {
  const matches: string[] = []
  let match = pattern.exec(text)

  while (match) {
    const value = match[groupIndex]?.trim()
    if (value) {
      matches.push(value)
    }
    match = pattern.exec(text)
  }

  return dedupeValues(matches)
}

function collectExpressionIdentifiers(text: string) {
  const expressions = collectRegexMatches(text, /\btest\s*=\s*"([^"]*)"/g)
  const identifiers: string[] = []

  expressions.forEach((expression) => {
    const normalizedExpression = expression.replace(/'[^']*'|"[^"]*"/g, ' ')
    const matches = normalizedExpression.match(/\b[a-z_]\w*(?:\.[a-z_]\w*)*\b/gi) ?? []

    matches.forEach((item) => {
      if (!mybatisExpressionKeywordSet.has(item)) {
        identifiers.push(item)
      }
    })
  })

  return dedupeValues(identifiers)
}

function collectPlaceholderPaths(text: string) {
  const matches: string[] = []
  const placeholderPattern = /[#$]\{([^}]+)\}/g
  let match = placeholderPattern.exec(text)

  while (match) {
    const expression = match[1]?.split(',')[0]?.trim()
    if (expression) {
      matches.push(expression)
    }
    match = placeholderPattern.exec(text)
  }

  return dedupeValues(matches)
}

function buildMybatisDocumentIndex(text: string): MybatisDocumentIndex {
  const namespace = collectRegexMatches(text, /<mapper\b[^>]*\snamespace\s*=\s*"([^"]+)"/g)[0] ?? ''
  const resultMapIds = collectRegexMatches(text, /<resultMap\b[^>]*\sid\s*=\s*"([^"]+)"/g)
  const sqlIds = collectRegexMatches(text, /<sql\b[^>]*\sid\s*=\s*"([^"]+)"/g)
  const statementIds = collectRegexMatches(text, /<(?:select|insert|update|delete)\b[^>]*\sid\s*=\s*"([^"]+)"/g)
  const propertyNames = collectRegexMatches(text, /\bproperty\s*=\s*"([^"]+)"/g)
  const typeNames = dedupeValues([
    ...defaultJavaTypeSuggestions,
    ...collectRegexMatches(text, /\b(?:parameterType|resultType|type|ofType|javaType)\s*=\s*"([^"]+)"/g),
  ])
  const parameterPaths = dedupeValues([
    ...collectExpressionIdentifiers(text),
    ...collectPlaceholderPaths(text),
    ...collectRegexMatches(text, /\bcollection\s*=\s*"([^"]+)"/g),
    ...collectRegexMatches(text, /\bitem\s*=\s*"([^"]+)"/g),
    ...collectRegexMatches(text, /\bindex\s*=\s*"([^"]+)"/g),
  ])

  return {
    namespace,
    parameterPaths,
    propertyNames,
    resultMapIds,
    sqlIds,
    statementIds,
    typeNames,
  }
}

function createValueSuggestions(monaco: typeof Monaco, values: string[], detail: string, range: ReturnType<typeof getWordCompletionRange>) {
  return values.map((value, index) => {
    return {
      detail,
      filterText: value,
      insertText: value,
      kind: monaco.languages.CompletionItemKind.Value,
      label: value,
      range,
      sortText: `01${index.toString().padStart(3, '0')}`,
    }
  })
}

function createPropertyPathTree(paths: string[]) {
  const tree = new Map<string, Set<string>>()

  paths.forEach((path) => {
    const segments = path.split('.').filter(Boolean)

    segments.forEach((_, index) => {
      const parentKey = segments.slice(0, index).join('.')
      const currentSegment = segments[index]
      if (!currentSegment) {
        return
      }
      const childSet = tree.get(parentKey) ?? new Set<string>()
      childSet.add(currentSegment)
      tree.set(parentKey, childSet)
    })
  })

  return tree
}

function getExpressionSuggestions(monaco: typeof Monaco, model: Monaco.editor.ITextModel, position: Monaco.Position, documentIndex: MybatisDocumentIndex) {
  const textBeforeCursor = model.getValueInRange({
    endColumn: position.column,
    endLineNumber: position.lineNumber,
    startColumn: 1,
    startLineNumber: 1,
  })
  const expressionMatch = textBeforeCursor.match(mybatisExpressionPattern)
  if (!expressionMatch) {
    return []
  }

  const expression = expressionMatch[1] ?? ''
  const expressionParts = expression.split(/[^\w.]+/)
  const activePath = expressionParts[expressionParts.length - 1] ?? ''
  const parentPath = activePath.includes('.')
    ? activePath.split('.').slice(0, -1).join('.')
    : ''
  const activeSegments = activePath.split('.')
  const currentKeyword = activeSegments[activeSegments.length - 1] ?? ''
  const propertyPathTree = createPropertyPathTree(documentIndex.parameterPaths)
  const candidateValues = parentPath
    ? Array.from(propertyPathTree.get(parentPath) ?? [])
    : Array.from(propertyPathTree.get('') ?? [])

  return candidateValues
    .filter(item => !currentKeyword || item.toLowerCase().startsWith(currentKeyword.toLowerCase()))
    .map((item, index) => {
      return {
        detail: parentPath ? 'MyBatis Property' : 'MyBatis Parameter',
        filterText: item,
        insertText: item,
        kind: monaco.languages.CompletionItemKind.Field,
        label: item,
        range: getExpressionCompletionRange(model, position),
        sortText: `005${index.toString().padStart(2, '0')}`,
      }
    })
}

function getAttributeValueSuggestions(
  monaco: typeof Monaco,
  documentIndex: MybatisDocumentIndex,
  tagContext: MybatisTagContext,
  range: ReturnType<typeof getWordCompletionRange>,
) {
  if (!tagContext.inAttributeValue) {
    return []
  }

  if (tagContext.attributeName === 'resultMap') {
    return createValueSuggestions(monaco, documentIndex.resultMapIds, 'MyBatis ResultMap', range)
  }

  if (tagContext.attributeName === 'refid') {
    return createValueSuggestions(monaco, documentIndex.sqlIds, 'MyBatis SQL Fragment', range)
  }

  if (tagContext.attributeName === 'id') {
    if (tagContext.currentTag === 'sql') {
      return createValueSuggestions(monaco, documentIndex.sqlIds, 'MyBatis SQL Id', range)
    }

    if (tagContext.currentTag === 'resultMap') {
      return createValueSuggestions(monaco, documentIndex.resultMapIds, 'MyBatis ResultMap Id', range)
    }

    if (['select', 'insert', 'update', 'delete'].includes(tagContext.currentTag)) {
      return createValueSuggestions(monaco, documentIndex.statementIds, 'MyBatis Statement Id', range)
    }
  }

  if (tagContext.attributeName === 'namespace') {
    return createValueSuggestions(monaco, [documentIndex.namespace], 'MyBatis Namespace', range)
  }

  if (mybatisTypeAttributeNames.includes(tagContext.attributeName)) {
    return createValueSuggestions(monaco, documentIndex.typeNames, 'Java Type', range)
  }

  if (['test', 'collection', 'item', 'index'].includes(tagContext.attributeName)) {
    return createValueSuggestions(monaco, documentIndex.parameterPaths, 'MyBatis Parameter', range)
  }

  if (tagContext.attributeName === 'property') {
    return createValueSuggestions(monaco, documentIndex.propertyNames, 'MyBatis Property', range)
  }

  return []
}

function getAttributeNameSuggestions(
  monaco: typeof Monaco,
  tagContext: MybatisTagContext,
  range: ReturnType<typeof getWordCompletionRange>,
) {
  if (!tagContext.inAttributeName || !tagContext.currentTag) {
    return []
  }

  return getAttributeSuggestions(monaco, tagContext.currentTag, range)
}

function createMybatisCompletionProvider(monaco: typeof Monaco): languages.CompletionItemProvider {
  return {
    triggerCharacters: [' ', '"', '<', '=', '/', '#', '$', '{', '.'],
    provideCompletionItems(model, position) {
      const languageId = model.getLanguageId()
      if (languageId !== 'xml' && languageId !== MYBATIS_LANGUAGE_ID) {
        return { suggestions: [] }
      }

      const textBeforeCursor = model.getValueInRange({
        endColumn: position.column,
        endLineNumber: position.lineNumber,
        startColumn: 1,
        startLineNumber: 1,
      })
      const linePrefix = model.getLineContent(position.lineNumber).slice(0, position.column - 1)
      const documentIndex = buildMybatisDocumentIndex(model.getValue())
      const tagContext = getCurrentTagContext(textBeforeCursor)

      const expressionSuggestions = getExpressionSuggestions(monaco, model, position, documentIndex)
      if (expressionSuggestions.length) {
        return {
          suggestions: expressionSuggestions,
        }
      }

      if (mybatisSnippetPrefixPattern.test(linePrefix)) {
        const range = getPrefixCompletionRange(model, position)

        return {
          suggestions: mybatisPrefixSuggestions.map((item, index) => {
            return {
              detail: 'MyBatis Snippet',
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

      if (tagContext.inAttributeValue) {
        const range = getWordCompletionRange(model, position)
        const attributeValueSuggestions = getAttributeValueSuggestions(monaco, documentIndex, tagContext, range)

        if (attributeValueSuggestions.length) {
          return {
            suggestions: attributeValueSuggestions,
          }
        }
      }

      if (tagContext.inAttributeName) {
        const range = getWordCompletionRange(model, position)
        const attributeNameSuggestions = getAttributeNameSuggestions(monaco, tagContext, range)

        if (attributeNameSuggestions.length) {
          return {
            suggestions: attributeNameSuggestions,
          }
        }
      }

      if (!mybatisTagPrefixPattern.test(linePrefix)) {
        return { suggestions: [] }
      }

      const range = getTagCompletionRange(model, position)
      const tagSuggestions = mybatisTagSuggestions.map((item, index) => {
        return {
          detail: 'MyBatis Tag',
          documentation: item.documentation,
          filterText: `<${item.label}`,
          insertText: item.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          kind: monaco.languages.CompletionItemKind.Snippet,
          label: item.label,
          range,
          sortText: `01${index.toString().padStart(2, '0')}`,
        }
      })

      return {
        suggestions: tagSuggestions,
      }
    },
  }
}

function registerMybatisCompletions(monaco: typeof Monaco) {
  const provider = createMybatisCompletionProvider(monaco)

  return [
    monaco.languages.registerCompletionItemProvider('xml', provider),
    monaco.languages.registerCompletionItemProvider(MYBATIS_LANGUAGE_ID, provider),
  ]
}

function ensureMybatisLanguage(monaco: typeof Monaco, dependencies: MybatisLanguageDependencies) {
  if (mybatisLanguageReady) {
    return
  }

  const { xmlConf, xmlLanguage } = dependencies
  const registrationStore = getRegistrationStore()
  const mybatisConf: languages.LanguageConfiguration = {
    ...xmlConf,
    autoClosingPairs: [
      ...(xmlConf.autoClosingPairs ?? []).filter(item => item.open !== '<'),
      { open: '#{', close: '}' },
      { open: '${', close: '}' },
    ],
    surroundingPairs: [
      ...(xmlConf.surroundingPairs ?? []).filter(item => item.open !== '<'),
      { open: '#{', close: '}' },
      { open: '${', close: '}' },
    ],
  }

  registrationStore.completionDisposables?.forEach(item => item.dispose())
  registrationStore.languageConfigDisposable?.dispose()
  registrationStore.monarchDisposable?.dispose()

  monaco.languages.register({
    aliases: ['MyBatis', 'mybatis'],
    extensions: ['.xml'],
    id: MYBATIS_LANGUAGE_ID,
  })

  registrationStore.languageConfigDisposable = monaco.languages.setLanguageConfiguration(MYBATIS_LANGUAGE_ID, mybatisConf)
  registrationStore.monarchDisposable = monaco.languages.setMonarchTokensProvider(MYBATIS_LANGUAGE_ID, xmlLanguage)
  registrationStore.completionDisposables = registerMybatisCompletions(monaco)

  mybatisLanguageReady = true
}

async function loadMybatisMonaco() {
  await import('monaco-editor/esm/nls.messages.zh-cn.js')
  await import('monaco-editor/min/vs/editor/editor.main.css')

  const [monaco, xmlBasicLanguage] = await Promise.all([
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/editor/editor.api'),
    import('monaco-editor/esm/vs/basic-languages/xml/xml.js'),
    // @ts-expect-error Monaco ESM subpath is resolved by Vite at build time.
    import('monaco-editor/esm/vs/basic-languages/xml/xml.contribution'),
  ])
  const xmlBasicLanguageModule = 'default' in xmlBasicLanguage ? xmlBasicLanguage.default : xmlBasicLanguage

  ensureMonacoEnvironment()
  ensureMybatisLanguage(monaco as typeof Monaco, {
    xmlConf: (xmlBasicLanguageModule as { conf: languages.LanguageConfiguration }).conf,
    xmlLanguage: (xmlBasicLanguageModule as { language: languages.IMonarchLanguage }).language,
  })

  return monaco as typeof Monaco
}

export function ensureMybatisMonaco() {
  monacoPromise ??= loadMybatisMonaco()
  return monacoPromise
}
