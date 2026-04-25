<script setup lang="ts">
import axios from 'axios'
import { uniq } from 'lodash-es'
import { ref, watch } from 'vue'
import { $$auths } from '@/auths'
import util from '@/utils/util'
import TreePermission from './TreePermission.vue'

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

const selectAllLoading = ref(false)
const dataLoading = ref(true)
const permission = ref<any[]>([])
const permissionBak = ref<any[]>([])
const permissionTree = ref<any[]>([])
const defaultProps = {
  children: 'children',
  label: 'name',
  permission: 'items',
}
const handlerLoading = ref(false)

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
  checkPriv()
  if (props.id) {
    dataLoading.value = true
    const res = await axios.get(`/ui/permissions/id/${props.id}/type/${props.type}/api`)
    permissionBak.value = Object.assign([], res.data.data.value)
    permission.value = res.data.data.value
    permissionTree.value = res.data.data.tree
    dataLoading.value = false
  }
}

function selectAllClickHandler() {
  selectAllLoading.value = true
  const handle = (tree, flag) => {
    let result: any[] = []
    let disabledResult: any[] = []
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
        tree[i].items.forEach((val) => {
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
}

async function saveClickHandler() {
  handlerLoading.value = true
  try {
    const priv: any = {}
    permissionBak.value
      .filter(p => !permission.value.includes(p))
      .forEach(p => (priv[p] = 0))
    permission.value
      .filter(p => !permissionBak.value.includes(p))
      .forEach(p => (priv[p] = 1))
    const res = await axios.put(`/ui/permissions/id/${props.id}/type/${props.type}/api`, { data: priv })
    util.showResponseMessage(res)
    getData()
  }
  finally {
    handlerLoading.value = false
  }
}

function checkPriv() {
  const { hasPriv } = $$auths
  if (props.type === 'B' && !hasPriv('Platform.Branch.SetPrivRange')) {
    // currentInstance.savePriv = true
  }
  else if (props.type === 'U' && !hasPriv('Platform.User.SetPriv')) {
    // currentInstance.savePriv = true
  }
  else if (props.type === 'R' && !hasPriv('Platform.Role.SetPriv')) {
    // currentInstance.savePriv = true
  }
}

getData()
</script>

<template>
  <div>
    <div class="card">
      <BaseButton
        :icon="$$renderIcon('i-ant-design:save-outlined')"
        :loading="handlerLoading"
        priv="Platform.Role.SetPriv||Platform.User.SetPriv||Platform.Branch.SetPrivRange"
        @click="saveClickHandler"
      >
        保存
      </BaseButton>
      <BaseButton :icon="$$renderIcon('i-ant-design:check-square-outlined')" :loading="selectAllLoading" @click="selectAllClickHandler">
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
