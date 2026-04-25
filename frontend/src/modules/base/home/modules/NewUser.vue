<script setup lang="ts">
import { useTableSetup } from '@/components/base-table'

const ANIMATION_DELAY = 100

const radio = ref('本月')

/**
 * 新用户表格数据
 * 包含用户基本信息和完成进度
 */
const tableData = reactive([
  {
    username: '中小鱼',
    province: '北京',
    sex: 0,
    age: 22,
    percentage: 60,
    pro: 0,
    color: 'var(--zv-primary)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
  {
    username: '何小荷',
    province: '深圳',
    sex: 1,
    age: 21,
    percentage: 20,
    pro: 0,
    color: 'var(--zv-primary)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
  {
    username: '誶誶淰',
    province: '上海',
    sex: 1,
    age: 23,
    percentage: 60,
    pro: 0,
    color: 'var(--zv-warning)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
  {
    username: '发呆草',
    province: '长沙',
    sex: 0,
    age: 28,
    percentage: 50,
    pro: 0,
    color: 'var(--zv-info)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
  {
    username: '甜筒',
    province: '浙江',
    sex: 1,
    age: 26,
    percentage: 70,
    pro: 0,
    color: 'var(--zv-danger)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
  {
    username: '冷月呆呆',
    province: '湖北',
    sex: 1,
    age: 25,
    percentage: 90,
    pro: 0,
    color: 'var(--zv-success)',
    avatar: 'https://i.imgtg.com/2023/01/16/QRqMK.jpg',
  },
])

/**
 * 添加进度条动画效果
 * 延迟后将进度值从 0 更新到目标百分比，触发动画
 */
function addAnimation(): void {
  setTimeout(() => {
    tableData.forEach((item) => {
      item.pro = item.percentage
    })
  }, ANIMATION_DELAY)
}

onMounted(() => {
  addAnimation()
})

const tableConfig = useTableSetup({
  rowKey: 'username',
  showPagination: false,
  datasource: () => Promise.resolve(tableData),
  columns: [
    {
      label: '头像',
      prop: 'avatar',
      width: '150px',
    },
    {
      label: '地区',
      prop: 'province',
    },
    {
      label: '性别',
      prop: 'sex',
      align: 'center',
      dict: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
      ],
    },
    {
      label: '进度',
      prop: 'pro',
      width: '240',
    },
  ],
})
</script>

<template>
  <div class="card flex-column-layout">
    <div class="header-container">
      <div class="title-container">
        <div class="title">
          新用户
        </div>
        <div class="info">
          这个月增长<span class="text-success">+15%</span>
        </div>
      </div>
      <ElRadioGroup v-model="radio">
        <ElRadioButton value="本月" label="本月" />
        <ElRadioButton value="上月" label="上月" />
        <ElRadioButton value="今年" label="今年" />
      </ElRadioGroup>
    </div>
    <BaseTable v-bind="tableConfig">
      <template #avatar_default="{ row }">
        <div style="display: flex; align-items: center">
          <img class="avatar" :src="row.avatar" alt="avatar">
          <span>{{ row.username }}</span>
        </div>
      </template>
      <template #pro_default="{ row }">
        <ElProgress
          :percentage="row.pro"
          :color="row.color"
          :stroke-width="4"
          :aria-label="`${row.username}的完成进度: ${row.pro}%`"
        />
      </template>
    </BaseTable>
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
      .text-success {
        margin-left: 10px;
        color: var(--zv-success);
      }
    }
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  margin-right: 6px;
}
</style>
