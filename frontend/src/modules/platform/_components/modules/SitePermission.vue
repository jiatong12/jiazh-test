<script setup lang="ts">
import axios from 'axios'
import { onMounted, reactive, toRefs, watch } from 'vue'
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

// 拆分后的状态对象
const permissionState = reactive({
  permissions: [] as any[],
  permissionsBak: [] as any[],
})

const columnState = reactive({
  columns: [
    {
      text: '站点名称',
      dataIndex: 'com.zving.cms.Site.',
      width: '',
      key: 'com.zving.cms.Site',
    },
  ] as any[],
})

const searchState = reactive({
  search: '',
})

const loadingState = reactive({
  dataLoading: true,
  saveLoading: false,
})

const uiState = reactive({
  isAllChecked: false,
  tableHeight: 0,
})

// 解构所有状态属性
const {
  permissions,
  permissionsBak,
} = toRefs(permissionState)

const {
  columns,
} = toRefs(columnState)

const {
  search,
} = toRefs(searchState)

const {
  dataLoading,
  saveLoading,
} = toRefs(loadingState)

const {
  // isAllChecked,
  tableHeight,
} = toRefs(uiState)

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

// methods
function searchHandler() {
  getData()
}

function selectedAllHandler() {
  treegrid.value?.selectedAllHandler()
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
    const res = await axios.put(`/ui/sitepriv/id/${props.id}/type/${props.type}/privs`, { data: updatedPermissions })
    util.showResponseMessage(res)
  }
  finally {
    saveLoading.value = false
  }
}

async function getData() {
  if (props.id) {
    dataLoading.value = true
    try {
      const datas = await Promise.all([
        axios.get(`/ui/sitepriv/id/all/type/${props.type}/columns`),
        axios.get(`/ui/sitepriv/id/${props.id}/type/${props.type}/privs`, {
          params: { name: encodeURIComponent(encodeURIComponent(search.value)) },
        }),
      ])
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
      columns.value = [...columns.value.slice(0, 1), ...datas[0].data.data]
      // 定义各列的宽度，使得文字显示比较完整
      const columnsWidth = [250, 70, 100, 100, 70, 70, 120, 70, 100, 120, 150]
      columnsWidth.forEach((val, index) => {
        columns.value[index].width = val
      })
    }
    catch (e) {
      console.error(e)
    }
    dataLoading.value = false
  }
}

// mounted
onMounted(() => {
  const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
  tableHeight.value = windowHeight * 0.7 - 180
})

getData()
</script>

<template>
  <div>
    <div class="card flex-justify-between">
      <div>
        <BaseButton :icon="$$renderIcon('i-ant-design:save-outlined')" :loading="saveLoading" priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange" @click="saveClickHandler">
          保存
        </BaseButton>
        <BaseButton :icon="$$renderIcon('i-ant-design:check-square-outlined')" @click="selectedAllHandler">
          全选
        </BaseButton>
      </div>
      <div>
        <ElInput v-model="search" placeholder="请输入站点名" class="search-bar-algin-toolbar" @keyup.enter="searchHandler">
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

<style scoped>
.search-wrap {
  padding: 10px 0;
  text-align: right;
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
