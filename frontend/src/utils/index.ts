/**
 * @description 浅拷贝属性，像在 dialog 的 open 事件中调用详情的时候怕有多余字段
 * @param source
 * @param target
 */
export function copyProperties(source: { [key: string]: any }, target: { [key: string]: any }) {
  if (!source || !target) {
    return
  }
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      if (source[key] !== undefined) {
        target[key] = source[key]
      }
    }
  }
}

/**
 * 深度冻结对象（处理循环引用+完整类型支持）
 * @param obj - 要冻结的对象
 * @returns 被深度冻结的不可变对象
 */
// export function freezeDeep<T>(obj: T): ReadonlyDeep<T> {
export function freezeDeep<T>(obj: T): T {
  const seen = new WeakSet<object>()

  function innerFreeze(o: any): any {
    // 基本类型直接返回
    if (o === null || typeof o !== 'object') { return o }

    // 检查循环引用
    if (seen.has(o)) { return o }
    seen.add(o)

    // 冻结当前对象（包括数组）
    Object.freeze(o)

    // 递归冻结所有属性
    Object.getOwnPropertyNames(o).forEach((prop) => {
      innerFreeze(o[prop])
    })

    return o
  }

  // return innerFreeze(obj) as ReadonlyDeep<T>
  return innerFreeze(obj)
}

// 深度只读类型定义
// type ReadonlyDeep<T> = T extends (...args: any[]) => any
//   ? T
//   : T extends object
//     ? { readonly [K in keyof T]: ReadonlyDeep<T[K]> }
//     : T

/**
 * 将扁平列表转换为树形结构
 * @template T 列表项类型
 * @param list 待转换的扁平列表
 * @param options 配置选项
 * @param options.idKey 节点ID字段名，默认为'id'
 * @param options.parentKey 父节点ID字段名，默认为'pid'
 * @param options.childrenKey 子节点字段名，默认为'children'
 * @param options.rootPredicate 判断是否为根节点的函数，默认检查parentKey为空
 * @param options.transformNode 节点转换函数，可用于修改节点数据
 * @returns 转换后的树形结构数组
 */
export function listToTree<T>(
  list: T[],
  options: {
    idKey?: string
    parentKey?: string
    childrenKey?: string
    rootPredicate?: (item: T) => boolean
    transformNode?: (item: T) => void
  } = {},
): T[] {
  const {
    idKey = 'id',
    parentKey = 'pid',
    childrenKey = 'children',
    rootPredicate = item => !item[parentKey],
    transformNode,
  } = options

  // 1. 创建映射表
  const nodeMap = new Map<string | number, T>()
  list.forEach((item) => {
    transformNode?.(item)
    nodeMap.set(item[idKey], item)
  })

  // 2. 构建树结构
  const tree: T[] = []
  for (const item of list) {
    const parentId = item[parentKey]
    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId)!
      parent[childrenKey] = parent[childrenKey] || []
      parent[childrenKey].push(item)
    }
    else if (rootPredicate(item)) {
      tree.push(item)
    }
  }

  return tree
}

/**
 * 合并两个对象，并检查不能有相同的 key，在编译期检查
 * @param obj1
 * @param obj2
 */
export function combineObj<T extends object, U extends object>(
  obj1: keyof T extends keyof U ? never : T,
  obj2: keyof U extends keyof T ? never : U,
) {
  return {
    ...obj1,
    ...obj2,
  }
}

/**
 * 传入一个正在执行的 promise，让它可以控制直接失败
 * @param p
 * @returns 可以用 abort 终止执行
 */
export function getPromiseWithAbort<T = any>(p: Promise<T>) {
  const obj = {} as { abort?: () => void, promise: Promise<T> }
  // 内部定一个新的promise，用来终止执行
  const p1 = new Promise<T>((_resolve, reject) => {
    obj.abort = reject
  })
  obj.promise = Promise.race([p, p1])
  return obj
}

/**
 * 构建元数据信息，通常用在 _meta.ts 文件中
 * @param meta
 * @returns 元数据
 */
export function buildMeta(meta: Menu.Meta) {
  return { ...meta }
}

/**
 * @description 获取浏览器默认语言
 */
export function getBrowserLang() {
  const browserLang = navigator.language ? navigator.language : navigator.browserLanguage
  let defaultBrowserLang = ''
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh'
  }
  else {
    defaultBrowserLang = 'en'
  }
  return defaultBrowserLang
}

/**
 * @description 获取当前时间对应的提示语
 */
export function getTimeState() {
  const timeNow = new Date()
  const hours = timeNow.getHours()
  if (hours >= 6 && hours <= 10) { return `早上好 ⛅` }
  else if (hours >= 10 && hours <= 14) { return `中午好 🌞` }
  else if (hours >= 14 && hours <= 18) { return `下午好 🌞` }
  else if (hours >= 18 && hours <= 24) { return `晚上好 🌛` }
  else if (hours >= 0 && hours <= 6) { return `凌晨好 🌛` }
  else { return '' }
}
