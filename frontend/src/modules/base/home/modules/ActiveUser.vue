<script setup lang="ts">
import type { ECOption } from '@/components/base-echarts'

interface UserStatItem {
  name: string
  num: string
}

// 最近9个月
const xAxisLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']

// 每月活跃用户数
const chartData = [160, 100, 150, 80, 190, 100, 175, 120, 160]

/**
 * 用户统计数据列表
 * 包含总用户量、总访问量、日访问量和周同比等关键指标
 */
const list: UserStatItem[] = [
  { name: '总用户量', num: '32k' },
  { name: '总访问量', num: '128k' },
  { name: '日访问量', num: '1.2k' },
  { name: '周同比', num: '+5%' },
]

// 构建 ECharts 选项配置
const chartOptions: ECOption = {
  tooltip: {
    trigger: 'axis',
  },
  // grid: {
  //   left: '0%',
  //   right: '0%',
  //   bottom: '0%',
  //   top: '0%',
  //   containLabel: true,
  // },
  xAxis: [
    {
      type: 'category',
      data: xAxisLabels,
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [
    {
      name: '活跃用户数',
      type: 'bar',
      barWidth: '50%', // 对应原 bar-width="50%"
      data: chartData,
    },
  ],
}
</script>

<template>
  <div class="card flex-column-layout">
    <BaseEcharts
      class="chart-container flex-height-fill"
      :option="chartOptions"
    />

    <div>
      <div class="info-section">
        <div class="overview-title">
          用户概述
        </div>
        <div class="week-change">
          比上周 <span class="success-text">+23%</span>
        </div>
        <div class="description">
          我们为您创建了多个选项，可将它们组合在一起并定制为像素完美的页面
        </div>
      </div>
      <div class="stats-grid">
        <div v-for="(item, index) in list" :key="index" class="stat-item">
          <div class="stat-number">
            {{ item.num }}
          </div>
          <div class="stat-label">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-container {
  box-sizing: border-box;
  padding: 8px;
}

.info-section {
  margin-left: 4px;
}

.overview-title {
  font-size: 18px;
}

.week-change {
  margin-top: 4px;
  font-size: 14px;
}

.description {
  margin-top: 4px;
  font-size: 14px;
}

.success-text {
  color: var(--zv-success);
  font-weight: 500;
}

.stats-grid {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.stat-item {
  flex: 1;
}

.stat-number {
  font-size: 22px;
  color: var(--zv-text-color-primary);
}
.stat-label {
  font-size: 12px;
  color: var(--zv-text-color-secondary);
}
</style>
