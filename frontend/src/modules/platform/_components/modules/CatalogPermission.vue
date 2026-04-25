<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, toRefs, watch } from 'vue'
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

const userStore = useUserStore()
const currentSiteID = computed(() => userStore.sites?.siteID)

const treegrid = useTemplateRef('treegrid')
// const currentInstance = getCurrentInstance()?.proxy

// 拆分后的状态对象
const loadingState = reactive({
  selectAllLoading: false,
  dataLoading: true,
  saveLoading: false,
  applyLoading: false,
})

const permissionState = reactive({
  permissions: [] as any[],
  permissionsBak: [] as any[],
})

const columnState = reactive({
  columns: [] as any[],
})

// const searchState = reactive({
//   search: '',
// })

const catalogState = reactive({
  currentCatalogID: 0,
  currentParentCatalogID: 0,
  showBack: false,
})

const siteState = reactive({
  siteListTreeData: [] as any[], // 站点列表树数据
})

const uiState = reactive({
  isAllChecked: false,
  tableHeight: 0,
})

const dimensionState = reactive({
  dimensionID: 1,
  dimensions: [{ ID: 1, code: 'default', name: '默认分类' }],
})

// 解构所有状态属性
const {
  selectAllLoading,
  dataLoading,
  saveLoading,
  applyLoading,
} = toRefs(loadingState)

const {
  permissions,
  permissionsBak,
} = toRefs(permissionState)

const {
  columns,
} = toRefs(columnState)

// const {
//   search,
// } = toRefs(searchState)

const {
  currentCatalogID,
  currentParentCatalogID,
  showBack,
} = toRefs(catalogState)

const {
  siteListTreeData,
} = toRefs(siteState)

const {
  // isAllChecked,
  tableHeight,
} = toRefs(uiState)

const {
  dimensionID,
  dimensions,
} = toRefs(dimensionState)

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
    await getDimensions()
    await getData()
  },
)

// methods
// function searchHandler() {
//   getData()
// }

function selectedAllHandler() {
  selectAllLoading.value = true
  treegrid.value?.selectedAllHandler()
  setTimeout(() => {
    selectAllLoading.value = false
  }, 1000)
}

function changeClickHandler(value) {
  dimensionID.value = value
  getData()
}

async function saveClickHandler() {
  saveLoading.value = true
  const updatedPermissions = {}
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
    const res = await axios.put(`/ui/catalogpriv/id/${props.id}/type/${props.type}/catalogprivs`, {
      data: updatedPermissions,
    })
    util.showResponseMessage(res)
  }
  finally {
    saveLoading.value = false
  }
}

async function applyToChildCatalog() {
  applyLoading.value = true
  const parentPrivMap = {}
  const updatedPermissions = {}
  permissions.value.forEach((val, permissionIndex) => {
    const permissionBak = permissionsBak.value[permissionIndex]
    columns.value.forEach((col, index) => {
      if (!val[col.dataIndex].disabled) {
        if (index === 0) {
          parentPrivMap[col.dataIndex + val.ID] = val[col.dataIndex].value ? 1 : 0
        }
        else {
          parentPrivMap[`${col.dataIndex}.${val.ID}`] = val[col.dataIndex].value ? 1 : 0
        }
      }
      if (
        permissionBak[col.dataIndex].value !== val[col.dataIndex].value
        && !permissionBak[col.dataIndex].disabled
      ) {
        if (index === 0) {
          updatedPermissions[col.dataIndex + val.ID] = val[col.dataIndex].value ? 1 : 0
        }
        else {
          updatedPermissions[`${col.dataIndex}.${val.ID}`] = val[col.dataIndex].value ? 1 : 0
        }
      }
    })
  })
  const privPrefix = columns.value[0].dataIndex
  try {
    const res = await axios.put(`/ui/catalogpriv/id/${props.id}/type/${props.type}/applytochild`, {
      data: { parentPrivMap, privPrefix, privMap: updatedPermissions },
    })
    util.showResponseMessage(res)
  }
  finally {
    applyLoading.value = false
  }
}

async function getData() {
  if (props.id) {
    dataLoading.value = true
    if (currentSiteID.value && siteListTreeData.value && siteListTreeData.value.length > 0) {
      const datas = await Promise.all([
        axios.get(`/ui/catalogpriv/id/all/type/${props.type}/catalogcolumns`),
        axios.get(`/ui/catalogpriv/id/${props.id}/type/${props.type}/catalogprivs`, {
          params: {
            siteID: currentSiteID.value,
            catalogID: currentCatalogID.value,
            dimensionID: dimensionID.value,
          },
        }),
      ])
      const res = datas[1]
      if (res.data.data.length > 0) {
        permissions.value = translate.MSDataTransfer.treeToArray(res.data.data, null, null, true)
        permissions.value.forEach((val) => {
          val.children = []
          if (currentCatalogID.value !== 0 && val.ID === currentCatalogID.value) {
            currentParentCatalogID.value = val.parentID
          }
        })
        permissionsBak.value = JSON.parse(JSON.stringify(permissions.value))
      }
      else {
        permissions.value = []
        permissionsBak.value = []
      }
      const resp = datas[0]
      columns.value = [...columns.value.slice(0, 1), ...resp.data.data]
      // 定义各列的宽度，使得文字显示比较完整
      // const columnsWidth = [180, 80, 70, 70, 70, 70, 120, 100, 70, 100, 100, 100, 120]
      // columnsWidth.forEach((val, index) => {
      //   columns.value[index].width = val
      // })
    }
    dataLoading.value = false
  }
}

function loadChildren(row) {
  currentCatalogID.value = row.ID
  currentParentCatalogID.value = row.parentID
  showBack.value = true
  getData()
}

function refreshCatalogs() {
  currentCatalogID.value = 0
  currentParentCatalogID.value = 0
  // currentInstance.updatedPermissions = {}
  getData()
}

function backLevel() {
  currentCatalogID.value = currentParentCatalogID.value
  if (currentCatalogID.value === 0) {
    showBack.value = false
    refreshCatalogs()
  }
  else {
    getData()
  }
}

async function getDimensions() {
  const res = await axios.get('/ui/dimensions', { params: { siteID: currentSiteID.value } })
  dimensions.value = res.data.data
  dimensionID.value = res.data.data[0].ID || 1
}

// mounted
onMounted(() => {
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  tableHeight.value = windowHeight * 0.7 - 160
})

// created
;(async () => {
  const siteRes = await axios.get(`/ui/sitepriv/id/${props.id}/type/${props.type}`)
  siteListTreeData.value = siteRes.data.data
  await getDimensions()
  await getData()
})()
</script>

<template>
  <div>
    <div class="card flex-align-center">
      <BaseTreeSelect v-model="currentSiteID" style="width: 216px;" class="mr-3" :dict="siteListTreeData" label-field="name" value-field="ID" children-field="children" />
      维度：<ElSelect v-model="dimensionID" placeholder="维度视图" style="width:155px;padding-right: 20px;" @change="changeClickHandler">
        <ElOption v-for="dimension in dimensions" :key="dimension.ID" :label="dimension.name" :value="dimension.ID" />
      </ElSelect>
      <BaseButton :icon="$$renderIcon('i-ant-design:save-outlined')" :loading="saveLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="saveClickHandler">
        保存
      </BaseButton>
      <BaseButton :icon="$$renderIcon('i-ant-design:check-square-outlined')" :loading="selectAllLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="selectedAllHandler">
        全选
      </BaseButton>
      <BaseButton
        :icon="$$renderIcon('i-ant-design:plus-outlined')" :loading="applyLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"
        @click="applyToChildCatalog"
      >
        应用到子栏目
      </BaseButton>
      <BaseButton :icon="$$renderIcon('i-ant-design:reload-outlined')" @click="refreshCatalogs">
        刷新栏目列表
      </BaseButton>
      <BaseButton v-show="showBack" :icon="$$renderIcon('i-ep:back')" @click="backLevel">
        返回
      </BaseButton>
    </div>
    <div v-loading="dataLoading" class="card mt-2">
      <TreeGridPermission ref="treegrid" v-model="permissions" :columns="columns" @load-children="loadChildren" />
    </div>
  </div>
</template>

<style scoped>
.catalog-link {
  color: var(--el-color-primary);
}

.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}

.ms-tree-space::before {
  content: '';
}
</style>
