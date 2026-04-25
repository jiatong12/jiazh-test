<script lang="ts" setup>
import axios from 'axios'
import { uniq } from 'lodash-es'
import { reactive, toRefs, watch } from 'vue'
import util from '@/utils/util'
import TreePermission from './TreePermission.vue'

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

// 拆分后的状态对象
const loadingState = reactive({
  selectAllLoading: false,
  dataLoading: true,
  handlerLoading: false,
})

const permissionState = reactive({
  permission: [] as string[],
  permissionBak: [] as string[],
  permissionTree: [] as any[],
})

const treeState = reactive({
  defaultProps: {
    children: 'children',
    label: 'name',
    permission: 'items',
  },
})

const menuState = reactive({
  NoDisPlayMenu: [
    'Platform.Metadata',
    'Platform.Metadata.Add',
    'Platform.Metadata.Save',
    'Platform.Metadata.Delete',
    'Platform.Metadata.AddData',
    'Platform.Metadata.EditData',
    'Platform.Metadata.DeleteData',
    'Platform.Menu',
    'Platform.Token',
    'Platform.Token.Add',
    'Platform.Token.Edit',
    'Platform.Token.Enable',
    'Platform.Token.Disable',
    'Platform.Token.Delete',
    'Platform.Token.Reset',
    'Platform.SMSSetting',
    'Platform.SMSSetting.TemplateAdd',
    'Platform.SMSSetting.TemplateSave',
    'Platform.SMSSetting.TemplateDel',
    'Platform.SMSSetting.TemplateEnable',
    'Platform.SMSSetting.PlatformAdd',
    'Platform.SMSSetting.PlatformDel',
    'Platform.SMSSetting.PlatformSave',
    'Platform.SMSSetting.PlatformEnable',
    'Platform.Detector',
    'Platform.SystemInfo.Export',
    'Platform.SystemInfo.Import',
  ] as string[],
})

// 解构所有状态属性
const {
  selectAllLoading,
  dataLoading,
  handlerLoading,
} = toRefs(loadingState)

const {
  permission,
  permissionBak,
  permissionTree,
} = toRefs(permissionState)

const {
  defaultProps,
} = toRefs(treeState)

const {
  NoDisPlayMenu,
} = toRefs(menuState)

// watch
watch(
  () => props.id,
  (value) => {
    if (value) {
      getData()
    }
    else {
      permission.value = []
      permissionTree.value = []
    }
  },
)

// methods
async function getData() {
  if (props.id) {
    dataLoading.value = true
    const res = await axios.get(`/ui/permissions/id/${props.id}/type/${props.type}/menus`)

    const noDisplayMenu = new Set(NoDisPlayMenu.value)

    let value: string[] = []
    if (res.data.data.value) {
      value = res.data.data.value.filter((row: string) => {
        return !noDisplayMenu.has(row)
      })
    }
    permissionBak.value = Object.assign([], value)
    permission.value = value

    let tree: any[] = []
    if (res.data.data.tree) {
      tree = res.data.data.tree
      for (let i = tree.length - 1; i >= 0; i--) {
        if (noDisplayMenu.has(tree[i].code)) {
          tree.splice(i, 1)
        }
        else {
          const children = tree[i].children
          if (children && children.length) {
            for (let j = children.length - 1; j >= 0; j--) {
              if (noDisplayMenu.has(children[j].code)) {
                children.splice(j, 1)
              }
              else {
                const items = children[j].items
                if (items && items.length) {
                  for (let k = items.length - 1; k >= 0; k--) {
                    if (noDisplayMenu.has(items[k].code)) {
                      items.splice(k, 1)
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    permissionTree.value = tree
    dataLoading.value = false
  }
}

function selectAllClickHandler() {
  selectAllLoading.value = true
  const handle = (tree: any[], flag: boolean) => {
    let result: string[] = []
    let disabledResult: string[] = []
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].code) {
        result.push(tree[i].code)
        if (tree[i].disabled && !flag) {
          permissionBak.value.forEach((val) => {
            if (val === tree[i].code) {
              disabledResult.push(tree[i].code)
            }
          })
        }
      }
      if (tree[i].items && tree[i].items.length > 0) {
        tree[i].items.forEach((val: any) => {
          result.push(val.code)
          if (val.disabled && !flag) {
            permissionBak.value.forEach((code) => {
              if (code === val.code) {
                disabledResult.push(val.code)
              }
            })
          }
        })
      }
      if (tree[i].children && tree[i].children.length > 0) {
        if (flag) {
          const tmp = handle(tree[i].children, true)
          result = result.concat(tmp)
        }
        else {
          const tmp = handle(tree[i].children, false)
          disabledResult = disabledResult.concat(tmp)
        }
      }
    }
    if (flag) {
      return result
    }
    else {
      return disabledResult
    }
  }
  let allPermissions = handle(permissionTree.value, true)
  if (
    !!permission.value
    && !!permission.value.length
    && permission.value.length === allPermissions.length
  ) {
    allPermissions = []
  }
  allPermissions = allPermissions.concat(handle(permissionTree.value, false))
  permission.value = uniq(allPermissions)
  setTimeout(() => {
    selectAllLoading.value = false
  }, 1000)
  console.log(permission.value)
}

async function saveClickHandler() {
  handlerLoading.value = true
  try {
    const priv: Record<string, number> = {}
    permissionBak.value
      .filter(p => !permission.value.includes(p))
      .forEach(p => (priv[p] = 0))
    permission.value
      .filter(p => !permissionBak.value.includes(p))
      .forEach(p => (priv[p] = 1))
    const res = await axios.put(`/ui/permissions/id/${props.id}/type/${props.type}/menus`, { data: priv })
    res.data && util.showResponseMessage(res.data)
  }
  finally {
    handlerLoading.value = false
  }
}

getData()
</script>

<template>
  <div>
    <div class="card">
      <BaseButton
        :loading="handlerLoading"
        priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"
        @click="saveClickHandler"
      >
        <template #icon>
          <BaseIcon name="i-ant-design:save-outlined" />
        </template>
        保存
      </BaseButton>
      <BaseButton :loading="selectAllLoading" @click="selectAllClickHandler">
        <template #icon>
          <BaseIcon name="i-ant-design:check-square-outlined" />
        </template>
        全选
      </BaseButton>
    </div>

    <div v-loading="dataLoading" class="card mt-2">
      <TreePermission
        v-model="permission"
        :permissions="permissionTree"
        :props="defaultProps"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
