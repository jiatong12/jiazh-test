import type { FormRules } from 'element-plus'
import { reactive } from 'vue'
import { isMobile } from '@/utils/validate/validate'

const verifyCode = '12341234'

/** 6位数字验证码正则 */
export const REGEXP_SIX = /^\d{6}$/

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
export const REGEXP_PWD
  = /^(?!\d+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?![^\n\r\u2028\u2029\u4E00-\u9FA5]*[\u4E00-\u9FA5].*$)([\s\S]){8,18}$/

/** 登录校验 */
const loginRules = reactive<FormRules>({
  password: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        }
        else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应微8-18未数字、字母、符号的任意两种组合'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        }
        else if (verifyCode !== value) {
          callback(new Error('请输入正确的验证码'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

/** 手机登录校验 */
const phoneRules = reactive<FormRules>({
  phone: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        }
        else if (!isMobile(value)) {
          callback(new Error('请输入正确的手机号码格式'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

/** 忘记密码校验 */
const updateRules = reactive<FormRules>({
  phone: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        }
        else if (!isMobile(value)) {
          callback(new Error('请输入正确的手机号码格式'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  verifyCode: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        }
        else if (!REGEXP_SIX.test(value)) {
          callback(new Error('请输入6位数字验证码'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        }
        else if (!REGEXP_PWD.test(value)) {
          callback(new Error('密码格式应为8-18位数字、字母、符号的任意两种组合'))
        }
        else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

export { loginRules, phoneRules, updateRules }
