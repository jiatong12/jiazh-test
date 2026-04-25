import type { FakeConfig } from '../../_tools/route'
import type { ReqPage, ResPage } from '@/types/service'
import { faker } from '@faker-js/faker/locale/zh_CN'
import dayjs from 'dayjs'
import { generateIdCard, ResultUtils } from '../../../utils/faker'

export default [
  // 获取用户列表
  {
    url: '/user/list',
    method: 'post',
    response: (_req) => {
      const { pageIndex = 0, pageSize } = _req.body as ReqPage
      const rows = Array.from({ length: pageSize }).map(() => {
        return {
          id: faker.string.uuid(),
          username: faker.person.fullName(),
          gender: faker.helpers.arrayElement([1, 2]),
          user: {
            detail: {
              age: faker.number.int({ min: 1, max: 100 }),
            },
          },
          idCard: generateIdCard(),
          email: faker.internet.email(),
          address: faker.location.city(),
          createTime: dayjs(faker.date.anytime()).format('YYYY-MM-DD HH:mm:ss'),
          status: faker.helpers.arrayElement([0, 1]),
          avatar: faker.image.avatarGitHub(),
        }
      })
      return ResultUtils.success({
        data: rows,
        pageIndex,
        pageSize,
        total: 2000,
      })
    },
  },
  // 获取树形用户列表
  {
    url: '/user/tree/list',
    method: 'post',
    response: (_req) => {
      return ResultUtils.success({
        data: [],
        total: 0,
        pageIndex: 0,
        pageSize: 0,
      } satisfies ResPage<any>)
    },
  },
  // 新增用户
  {
    url: '/user/add',
    method: 'post',
    response: (_req) => {
      // const { id } = req.body
      return ResultUtils.success({})
    },
  },
  // 批量添加用户
  {
    url: '/user/import',
    method: 'post',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  // 编辑用户
  {
    url: '/user/edit',
    method: 'post',
    response: (_req) => {
      // const { id } = req.body
      return ResultUtils.success({})
    },
  },
  // 删除用户
  {
    url: '/user/delete',
    method: 'post',
    response: (_req) => {
      // const { id } = req.body
      return ResultUtils.success({})
    },
  },
  // 切换用户状态
  {
    url: '/user/change',
    method: 'post',
    response: (_req) => {
      // const { id, status } = req.body
      return ResultUtils.success({})
    },
  },
  // 重置用户密码
  {
    url: '/user/rest_password',
    method: 'post',
    response: (_req) => {
      // const { id } = req.body
      return ResultUtils.success({})
    },
  },
  // 导出用户数据
  {
    url: '/user/export',
    method: 'post',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  // 获取用户状态字典
  {
    url: '/user/status',
    method: 'get',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  // 获取用户性别字典
  {
    url: '/user/gender',
    method: 'get',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  // 获取用户部门列表
  {
    url: '/user/department',
    method: 'get',
    response: (_req) => {
      return ResultUtils.success([
        {
          id: '1',
          name: '华东分部',
          children: [
            {
              id: '11',
              name: '研发部',
            },
            {
              id: '12',
              name: '市场部',
            },
            {
              id: '13',
              name: '商务部',
            },
            {
              id: '14',
              name: '财务部',
            },
          ],
        },
        {
          id: '2',
          name: '华南分部',
          children: [
            {
              id: '21',
              name: '研发部',
            },
            {
              id: '22',
              name: '市场部',
            },
            {
              id: '23',
              name: '商务部',
            },
            {
              id: '24',
              name: '财务部',
            },
          ],
        },
        {
          id: '3',
          name: '西北分部',
          children: [
            {
              id: '31',
              name: '研发部',
            },
            {
              id: '32',
              name: '市场部',
            },
            {
              id: '33',
              name: '商务部',
            },
            {
              id: '34',
              name: '财务部',
            },
          ],
        },
      ])
    },
  },
  // 获取用户角色字典
  {
    url: '/user/role',
    method: 'get',
    response: (_req) => {
      return ResultUtils.success({})
    },
  },
  {
    url: '/mockTest',
    method: 'get',
    response: (_req) => {
      return ResultUtils.success({
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatarGitHub(),
        address: faker.location.streetAddress(),
      })
    },
  },
] as const satisfies FakeConfig
