import sys from './sys'

// 默认只启用“登录可用”所需的核心 fake。
// 业务接口 fake（如 dict/user）按需手动引入，避免无后端场景下维护成本过高。
export default [...sys] as const
