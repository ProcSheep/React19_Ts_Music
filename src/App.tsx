import { Suspense } from "react"
import { shallowEqual } from "react-redux"
import { Link, useRoutes } from "react-router-dom"
import routes from "./router"
import { useAppSelector } from "./store"

function App() {
  const { count, name } = useAppSelector(
    (state) => ({
      count: state.counter.count,
      name: state.counter.name,
    }),
    shallowEqual
  )

  return (
    <div className="App">
      <div>
        <Link to="/discover">发现音乐</Link>
        <Link to="/mine">我的音乐</Link>
      </div>
      <h2>
        当前计数: {count} 名字: {name}
      </h2>
      {/* 懒加载过程中,临时加载显示,可以是字符串,也可以是组件(比如加载页面) */}
      <Suspense fallback="loading....">{useRoutes(routes)}</Suspense>
    </div>
  )
}

export default App
