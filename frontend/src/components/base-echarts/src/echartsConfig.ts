import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  FunnelSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts'
import type {
  DatasetComponentOption,
  DataZoomComponentOption,
  GridComponentOption,
  LegendComponentOption,
  RadarComponentOption,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components'
import type {
  ComposeOption,
} from 'echarts/core'
import {
  BarChart,
  FunnelChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
} from 'echarts/charts'
import {
  // 数据集组件
  DatasetComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'

type ECSeriesOption
  = | BarSeriesOption
    | FunnelSeriesOption
    | LineSeriesOption
    | PieSeriesOption
    | RadarSeriesOption
    | ScatterSeriesOption

type ECComponentOption
  = | DataZoomComponentOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | LegendComponentOption
    | RadarComponentOption
    | DatasetComponentOption

// 通过 ComposeOption 组合项目当前已注册的图表和组件类型
export type ECOption = ComposeOption<ECSeriesOption | ECComponentOption>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  RadarComponent,
  DataZoomComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  FunnelChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  SVGRenderer,
])

export default echarts
