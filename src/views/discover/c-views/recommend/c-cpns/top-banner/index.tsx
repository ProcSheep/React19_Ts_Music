import { AppShallowEqual, useAppSelector } from "@/store"
import { Carousel } from "antd"
import type { CarouselRef } from "antd/es/carousel"
import classNames from "classnames"
import type { ReactNode } from "react"
import { memo, useRef, useState } from "react"
import { BannerControl, BannerLeft, BannerRight, BannerWrapper } from "./style"

interface IProps {
  children?: ReactNode
}

const TopBanner: React.FC<IProps> = () => {
  /** 获取内部数据 */
  const [currentIndex, setCurrentIndex] = useState(0)
  const { banners } = useAppSelector(
    (state) => ({
      banners: state.recommend.banners,
    }),
    AppShallowEqual
  )
  // ElementRef已弃用,antd直接提供了组件的ref类型可以直接引用
  const bannerRef = useRef<CarouselRef>(null)

  /** 事件处理函数 */
  function handlePrevClick() {
    bannerRef.current?.prev()
  }

  function handleNextClick() {
    bannerRef.current?.next()
  }

  function afterChangeHandle(current: number) {
    setCurrentIndex(current)
  }

  function handleGoTo(bannerIndex: number) {
    bannerRef.current?.goTo(bannerIndex)
  }

  // 获取每次切换的图片url,第一次banners为空(?.)
  let bgImgUrl = banners[currentIndex]?.imageUrl
  if (bgImgUrl) {
    bgImgUrl = bgImgUrl + "?imageView&blur=40x20" // 请求服务器对图片添加毛玻璃效果
  }

  return (
    <BannerWrapper
      style={{ background: `url('${bgImgUrl}') center center / 6000px` }}
    >
      <div className="banner wrap-v2">
        <BannerLeft>
          <Carousel
            autoplay
            dots={false}
            ref={bannerRef}
            afterChange={afterChangeHandle}
          >
            {banners.map((item) => {
              return (
                <div className="banner-item" key={item.imageUrl}>
                  <img
                    className="image"
                    src={item.imageUrl}
                    alt={item.typeTitle}
                  />
                </div>
              )
            })}
          </Carousel>
          <ul className="dots">
            {banners.map((item, index) => {
              return (
                <li key={item.imageUrl}>
                  <span
                    className={classNames("item", {
                      active: index === currentIndex,
                    })}
                    onClick={() => handleGoTo(index)}
                  ></span>
                </li>
              )
            })}
          </ul>
        </BannerLeft>
        <BannerRight></BannerRight>
        <BannerControl>
          <button className="btn left" onClick={handlePrevClick}></button>
          <button className="btn right" onClick={handleNextClick}></button>
        </BannerControl>
      </div>
    </BannerWrapper>
  )
}

export default memo(TopBanner)
