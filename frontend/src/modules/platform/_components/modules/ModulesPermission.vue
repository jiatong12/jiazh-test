<script setup lang="ts">
import axios from 'axios'
import { reactive, toRefs, watch } from 'vue'
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
// const currentInstance = getCurrentInstance()?.proxy

const treegrid = useTemplateRef('treegrid')

// 获取用户 store
const userStore = useUserStore()
const currentSiteID = computed(() => userStore.sites?.siteID)

// 拆分后的状态对象
const loadingState = reactive({
  selectAllLoading: false,
  dataLoading: true,
  saveLoading: false,
})

const permissionState = reactive({
  permissions: [] as any[],
  permissionsBak: [] as any[],
})

const columnState = reactive({
  columns: [] as any[],
})

const searchState = reactive({
  keyword: '',
})

const moduleState = reactive({
  mType: '',
  moduleTypes: {} as Record<string, string>,
})

const siteState = reactive({
  // currentSiteID: userStore.siteID,
  siteListTreeData: [] as any[], // 站点列表树数据
})

// const uiState = reactive({
//   isAllChecked: false,
// })

// 解构所有状态属性
const {
  selectAllLoading,
  dataLoading,
  saveLoading,
} = toRefs(loadingState)

const {
  permissions,
  permissionsBak,
} = toRefs(permissionState)

const {
  columns,
} = toRefs(columnState)

const {
  keyword,
} = toRefs(searchState)

const {
  mType,
  moduleTypes,
} = toRefs(moduleState)

const {
  // currentSiteID,
  siteListTreeData,
} = toRefs(siteState)

// const {
//   isAllChecked,
// } = toRefs(uiState)

// watch
watch(
  () => props.id,
  (value) => {
    if (value) {
      moduleTypes.value = {}
      mType.value = ''
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
    moduleTypes.value = {}
    mType.value = ''
    getData()
  },
)
watch(
  () => mType.value,
  async (val) => {
    mType.value = val
    getData()
  },
)

// methods
function searchHandler() {
  getData()
}

function selectedAllHandler() {
  selectAllLoading.value = true
  treegrid.value?.selectedAllHandler()
  setTimeout(() => {
    selectAllLoading.value = false
  }, 1000)
}

async function saveClickHandler() {
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
    const res = await axios.put(`/ui/modulespriv/id/${props.id}/type/${props.type}/modulespriv`, {
      data: updatedPermissions,
    })
    util.showResponseMessage(res)
    permissionsBak.value = JSON.parse(JSON.stringify(permissions.value))
  }
  finally {
    saveLoading.value = false
  }
}

async function getData() {
  if (props.id) {
    dataLoading.value = true
    if (currentSiteID.value && siteListTreeData.value && siteListTreeData.value.length > 0) {
      columns.value = []
      const resModelTypes = await axios.get(`/ui/modulespriv/id/${props.id}/type/${props.type}/privtype`)
      moduleTypes.value = resModelTypes.data.data
      if (!mType.value) {
        // eslint-disable-next-line no-unreachable-loop
        for (const moduleType in moduleTypes.value) {
          mType.value = moduleType
          break
        }
      }
      const datas = await Promise.all([
        axios.get(`/ui/modulespriv/id/all/type/${props.type}/modulesprivcolumns`, {
          params: { mType: mType.value },
        }),
        axios.get(`/ui/modulespriv/id/${props.id}/type/${props.type}/modulesprivs`, {
          params: {
            siteID: currentSiteID.value,
            mType: mType.value,
            keyword: encodeURIComponent(encodeURIComponent(keyword.value)),
          },
        }),
      ])
      const resp = datas[0]
      columns.value = resp.data.data
      columns.value[0].width = 250
      if (mType.value === 'MessageBoard') {
        columns.value[5].width = 130
      }
      const res = datas[1]
      if (res.data.data.length > 0) {
        permissions.value = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
        permissions.value.forEach((val) => {
          val.children = []
        })
        permissionsBak.value = JSON.parse(JSON.stringify(permissions.value))
      }
      else {
        permissions.value = []
        permissionsBak.value = []
      }
    }
    dataLoading.value = false
  }
}

// created
(async () => {
  const siteRes = await axios.get(`/ui/sitepriv/id/${props.id}/type/${props.type}`)
  siteListTreeData.value = siteRes.data.data
  getData()
})()
</script>

<template>
  <div>
    <div class="card flex-justify-between">
      <div class=" flex-align-center">
        <BaseTreeSelect v-model="currentSiteID" style="width: 216px;" class="mr-3" :dict="siteListTreeData" label-field="name" value-field="ID" children-field="children" />
        <ElSelect v-model="mType" style="width:155px;margin: 0 20px;" placeholder="请选择功能组件">
          <ElOption v-for="(value, key) in moduleTypes" :key="key" :label="value" :value="key" />
        </ElSelect>
        <BaseButton :icon="$$renderIcon('i-ant-design:save-outlined')" :loading="saveLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="saveClickHandler">
          保存
        </BaseButton>
        <BaseButton :icon="$$renderIcon('i-ant-design:check-square-outlined')" :loading="selectAllLoading" @click="selectedAllHandler">
          全选
        </BaseButton>
      </div>

      <div>
        <ElInput v-model="keyword" placeholder="请输入关键字" class="search-bar-algin-toolbar" @keyup.enter="searchHandler">
          <template #append>
            <BaseIcon title="查询" name="i-ep:search" @click="searchHandler" />
          </template>
        </ElInput>
      </div>
    </div>
    <div v-loading="dataLoading" class="card mt-2">
      <TreeGridPermission ref="treegrid" v-model="permissions" :columns="columns" />
    </div>
  </div>
</template>
