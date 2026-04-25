/**
 * 校验逻辑简单封装
 * @param fun 校验函数
 * @param errMsg 异常消息
 */
export function validateFun(fun: (val: any) => boolean, errMsg: string): (rule: any, value: any, callback: any) => any {
  return (_rule: any, value: any, callback: any) => {
    // 验证邮箱正则表达式
    if (fun(value)) {
      return callback()
    }
    else {
      return callback(new Error(errMsg))
    }
  }
}
