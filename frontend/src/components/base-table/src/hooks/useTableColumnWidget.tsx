import type { ColumnWidgetType, WidgetConfig } from '../types/table.types'
import { ElLink } from 'element-plus'
import { BaseBadge } from '@/components/base-badge'
import { BaseDictBadge } from '@/components/base-dict-badge'
import { BaseDictTag } from '@/components/base-dict-tag'
import { BaseDictText } from '@/components/base-dict-text'
import { BaseImage } from '@/components/base-image'
import { BaseTag } from '@/components/base-tag'
import { BaseText } from '@/components/base-text'

type Render = (config: WidgetConfig) => VNode

/* 组件映射，此对象放里面方便后面根据 item 数据修改 */
const widgetMap: Record<ColumnWidgetType, Render> = {
  text: ({ dict, modelValue, empty, widgetClick, scope }) => {
    if (modelValue === '' || modelValue === void 0 || modelValue === null) {
    // 空时显示的内容，只有展示组件会这样显示
      return <>{empty}</>
    }

    if (dict) {
      return (
        <BaseDictText value={modelValue} dict={dict} onClick={() => widgetClick?.(scope)}></BaseDictText>
      )
    }
    return <BaseText onClick={() => widgetClick?.(scope)}>{modelValue}</BaseText>
  },
  tag: ({ dict, modelValue, empty, widgetClick, scope }) => {
    if (modelValue === '' || modelValue === void 0 || modelValue === null) {
    // 空时显示的内容，只有展示组件会这样显示
      return <>{empty}</>
    }

    if (dict) {
      return (
        <BaseDictTag value={modelValue} dict={dict} onClick={() => widgetClick?.(scope)}></BaseDictTag>
      )
    }
    return <BaseTag onClick={() => widgetClick?.(scope)}>{modelValue}</BaseTag>
  },
  badge: ({ dict, modelValue, empty, widgetClick, scope }) => {
    if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
      return <>{empty}</>
    }

    if (dict) {
      return (
        <BaseDictBadge value={modelValue} dict={dict} onClick={() => widgetClick?.(scope)}> </BaseDictBadge>
      )
    }
    return <BaseBadge onClick={() => widgetClick?.(scope)}>{modelValue}</BaseBadge>
  },
  link: ({ dict, modelValue, empty, widgetClick, scope }) => {
    if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
      return <span class="color-gray">{empty}</span>
    }

    if (dict) {
      return (
        <ElLink type="primary" onClick={() => widgetClick?.(scope)}>
          <BaseDictText value={modelValue} dict={dict} style={{ color: 'inherit' }}></BaseDictText>
        </ElLink>
      )
    }
    return (
      <ElLink type="primary" onClick={() => widgetClick?.(scope)}>
        {modelValue}
      </ElLink>
    )
  },
  image: ({ modelValue, empty }) => {
    if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      return <>{empty}</>
    }

    return (
      <BaseImage src={modelValue} height={100} width={100}></BaseImage>
    )
  },
}

export function useTableColumnWidget() {
  return {
    /**
     * 获取表格物料
     *
     * @param config 配置
     */
    getWidget(config: WidgetConfig) {
      const { widget = 'text' } = config

      const render = widgetMap[widget]
      if (render) {
        return render(config)
      }

      return void 0
    },
  }
}
