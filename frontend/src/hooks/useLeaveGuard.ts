/**
 * @description 离开提醒
 * 浏览级别的离开提醒
 * vue 页面级别的离开提醒
 * 自定义离开提醒
 * @author shiyun
 */
import { ElMessageBox } from 'element-plus'
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const msg = '数据未保存，是否仍要离开？'

function confirm() {
  return ElMessageBox.confirm(
    msg,
    '提示',
    {
      confirmButtonText: '直接离开',
      cancelButtonText: '继续编辑',
      type: 'warning',
    },
  )
}

/**
 * 比较对象时否有改动， json 转字符串
 * @param obj
 */
function serializeForComparison(obj: any) {
  return JSON.stringify(unref(obj), (_key, value) => {
    // 过滤掉为 null 和 空字符的参数，TODO 考虑到初始值为 null 的赋值给某些组件后会自动赋值为0，这里也暂时忽略
    if (value === undefined || value === null || value === '') {
      return undefined
    }
    else {
      return value
    }
  })
}

/**
 * 是否是引用类型
 * @param value
 */
function isReferenceType(value: any) {
  return typeof value === 'object' && value !== null
}

/**
 * 比较对象时否有改动
 */
export function hasDataChanged(before: any, after: any) {
  before = unref(before)
  after = unref(after)
  if (isReferenceType(before) && before === after) {
    // 对象引用相同，是同一个对象，进行异常提示，这里为了不影响业务逻辑，只打印控制台
    console.error('hasDataChanged: before and after are the same reference')
    return true
    // throw new Error('hasDataChanged: before and after are the same reference')
  }
  return serializeForComparison(before) !== serializeForComparison(after)
}

/**
 * 检查改变
 * @returns true 是数据变了
 */
type LeaveCheckCondition = (helpers: { hasDataChanged: typeof hasDataChanged }) => boolean

/**
 * 浏览器级的离开页面提醒处理
 * 关闭浏览器页签、网页或刷新页面时提醒
 * 不能自定义提示语 @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/beforeunload_event
 * @param checkChange 检查
 */
function beforeunload(checkChange: LeaveCheckCondition) {
  function onBeforeunload(e): string | void {
    if (checkChange({ hasDataChanged })) {
      e = e || window.event
      if (e) {
        // 为了触发提示
        e.preventDefault()
        // 不能修改提示，只是为了触发弹框
        e.returnValue = msg
      }

      // 不能修改提示，只是为了触发弹框
      return msg
    }
  }

  function addEvent() {
    // 激活事件监听，关闭页签、网页或刷新页面时提醒
    window.addEventListener('beforeunload', onBeforeunload, false)
  }
  function removeEvent() {
    // 销毁事件监听
    window.removeEventListener('beforeunload', onBeforeunload, false)
  }
  onMounted(addEvent)
  onActivated(addEvent)
  onUnmounted(removeEvent)
  onDeactivated(removeEvent)
}

// 存储当前页面中所有 routeLeave 中的处理逻辑
// 这里用最简单的方式避免一个页面注册多个监听导致多个弹框情况，用来实现处理局部变量，如 canLeave
interface LeaveGuardHandler {
  // 是否应该阻止
  shouldBlock: () => boolean
  onConfirm: () => void
  onCancel: () => void
}
let pendingLeaveGuards: LeaveGuardHandler[] = ([])

/**
 * vue 级别的离开监听
 * 组件销毁、页面跳转、tab 关闭
 * @param checkChange
 */
function useVueLeaveCheck(checkChange: LeaveCheckCondition) {
  // ----------------- 创建个检查实例 -----------------
  // 控制下次离开页面时候是否继续弹框
  // const canLeave = ref(false)
  const routeLeaveHandle: LeaveGuardHandler = {
    shouldBlock: () => {
      return checkChange({ hasDataChanged })
    },
    onConfirm: () => {
      // // 跳转页面，重置
      // pendingLeaveGuards = []
      // next()
    },
    onCancel: () => {
      // 继续编辑
      // canLeave.value = false
    },
  }

  const init = () => {
    // 有 onMounted 和 onActivated 一起执行的情况，这里用 includes 排除
    !pendingLeaveGuards.includes(routeLeaveHandle) && pendingLeaveGuards.push(routeLeaveHandle)
  }
  // 初始化
  onActivated(init)
  onMounted(init)
  onDeactivated(() => {
    const index = pendingLeaveGuards.indexOf(routeLeaveHandle)
    // 删除
    index !== -1 && pendingLeaveGuards.splice(index, 1)
  })
  // 考虑到弹框等子组件情况
  onUnmounted(() => {
    const index = pendingLeaveGuards.indexOf(routeLeaveHandle)
    // 删除
    index !== -1 && pendingLeaveGuards.splice(index, 1)
  })
  // vue router 触发，如果有多个的情况，有一个没过就不能跳转
  // 就算放懒加载的子组件中都可以监听到
  onBeforeRouteLeave((_to, _from, next) => {
    // console.log('onBeforeRouteLeave====================')
    // console.log(routeLeaveHandleList)

    // 这个页面有几个离开检查时（如：页面有一个，弹框有一个），获取其中的检查有改变的
    const activeGuards = pendingLeaveGuards.filter(e => e.shouldBlock())
    if (!activeGuards.length) {
      // 没有改变项，跳转页面，重置
      pendingLeaveGuards = []
      next()
      return
    }

    // next(false)

    // eslint-disable-next-line no-alert
    const answer = window.confirm('数据未保存，是否仍要离开？')
    if (answer) {
      activeGuards.forEach(e => e.onConfirm())
      pendingLeaveGuards = []
      next()
    }
    else {
      // 继续编辑
      activeGuards.forEach(e => e.onCancel())
      // next(false) 会导致进入 router.push('').then，并且参数为 Error
      next(false)
    }

    // // 弹框提示，这里如果用浏览器的回退，会失效，所以用 window.confirm 替代
    // return confirm().then(() => {
    //   activeGuards.forEach(e => e.onConfirm())
    //   pendingLeaveGuards = []
    //   next()
    //   debugger
    // }).catch(() => {
    //   // 继续编辑
    //   activeGuards.forEach(e => e.onCancel())
    //   debugger
    //   // next(false) 会导致进入 then，并且第一个参数为 Error
    //   next(false)
    // })
  })

  // 手动触发，自定义触发检查的时机，如关闭弹框或抽屉
  function leaveCheck(_hasDataChanged?: LeaveCheckCondition) {
    if (!checkChange({ hasDataChanged: _hasDataChanged ?? hasDataChanged })) {
      // 检查没改变，返回成功
      return Promise.resolve()
    }

    return confirm()
  }

  return {
    leaveCheck,
  }
}

/**
 * 离开提醒
 * 一般在弹框中使用
 * @param checkChange 是否检查，传函数是为了懒加载计算
 * @returns 手动触发离开提醒
 */
function useLeaveCheckCore(checkChange: LeaveCheckCondition) {
  // ----------------- 浏览器级别的离开监听 -----------------
  beforeunload(checkChange)

  // ----------------- vue 级别的离开监听 -----------------
  const { leaveCheck } = useVueLeaveCheck(checkChange)

  return {
    // 手动触发，自定义触发检查的时机，如关闭弹框或抽屉
    leaveCheck,
  }
}

// ----------------- 对外暴露的 hooks -----------------
export function useLeaveGuard(shouldBlockLeave: LeaveCheckCondition) {
  return useLeaveCheckCore(shouldBlockLeave)
}
export function useLeaveGuardByComparison(getComparisonPair: () => [originalValue: any, currentValue: any]) {
  return useLeaveCheckCore(({ hasDataChanged }) => {
    const [originalValue, currentValue] = getComparisonPair()
    return hasDataChanged(originalValue, currentValue)
  })
}
