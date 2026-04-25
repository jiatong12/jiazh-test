/* eslint-disable regexp/no-useless-assertions */
/* eslint-disable regexp/no-contradiction-with-assertion */
/* eslint-disable regexp/no-super-linear-backtracking */
/* eslint-disable regexp/no-unused-capturing-group */
/**
 * 表单中的校验函数
 */

/**
 * @description 手机机身码(IMEI)
 * @param {string} val
 */
export function isIMEI(val: any): boolean {
  return /^\d{15,17}$/.test(val)
}

/**
 * @description 必须带端口号的网址(或ip)
 * @param {string} val
 */
export function isURI(val: any) {
  return /^(?:(?:ht|f)tps?:\/\/)?[\w-]+(?:\.[\w-]+)+:\d{1,5}\/?$/.test(val)
}

/**
 * @description 网址(url,支持端口和"?+参数"和"#+参数)
 * @param {string} val
 */
export function isURL(val: any) {
  return /^(?:(?:ht|f)tps?:\/\/)?[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(val)
}

/**
 * @description 统一社会信用代码(严格)
 * @param {string} val
 */
export function isUSCC_strict(val: any) {
  return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(val)
}

/**
 * @description 统一社会信用代码(宽松匹配)(15位/18位/20位数字/字母)
 * @param {string} val
 */
export function isUSCC(val: any) {
  return /^(([0-9A-Z]{15})|([0-9A-Z]{18})|([0-9A-Z]{20}))$/i.test(val)
}

/**
 * @description 子网掩码
 * @param {string} val
 */
export function isSubnetMask(val: any) {
  return /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(val)
}
/**
 * @description 银行卡号（10到30位, 覆盖对公/私账户, 参考[微信支付](https://pay.weixin.qq.com/wiki/doc/api/xiaowei.php?chapter=22_1)）
 * @param {string} val
 */
export function isCardNo(val: any) {
  return /^[1-9]\d{9,29}$/.test(val)
}

/**
 * @description 用户名校验，4到16位（字母，数字，下划线，减号）
 * @param {string} val
 */
export function isUsername(val: any) {
  return /^[\w-]{4,16}$/.test(val)
}
/**
 * @description 密码校验，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
 * @param {string} val
 */
export function isPassword(val: any) {
  return /^\S*(?=\S{6})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(val)
}

/**
 * @description 中文姓名
 * @param {string} val
 */
export function isChineseName(val: any) {
  return /^[\u4E00-\u9FA5·]{2,16}$/.test(val)
}

/**
 * @description 英文姓名
 * @param {string} val
 */
export function isEnglishName(val: any) {
  return /(^[a-z][a-z\s]{0,20}[a-z]$)/i.test(val)
}

/**
 * @description 车牌号(新能源)
 * @param {string} val
 */
export function isLicensePlate_newEnergy(val: any) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z](?:((\d{5}[A-HJK])|([A-HJK][A-HJ-NP-Z0-9]\d{4}))|[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳])$/.test(
    val,
  )
}

/**
 * @description 车牌号(非新能源)
 * @param {string} val
 */
export function isLicensePlate_noNewEnergy(val: any) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
    val,
  )
}

/**
 * @description 车牌号(新能源+非新能源)
 * @param {string} val
 */
export function isLicensePlate_all(val: any) {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(
    val,
  )
}

/**
 * @description 手机号(mobile phone)中国(宽松), 只要是13,14,15,16,17,18,19开头即可
 * @param {string} val
 */
export function isMobile(val: any) {
  return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(val)
}
/**
 * @description 座机(tel phone)电话(国内),如: 0341-86091234
 * @param {string} val
 */
export function isTel(val: any) {
  return /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/.test(val)
}
/**
 * @description email(邮箱)
 * @param {string} val
 */
export function isEmail(val: any) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i.test(
    val,
  )
}

/**
 * @description 身份证号, 支持1/2代(15位/18位数字)
 * @param {string} val
 */
export function isIdCard(val: any) {
  return /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}([\dX])$)/i.test(
    val,
  )
}

/**
 * @description 护照（包含香港、澳门）
 * @param {string} val
 */
export function isPassport(val: any) {
  return /(^[EKGDSPH]\d{8}$)|(^((E[a-f])|([DSP]E)|(KJ)|(MA)|(1[45]))\d{7}$)/i.test(val)
}

/**
 * @description 中文/汉字
 * @param {string} val
 */
export function isChinese(val: any) {
  return /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(
    val,
  )
}

/**
 * @description 小数
 * @param {string} val
 */
export function isDecimals(val: any) {
  return /^\d+\.\d+$/.test(val)
}
/**
 * @description 数字
 * @param {string} val
 */
export function isDigit(val: any) {
  return /^\d+$/.test(val)
}

/**
 * @description 数字和字母组成
 * @param {string} val
 */
export function isAlphabetsAndDigit(val: any) {
  return /^[A-Z0-9]+$/i.test(val)
}

/**
 * @description 英文字母
 * @param {string} val
 */
export function isAlphabets(val: any) {
  return /^[a-z]+$/i.test(val)
}

/**
 * @description 小写英文字母
 * @param {string} val
 */
export function isLowerCase(val: any) {
  return /^[a-z]+$/.test(val)
}
/**
 * @description 大写英文字母
 * @param {string} val
 */
export function isUpperCase(val: any) {
  return /^[A-Z]+$/.test(val)
}
/**
 * @description ip-v4[:端口]
 * @param {string} val
 */
export function isIPV4(val: any) {
  return /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:\d|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/.test(
    val,
  )
}

/**
 * @description 邮政编码(中国)
 * @param {string} val
 */
export function isPostalCode(val: any) {
  return /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/.test(val)
}
