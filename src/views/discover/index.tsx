import type { ReactNode } from "react"
import { memo, Suspense } from "react"
import { Link, Outlet } from "react-router-dom"

interface IProps {
  children?: ReactNode
}

const Discover: React.FC<IProps> = () => {
  return (
    <div className="Discover">
      <div>
        <div>Discover</div>
        <div>二级路由导航</div>
        <div>
          <Link to="/discover/recommend">推荐</Link>
          <Link to="/discover/ranking">排行榜</Link>
          <Link to="/discover/songs">歌单</Link>
          <Link to="/discover/djradio">主播电台</Link>
          <Link to="/discover/artist">歌手</Link>
          <Link to="/discover/album">新碟上架</Link>
        </div>
        {/* 二级路由的占位符Outlet (类似vue中的router-view) */}
        <Suspense fallback="loading...">
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default memo(Discover)
