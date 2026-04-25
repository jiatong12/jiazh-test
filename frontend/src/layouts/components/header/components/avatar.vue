<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { drawIcon } from 'jdenticon'
import PasswordModifyDialog from '@/modules/base/login/components/PasswordModifyDialog.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import { clearCache } from '@/utils/cache'

// import InfoDialog from './InfoDialog.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const userName = computed(() => userStore.userInfo?.userName ?? '默认')

// 退出登录
function logout() {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    authStore.logout()
  })
}

// 打开修改密码和个人信息弹窗
// const infoRef = useTemplateRef('infoRef')
const passwordModifyDialogRef = useTemplateRef('passwordModifyDialogRef')

/**
 * 清空缓存
 */
function onClearCache() {
  // 清除缓存
  clearCache()
  // 退出登录
  authStore.logout()
}

function hashCode(str) {
  let hash = 0
  let i
  let chr
  let len
  if (str.length === 0) { return hash }
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}
const avatarPath = computed(() => {
  if (!userName.value) { return '' }
  const size = 96
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  drawIcon(ctx, hashCode(userName.value), size)
  const data = canvas.toDataURL('image/png')
  return data
})
</script>

<template>
  <ElDropdown trigger="click">
    <div class="avatar">
      <img :src="avatarPath" alt="avatar">
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <!-- <ElDropdownItem @click="infoRef?.openDialog()">
          <BaseIcon name="i-lucide:user-round" />个人信息
        </ElDropdownItem> -->
        <ElDropdownItem @click="passwordModifyDialogRef?.open('修改密码', userName)">
          <BaseIcon name="i-mdi:square-edit-outline" />修改密码
        </ElDropdownItem>
        <ElDropdownItem @click="onClearCache">
          <BaseIcon name="i-mingcute:broom-line" />清除缓存
        </ElDropdownItem>
        <ElDropdownItem divided @click="logout">
          <BaseIcon name="i-mdi:log-out" />退出登录
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
  <!-- infoDialog -->
  <!-- <InfoDialog ref="infoRef" /> -->
  <!-- PasswordModifyDialog -->
  <PasswordModifyDialog ref="passwordModifyDialogRef" />
</template>

<style scoped lang="scss">
.avatar {
  width: 30px;
  height: 30px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 6px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
