import { getCssVar, hexToRgba } from '@/utils/color'
import { generateEchartsColorPalette } from '@/utils/colorPalette'

/**
 * ECharts 主题钩子函数
 * 基于 Element Plus CSS 变量构建统一的图表主题
 *
 * @returns {object} ECharts 主题配置对象
 */
export function useEchartsTheme() {
  // 定义 Element Plus CSS 变量映射
  const vars = {
    primary: getCssVar('--el-color-primary'), // 主要颜色
    primaryLight1: getCssVar('--el-color-primary-light-1'), // 主要颜色浅色1
    primaryLight3: getCssVar('--el-color-primary-light-3'), // 主要颜色浅色3
    success: getCssVar('--el-color-success'), // 成功状态色
    warning: getCssVar('--el-color-warning'), // 警告状态色
    danger: getCssVar('--el-color-danger'), // 危险状态色
    info: getCssVar('--el-color-info'), // 信息状态色

    textRegular: getCssVar('--el-text-color-regular'), // 常规文本色
    textSecondary: getCssVar('--el-text-color-secondary'), // 次要文本色
    textPlaceholder: getCssVar('--el-text-color-placeholder'), // 占位符文本色

    border: getCssVar('--el-border-color'), // 边框颜色
    borderLight: getCssVar('--el-border-color-light'), // 浅边框颜色
    borderLighter: getCssVar('--el-border-color-lighter'), // 更浅边框颜色

    bg: getCssVar('--el-bg-color'), // 背景色
    bgOverlay: getCssVar('--el-bg-color-overlay'), // 覆盖层背景色

    fontFamily: getCssVar('--el-font-family'), // 字体族
  }

  // 主题配色方案 - 使用 Element Plus 颜色系统
  const colorPalette = generateEchartsColorPalette(vars.primary, 10)

  // 公共坐标轴样式配置 - 统一各类型坐标轴的基础样式
  const commonAxisStyle = {
    axisLine: {
      show: false,
      lineStyle: { color: vars.border }, // 坐标轴线颜色
    },
    axisTick: {
      show: false,
      lineStyle: { color: vars.border }, // 坐标轴刻度线颜色
    },
    axisLabel: {
      show: true,
      color: vars.textSecondary, // 坐标轴标签颜色
    },
    splitLine: {
      show: false,
      lineStyle: { color: [vars.borderLight], type: 'dashed' }, // 分割线样式
    },
    splitArea: {
      show: false,
      areaStyle: { // 分割区域样式
        color: ['rgba(250,250,250,0.05)', 'rgba(200,200,200,0.02)'],
      },
    },
  }

  /**
   * 通用图例项样式生成函数
   * @param {string} [color] - 指定颜色，如果不传则使用默认颜色
   * @returns {object} 图例项样式配置
   */
  const commonItemStyle = (color?: string) => ({
    borderWidth: 1,
    borderColor: vars.border,
    ...(color && { color }), // 如果传入颜色，则应用该颜色
  })

  return {
    // 网格布局配置 - 控制图表绘制区域
    grid: {
      top: 10,
      right: 0,
      left: 0,
      bottom: 0,
      containLabel: true, // 是否包含标签在内
    },

    // 提示框配置 - 鼠标悬停时显示的数据提示
    tooltip: {
      trigger: 'axis', // 触发方式：坐标轴触发
      // backgroundColor: vars.bgOverlay,
      backgroundColor: hexToRgba(vars.bgOverlay, 0.9).rgba, // 背景色
      borderColor: vars.border, // 边框颜色
      textStyle: { color: vars.textRegular }, // 文字样式
      axisPointer: {
        type: 'line', // 指针类型：直线
        lineStyle: { color: vars.primary, width: 1 }, // 直线样式
        crossStyle: { color: vars.primary, width: 1 }, // 十字准星样式
        shadowStyle: { color: 'rgba(0, 0, 0, 0.05)' }, // 阴影样式 - 修复原错误值
      },
    },

    // 颜色配置 - 定义图表各部分使用的颜色序列
    color: colorPalette,

    // 背景和文本基础样式
    backgroundColor: 'transparent', // 背景透明
    textStyle: {
      fontFamily: vars.fontFamily, // 使用 Element Plus 字体
      fontSize: 14, // 默认字体大小
      color: vars.textRegular, // 默认文字颜色
    },

    // 标题配置
    title: {
      textStyle: {
        color: vars.textRegular, // 标题颜色
        fontSize: 16, // 标题字体大小
        fontWeight: 'bold', // 标题字体粗细
      },
      subtextStyle: {
        color: vars.textSecondary, // 副标题颜色
        fontSize: 12, // 副标题字体大小
      },
    },

    // 折线图配置
    line: {
      itemStyle: {
        ...commonItemStyle(),
        borderWidth: '2', // 数据点边框宽度
      },
      lineStyle: {
        width: '3', // 线条宽度
      },
      symbolSize: '8', // 数据点大小
      symbol: 'emptyCircle', // 数据点形状
      smooth: false, // 是否平滑曲线
    },

    // 雷达图配置
    radar: {
      itemStyle: {
        ...commonItemStyle(),
        borderWidth: '2', // 数据点边框宽度
      },
      lineStyle: {
        width: '3', // 线条宽度
      },
      symbolSize: '8', // 数据点大小
      symbol: 'emptyCircle', // 数据点形状
      smooth: false, // 是否平滑曲线
    },

    // 柱状图配置 - 添加圆角效果
    bar: {
      itemStyle: {
        ...commonItemStyle(),
        barBorderWidth: 1, // 柱状图边框宽度
        barBorderColor: vars.border, // 柱状图边框颜色
        borderRadius: 4, // 柱状图圆角半径
      },
      // 设置柱子之间的间距
      barGap: '30%', // 不同系列柱子间的间距
      barCategoryGap: '20%', // 同类别柱子间的间距
    },

    // 饼图配置
    pie: {
      itemStyle: {
        ...commonItemStyle(), // 使用默认项样式
        borderWidth: 1, // 边框宽度
        borderColor: vars.borderLighter, // 边框颜色
        borderRadius: 2, // 圆角半径
      },
      label: { color: vars.textRegular }, // 标签颜色
    },

    // 散点图和其他图表类型的通用配置
    scatter: { itemStyle: commonItemStyle() },
    boxplot: { itemStyle: commonItemStyle() },
    parallel: { itemStyle: commonItemStyle() },
    sankey: { itemStyle: commonItemStyle() },
    funnel: { itemStyle: commonItemStyle() },
    gauge: { itemStyle: commonItemStyle() },

    // K线图配置
    candlestick: {
      itemStyle: {
        color: vars.success, // 阳线颜色
        color0: vars.danger, // 阴线颜色
        borderColor: vars.success, // 阳线边框颜色
        borderColor0: vars.danger, // 阴线边框颜色
        borderWidth: '1', // 边框宽度
      },
    },

    // 关系图配置
    graph: {
      itemStyle: commonItemStyle(), // 节点样式
      lineStyle: {
        width: '1', // 连接线宽度
        color: vars.border, // 连接线颜色
      },
      symbolSize: '8', // 节点大小
      symbol: 'emptyCircle', // 节点形状
      smooth: false, // 是否平滑连接
      color: colorPalette, // 颜色方案
      label: { color: vars.textRegular }, // 标签颜色
    },

    // 地图配置
    map: {
      itemStyle: {
        areaColor: vars.bg, // 区域颜色
        borderColor: vars.borderLight, // 边界颜色
        borderWidth: 0.5, // 边界宽度
      },
      label: { color: vars.textRegular }, // 标签颜色
      emphasis: { // 高亮状态
        itemStyle: {
          areaColor: vars.primaryLight3, // 高亮区域颜色
          borderColor: vars.primary, // 高亮边界颜色
          borderWidth: 1, // 高亮边界宽度
        },
        label: { color: vars.primary }, // 高亮标签颜色
      },
    },

    // 地理坐标图 (与地图配置相同)
    geo: {
      itemStyle: {
        areaColor: vars.bg, // 区域颜色
        borderColor: vars.borderLight, // 边界颜色
        borderWidth: 0.5, // 边界宽度
      },
      label: { color: vars.textRegular }, // 标签颜色
      emphasis: { // 高亮状态
        itemStyle: {
          areaColor: vars.primaryLight3, // 高亮区域颜色
          borderColor: vars.primary, // 高亮边界颜色
          borderWidth: 1, // 高亮边界宽度
        },
        label: { color: vars.primary }, // 高亮标签颜色
      },
    },

    // 各类坐标轴配置
    categoryAxis: { ...commonAxisStyle }, // 类目轴
    valueAxis: { // 数值轴
      ...commonAxisStyle,
      splitLine: { // 分割线 - 数值轴默认显示
        show: true,
        lineStyle: { color: [vars.borderLight], type: 'dashed' },
      },
    },
    logAxis: { // 对数轴
      ...commonAxisStyle,
      splitLine: { // 分割线 - 对数轴默认显示
        show: true,
        lineStyle: { color: [vars.borderLight] },
      },
    },
    timeAxis: { // 时间轴
      ...commonAxisStyle,
      splitLine: { // 分割线 - 时间轴默认显示
        show: true,
        lineStyle: { color: [vars.borderLight] },
      },
    },

    // 工具栏配置
    toolbox: {
      iconStyle: { // 图标样式
        borderColor: vars.textSecondary, // 图标边框颜色
        color: 'transparent', // 图标填充色
      },
      emphasis: { // 高亮状态
        iconStyle: {
          borderColor: vars.textRegular, // 高亮图标边框颜色
          color: 'transparent', // 高亮图标填充色
        },
      },
    },

    // 图例配置
    legend: {
      top: 6, // 默认图例与上边距
      itemGap: 14, // 图例项间距
      padding: [0, 0, 10, 0], // 图例与图形区域的基础留白
      textStyle: { color: vars.textSecondary }, // 图例文字颜色
      pageIconColor: vars.primary, // 图例翻页按钮颜色
      pageIconInactiveColor: vars.textPlaceholder, // 图例翻页按钮未激活颜色
      pageTextStyle: { color: vars.textSecondary }, // 图例翻页文字颜色
    },

    // 时间轴配置
    timeline: {
      lineStyle: { // 轴线样式
        color: vars.primary, // 线条颜色
        width: 2, // 线条宽度
      },
      itemStyle: { // 项目样式
        color: vars.primary, // 项目颜色
        borderWidth: 1, // 项目边框宽度
      },
      controlStyle: { // 控件样式
        color: vars.primary, // 控件颜色
        borderColor: vars.primary, // 控件边框颜色
        borderWidth: 0.5, // 控件边框宽度
      },
      checkpointStyle: { // 当前点样式
        color: vars.primary, // 当前点颜色
        borderColor: vars.bgOverlay, // 当前点边框颜色
      },
      label: { color: vars.textRegular }, // 标签颜色
      emphasis: { // 高亮状态
        itemStyle: { color: vars.primary }, // 高亮项目样式
        controlStyle: { // 高亮控件样式
          color: vars.primary,
          borderColor: vars.primary,
          borderWidth: 0.5,
        },
        label: { color: vars.textRegular }, // 高亮标签颜色
      },
    },

    // 视觉映射配置
    visualMap: {
      color: [vars.primary, vars.primaryLight1], // 渐变色数组
    },

    // 数据缩放配置
    dataZoom: {
      backgroundColor: 'transparent', // 背景色
      dataBackgroundColor: vars.borderLighter, // 数据区域背景色
      fillerColor: 'rgba(94, 124, 224, 0.25)', // 选中区域填充色
      handleColor: vars.primary, // 手柄颜色
      handleSize: '100%', // 手柄大小
      textStyle: { color: vars.textSecondary }, // 文字颜色
    },

    // 标记点配置
    markPoint: {
      label: { color: vars.textRegular }, // 标签颜色
      emphasis: { // 高亮状态
        label: { color: vars.textRegular }, // 高亮标签颜色
      },
    },
  }
}
