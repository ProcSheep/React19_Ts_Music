import AreaHeaderV1 from "@/components/area-header-v1"
import SongMenuItem from "@/components/song-menu-item"
import { AppShallowEqual, useAppSelector } from "@/store"
import type { ReactNode } from "react"
import { memo } from "react"
import { HotRecommendWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const HotRecommend: React.FC<IProps> = () => {
  const { hotRecommends } = useAppSelector(
    (state) => ({
      hotRecommends: state.recommend.hotRecommends,
    }),
    AppShallowEqual
  )
  const newHotRecommends = hotRecommends?.slice(0, 8)

  return (
    <HotRecommendWrapper>
      <AreaHeaderV1
        title="热门推荐"
        keywords={["华语", "摇滚", "民谣", "电子", "流行"]}
        moreLink="/discover/songs"
      />
      <div className="recommend-list">
        {newHotRecommends.map((item) => {
          return <SongMenuItem key={item.id} itemData={item} />
        })}
      </div>
    </HotRecommendWrapper>
  )
}

export default memo(HotRecommend)
