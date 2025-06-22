import type { ReactNode } from "react"
import { memo, Suspense } from "react"
import { Outlet } from "react-router-dom"
import NavBar from "./c-cpns/nav-bar"

interface IProps {
  children?: ReactNode
}

const Discover: React.FC<IProps> = () => {
  return (
    <div className="Discover">
      <div>
        {/* 引入二级路由的组件 */}
        <NavBar />
        {/* 二级路由内容的占位符Outlet (类似vue中的router-view) */}
        <Suspense fallback="loading...">
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default memo(Discover)
