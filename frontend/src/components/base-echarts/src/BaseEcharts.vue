<script setup lang="ts" name="ECharts">
import type { ECElementEvent } from 'echarts/core'
import type { ECOption } from './echartsConfig'
import { useDebounceFn, useIntersectionObserver, useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { nextTick, onActivated, onBeforeUnmount, onDeactivated, ref, shallowRef, watch } from 'vue'
import { useGlobalStore } from '@/store/modules/global'
import echarts from './echartsConfig'
import { useEchartsTheme } from './hooks/useEchartsTheme'

const props = withDefaults(defineProps<Props>(), {
  renderer: 'canvas',
  width: '100%',
  height: '100%',
})

interface Props {
  option: ECOption
  renderer?: 'canvas' | 'svg'
  width?: string
  height?: string
  onClick?: (event: ECElementEvent) => void
}

const echartsStyle = computed(() => ({ height: props.height, width: props.width }))

const chartRef = ref<HTMLDivElement>()
const chartInstance = shallowRef<echarts.ECharts | null>(null)
const isInViewport = ref(false)
const skipResizeAnimationOnce = ref(false)

function handleClick(event) {
  props.onClick?.(event)
}

// 图表仅在进入可视区域且容器已有尺寸时初始化，避免长页面提前创建大量实例。
function canRenderChart() {
  if (!chartRef.value || !isInViewport.value) {
    return false
  }

  return chartRef.value.offsetWidth > 0 && chartRef.value.offsetHeight > 0
}

async function initChart() {
  if (!chartRef.value || !canRenderChart()) { return }

  try {
    const customTheme = useEchartsTheme()

    // 检查是否已存在实例
    let instance = echarts.getInstanceByDom(chartRef.value)

    if (!instance) {
      instance = echarts.init(chartRef.value, customTheme, {
        renderer: props.renderer,
      })
      instance.on('click', handleClick)
    }

    chartInstance.value = instance
    updateChart()
  }
  catch (error) {
    console.error('ECharts init error:', error)
  }
}

function resize() {
  if (chartInstance.value) {
    try {
      if (!chartRef.value || chartRef.value.offsetWidth === 0 || chartRef.value.offsetHeight === 0) {
        return
      }

      const duration = skipResizeAnimationOnce.value ? 0 : 300
      chartInstance.value.resize({ animation: { duration } })
      skipResizeAnimationOnce.value = false
    }
    catch (error) {
      console.error('ECharts resize error:', error)
    }
  }
}

const debouncedResize = useDebounceFn(resize, 300, { maxWait: 800 })

// 所有“需要把图表渲染出来”的场景统一走这里，保证懒渲染和恢复逻辑一致。
function tryRenderChart() {
  if (!canRenderChart()) {
    return
  }

  if (!chartInstance.value) {
    nextTick(() => initChart())
    return
  }

  skipResizeAnimationOnce.value = true
  debouncedResize()
}

// 更新图表
function updateChart() {
  try {
    if (!chartInstance.value) {
      tryRenderChart()
      return
    }
    chartInstance.value.setOption(props.option, {
      notMerge: true,
      replaceMerge: ['xAxis', 'yAxis', 'series'], // 提高性能的选项
    })
  }
  catch (error) {
    console.error('图表更新失败:', error)
  }
}

// 使用引用级监听，避免深层递归监听 option 带来的额外开销
watch(
  () => props.option,
  () => {
    updateChart()
  },
)

function destroyChart() {
  try {
    chartInstance.value?.dispose()
  }
  catch (error) {
    console.warn('ECharts dispose warning:', error)
  }
  chartInstance.value = null
}

// 使用 useResizeObserver 替代全局 window resize 监听，更精确
useResizeObserver(chartRef, debouncedResize)

useIntersectionObserver(
  chartRef,
  ([entry]) => {
    isInViewport.value = !!entry?.isIntersecting

    if (!isInViewport.value) {
      return
    }

    // 首次进入可视区域时再初始化，后续重新进入时只做必要的恢复。
    tryRenderChart()
  },
  {
    threshold: 0.05,
  },
)

const globalStore = useGlobalStore()
const { layout, isCollapse, tabs, footer, primary, isDark } = storeToRefs(globalStore)
// 改变布局的操作，需要重新 resize
watch(
  () => [layout.value, isCollapse.value, tabs.value, footer.value],
  () => {
    debouncedResize()
  },
)

/*
修改主题颜色，需要重新初始化
ps: 后续主题如果根据黑暗模式进行了配置，需要监听 isDark
*/
watch(
  // () => primary.value,
  () => [primary.value, isDark.value],
  () => {
    destroyChart()
    // 主题切换后仍然按可视区门槛重建，避免不可见图表被提前初始化。
    tryRenderChart()
  },
)

onActivated(() => {
  skipResizeAnimationOnce.value = true
  tryRenderChart()
})

onDeactivated(() => {
  skipResizeAnimationOnce.value = true
})

onBeforeUnmount(() => {
  destroyChart()
})

// 暴露方法
defineExpose({
  // 获取实例，可用来注册事件等操作
  getInstance: () => chartInstance.value,
  resize,
  updateChart,
})
</script>

<template>
  <div ref="chartRef" class="echarts-container" :style="echartsStyle" />
</template>

<style scoped>
.echarts-container {
  min-height: 100px;
  min-width: 100px;
}
</style>
