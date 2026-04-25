<!--
 栅格组件
 子组件用 base-col
-->
<script setup lang='tsx'>
import type { BaseRowProps } from './types'
import { Comment, Fragment, isVNode, /* Static, */ Suspense, Text } from 'vue'
import BaseCol from './BaseCol.vue'
import { setupStore } from './context'

const props = withDefaults(defineProps<BaseRowProps>(), {
  gutter: 10,
  col: 2,
})

setupStore(toRef(props, 'col'), toRef(props, 'cols'))

const gutter = computed(() => {
  return Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
})

const gap = computed(() => {
  return Array.isArray(props.gutter) ? `${props.gutter[1]}px 0` : `${props.gutter}px 0`
})

/**
 * 判断是否是 BaseCol 类型
 * @param vnode
 */
function isBaseRow(vnode) {
  // console.log(vnode.type.__name, BaseCol.__name)
  return vnode.type.__name === BaseCol.__name
  // return vnode.type === BaseCol
}

/**
 * 判断一个 VNode 是否可渲染
 * @param {import('vue').VNode} vnode - 要检查的虚拟节点
 * @returns {boolean} 返回 true 表示可渲染，false 表示不可渲染
 *
 * 功能说明：
 * 1. 检查各种不可渲染的 VNode 类型（null、undefined、注释等）
 * 2. 特殊处理 Fragment 和 Suspense 组件
 * 3. 检查文本节点是否有实际内容
 * 4. 过滤掉指令节点（如 v-if、v-for 等）
 */
function isRenderableVNode(vnode) {
  // 基础检查：确保传入的是有效的 VNode
  if (!isVNode(vnode)) {
    return false
  }

  const { children } = vnode

  // 使用 switch 语句处理不同类型的 VNode
  switch (vnode.type) {
    // null 或 undefined 类型的 VNode 不可渲染
    case null:
    case undefined:
      return false

    // 注释节点不可渲染
    case Comment:
      return false

    // 文本节点：检查是否有非空白内容
    case Text:
      return children != null && String(children).trim() !== ''

    // Fragment 片段：检查是否有可渲染的子节点
    case Fragment:
      return Array.isArray(children)
        && children.some(isRenderableVNode)

    // Suspense 组件：检查默认内容是否可渲染
    case Suspense:{
      const suspenseContent = vnode.suspense?.activeBranch || (vnode as any).ssContent
      return suspenseContent != null && isRenderableVNode(suspenseContent)
    }

    // 默认情况处理
    default:
      // 符号类型的节点（Vue 内部使用的特殊节点）不可渲染
      if (typeof vnode.type === 'symbol') {
        return false
      }

      // 指令节点（以 'v-' 开头的类型）不可渲染
      if (typeof vnode.type === 'string' && vnode.type.startsWith('v-')) {
        return false
      }

      // 其他情况视为可渲染
      return true
  }
}
const slots = useSlots()

/**
 * 这里只能是普通函数，不能是计算函数，不然在重置 v-model="data.xxx" 中的 data 时，不会触发重新渲染
 * 性能方面不用过于担心，只是 gridItems 每次需要重新计算，组件并不会每次都重新渲染
 * 注意这里面不要用 filter，这样会导致数据量不同，触发组件的重新渲染
 */
function getGridItems() {
  const result: any[] = []
  const renderableVNode = slots.default?.() || []

  renderableVNode.forEach((child, childIndex) => {
    if (Fragment === child.type && Array.isArray(child.children)) {
      const filteredChildren = child.children
      filteredChildren.forEach((dom, domIndex) => {
        const vnodeKey = isVNode(dom) ? dom.key : null
        result.push({
          key: vnodeKey ?? `node-${childIndex}-${domIndex}`,
          vnode: dom,
          renderable: isRenderableVNode(dom),
          isGridItem: isBaseRow(dom),
        })
      })
    }
    else {
      result.push({
        key: child.key ?? `node-${childIndex}`,
        vnode: child,
        renderable: isRenderableVNode(child),
        isGridItem: isBaseRow(child),
      })
    }
  })

  return result
}
</script>

<template>
  <ElRow :gutter="gutter" :style="{ gap }">
    <template v-for="item in getGridItems()" :key="item.key">
      <template v-if="item.renderable">
        <component :is="item.vnode" v-if="item.isGridItem" />
        <BaseCol v-else>
          <component :is="item.vnode" />
        </BaseCol>
      </template>
    </template>
  </ElRow>
</template>

<style lang="scss"  scoped>

</style>
