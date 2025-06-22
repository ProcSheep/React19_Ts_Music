import { Suspense } from "react"
import { useRoutes } from "react-router-dom"
import AppFooter from "./components/app-footer"
import AppHeader from "./components/app-header"
import routes from "./router"

function App() {
  return (
    <div className="App">
      {/* 顶部: 一级路由导航 */}
      <AppHeader />
      {/* 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
      <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
      {/* 底部信息栏 */}
      <AppFooter />
    </div>
  )
}

export default App
