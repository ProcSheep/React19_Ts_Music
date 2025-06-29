import { Suspense, useEffect } from "react"
import { useRoutes } from "react-router-dom"
import AppFooter from "./components/app-footer"
import AppHeader from "./components/app-header"
import routes from "./router"
import { useAppDispatch } from "./store"
import AppPlayerBar from "./views/player/app-player-bar"
import { fetchCurrentSongAction } from "./views/player/store/player"

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCurrentSongAction(2711834126))
  }, [])

  return (
    <div className="App">
      {/* 顶部: 一级路由导航 */}
      <AppHeader />
      {/* 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
      <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
      {/* 播放器工具栏 */}
      <AppPlayerBar />
      {/* 底部信息栏 */}
      <AppFooter />
    </div>
  )
}

export default App
