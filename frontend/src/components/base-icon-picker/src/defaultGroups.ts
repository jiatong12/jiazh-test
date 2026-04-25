import type { IconPickerGroup, IconPickerItem } from './types'

const RAW_DEFAULT_ICON_PICKER_GROUPS = [
  {
    key: 'navigation-layout',
    title: '导航与布局',
    icons: [
      { name: 'i-mdi:home-outline', label: '首页' },
      { name: 'i-mdi:view-dashboard-outline', label: '仪表盘' },
      { name: 'i-mdi:menu', label: '菜单' },
      { name: 'i-mdi:menu-open', label: '展开菜单' },
      { name: 'i-mdi:sitemap', label: '结构' },
      { name: 'i-mdi:compass-outline', label: '导航' },
      { name: 'i-mdi:map-marker-outline', label: '定位' },
      { name: 'i-mdi:calendar-month-outline', label: '日历' },
      { name: 'i-mdi:clock-outline', label: '时间' },
      { name: 'i-mdi:tab', label: '标签页' },
      { name: 'i-mdi:view-list-outline', label: '列表' },
      { name: 'i-mdi:view-grid-outline', label: '网格' },
    ],
  },
  {
    key: 'user-auth',
    title: '用户与权限',
    icons: [
      { name: 'i-mdi:account-circle-outline', label: '用户' },
      { name: 'i-mdi:account-group-outline', label: '用户组' },
      { name: 'i-mdi:shield-account-outline', label: '权限' },
      { name: 'i-mdi:shield-lock-outline', label: '安全策略' },
      { name: 'i-mdi:lock-outline', label: '锁定' },
      { name: 'i-mdi:lock-open-variant-outline', label: '解锁' },
      { name: 'i-mdi:key-outline', label: '密钥' },
      { name: 'i-mdi:fingerprint', label: '指纹' },
      { name: 'i-mdi:badge-account-outline', label: '工牌' },
      { name: 'i-mdi:card-account-details-outline', label: '账号信息' },
      { name: 'i-mdi:account-cog-outline', label: '账号设置' },
      { name: 'i-mdi:account-check-outline', label: '账号审核' },
    ],
  },
  {
    key: 'operation-common',
    title: '常用操作',
    icons: [
      { name: 'i-mdi:plus-box-outline', label: '新增' },
      { name: 'i-mdi:pencil-outline', label: '编辑' },
      { name: 'i-mdi:content-save-outline', label: '保存' },
      { name: 'i-mdi:refresh', label: '刷新' },
      { name: 'i-mdi:magnify', label: '搜索' },
      { name: 'i-mdi:filter-outline', label: '筛选' },
      { name: 'i-mdi:sort', label: '排序' },
      { name: 'i-mdi:eye-outline', label: '查看' },
      { name: 'i-mdi:content-copy', label: '复制' },
      { name: 'i-mdi:content-paste', label: '粘贴' },
      { name: 'i-mdi:undo-variant', label: '撤销' },
      { name: 'i-mdi:redo-variant', label: '重做' },
      { name: 'i-mdi:download-outline', label: '下载' },
      { name: 'i-mdi:upload-outline', label: '上传' },
      { name: 'i-mdi:trash-can-outline', label: '删除' },
    ],
  },
  {
    key: 'document-media',
    title: '文档与媒体',
    icons: [
      { name: 'i-mdi:file-document-outline', label: '文档' },
      { name: 'i-mdi:file-pdf-box', label: 'PDF' },
      { name: 'i-mdi:file-word-box', label: 'Word' },
      { name: 'i-mdi:file-excel-box', label: 'Excel' },
      { name: 'i-mdi:image-outline', label: '图片' },
      { name: 'i-mdi:video-outline', label: '视频' },
      { name: 'i-mdi:music-note-outline', label: '音频' },
      { name: 'i-mdi:folder-outline', label: '文件夹' },
      { name: 'i-mdi:folder-open-outline', label: '打开文件夹' },
      { name: 'i-mdi:paperclip', label: '附件' },
      { name: 'i-mdi:link-variant', label: '链接' },
      { name: 'i-mdi:qrcode-scan', label: '二维码' },
      { name: 'i-mdi:printer-outline', label: '打印' },
    ],
  },
  {
    key: 'data-status',
    title: '数据与状态',
    icons: [
      { name: 'i-mdi:chart-line', label: '图表' },
      { name: 'i-mdi:chart-bar', label: '柱状图' },
      { name: 'i-mdi:chart-pie', label: '饼图' },
      { name: 'i-mdi:database-outline', label: '数据库' },
      { name: 'i-mdi:bell-outline', label: '通知' },
      { name: 'i-mdi:check-circle-outline', label: '成功', color: '#67C23A' },
      { name: 'i-mdi:close-circle-outline', label: '失败', color: '#F56C6C' },
      { name: 'i-mdi:alert-circle-outline', label: '警告', color: '#E6A23C' },
      { name: 'i-mdi:information-outline', label: '提示', color: '#409EFF' },
      { name: 'i-mdi:progress-clock', label: '处理中' },
      { name: 'i-mdi:sync', label: '同步' },
      { name: 'i-mdi:loading', label: '加载中' },
    ],
  },
  {
    key: 'ep-common',
    title: 'Element Plus',
    icons: [
      { name: 'i-ep:search', label: '搜索' },
      { name: 'i-ep:edit', label: '编辑' },
      { name: 'i-ep:delete', label: '删除' },
      { name: 'i-ep:upload-filled', label: '上传' },
      { name: 'i-ep:download', label: '下载' },
      { name: 'i-ep:setting', label: '设置' },
      { name: 'i-ep:plus', label: '添加' },
      { name: 'i-ep:check', label: '确认' },
      { name: 'i-ep:close', label: '关闭' },
      { name: 'i-ep:refresh', label: '刷新' },
      { name: 'i-ep:filter', label: '筛选' },
      { name: 'i-ep:view', label: '查看' },
      { name: 'i-ep:warning', label: '警告' },
    ],
  },
  {
    key: 'custom-svg',
    title: '自定义 SVG',
    icons: [
      { name: 'i-icon:add', label: '新增' },
      { name: 'i-icon:loading', label: '加载' },
      { name: 'i-icon:image-load-fail', label: '图片失败' },
    ],
  },
] as const

type RawGroup = (typeof RAW_DEFAULT_ICON_PICKER_GROUPS)[number]
type RawIcon = RawGroup['icons'][number]

function cloneIconEntry(icon: RawIcon): string | IconPickerItem {
  if (typeof icon === 'string') {
    return icon
  }

  return {
    name: icon.name,
    label: icon.label,
    color: 'color' in icon ? icon.color : void 0,
  }
}

export function getDefaultIconPickerGroups(): IconPickerGroup[] {
  return RAW_DEFAULT_ICON_PICKER_GROUPS.map(group => ({
    key: group.key,
    title: group.title,
    color: 'color' in group && typeof group.color === 'string' ? group.color : void 0,
    icons: group.icons.map(cloneIconEntry),
  }))
}

export const DEFAULT_ICON_PICKER_GROUPS = getDefaultIconPickerGroups()
