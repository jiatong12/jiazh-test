<script setup lang="ts">
import type { ECOption } from '@/components/base-echarts'
import { graphic } from 'echarts'
import { getCssVar, hexToRgba } from '@/utils/color'

/**
 * 全年访问量数据
 * 记录每月的访问量统计
 */
const data = [50, 25, 40, 20, 70, 35, 65, 30, 35, 20, 40, 44]

/**
 * X 轴月份标签
 */
const xAxisData = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

// 配置图表选项
const chartOptions = ref<ECOption>({
  grid: {
    left: '0',
    right: '20',
    bottom: '0',
    top: '20',
    containLabel: true,
  },
  tooltip: {
    trigger: 'axis',
    borderColor: 'transparent',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: xAxisData,
  },
  yAxis: {
    type: 'value',
  },
  series: [{
    data,
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 0,
    areaStyle: {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: hexToRgba(getCssVar('--el-color-primary'), 0.2).rgba,
        },
        {
          offset: 1,
          color: hexToRgba(getCssVar('--el-color-primary'), 0.01).rgba,
        },
      ]),
    },
  }],
})
</script>

<template>
  <div class="card flex-column-layout">
    <div class="header-container">
      <div class="title-container">
        <div class="title">
          访问量
        </div>
        <div class="info">
          今年增长<span class="positive-change">+15%</span>
        </div>
      </div>
    </div>
    <BaseEcharts
      class="chart-container flex-height-fill"
      :option="chartOptions"
      height="20rem"
    />
  </div>
</template>

<style lang="scss" scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-container {
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .info {
      font-size: 14px;
      color: var(--zv-text-color-secondary);
      .positive-change {
        margin-left: 10px;
        color: var(--zv-success);
      }
    }
  }
}
</style>
