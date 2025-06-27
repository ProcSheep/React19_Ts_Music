import AreaHeaderV1 from "@/components/area-header-v1"
import { AppShallowEqual, useAppSelector } from "@/store"
import type { ReactNode } from "react"
import { memo } from "react"
import TopRankingItem from "../top-ranking-item"
import { TopRankingWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const TopRanking: React.FC<IProps> = () => {
  const { rankings } = useAppSelector(
    (state) => ({
      rankings: state.recommend.rankings,
    }),
    AppShallowEqual
  )

  return (
    <TopRankingWrapper>
      <AreaHeaderV1 title="榜单" moreLink="/discover/ranking" />
      <div className="content">
        {rankings.map((item) => {
          return <TopRankingItem itemData={item} key={item.id} />
        })}
      </div>
    </TopRankingWrapper>
  )
}

export default memo(TopRanking)
