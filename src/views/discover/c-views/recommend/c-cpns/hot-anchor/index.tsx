import { hotRadios } from "@/assets/data/local-data"
import AreaHeaderV2 from "@/components/area-header-v2"
import { getImageSize } from "@/utils/format"
import type { ReactNode } from "react"
import { memo } from "react"
import { HotAnchorWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const HotAnchor: React.FC<IProps> = () => {
  return (
    <HotAnchorWrapper>
      {/* 顶部标题 */}
      <AreaHeaderV2 title="热门主播" />
      {/* 热门主播列表 */}
      <div className="anchors">
        {hotRadios.map((item) => {
          return (
            <div className="item" key={item.name}>
              <img src={getImageSize(item.picUrl, 62)} alt="" />
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="desc">{item.position}</div>
              </div>
            </div>
          )
        })}
      </div>
    </HotAnchorWrapper>
  )
}

export default memo(HotAnchor)
