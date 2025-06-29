import AreaHeaderV2 from "@/components/area-header-v2"
import { AppShallowEqual, useAppSelector } from "@/store"
import { getImageSize } from "@/utils/format"
import type { ReactNode } from "react"
import { memo } from "react"
import { SettleSingerWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const SettleSinger: React.FC<IProps> = () => {
  const { settleSingers } = useAppSelector(
    (state) => ({
      settleSingers: state.recommend.settleSingers,
    }),
    AppShallowEqual
  )

  return (
    <SettleSingerWrapper>
      {/* 顶部标题(通用组件) */}
      <AreaHeaderV2
        title="入驻歌手"
        moreText="查看全部 &gt;"
        moreLink="#/discover/artist"
      />
      {/* 入驻歌手的列表榜单 */}
      <div className="artists">
        {settleSingers.map((item) => {
          return (
            <a href="#/discover/artist" className="item" key={item.id}>
              <img className="img" src={getImageSize(item.picUrl, 62)} alt="" />
              <div className="info">
                <div className="name">{item.name}</div>
                {/* 对数组信息的展示: join->以空格" "为间隔符 */}
                <div className="alias">{item.alias.join(" ")}</div>
              </div>
            </a>
          )
        })}
        {/* 底部 */}
        <div className="apply-for">
          <a href="#/">申请成为网易音乐人</a>
        </div>
      </div>
    </SettleSingerWrapper>
  )
}

export default memo(SettleSinger)
