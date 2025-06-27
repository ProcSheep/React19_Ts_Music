import { formatCount, getImageSize } from "@/utils/format"
import type { ReactNode } from "react"
import { memo } from "react"
import { MenuItemWrapper } from "./style"

interface IProps {
  children?: ReactNode
  itemData: any
}

const SongMenuItem: React.FC<IProps> = (props) => {
  const { itemData } = props
  return (
    <MenuItemWrapper className="SongMenuItem">
      <div className="top">
        {/* 小细节: MenuItem动态请求图片的大小,小图片减少请求和渲染压力 */}
        <img src={getImageSize(itemData.picUrl, 140)} alt="" />
        {/* 许多精灵图,包括2个蒙版cover,2个图标icon */}
        <div className="cover sprite_cover">
          <div className="info sprite_cover">
            <span>
              <i className="sprite_icon headset"></i>
              {/* 播放量格式化: 大于10万的以万为单位 */}
              <span className="count">{formatCount(itemData.playCount)}</span>
            </span>
            <i className="sprite_icon play"></i>
          </div>
        </div>
      </div>
      <div className="bottom">{itemData.name}</div>
    </MenuItemWrapper>
  )
}

export default memo(SongMenuItem)
