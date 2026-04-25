import type { FormItemRule } from 'element-plus'
import { computed } from 'vue'

// 定义操作符常量
const OPERATORS = {
  eq: { name: '等于', code: '=' },
  ne: { name: '不等于', code: '!=' },
  gt: { name: '大于', code: '>' },
  lt: { name: '小于', code: '<' },
  ge: { name: '大于等于', code: '>=' },
  le: { name: '小于等于', code: '<=' },
}

// 验证规则基类
abstract class VerifyRule {
  protected label: string
  protected message: string

  constructor(label: string, message: string) {
    this.label = label
    this.message = message
  }

  abstract ruleGenerator(): FormItemRule | null

  protected validatorGenerator(regex: RegExp, message: string) {
    return (_rule: any, value: any, callback: any) => {
      if (!value || value === '') {
        callback()
        return
      }

      const isValid = regex.test(value)

      if (!isValid) {
        callback(new Error(message))
      }
      else {
        callback()
      }
    }
  }
}

// 非空验证规则
class NotNullRule extends VerifyRule {
  constructor(label: string, message?: string | null) {
    message = message || `${label}不能为空`
    super(label, message)
  }

  ruleGenerator(): FormItemRule {
    return {
      required: true,
      message: this.message,
      trigger: ['blur', 'change'],
    }
  }
}

// 正则表达式静态规则
class RegexStaticRule extends VerifyRule {
  private regExp: RegExp

  constructor(label: string, message: string, regExp: RegExp) {
    super(label, message)
    this.regExp = regExp
  }

  ruleGenerator(): FormItemRule {
    const validator = this.validatorGenerator(this.regExp, this.message)
    return {
      validator,
      trigger: ['blur', 'change'],
    }
  }
}

// 正则表达式规则
class RegexRule extends VerifyRule {
  private exp: string

  constructor(label: string, message: string, exp: string) {
    super(label, message)
    this.exp = exp
  }

  ruleGenerator(): FormItemRule | null {
    let regExp: RegExp
    try {
      regExp = new RegExp(this.exp)
    }
    catch (e) {
      console.error(`正则表达式错误，${e}`)
      return null
    }

    const validator = this.validatorGenerator(regExp, this.message)
    return {
      validator,
      trigger: ['blur', 'change'],
    }
  }
}

// 长度规则
class LengthRule extends VerifyRule {
  protected min: number | null
  protected max: number | null

  constructor(label: string, message: string, size: { min: number | null, max: number | null }) {
    super(label, message)
    this.min = size.min
    this.max = size.max
  }

  ruleGenerator(): FormItemRule {
    return {
      min: this.min !== null ? this.min : undefined,
      max: this.max !== null ? this.max : undefined,
      message: this.message,
      trigger: ['blur', 'change'],
    }
  }
}

// 字符数规则
class LengthExRule extends VerifyRule {
  protected min: number | null
  protected max: number | null

  constructor(label: string, message: string, size: { min: number | null, max: number | null }) {
    super(label, message)
    this.min = size.min
    this.max = size.max
  }

  private getLengthEx(str: string): number {
    let ret = 0
    for (let i = 0; i < str.length; i++) {
      ret += str.charCodeAt(i) > 255 ? 3 : 1
    }
    return ret
  }

  ruleGenerator(): FormItemRule {
    const validator = (_rule: any, value: any, callback: any) => {
      if (!value) {
        typeof callback === 'function' && callback()
        return
      }

      const valueLengthEx = this.getLengthEx(value || '')
      const hasMinLimit = typeof this.min === 'number'
      const hasMaxLimit = typeof this.max === 'number'
      const isLT = hasMinLimit && !hasMaxLimit && valueLengthEx < this.min!
      const isGT = hasMaxLimit && !hasMinLimit && valueLengthEx > this.max!
      const isLTAndGT = hasMinLimit && hasMaxLimit && (valueLengthEx < this.min! || valueLengthEx > this.max!)
      const hasError = isLT || isGT || isLTAndGT

      typeof callback === 'function' && callback(!hasError ? undefined : new Error(this.message))
    }

    return {
      validator,
      trigger: ['blur', 'change'],
    }
  }
}

// 日期时间规则
class DateTimeRule extends VerifyRule {
  private dateFormat: string

  constructor(label: string, message: string, dateFormat: string) {
    super(label, message)
    this.dateFormat = dateFormat
  }

  ruleGenerator(): FormItemRule | null {
    let regExp: RegExp
    let exp = `^${this.dateFormat}$`

    exp = exp.replace('yyyy', '[0-9]{4}')
    exp = exp.replace('yy', '[0-9]{2}')
    exp = exp.replace('MM', '[0-9]{2}')
    exp = exp.replace('dd', '[0-9]{2}')
    exp = exp.replace('hh', '[0-9]{2}')
    exp = exp.replace('mm', '[0-9]{2}')
    exp = exp.replace('ss', '[0-9]{2}')

    try {
      regExp = new RegExp(exp)
    }
    catch (e) {
      console.error(`正则表达式错误，${e}`)
      return null
    }

    const validator = this.validatorGenerator(regExp, this.message)
    return {
      validator,
      trigger: ['blur', 'change'],
    }
  }
}

// 解析参数
function parseParam(param: string) {
  const result = {
    value: '' as any,
    message: null as string | null,
  }

  if (!param.includes('|')) {
    result.value = param
    return result
  }

  const array = param.split('|')
  result.value = array[0]
  result.message = array[1] || null

  return result
}

// 解析正则表达式参数
function parseRegexParam(param: string) {
  const result = {
    value: '',
    message: null as string | null,
  }

  let index = 0
  let tempIndex = 0
  while (index !== -1) {
    tempIndex = param.indexOf('||', index + 1)
    if (tempIndex === -1) {
      index = -1
      break
    }
    if (param[tempIndex - 1] !== '\\') {
      index = tempIndex
      break
    }
    index = tempIndex
  }

  if (index === -1 || index === 0) {
    result.value = param
    return result
  }

  result.value = param.substring(0, index)
  result.message = param.substring(index + 2) || null

  return result
}

// 规则工厂函数
function factory(type: string, label: string): VerifyRule | null {
  let param: ReturnType<typeof parseParam>

  if (type.startsWith('NotNull')) {
    param = parseParam(type)
    return new NotNullRule(label, param.message)
  }

  if (type.startsWith('Number')) {
    param = parseParam(type)
    return new RegexStaticRule(
      label,
      param.message || `${label}必须是数字`,
      /(^-?(?:\d+\.\d+|\d{2,})$)|(^-?\d+$)/,
    )
  }

  if (type.startsWith('Int')) {
    param = parseParam(type)
    return new RegexStaticRule(label, param.message || `${label}必须是整数`, /^-?\d+$/)
  }

  if (type.startsWith('Email')) {
    param = parseParam(type)
    return new RegexStaticRule(
      label,
      param.message || `${label}必须是email`,
      // eslint-disable-next-line regexp/no-misleading-capturing-group
      /^([-\w.])+@(([-\w])+\.)+(\w{2,4})+$/,
    )
  }

  if (type.startsWith('ZipCode')) {
    param = parseParam(type)
    return new RegexStaticRule(label, param.message || `${label}必须是邮政编码`, /^[1-9]\d{5}$/)
  }

  if (type.startsWith('CnTel')) {
    param = parseParam(type)
    return new RegexStaticRule(
      label,
      param.message || `${label}必须是固定电话`,
      /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
    )
  }

  if (type.startsWith('CnPhone')) {
    param = parseParam(type)
    return new RegexStaticRule(label, param.message || `${label}必须是手机号码`, /^1[3-9]\d{9}$/)
  }

  if (type.startsWith('IDCardNo')) {
    param = parseParam(type)
    return new RegexStaticRule(
      label,
      param.message || `${label}必须身份证号码`,
      /(^\d{15}$)|(^\d{17}([0-9X])$)/,
    )
  }

  if (type.startsWith('TitleString')) {
    param = parseParam(type)
    return new RegexStaticRule(
      label,
      param.message || `${label}只允许输入中文、英文字母和数字`,
      /^[\u4E00-\u9FA5|A-Z0-9]+$/i,
    )
  }

  if (type.startsWith('Regex=')) {
    const exp = type.split('=')
    param = parseRegexParam(exp[1]!)
    return new RegexRule(label, param.message || `${label}必须符合正则表达式`, param.value)
  }

  if (type.startsWith('Length')) {
    const op = type.replace(/[^><=]/g, '')
    const opParams = type.split(op)
    param = parseParam(opParams[1]!.trim())
    let min: number | null = null
    let max: number | null = null
    let operatorObj = OPERATORS.eq

    switch (op) {
      case OPERATORS.gt.code:
        min = Number.parseInt(param.value) + 1
        operatorObj = OPERATORS.gt
        break
      case OPERATORS.lt.code:
        max = Number.parseInt(param.value) - 1
        operatorObj = OPERATORS.lt
        break
      case OPERATORS.eq.code:
        min = max = Number.parseInt(param.value)
        operatorObj = OPERATORS.eq
        break
      case OPERATORS.ge.code:
        min = Number.parseInt(param.value)
        operatorObj = OPERATORS.ge
        break
      case OPERATORS.le.code:
        max = Number.parseInt(param.value)
        operatorObj = OPERATORS.le
        break
      default:
        break
    }

    const isLengthEX = type.startsWith('LengthEX')
    const RuleClass = isLengthEX ? LengthExRule : LengthRule
    const defaultMsg = `${label}${isLengthEX ? '字数' : '长度'}必须${operatorObj.name}${param.value}`

    return new RuleClass(label, param.message || defaultMsg, { min, max })
  }

  if (type.startsWith('DateTime=')) {
    const dateFormat = type.split('=')
    param = parseParam(dateFormat[1]!)
    return new DateTimeRule(
      label,
      param.message || `${label}必须是日期时间，${param.value}`,
      param.value,
    )
  }

  return null
}

// 主要的 hook 函数
export function useFormItemVerify(props: { verify?: string[], label?: string, prop?: string, required?: boolean, rules?: FormItemRule | FormItemRule[] }) {
  // 获取表单规则
  const getRules = computed((): FormItemRule[] => {
    const verifyRules = getVerifyRules() || []

    const requiredRule = !!props.required === true
      ? [{ required: !!props.required, message: `${props.label}不能为空`, trigger: ['blur', 'change'] }]
      : []
    const selfRules = props.rules

    return (verifyRules || []).concat(selfRules || []).concat(requiredRule) as FormItemRule[]
  })

  // 获取验证规则
  function getVerifyRules(): FormItemRule[] | null {
    const verify = props.verify
    if (!verify?.length) {
      return null
    }

    const result: FormItemRule[] = []
    let label = props.label || ''

    const labelSuffix = label[label.length - 1]
    if (labelSuffix === ':' || labelSuffix === '：') {
      label = label.slice(0, -1)
    }

    verify.forEach((val) => {
      if (val.length === 0) {
        return
      }

      const rule = factory(val, label)?.ruleGenerator()
      rule && result.push(rule)
    })

    return result
  }

  return {
    getRules,
    getVerifyRules,
  }
}
