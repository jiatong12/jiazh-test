import type { ReadonlyWidgetType, WidgetConfig, WidgetType } from '../types'
import { ElCheckbox, ElDatePicker, ElLink, ElSwitch, ElText, ElTimePicker } from 'element-plus'
import { isString } from 'lodash-es'
import { defineAsyncComponent } from 'vue'
import { BaseBadge } from '@/components/base-badge'
import { BaseCheckboxGroup } from '@/components/base-checkbox-group'
import { BaseDecimal } from '@/components/base-decimal'
import { BaseDictBadge } from '@/components/base-dict-badge'
import { BaseDictTag } from '@/components/base-dict-tag'
import { BaseDictText } from '@/components/base-dict-text'
import { BaseIcon } from '@/components/base-icon'
import { BaseImage } from '@/components/base-image'
import { BaseInput } from '@/components/base-input'
import { BaseNumber } from '@/components/base-number'
import { BaseRadio } from '@/components/base-radio'
import { BaseSelect } from '@/components/base-select'
import { BaseSelectTag } from '@/components/base-select-tag'
import { BaseTag } from '@/components/base-tag'
import { BaseText } from '@/components/base-text'
import { BaseTextarea } from '@/components/base-textarea'
import { BaseTreeSelect } from '@/components/base-tree-select'
import { getCssVar } from '@/utils/color'

type Render = (config: WidgetConfig) => VNode

const AsyncBaseIconPicker = defineAsyncComponent(() =>
  import('@/components/base-icon-picker').then(mod => mod.BaseIconPicker),
)

const textRender: Render = ({ dict, modelValue, widgetProps, readonlyEmpty }) => {
  if (modelValue === '' || modelValue === void 0 || modelValue === null) {
    // 空时显示的内容，只有展示组件会这样显示
    return <>{readonlyEmpty}</>
  }

  if (dict) {
    return (
      <BaseDictText value={modelValue} dict={dict} {...widgetProps}></BaseDictText>
    )
  }
  return <BaseText {...widgetProps}>{modelValue}</BaseText>
}

const tagRender: Render = ({ dict, modelValue, widgetProps, readonlyEmpty }) => {
  if (modelValue === '' || modelValue === void 0 || modelValue === null) {
    // 空时显示的内容，只有展示组件会这样显示
    return <>{readonlyEmpty}</>
  }

  if (dict) {
    return (
      <BaseDictTag value={modelValue} dict={dict} {...widgetProps}></BaseDictTag>
    )
  }
  return <BaseTag {...widgetProps}>{modelValue}</BaseTag>
}

/* 组件映射，此对象放里面方便后面根据 item 数据修改 */
const widgetMap: Record<WidgetType, { readonlyWidget: ReadonlyWidgetType | Render, render: Render }> = {
  text: {
    readonlyWidget: 'text',
    render: textRender,
  },
  tag: {
    readonlyWidget: 'tag',
    render: tagRender,
  },
  badge: {
    readonlyWidget: 'badge',
    render({ dict, modelValue, widgetProps, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
        return <>{readonlyEmpty}</>
      }

      if (dict) {
        return (
          <BaseDictBadge
            value={modelValue}
            dict={dict}
            {...widgetProps}
          >
          </BaseDictBadge>
        )
      }
      return <BaseBadge {...widgetProps}>{modelValue}</BaseBadge>
    },
  },
  link: {
    readonlyWidget: 'link',
    render({ dict, modelValue, widgetProps, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
        return <span class="color-gray">{readonlyEmpty}</span>
      }

      if (dict) {
        return (
          <ElLink type="primary" {...widgetProps}>
            <BaseDictText
              value={modelValue}
              dict={dict}
              {...widgetProps}
            >
            </BaseDictText>
          </ElLink>
        )
      }
      return (
        <ElLink type="primary" {...widgetProps}>
          {modelValue}
        </ElLink>
      )
    },
  },
  image: {
    readonlyWidget: 'image',
    render({ modelValue, widgetProps, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
        return <>{readonlyEmpty}</>
      }

      return (
        <BaseImage
          src={modelValue}
          height={100}
          width={100}
          {...widgetProps}
        >
        </BaseImage>
      )
    },
  },
  input: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return textRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <BaseInput
          modelValue={modelValue}
          onUpdate:modelValue={val => setModelValue(val?.trim())}
          placeholder="请输入"
          clearable
          {...widgetProps}
        >
        </BaseInput>
      )
    },
  },
  textarea: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return textRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <BaseTextarea
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          autosize={{ minRows: 3, maxRows: 5 }}
          placeholder="请输入"
          clearable
          {...widgetProps}
        >
        </BaseTextarea>
      )
    },
  },
  number: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return textRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <BaseNumber
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          min={1}
          placeholder="请输入"
          {...widgetProps}
        >
        </BaseNumber>
      )
    },
  },
  decimal: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return textRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <BaseDecimal
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          min={1}
          placeholder="请输入"
          {...widgetProps}
        >
        </BaseDecimal>
      )
    },
  },
  switch: {
    readonlyWidget: (config) => {
      const { modelValue, setModelValue, readonlyEmpty, widgetProps } = config
      const { activeText, inactiveText, activeValue, inactiveValue } = widgetProps ?? {}
      const noColor = getCssVar('--el-switch-on-color')
      const offColor = getCssVar('--el-switch-off-color')
      const dict = [{ label: activeText, value: activeValue, color: noColor }, { label: inactiveText, value: inactiveValue, color: offColor }]
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElSwitch
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          {...widgetProps}
        >
        </ElSwitch>
      )
    },
  },
  checkbox: {
    readonlyWidget: (config) => {
      const { modelValue, setModelValue, readonlyEmpty, widgetProps } = config
      const { trueValue, falseValue } = widgetProps ?? {}
      const dict = [{ label: '是', value: trueValue }, { label: '否', value: falseValue }]
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElCheckbox
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          {...widgetProps}
        >
        </ElCheckbox>
      )
    },
  },
  checkboxGroup: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseCheckboxGroup
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          {...widgetProps}
        >
        </BaseCheckboxGroup>
      )
    },
  },
  radio: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseRadio
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          {...widgetProps}
        >
        </BaseRadio>
      )
    },
  },
  select: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseSelect
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          clearable
          placeholder="请选择"
          {...widgetProps}
        >
        </BaseSelect>
      )
    },
  },
  multipleSelect: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseSelect
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          clearable
          multiple
          placeholder="请选择"
          {...widgetProps}
        >
        </BaseSelect>
      )
    },
  },
  treeSelect: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseTreeSelect
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          clearable
          placeholder="请选择"
          {...widgetProps}
        >
        </BaseTreeSelect>
      )
    },
  },
  multipleTreeSelect: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseTreeSelect
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          clearable
          multiple
          placeholder="请选择"
          {...widgetProps}
        >
        </BaseTreeSelect>
      )
    },
  },
  selectTag: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseSelectTag
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          multiple={false}
          showAll={false}
          {...widgetProps}
        />
      )
    },
  },
  multipleSelectTag: {
    readonlyWidget: (config) => {
      const { dict, modelValue, setModelValue, readonlyEmpty } = config
      return tagRender({ dict, modelValue, setModelValue, readonlyEmpty })
    },
    render({ dict, modelValue, setModelValue, widgetProps }) {
      return (
        <BaseSelectTag
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          dict={dict}
          multiple
          showAll={false}
          {...widgetProps}
        />
      )
    },
  },
  iconPicker: {
    readonlyWidget({ modelValue, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
        return <>{readonlyEmpty}</>
      }

      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <BaseIcon name={modelValue} style={{ fontSize: '16px' }} />
          <span>{modelValue}</span>
        </span>
      )
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <AsyncBaseIconPicker
          modelValue={modelValue || ''}
          onUpdate:modelValue={setModelValue}
          {...widgetProps}
        />
      )
    },
  },
  date: {
    readonlyWidget: 'text',
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElDatePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          type="date"
          valueFormat="YYYY-MM-DD"
          placeholder="请选择日期"
          clearable
          {...widgetProps}
        >
        </ElDatePicker>
      )
    },
  },
  dateRange: {
    readonlyWidget({ modelValue, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
        return <>{readonlyEmpty}</>
      }
      return <ElText>{`${modelValue.join(' 至 ')}`}</ElText>
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElDatePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          type="daterange"
          valueFormat="YYYY-MM-DD"
          rangeSeparator="至"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          clearable
          {...widgetProps}
        >
        </ElDatePicker>
      )
    },
  },
  time: {
    readonlyWidget: 'text',
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElTimePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          placeholder="请选择时间"
          clearable
          {...widgetProps}
        >
        </ElTimePicker>
      )
    },
  },
  timeRange: {
    readonlyWidget({ modelValue, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
        return <>{readonlyEmpty}</>
      }
      return <ElText>{`${modelValue.join(' 至 ')}`}</ElText>
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElTimePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          isRange
          clearable
          rangeSeparator="至"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          {...widgetProps}
        >
        </ElTimePicker>
      )
    },
  },
  dateTime: {
    readonlyWidget: 'text',
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElDatePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          type="datetime"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择时间"
          clearable
          {...widgetProps}
        >
        </ElDatePicker>
      )
    },
  },
  dateTimeRange: {
    readonlyWidget({ modelValue, readonlyEmpty }) {
      if (modelValue === '' || modelValue === void 0 || modelValue === null) {
      // 空时显示的内容，只有展示组件会这样显示
        return <>{readonlyEmpty}</>
      }
      return <ElText>{`${modelValue.join(' 至 ')}`}</ElText>
    },
    render({ modelValue, setModelValue, widgetProps }) {
      return (
        <ElDatePicker
          modelValue={modelValue}
          onUpdate:modelValue={setModelValue}
          type="datetimerange"
          format="YYYY-MM-DD HH:mm:ss"
          valueFormat="YYYY-MM-DD HH:mm:ss"
          rangeSeparator="至"
          startPlaceholder="开始时间"
          endPlaceholder="结束时间"
          clearable
          {...widgetProps}
        >
        </ElDatePicker>
      )
    },
  },
}

export function useFormWidget() {
  return {
    /**
     * 获取表单物料
     *
     * @param config 配置
     */
    getWidget(config: WidgetConfig) {
      const { widget = 'input' } = config

      const { render } = widgetMap[widget]
      if (render) {
        return render(config)
      }

      return void 0
    },

    /**
     * 获取表单只读物料
     *
     * @param config 配置
     */
    getReadonlyWidget(config: WidgetConfig) {
      const { widget = 'text' } = config

      const { readonlyWidget } = widgetMap[widget]
      if (readonlyWidget) {
        const render = isString(readonlyWidget) ? widgetMap[readonlyWidget].render : readonlyWidget
        return render(config)
      }

      return void 0
    },
  }
}
