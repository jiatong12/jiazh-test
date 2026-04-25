<script lang="ts" setup>
import axios from 'axios'
import { ref } from 'vue'
// import { useUserStore } from '@/store/modules/user'
import util from '@/utils/util'

const info = ref<any[]>([])
const dataLoading = ref(true)
const login = ref({
  loading: false,
  isCan: true,
})
const logOffLoading = ref(false)

// const userStore = useUserStore()

// methods
async function disableOrEnableLoginClickHandler() {
  const handle = async () => {
    login.value.loading = true
    if (login.value.isCan) {
      const res = await axios.delete('/ui/info/logined').then(r => r.data)
      login.value.isCan = res.state
      util.showResponseMessage(res)
      login.value.loading = false
      return res.status === 1
    }
    else {
      const res = await axios.put('/ui/info/logined').then(r => r.data)
      login.value.isCan = res.state
      util.showResponseMessage(res)
      login.value.loading = false
      return res.status === 1
    }
  }

  if (login.value.isCan) {
    await ElMessageBox.confirm('临时禁止登录后，除admin之外的其他用户都不能登录。是否确认？', '请确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    handle()
  }
  else {
    handle()
  }
}

async function logOffSessionClickHandler() {
  try {
    await ElMessageBox.confirm('除当前用户之外的其他用户都将被强制注销。是否确认？', '请确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  }
  catch {
    return
  }
  logOffLoading.value = true
  const res = await axios.delete('/ui/info/sessions').then(r => r.data)
  logOffLoading.value = false
  util.showResponseMessage(res)
}

// const isThreeRole = computed(() => userStore.userInfo?.isThreeRole)
dataLoading.value = true
Promise.all([
  axios.get('/ui/info').then(res => res.data),
  axios.get('/ui/info/logined').then(res => res.data),
]).then((datas) => {
  info.value = datas[0].data
  login.value = {
    loading: false,
    isCan: !!datas[1].state,
  }
  dataLoading.value = false
})
</script>

<template>
  <div>
    <div class="layout-content-card">
      <div class="card">
        <BaseButton :icon="login.isCan ? $$renderIcon('i-mdi:lock') : $$renderIcon('i-mdi:lock-open')" :loading="login.loading" priv="Platform.SystemInfo.ChangeLoginStatus" @click="disableOrEnableLoginClickHandler">
          {{ login.isCan ? '禁止登陆' : '允许登陆' }}
        </BaseButton>
        <BaseButton :icon="$$renderIcon('i-mdi:logout')" :loading="logOffLoading" priv="Platform.SystemInfo.ForceExit" @click="logOffSessionClickHandler">
          强制注销所有会话
        </BaseButton>
      </div>
    </div>
    <div class="container">
      <div v-for="item in info" :key="item.id" class="item">
        <div v-loading="dataLoading" class="card" style="margin: 0px;">
          <h3 class="info-title">
            {{ item.title }}
          </h3>
          <ElTable :data="item.data" style="width: 100%">
            <ElTableColumn prop="item" align="right" label="项" />
            <ElTableColumn prop="value" label="值" />
          </ElTable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  column-count: 2; /* 列数 */
  column-gap: 20px; /* 列间距为0 */
  margin-top: 20px;
}

.item {
  break-inside: avoid; /* 防止元素被分割 */
  margin: 0 0 0 0; /* 上下间距为0 */
  padding: 0;
  box-sizing: border-box;
  display: inline-block; /* 关键 */
  width: 100%; /* 占满列宽 */
  margin-bottom: 20px;
}

.info-title {
  text-align: center;
  margin: 0.6em 0;
}
.progress-text {
  text-align: center;
}
</style>
