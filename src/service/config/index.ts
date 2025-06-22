// 区分开发和生产环境示意: vite的全局变量import.meta.PROD(检测是否为生产环境production)
let BASE_URL = ""
if (import.meta.env.PROD) {
  BASE_URL = "http://codercba.com:9002"
} else {
  // 开发环境 (这里端口有限,没有区分)
  BASE_URL = "http://codercba.com:9002"
}

export { BASE_URL }
export const TIME_OUT = 5000
