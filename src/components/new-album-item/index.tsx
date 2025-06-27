import { getImageSize } from "@/utils/format"
import type { ReactNode } from "react"
import { memo } from "react"
import { AlbumWrapper } from "./style"

interface IProps {
  children?: ReactNode
  itemData: any
}

const NewAlbumItem: React.FC<IProps> = (props) => {
  const { itemData } = props

  return (
    <AlbumWrapper>
      <div className="top">
        <img src={getImageSize(itemData.picUrl, 100)} className="img" />
        <i className="cover sprite_cover"></i>
      </div>
      <div className="bottom">
        <div className="name">{itemData.name}</div>
        <div className="artist">{itemData.artist.name}</div>
      </div>
    </AlbumWrapper>
  )
}

export default memo(NewAlbumItem)
