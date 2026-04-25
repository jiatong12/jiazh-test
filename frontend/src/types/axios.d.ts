import 'axios'

declare module 'axios' {
  interface AxiosInstance {
    // get: <Path extends GetPaths, T = ApiResponseType<Path, 'get'>, R = AxiosResponse<T>, D extends ApiResponseParamsType<Path, 'get'> = ApiResponseParamsType<Path, 'get'>>(url: Path, config?: Omit<AxiosRequestConfig, 'params'> & { params?: D['query'] }) => Promise<R>
    // delete: <Path extends DeletePaths, T = ApiResponseType<Path, 'delete'>, R = AxiosResponse<T>, D extends ApiResponseParamsType<Path, 'delete'> = ApiResponseParamsType<Path, 'delete'>>(url: Path, config?: Omit<AxiosRequestConfig, 'params'> & { params?: D['query'] }) => Promise<R>
    // post: <Path extends PostPaths, T = ApiResponseType<Path, 'post'>, R = AxiosResponse<T>, D extends ApiResponseParamsType<Path, 'post'> = ApiResponseParamsType<Path, 'post'>>(url: Path, data?: D['body'], config?: Omit<AxiosRequestConfig<D['body']>, 'params'> & { params?: D['query'] }) => Promise<R>
    // put: <Path extends PutPaths, T = ApiResponseType<Path, 'put'>, R = AxiosResponse<T>, D extends ApiResponseParamsType<Path, 'put'> = ApiResponseParamsType<Path, 'put'>>(url: Path, data?: D['body'], config?: Omit<AxiosRequestConfig<D['body']>, 'params'> & { params?: D['query'] }) => Promise<R>
    // patch: <Path extends PatchPaths, T = ApiResponseType<Path, 'patch'>, R = AxiosResponse<T>, D extends ApiResponseParamsType<Path, 'patch'> = ApiResponseParamsType<Path, 'patch'>>(url: Path, data?: D['body'], config?: Omit<AxiosRequestConfig<D['body']>, 'params'> & { params?: D['query'] }) => Promise<R>
  }

  /**
   * 自定义配置参数
   */
  interface AxiosRequestConfig {
    // showLoading?: boolean
    // retryTimes?: number
    // cancel?: boolean // 接口重复是否取消
    showDefaultError?: boolean // 是否显示错误消息
    useBizStatus?: boolean // 是否使用业务状态（拦截器不自动根据 status判断是否成功）
    zcaptchaRetried?: boolean // 是否已经完成过一次验证码重试

    // isOriginalData?: boolean
    // loading?: booleans
  }

}

// // 然后在实现中
// customAxios.typedGet = async function<T>(url: string, config?: AxiosRequestConfig) {
//   const response = await this.get<ApiResponse<T>>(url, config)
//   return response.data.data
// }

// 使用时有完整类型提示
// const user = await customAxios.typedGet<User>('/users/1')
