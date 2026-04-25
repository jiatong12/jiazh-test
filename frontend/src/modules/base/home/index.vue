<!-- 工作台页面 -->
<script setup lang="ts">
import ActiveUser from './modules/ActiveUser.vue'
import CardList from './modules/CardList.vue'
import Dynamic from './modules/DynamicStats.vue'
import NewUser from './modules/NewUser.vue'
import SalesOverview from './modules/SalesOverview.vue'
import TodoList from './modules/TodoList.vue'
</script>

<template>
  <div class="page-wrap">
    <BaseRow :gutter="20">
      <BaseCol :col="1">
        <CardList />
      </BaseCol>

      <BaseCol :cols="{ sm: 1, md: 2 }">
        <ActiveUser class="row2" />
      </BaseCol>
      <BaseCol :cols="{ sm: 1, md: 2 }">
        <SalesOverview class="row2" />
      </BaseCol>

      <BaseCol :cols="{ sm: 1, md: 1, lg: 2 }">
        <NewUser class="row3" />
      </BaseCol>
      <BaseCol :cols="{ sm: 1, md: 2, lg: 4 }">
        <Dynamic class="row3" />
      </BaseCol>
      <BaseCol :cols="{ sm: 1, md: 2, lg: 4 }">
        <TodoList class="row3" />
      </BaseCol>
    </BaseRow>
  </div>
</template>

<style lang="scss" scoped>
.page-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.row2 {
  height: 400px;
}
.row3 {
  height: 500px;
}
</style>
