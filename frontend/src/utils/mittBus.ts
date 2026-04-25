// import type { Emitter, EventType } from 'mitt'
/**
 * 全局事件总线，用于全局事件的发布与订阅
 * 用法：
 * mittBus.on('event', callback)
 * mittBus.emit('event', data)
 */
import mitt from 'mitt'

// 创建类型安全的事件总线实例
const mittBus = mitt<{
  // // 打开设置面板事件
  // openSetting: void
  // // 打开锁屏事件
  // openLockScreen: void
  // 打开主题配置抽屉
  openThemeDrawer: void
}>()

export default mittBus
