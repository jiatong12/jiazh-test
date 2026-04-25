import type { ResultData, SuccessResultData } from '../types/service'
import { faker } from '@faker-js/faker/locale/zh_CN'
import { isObject } from 'lodash-es'
import { SUCCESS_STATUS } from '../types/service'

/**
 * 包裹结果集
 * @param data
 * @param status
 * @param msg
 */
function resultWrap<T>(
  data: T,
  status: number = SUCCESS_STATUS,
  msg: string = '成功',
): T extends ResultData<infer U> ? ResultData<U> : ResultData<T> {
  const isWrap = isObject(data) && 'status' in data && 'message' in data && 'data' in data
  // 已经被包裹，直接返回
  if (isWrap) {
    return data as any
  }

  // 包裹
  return {
    // code,
    // msg,
    // data,
    status,
    message: msg,
    data,
  } satisfies ResultData<T> as any
}

// 生成 idCard
export function generateIdCard(): string {
  // 生成地址码（前6位）
  const addressCode = faker.number.int({ min: 100000, max: 999999 }).toString()
  // 生成出生日期（中间8位）
  const birthDate = faker.date.between({ from: new Date('1900-01-01'), to: new Date('2099-12-31') }).toISOString().substring(0, 10).replace(/-/g, '')
  // 生成顺序码和校验码（后4位）
  const sequenceAndCheckCode = faker.number.int({ min: 1000, max: 9999 }).toString()
  // 拼接成18位身份证号码
  const fakeID = `${addressCode}${birthDate}${sequenceAndCheckCode}`
  return fakeID
}

export const ResultUtils = Object.freeze({
  success: <T = Record<string, never>>(data: T = {} as T): SuccessResultData<T> => {
    return resultWrap(data, SUCCESS_STATUS) as SuccessResultData<T>
  },
  error: (msg: string, code = 500) => {
    return resultWrap(null, code, msg) as ResultData<null>
  },
})
