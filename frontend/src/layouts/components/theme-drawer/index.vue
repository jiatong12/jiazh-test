<script setup lang="ts">
import type { LayoutType } from '@/store/modules/global'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useTheme } from '@/hooks/useTheme'
import { tabStyleTypeList, useGlobalStore } from '@/store/modules/global'
import mittBus from '@/utils/mittBus'
import PrimaryColor from './components/PrimaryColor.vue'

const { changeGreyOrWeak, setAsideTheme, setHeaderTheme } = useTheme()

const globalStore = useGlobalStore()
const {
  layout,
  isGrey,
  isWeak,
  asideInverted,
  headerInverted,
  isCollapse,
  accordion,
  breadcrumb,
  breadcrumbIcon,
  tabs,
  tabsIcon,
  footer,
  tabStyleType,
} = storeToRefs(globalStore)

// 设置布局方式
function setLayout(val: LayoutType) {
  globalStore.layout = val
  setAsideTheme()
}

// 打开主题设置
const drawerVisible = ref(false)
mittBus.on('openThemeDrawer', () => (drawerVisible.value = true))
</script>

<template>
  <ElDrawer v-model="drawerVisible" title="布局设置" size="290px">
    <!-- 布局样式 -->
    <ElDivider class="divider" content-position="center">
      <BaseIcon name="i-ep:notification" />
      布局样式
    </ElDivider>
    <div class="layout-box">
      <ElTooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div class="layout-item layout-classic" :class="[{ 'is-active': layout === 'classic' }]" @click="setLayout('classic')">
          <div class="layout-dark" />
          <div class="layout-container">
            <div class="layout-light" />
            <div class="layout-content" />
          </div>
          <ElIcon v-if="layout === 'classic'">
            <BaseIcon name="i-ep:circle-check-filled" />
          </ElIcon>
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div class="layout-item layout-vertical" :class="[{ 'is-active': layout === 'vertical' }]" @click="setLayout('vertical')">
          <div class="layout-dark" />
          <div class="layout-container">
            <div class="layout-light" />
            <div class="layout-content" />
          </div>
          <ElIcon v-if="layout === 'vertical'">
            <BaseIcon name="i-ep:circle-check-filled" />
          </ElIcon>
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div class="layout-item layout-transverse" :class="[{ 'is-active': layout === 'transverse' }]" @click="setLayout('transverse')">
          <div class="layout-dark" />
          <div class="layout-content" />
          <ElIcon v-if="layout === 'transverse'">
            <BaseIcon name="i-ep:circle-check-filled" />
          </ElIcon>
        </div>
      </ElTooltip>
      <ElTooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div class="layout-item layout-columns" :class="[{ 'is-active': layout === 'columns' }]" @click="setLayout('columns')">
          <div class="layout-dark" />
          <div class="layout-light" />
          <div class="layout-content" />
          <ElIcon v-if="layout === 'columns'">
            <BaseIcon name="i-ep:circle-check-filled" />
          </ElIcon>
        </div>
      </ElTooltip>
    </div>
    <div class="theme-item">
      <span>
        侧边栏反转色
        <BaseHelp>侧边栏颜色变为深色模式</BaseHelp>
      </span>
      <ElSwitch v-model="asideInverted" @change="setAsideTheme" />
    </div>
    <div class="theme-item mb50">
      <span>
        头部反转色
        <BaseHelp>头部颜色变为深色模式</BaseHelp>
      </span>
      <ElSwitch v-model="headerInverted" @change="setHeaderTheme" />
    </div>

    <!-- 全局主题 -->
    <ElDivider class="divider" content-position="center">
      <ElIcon>
        <BaseIcon name="i-ep:cold-drink" />
      </ElIcon>
      全局主题
    </ElDivider>
    <div class="theme-item">
      <span>主题颜色</span>
      <PrimaryColor />
    </div>
    <div class="theme-item">
      <span>灰色模式</span>
      <ElSwitch v-model="isGrey" @change="changeGreyOrWeak('grey', !!$event)" />
    </div>
    <div class="theme-item mb40">
      <span>色弱模式</span>
      <ElSwitch v-model="isWeak" @change="changeGreyOrWeak('weak', !!$event)" />
    </div>

    <!-- 界面设置 -->
    <ElDivider class="divider" content-position="center">
      <ElIcon>
        <BaseIcon name="i-lucide:settings" />
      </ElIcon>
      界面设置
    </ElDivider>
    <div class="theme-item">
      <span>菜单折叠</span>
      <ElSwitch v-model="isCollapse" />
    </div>
    <div class="theme-item">
      <span>菜单手风琴</span>
      <ElSwitch v-model="accordion" />
    </div>
    <div class="theme-item">
      <span>面包屑</span>
      <ElSwitch v-model="breadcrumb" />
    </div>
    <div class="theme-item">
      <span>面包屑图标</span>
      <ElSwitch v-model="breadcrumbIcon" />
    </div>
    <div class="theme-item">
      <span>标签栏</span>
      <ElSwitch v-model="tabs" />
    </div>
    <div class="theme-item">
      <span>标签栏图标</span>
      <ElSwitch v-model="tabsIcon" />
    </div>
    <div class="theme-item">
      <span>标签栏风格</span>
      <ElSelect v-model="tabStyleType" style="width: 100px;">
        <ElOption
          v-for="item in tabStyleTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <ElSwitch v-model="footer" />
    </div>
  </ElDrawer>
</template>

<style scoped lang="scss">
@import url('./index.scss');
</style>
