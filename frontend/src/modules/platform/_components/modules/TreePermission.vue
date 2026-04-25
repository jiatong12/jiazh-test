<script setup lang="ts">
import type { PropType } from 'vue'
import { ElCheckbox } from 'element-plus'
import { uniq } from 'lodash-es'
import { getCurrentInstance } from 'vue'
import util from '@/utils/util'

const checkGroupValue = defineModel({
  type: Array as PropType<any[]>,
  default: () => [],
})

// props
const propDef = defineProps({
  permissions: {
    type: Array as PropType<any[]>,
    required: true,
  },
  props: {
    type: Object,
    default() {
      return {
        children: 'children',
        label: 'name',
        permission: 'permissions',
      }
    },
  },
  expand: {
    type: Boolean,
    default: true,
  },
})

const currentInstance = getCurrentInstance()?.proxy

// methods
function checkBoxChangeHandler(code, parentCode) {
  return (value) => {
    let val = [...checkGroupValue.value]
    if (value) {
      val.push(code)
      if (parentCode) {
        val = checkParentNode(parentCode, val)
      }
    }
    else {
      const index = val.findIndex(val => val === code)
      val.splice(index, 1)
    }
    val = uniq(val)
    checkGroupValue.value = val
  }
}

function checkParentNode(code, val) {
  while (code) {
    val = val.concat(code)
    const parentNode = util.findTreeParentNode(propDef.permissions, 'code', code, propDef.props.children)
    if (parentNode.code && code !== parentNode.code) {
      code = parentNode.code
    }
    else {
      break
    }
  }
  return val
}

function nodeCheckBoxChangeHandler(code) {
  return (targetValue) => {
    let val = [...checkGroupValue.value]
    const node = util.findTreeNode(propDef.permissions, 'code', code, propDef.props.children)
    if (node.parentCode) {
      val = checkParentNode(node.parentCode, val)
    }
    const nodeValues = treeNodeAllPermissionItems([node])
    if (targetValue) {
      // 全选子节点
      val = val.concat(nodeValues)
    }
    else {
      // 取消选择子节点
      val = val.filter(val => !nodeValues.includes(val))
    }
    val = uniq(val)
    checkGroupValue.value = val
  }
}

function renderContent(h, { data }) {
  // console.log(data)
  const nodeContent: any[] = []
  nodeContent.push(
    h(
      'div',
      {
        class: ['node-name'],
        style: {
          display: 'inline-block',
          fontWeight: '600',
        },
      },
      [
        h(
          ElCheckbox,
          {
            value: data ? data.code : '',
            disabled: data ? data.disabled : '',
            onChange: nodeCheckBoxChangeHandler(data ? data.code : ''),
          },
          () => '',
        ),
        h(
          'span',
          {
            style: {
              display: 'inline-block',
              marginRight: '20px',
              lineHeight: '32px',
              fontSize: '16px',
            },
          },
          [
            h('i', {
              class: data && data.icon ? data.icon : 'i-lucide:folder',
              style: {
                marginLeft: '2px',
                marginRight: '5px',
              },
            }),
            h('span', data ? data.name : ''),
          ],
        ),
      ],
    ),
  )

  if (data && data[propDef.props.permission] && data[propDef.props.permission].length) {
    const permissionCheckBoxs = data[propDef.props.permission].map((val) => {
      return h(
        ElCheckbox,
        {
          style: {
            marginLeft: '18px',
          },
          value: val.code,
          disabled: val.disabled,
          onChange: checkBoxChangeHandler(val.code, val.parentCode),
        },
        () => val.name,
      )
    }, currentInstance)
    nodeContent.push(
      h(
        'div',
        {
          style: {
            // marginTop: '10px',
            marginBottom: '10px',
            whiteSpace: 'nowrap',
          },
          class: 'node-content',
        },
        permissionCheckBoxs,
      ),
    )
  }
  return h(
    'div',
    {
      style: {
        display: 'inline-block',
      },
    },
    nodeContent,
  )
}

function treeNodeAllPermissionItems(tree) {
  let result: any[] = []
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].code) {
      result.push(tree[i].code)
    }
    if (tree[i][propDef.props.permission] && tree[i][propDef.props.permission].length) {
      const tmpItems = tree[i][propDef.props.permission].map(val => val.code)
      result = result.concat(tmpItems)
    }
    if (tree[i][propDef.props.children] && tree[i][propDef.props.children].length) {
      const tmp = treeNodeAllPermissionItems(tree[i][propDef.props.children])
      result = result.concat(tmp)
    }
  }
  return result
}
</script>

<template>
  <div class="tree-wrap">
    <ElCheckboxGroup :model-value="checkGroupValue">
      <ElTree
        class="permission-tree-wrap"
        :data="permissions"
        :props="props"
        :expand-on-click-node="false"
        :default-expand-all="expand"
        :render-content="renderContent"
      />
    </ElCheckboxGroup>
  </div>
</template>

<style scoped lang="scss">
:deep(.node-content) {
  display: flex;
  flex-wrap: wrap;

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: gray;
  }
}

// :deep(.node-content el-checkbox) {
//   min-height: 20px;
// }
:deep() .permission-tree-wrap {
  .el-tree-node__content {
    height: auto;
  }
  /* 使用通用兄弟选择器和子选择器的组合 */
  .el-tree-node:not(:first-child) {
    border-top: 1px solid #e5e5e5;
  }
  .el-tree-node__children .el-tree-node {
    border-bottom: 0px;
    margin-bottom: 0px;
  }
}
</style>
