export interface TreeNodeItem {
  label: string
  value: string
  disabled?: boolean
  children?: TreeNodeItem[]
}

export const branchTreeDict: TreeNodeItem[] = [
  {
    label: '总部',
    value: 'head',
    children: [
      {
        label: '产品中心',
        value: 'product',
        children: [
          { label: '产品一组', value: 'product-1' },
          { label: '产品二组', value: 'product-2' },
        ],
      },
      {
        label: '技术中心',
        value: 'tech',
        children: [
          { label: '前端组', value: 'frontend' },
          { label: '后端组', value: 'backend' },
        ],
      },
    ],
  },
  {
    label: '华东分部',
    value: 'east',
    children: [
      { label: '上海交付组', value: 'sh-delivery' },
      { label: '杭州实施组', value: 'hz-implement', disabled: true },
    ],
  },
]

const asyncTreeDict: TreeNodeItem[] = [
  {
    label: '平台系统',
    value: 'platform',
    children: [
      { label: '权限中心', value: 'platform-auth' },
      { label: '系统配置', value: 'platform-config' },
    ],
  },
  {
    label: '业务系统',
    value: 'biz',
    children: [
      { label: '会员运营', value: 'biz-member' },
      { label: '内容发布', value: 'biz-content' },
    ],
  },
]

export function wait(ms = 700) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function getAsyncTreeDict() {
  await wait()
  return asyncTreeDict
}
