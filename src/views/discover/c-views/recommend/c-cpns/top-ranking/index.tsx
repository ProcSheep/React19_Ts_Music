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
  // 服务器问题,请求数据可能会丢包,少几个数据,所以如果没有请求到数据,就默认空数组
  const { rankings = [] } = useAppSelector(
    (state) => ({
      rankings: state.recommend.rankings,
    }),
    AppShallowEqual
  )

  // console.log("rankings", rankings)

  return (
    <TopRankingWrapper>
      <AreaHeaderV1 title="榜单" moreLink="/discover/ranking" />
      <div className="content">
        {rankings.map((item) => {
          if (!item) return // 网络不好,可能数据有丢包
          return <TopRankingItem itemData={item} key={item.id} />
        })}
      </div>
    </TopRankingWrapper>
  )
}

export default memo(TopRanking)
