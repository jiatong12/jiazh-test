<!-- 收藏 -->
<script lang="ts" setup>
import { useTabsStore } from '@/store/modules/tabs'

const router = useRouter()

const tabsStore = useTabsStore()
</script>

<template>
  <ElPopover placement="bottom" :width="200" trigger="hover">
    <template #reference>
      <ElIcon class="favorites ">
        <BaseIcon name="i-fluent:star-line-horizontal-3-16-regular" />
      </ElIcon>
    </template>
    <div class="collection-wrapper">
      <div class="title-bar">
        <div>标签页收藏夹</div>
        <a class="cursor-pointer" title="加入到收藏夹" @click="tabsStore.addToCollection()">
          <BaseIcon name="i-fluent:collections-16-regular" class="size-5" />
        </a>
      </div>
      <div
        :class="{ list: tabsStore.tabCollection.length > 0, flex: tabsStore.tabCollection.length === 0 }"
      >
        <div v-for="item in tabsStore.tabCollection" :key="item.title" class="div-button" @click="router.push(item.path)">
          <div class="menu">
            <BaseIcon v-if="item.icon" :name="item.icon" />
            <div>{{ item.title }}</div>
          </div>
          <BaseIcon name="i-streamline:recycle-bin-2" class="remove-icon" @click.stop="tabsStore.removeCollection(item)" />
        </div>
        <div v-show="!tabsStore.tabCollection.length" class="h-13 w-full flex items-center justify-center">
          还没有收藏任何标签页
        </div>
      </div>
    </div>
  </ElPopover>
</template>

<style lang="scss" scoped>
.favorites {
  display: block;
  width: 46px;
  height: 100%;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
}

.collection-wrapper {
  & .title-bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }

  & .list {
    display: flex;
    flex-wrap: wrap;
    // display: grid;
    // grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  & .div-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.375rem 0.5rem;
    cursor: pointer;
    background-color: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    border-radius: 0.25rem;

    & .menu {
      display: flex;
      gap: 0.25rem;
      align-items: center;
      width: 100%;
      overflow: hidden;
      font-size: 0.875rem;
      color: var(--el-text-color-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .remove-icon {
      position: relative;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }

    & .remove-icon:hover {
      color: var(--el-color-primary);
    }

    &:hover {
      background-color: var(--el-bg-color-page);
    }
  }

  & .flex {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3.25rem;
    color: var(--el-text-color-secondary);
  }
}
</style>
