import type { FormRules } from 'element-plus'

export const projectCategoryDict = [
  { label: '礼盒商城', value: 'gift', color: 'danger' },
  { label: '设备台账', value: 'device', color: 'primary' },
  { label: '办公物资', value: 'office', color: 'warning' },
  { label: '企业服务', value: 'service', color: 'success' },
]

export const projectShelfStatusDict = [
  { label: '已发布', value: 1, color: 'success' },
  { label: '已下线', value: 0, color: 'info' },
]

export type BaseFormDetailScene = 'standard' | 'service'

export interface BaseFormDetailData {
  projectName: string
  projectCode: string
  owner: string
  category: string
  shelfStatus: number
  cover: string
  deliveryTime: string
  createdAt: string
  updatedAt: string
  summary: string
}

const baseFormDetailMap: Record<BaseFormDetailScene, BaseFormDetailData> = {
  standard: {
    projectName: '智慧园区一体化平台',
    projectCode: 'ZV-PARK-2026',
    owner: '交付中台',
    category: 'device',
    shelfStatus: 1,
    cover: '/branding/logo.svg',
    deliveryTime: 'T+3 工作日上线',
    createdAt: '2026-02-21 09:30:00',
    updatedAt: '2026-03-16 18:20:00',
    summary: '演示 descriptions 模式下的只读展示，适合详情页、抽屉详情和审核查看场景。',
  },
  service: {
    projectName: '企业服务订阅中心',
    projectCode: 'ZV-SERVICE-2026',
    owner: '客户成功组',
    category: 'service',
    shelfStatus: 0,
    cover: '/branding/logo.svg',
    deliveryTime: '按客户排期分批交付',
    createdAt: '2026-01-08 14:10:00',
    updatedAt: '2026-03-12 11:45:00',
    summary: '切换不同场景后重新调用 loadData，可复用同一套详情字段展示不同记录。',
  },
}

export async function getBaseFormDetailData(scene: BaseFormDetailScene): Promise<BaseFormDetailData> {
  await new Promise(resolve => setTimeout(resolve, 280))
  return {
    ...baseFormDetailMap[scene],
  }
}

export interface BaseFormDemoData {
  projectName: string
  owner: string
  branch: string
  category: string
  shelfStatus: number
  launchDate: string
  remark: string
}

export function createBaseFormDemoData(): BaseFormDemoData {
  return {
    projectName: 'zving-admin-starter-vue3',
    owner: '前端架构组',
    branch: 'release/docs-module',
    category: 'device',
    shelfStatus: 1,
    launchDate: '2026-03-18',
    remark: '文档页直接运行在主应用内时，表单示例可以完全复用项目组件、主题变量和全局运行时能力。',
  }
}

export const baseFormDemoFilledData: BaseFormDemoData = {
  projectName: '品牌礼盒商城后台',
  owner: '交付中台',
  branch: 'release/product-manage',
  category: 'gift',
  shelfStatus: 1,
  launchDate: '2026-04-08',
  remark: '基础用法优先展示对象数据源、显式 labelWidth、字典字段、校验规则和 BaseCol 整行字段，结构尽量贴近真实新增编辑页。',
}

export const baseFormDemoRules: FormRules<BaseFormDemoData> = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  category: [{ required: true, message: '请选择项目分类', trigger: 'change' }],
}
