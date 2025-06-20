// import { StrictMode } from "react"
import App from "@/App"
import "@/assets/css/index.less" // 引入所有的less(包括normalize.css)
import store from "@/store" // store数据
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux" // 给store公开数据的组件
import { HashRouter } from "react-router-dom" // 路由

createRoot(document.getElementById("root")!).render(
  // <StrictMode> 取消严格模式,防止多余的网络请求
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
  // </StrictMode>,
)
