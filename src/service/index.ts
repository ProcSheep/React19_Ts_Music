import { BASE_URL, TIME_OUT } from "./config"
import HYRequest from "./request"

const hyRequest1 = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

// 爱彼迎的数据有自己独有的拦截函数处理,既有全局的拦截器,也有自己的
const hyRequest2 = new HYRequest({
  baseURL: "http://codercba.com:1888/airbnb/api",
  timeout: 8000,
  interceptors: {
    requestSuccessFn(config) {
      console.log("爱彼迎请求成功的拦截")
      return config
    },
    requestFailureFn(err) {
      console.log("爱彼迎请求失败的拦截")
      return err
    },
    responseSuccessFn(res) {
      console.log("爱彼迎响应成功的拦截")
      return res
    },
    responseFailureFn(err) {
      console.log("爱彼迎响应失败的拦截")
      return err
    },
  },
})

export { hyRequest1, hyRequest2 }

