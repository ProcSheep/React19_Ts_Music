import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"
import axios, { AxiosHeaders } from "axios"

/**
 * 难点
 * 1. 拦截器精细化控制
 *  全局拦截器*
 *  实例拦截器**
 *  单次请求拦截器****
 *
 * 2.响应结果数据类型处理(泛型)
 *
 * 未来,文件上传等功能都可以在这里基础上继续封装(Node高级)
 */

// 拦截器: 应用比如有: 蒙版isLoading,请求携带token,修改配置(返回自带.data)

interface HYInterceptors<T = AxiosResponse> {
  // 源码中,config的类型现在已经改为InternalAxiosRequestConfig,它继承自AxiosRequestConfig;
  // 老师当时还是AxiosRequestConfig版本
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailureFn?: (err: any) => any
}

// 针对AxiosRequestConfig进行扩展
interface HYRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HYInterceptors<T>
  headers?: AxiosRequestHeaders // 为了更好的提示
}

class HYRequest {
  instance: AxiosInstance

  // 每次使用都会创建一个新的axios实例,实例对象之间配置互不干扰
  constructor(config: HYRequestConfig) {
    // 更好的提示,更加的灵活
    this.instance = axios.create(config)

    // 1.全局拦截器: 给每一个实例添加拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log("全局请求成功拦截")
        return config
      },
      (err) => {
        console.log("全局请求失败拦截")
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        console.log("全局响应成功拦截")
        return res.data // 更加简便,减少多余res.data
      },
      (err) => {
        console.log("全局响应失败拦截")
        return err
      }
    )

    // 2.实例拦截器: 针对特定的拦截器,如果有就在原有的基础上添加新的拦截器,拦截器可以有多个
    if (config.interceptors) {
      this.instance.interceptors.request.use(
        config.interceptors.requestSuccessFn,
        config.interceptors.requestFailureFn
      )
      this.instance.interceptors.response.use(
        config.interceptors.responseSuccessFn,
        config.interceptors.responseFailureFn
      )
    }
  }

  // 3.单次请求拦截器:
  // 添加单次网络请求的拦截器,不可以添加到实例对象上
  // 拦截器的本质就是钩子函数,在对应的时机回调拦截器的函数
  request<T = any>(config: HYRequestConfig<T>) {
    if (config.interceptors?.requestSuccessFn) {
      config.headers = config.headers || new AxiosHeaders() // 防止安全漏洞,成功的回调参数类型InternalAxiosRequestConfig需要headers
      // 1.单次请求成功的请求拦截
      config = config.interceptors.requestSuccessFn(
        config as InternalAxiosRequestConfig
      ) // 类型断言as帮助跳过ts检测
    }

    // 拆分网络请求,从内部拿响应数据res,在返回res之前调用响应拦截的回调函数,传入初始数据res,获取可能改变的res返回出去 -> resolve(res)
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // .then成功请求到数据
          // 2.单次请求成功的响应拦截
          if (config.interceptors?.responseSuccessFn) {
            // res被拦截后,在回调函数内部可能被改变
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res) // 返回新的res
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: "GET" })
  }
  post<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: "POST" })
  }
  delete<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: "DELETE" })
  }
  patch<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: "PATCH" })
  }
}

export default HYRequest
