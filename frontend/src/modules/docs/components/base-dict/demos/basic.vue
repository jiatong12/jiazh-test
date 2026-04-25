<script setup lang="ts">
import { loadRemoteStatusDict, projectTagDict, stageDict } from './data'

const currentStatus = ref(1)
const currentStage = ref('building')
const currentTags = ref([1, 3])
</script>

<template>
  <div class="flex-column-layout">
    <ElSpace wrap>
      <BaseButton @click="currentStatus = 1">
        demo1 = 正常
      </BaseButton>
      <BaseButton @click="currentStatus = 0">
        demo1 = 禁用
      </BaseButton>
      <BaseButton @click="currentStage = 'plan'">
        阶段 = 规划
      </BaseButton>
      <BaseButton @click="currentStage = 'delivery'">
        阶段 = 交付
      </BaseButton>
      <BaseButton @click="currentTags = [1, 2, 3]">
        全部标签
      </BaseButton>
    </ElSpace>

    <BaseRow :cols="{ xs: 1, md: 2, lg: 3 }">
      <div class="card flex-column">
        <strong>BaseDictText</strong>
        <BaseDictText :value="currentStatus" dict="demo1" />
      </div>

      <div class="card flex-column">
        <strong>BaseDictTag</strong>
        <BaseDictTag :value="currentStage" :dict="stageDict" />
      </div>

      <div class="card flex-column">
        <strong>BaseDictBadge</strong>
        <BaseDictBadge :value="currentStatus" dict="demo1" />
      </div>

      <div class="card flex-column">
        <strong>多值标签</strong>
        <BaseDictTag :value="currentTags" :dict="projectTagDict" />
      </div>

      <div class="card flex-column">
        <strong>BaseDict 自定义渲染</strong>
        <BaseDict :model-value="2" :dict="loadRemoteStatusDict">
          <template #default="{ dictItems }">
            <BaseBadge
              v-for="item in dictItems"
              :key="item?.value"
              :color="item?.color"
            >
              {{ item?.label }}
            </BaseBadge>
          </template>
        </BaseDict>
      </div>
    </BaseRow>
  </div>
</template>
