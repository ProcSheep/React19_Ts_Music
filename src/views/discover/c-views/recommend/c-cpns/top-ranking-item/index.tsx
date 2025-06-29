import { useAppDispatch } from "@/store"
import { getImageSize } from "@/utils/format"
import { fetchCurrentSongAction } from "@/views/player/store/player"
import type { ReactNode } from "react"
import { memo } from "react"
import { RankingItemWrapper } from "./style"

interface IProps {
  children?: ReactNode
  itemData: any
}

const TopRankingItem: React.FC<IProps> = (props) => {
  // 给默认值是因为服务器请求数据不稳定,可能请求不到数据
  const { itemData = {} } = props
  const { tracks = [] } = itemData

  const dispatch = useAppDispatch()
  // 请求歌曲数据
  function handlePlayClick(id: number) {
    dispatch(fetchCurrentSongAction(id))
  }

  return (
    <RankingItemWrapper>
      {/* 榜单头部 */}
      <div className="header">
        <div className="image">
          <img
            className="img"
            src={getImageSize(itemData.coverImgUrl, 80)}
            alt=""
          />
          <a href="" className="sprite_cover"></a>
        </div>
        <div className="info">
          <div className="name">{itemData.name}</div>
          <div>
            <button className="btn play sprite_02"></button>
            <button className="btn favor sprite_02"></button>
          </div>
        </div>
      </div>
      {/* 榜单列表 */}
      <div className="list">
        {tracks.slice(0, 10).map((item: any, index: number) => {
          return (
            <div className="item" key={index}>
              <div className="index">{index + 1}</div>
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="operate">
                  <button
                    className="btn sprite_02 play"
                    onClick={() => handlePlayClick(item.id)}
                  ></button>
                  <button className="btn sprite_icon2 add"></button>
                  <button className="btn sprite_02 favor"></button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {/* 榜单底部 */}
      <div className="footer">
        <a href="/discover/ranking">查看全部 &gt;</a>
      </div>
    </RankingItemWrapper>
  )
}

export default memo(TopRankingItem)
