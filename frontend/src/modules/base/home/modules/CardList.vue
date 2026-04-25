<script setup lang="ts">
import { CountTo } from 'vue3-count-to'

interface CardDataItem {
  des: string
  icon: string
  startVal: number
  duration: number
  num: number
  change: string
}

/**
 * 卡片统计数据列表
 * 展示总访问次数、在线访客数、点击量和新用户等核心数据指标
 */
const dataList = reactive<CardDataItem[]>([
  {
    des: '总访问次数',
    icon: 'i-mdi:chart-line',
    startVal: 0,
    duration: 1000,
    num: 9120,
    change: '+20%',
  },
  {
    des: '在线访客数',
    icon: 'i-mdi:account-group',
    startVal: 0,
    duration: 1000,
    num: 182,
    change: '+10%',
  },
  {
    des: '点击量',
    icon: 'i-mdi:fire',
    startVal: 0,
    duration: 1000,
    num: 9520,
    change: '-12%',
  },
  {
    des: '新用户',
    icon: 'i-mdi:account-plus',
    startVal: 0,
    duration: 1000,
    num: 156,
    change: '+30%',
  },
])
</script>

<template>
  <!-- <ElRow :gutter="20" style="gap: 20px 0;">
    <ElCol v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">

    </ElCol>
  </ElRow> -->

  <BaseRow :gutter="20" :cols="{ sm: 2, md: 4, lg: 4 }">
    <div v-for="(item, index) in dataList" :key="index" class="card-item card">
      <span class="card-des">{{ item.des }}</span>
      <CountTo class="card-number" :end-val="item.num" :duration="1300" />
      <div class="card-change">
        <span class="change-label">较上周</span>
        <span class="change-value" :class="{ 'is-decrease': !item.change.includes('+') }">
          {{ item.change }}
        </span>
      </div>
      <div class="card-icon-wrapper">
        <BaseIcon :name="item.icon" />
      </div>
    </div>
  </BaseRow>
</template>

<style lang="scss" scoped>
.card-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-g-700 {
  color: var(--zv-gray-700);
  font-size: 14px;
}

.card-number {
  font-size: 26px;
  font-weight: 500;
  margin-top: 8px;
}

.card-change {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.change-label {
  font-size: 12px;
  color: var(--zv-gray-600);
}

.change-value {
  margin-left: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--zv-success);

  &.is-decrease {
    color: var(--zv-danger);
  }
}

.card-icon-wrapper {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  font-size: 24px;
  margin: auto 0;
  border-radius: 12px;
  color: var(--zv-primary);
  background-color: var(--zv-primary-8);
}
</style>
