import type { BaseTableSearchType, WidgetConfig } from '../types/search.types'
import { ElDatePicker, ElInput, ElInputNumber, ElSwitch, ElTimePicker } from 'element-plus'

import { BaseNumber } from '@/components/base-number'
import { BaseSelect } from '@/components/base-select'
import { BaseSelectTag } from '@/components/base-select-tag'
import { BaseTreeSelect } from '@/components/base-tree-select'

type Render = (config: WidgetConfig) => VNode

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const dateShortcuts = [
  { text: '今天', value: () => new Date() },
  { text: '昨天', value: () => new Date(Date.now() - ONE_DAY_MS) },
  { text: '一周前', value: () => new Date(Date.now() - 7 * ONE_DAY_MS) },
]

const rangeShortcuts = [
  {
    text: '最近7天',
    value: () => {
      const end = new Date()
      const start = new Date(Date.now() - 6 * ONE_DAY_MS)
      return [start, end]
    },
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date()
      const start = new Date(Date.now() - 29 * ONE_DAY_MS)
      return [start, end]
    },
  },
  {
    text: '本月',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const now = new Date()
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 0)
      return [start, end]
    },
  },
]

/* 组件映射，此对象放里面方便后面根据 item 数据修改 */
const widgetMap: Record<BaseTableSearchType, Render> = {
  input({ modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <ElInput
        modelValue={modelValue}
        onUpdate:modelValue={val => setModelValue(val?.trim())}
        placeholder="请输入"
        clearable
        onClear={handleSearch}
        {...widgetProps}
      >
      </ElInput>
    )
  },

  number({ modelValue, setModelValue, widgetProps }) {
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
  numberRange({ modelValue, setModelValue, widgetProps }) {
    const rangeValue = Array.isArray(modelValue) ? modelValue : [null, null]

    const setValue = (newValue: any[]) => {
      if (newValue[0] === null && newValue[1] === null) {
        setModelValue(null)
      }
      else {
        setModelValue(newValue)
      }
    }

    const handleStartChange = (val: number | null | undefined) => {
      const newValue = [val, rangeValue[1]]
      setValue(newValue)
    }

    const handleEndChange = (val: number | null | undefined) => {
      const newValue = [rangeValue[0], val]
      setValue(newValue)
    }

    return (
      <div class="search-form-number-range" style="display: flex; align-items: center; gap: 10px; flex-wrap:wrap;">
        <ElInputNumber
          modelValue={rangeValue[0]}
          onUpdate:modelValue={handleStartChange}
          placeholder="最小值"
          controls={false}
          style="width:100px;min-width:100px"
          {...widgetProps}
        />
        <span>-</span>
        <ElInputNumber
          modelValue={rangeValue[1]}
          onUpdate:modelValue={handleEndChange}
          placeholder="最大值"
          controls={false}
          style="width:100px;min-width:100px"
          {...widgetProps}
        />
      </div>
    )
  },

  select({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseSelect
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        clearable
        placeholder="请选择"
        {...widgetProps}
      >
      </BaseSelect>
    )
  },
  switch({ modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <ElSwitch
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        {...widgetProps}
      >
      </ElSwitch>
    )
  },
  multipleSelect({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseSelect
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        clearable
        multiple
        placeholder="请选择"
        {...widgetProps}
      >
      </BaseSelect>
    )
  },
  treeSelect({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseTreeSelect
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        clearable
        placeholder="请选择"
        {...widgetProps}
      >
      </BaseTreeSelect>
    )
  },
  multipleTreeSelect({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseTreeSelect
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        clearable
        multiple
        placeholder="请选择"
        {...widgetProps}
      >
      </BaseTreeSelect>
    )
  },
  selectTag({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseSelectTag
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        multiple={false}
        showAll={false}
        {...widgetProps}
      />
    )
  },
  multipleSelectTag({ dict, modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <BaseSelectTag
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        dict={dict}
        multiple
        showAll={false}
        {...widgetProps}
      />
    )
  },
  date({ modelValue, setModelValue, handleSearch, widgetProps }) {
    const shortcuts = widgetProps?.shortcuts ?? dateShortcuts
    return (
      <ElDatePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        type="date"
        valueFormat="YYYY-MM-DD"
        placeholder="请选择日期"
        clearable
        shortcuts={shortcuts}
        {...widgetProps}
      >
      </ElDatePicker>
    )
  },
  dateRange({ modelValue, setModelValue, handleSearch, widgetProps }) {
    const shortcuts = widgetProps?.shortcuts ?? rangeShortcuts
    return (
      <ElDatePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        type="daterange"
        valueFormat="YYYY-MM-DD"
        rangeSeparator="至"
        startPlaceholder="开始时间"
        endPlaceholder="结束时间"
        clearable
        shortcuts={shortcuts}
        unlinkPanels
        {...widgetProps}
      >
      </ElDatePicker>
    )
  },
  time({ modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <ElTimePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        placeholder="请选择时间"
        clearable
        {...widgetProps}
      >
      </ElTimePicker>
    )
  },
  timeRange({ modelValue, setModelValue, handleSearch, widgetProps }) {
    return (
      <ElTimePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
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
  dateTime({ modelValue, setModelValue, handleSearch, widgetProps }) {
    const shortcuts = widgetProps?.shortcuts ?? dateShortcuts
    return (
      <ElDatePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        type="datetime"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        placeholder="请选择时间"
        clearable
        shortcuts={shortcuts}
        {...widgetProps}
      >
      </ElDatePicker>
    )
  },
  dateTimeRange({ modelValue, setModelValue, handleSearch, widgetProps }) {
    const shortcuts = widgetProps?.shortcuts ?? rangeShortcuts
    return (
      <ElDatePicker
        modelValue={modelValue}
        onUpdate:modelValue={(val) => {
          setModelValue(val)
          handleSearch()
        }}
        type="datetimerange"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        rangeSeparator="至"
        startPlaceholder="开始时间"
        endPlaceholder="结束时间"
        clearable
        unlinkPanels
        shortcuts={shortcuts}
        {...widgetProps}
      >
      </ElDatePicker>
    )
  },
}

export function useSearchFormWidget() {
  return {
    /**
     * 获取表单物料
     *
     * @param config 配置
     */
    getWidget(config: WidgetConfig) {
      const { widget = 'input' } = config

      const render = widgetMap[widget]
      if (render) {
        return render(config)
      }

      return void 0
    },

  }
}
