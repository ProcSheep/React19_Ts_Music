import AreaHeaderV1 from "@/components/area-header-v1"
import NewAlbumItem from "@/components/new-album-item"
import { AppShallowEqual, useAppSelector } from "@/store"
import { Carousel } from "antd"
import type { CarouselRef } from "antd/es/carousel"
import type { ReactNode } from "react"
import { memo, useRef } from "react"
import { AlbumWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const NewAlbum: React.FC<IProps> = () => {
  /** 定义内部状态 */
  const bannerRef = useRef<CarouselRef>(null)
  const { newAlbums } = useAppSelector(
    (state) => ({
      newAlbums: state.recommend.newAlbums,
    }),
    AppShallowEqual
  )

  /** 事件处理函数 */
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  function handleNextClick() {
    bannerRef.current?.next()
  }

  return (
    <AlbumWrapper>
      <AreaHeaderV1 title="新碟上架" moreLink="/discover/album" />
      <div className="content">
        <button
          className="arrow arrow-left sprite_02"
          onClick={handlePrevClick}
        ></button>
        <div className="banner">
          <Carousel ref={bannerRef} dots={false} speed={1500}>
            {/* 双重遍历,先遍历页,再遍历页内数据 */}
            {[0, 1].map((item, index) => {
              return (
                // 一页放五个数据,slice截取数据[x,y)
                <div key={index}>
                  {/* Carousel组件内会自动把最外层div附加内联样式,会覆盖我们想要的样式
                      所以我们外层嵌套一个div,内部是自己样式的div(album-list)
                  */}
                  <div className="album-list">
                    {newAlbums.slice(item * 5, (item + 1) * 5).map((album) => {
                      return <NewAlbumItem itemData={album} key={album.name} />
                    })}
                  </div>
                </div>
              )
            })}
          </Carousel>
        </div>
        <button
          className="arrow arrow-right sprite_02"
          onClick={handleNextClick}
        ></button>
      </div>
    </AlbumWrapper>
  )
}

export default memo(NewAlbum)
