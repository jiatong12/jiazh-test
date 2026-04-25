<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import util from '@/utils/util'
import translate from '../../_common/dataTranslate'
import TreeGridPermission from './TreeGridPermission.vue'

// props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

const treegrid = useTemplateRef('treegrid')

// 将 dataState 拆分为独立的响应式变量
const selectAllLoading = ref(false)
const permissions = ref<any[]>([])
const permissionsBak = ref<any[]>([])
const oldColumns = ref([
  {
    text: '区块',
    dataIndex: 'com.zving.cms.Block.',
    width: 150,
    key: 'com.zving.cms.Block',
  },
  {
    text: '栏目',
    dataIndex: 'catalogName',
    width: 150,
    key: 'com.zving.cms.Catalog',
    noCheckBox: true,
  },
])

const userStore = useUserStore()

const columns = ref<any[]>([])
const dataLoading = ref(true)
const saveLoading = ref(false)
const currentSiteID = computed(() => userStore.sites?.siteID)
const siteListTreeData = ref([]) // 站点列表树数据
// const isAllChecked = ref(false)
const tableHeight = ref(0)

// watch
watch(
  () => props.id,
  (value) => {
    if (value) {
      getData()
    }
    else {
      permissions.value = []
    }
  },
)
watch(
  () => currentSiteID.value,
  async () => {
    getData()
  },
)

// methods
async function saveClickHandler() {
  saveLoading.value = true
  saveLoading.value = true
  const updatedPermissions: Record<string, any> = {}
  permissionsBak.value.forEach((permissionBak, index) => {
    const permission = permissions.value[index]
    columns.value.forEach((column, colIndex) => {
      if (
        permissionBak[column.dataIndex].value !== permission[column.dataIndex].value
        && !permissionBak[column.dataIndex].disabled
      ) {
        if (colIndex === 0) {
          updatedPermissions[column.dataIndex + permission.ID] = permission[column.dataIndex].value ? 1 : 0
        }
        else {
          updatedPermissions[`${column.dataIndex}.${permission.ID}`] = permission[column.dataIndex].value
            ? 1
            : 0
        }
      }
    })
  })
  try {
    const res = await axios.put(`/ui/blockpriv/id/${props.id}/type/${props.type}/privs`, { data: updatedPermissions })
    util.showResponseMessage(res)
  }
  finally {
    saveLoading.value = false
  }
}

async function getData() {
  if (props.id) {
    dataLoading.value = true
    if (currentSiteID.value && siteListTreeData.value && siteListTreeData.value.length > 0) {
      const datas = await Promise.all([
        axios.get(`/ui/blockpriv/id/all/type/${props.type}/columns`),
        axios.get(`/ui/blockpriv/id/${props.id}/type/${props.type}/privs`, { params: { siteID: currentSiteID.value } }),
      ])
      dataLoading.value = true
      const res = datas[1]
      if (res.data.data.length > 0) {
        permissions.value = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
        permissionsBak.value = JSON.parse(JSON.stringify(permissions.value))
      }
      else {
        permissions.value = []
        permissionsBak.value = []
      }
      const resp = datas[0]
      columns.value = [...oldColumns.value.slice(0, 2), ...resp.data.data]
    }
    dataLoading.value = false
  }
}

function selectedAllHandler() {
  selectAllLoading.value = true
  treegrid.value?.selectedAllHandler()
  setTimeout(() => {
    selectAllLoading.value = false
  }, 1000)
}

// mounted
onMounted(() => {
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  tableHeight.value = windowHeight * 0.7 - 160
})

;(async () => {
  const siteRes = await axios.get(`/ui/sitepriv/id/${props.id}/type/${props.type}`)
  siteListTreeData.value = siteRes.data.data
  getData()
})()
</script>

<template>
  <div>
    <div class="card flex-align-center">
      <BaseTreeSelect v-model="currentSiteID" style="width: 216px;" class="mr-3" :dict="siteListTreeData" label-field="name" value-field="ID" children-field="children" />
      <BaseButton :icon="$$renderIcon('i-ant-design:save-outlined')" style="padding-left: 20px;" :loading="saveLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="saveClickHandler">
        保存
      </BaseButton>
      <BaseButton :icon="$$renderIcon('i-ant-design:check-square-outlined')" :loading="selectAllLoading" @click="selectedAllHandler">
        全选
      </BaseButton>
    </div>
    <div v-loading="dataLoading" class="card mt-2">
      <TreeGridPermission ref="treegrid" v-model="permissions" :columns="columns" />
    </div>
  </div>
</template>
