import { useAppDispatch } from "@/store"
import type { ReactNode } from "react"
import { memo, useEffect } from "react"
import HotRecommend from "./c-cpns/hot-recommend"
import NewAlbum from "./c-cpns/new-album"
import TopBanner from "./c-cpns/top-banner"
import TopRanking from "./c-cpns/top-ranking"
import {
  fetchRankingDataAction,
  fetchRecommendDataAction,
} from "./store/recommend"
import { RecommendWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const Recommend: React.FC<IProps> = () => {
  // 1.派发store的数据,网络请求
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchRecommendDataAction())
    dispatch(fetchRankingDataAction())
  }, [dispatch])
  return (
    <RecommendWrapper>
      <TopBanner />
      <div className="content wrap-v2">
        <div className="left">
          <HotRecommend />
          <NewAlbum />
          <TopRanking />
        </div>
        <div className="right">right</div>
      </div>
    </RecommendWrapper>
  )
}

export default memo(Recommend)
