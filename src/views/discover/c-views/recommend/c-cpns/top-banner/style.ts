import bannerSprite from "@/assets/img/banner_sprite.png"
import download from "@/assets/img/download.png"
import styled from "styled-components"
/* 整体 */
export const BannerWrapper = styled.div`
  /* 背景的毛玻璃,直接通过style属性传入了,不必在这里写,直接对背景进行切换
    解释一下css属性: url(XXX) center center / 6000px 是一个简写,代表如下
    background-position: center center; 图片上下左右都居中
    background-size: 6000px; 图片横向拉长6000px
  */

  /* 轮播整体高度270px,分为左右两个部分,flex左右布局 */
  .banner {
    height: 270px;
    display: flex;
    position: relative;
  }
`

/* 左侧轮播 */
export const BannerLeft = styled.div`
  position: relative;
  width: 730px;
  height: 270px;

  .banner-item {
    .image {
      width: 100%;
    }
  }

  .dots {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    /* dots设置间距 */
    > li {
      margin: 0 2px;
      /* dots小点是精灵图,有白色点和红色点两种,依靠定位不同来显示不同的点色 */
      .item {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url(${bannerSprite}) 3px -343px;
        cursor: pointer;

        &:hover,
        &.active {
          background-position: -16px -343px;
        }
      }
    }
  }
`

/* 右侧图片 */
/* attrs为组件设置静态或动态的属性,可以点击跳转新页面 */
export const BannerRight = styled.a.attrs({
  href: "https://music.163.com/#/download",
  target: "_blank",
})`
  display: block;
  width: 254px;
  height: 270px;
  background-image: url(${download}); /* 背景是图片 */
`

/* 左右按钮 */
export const BannerControl = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  /* 竖直方向居中 */
  top: 50%;
  transform: translateY(-50%);

  .btn {
    position: absolute;
    width: 37px;
    height: 63px;
    background-image: url(${bannerSprite}); /* 按钮所在的精灵图 */
    background-color: transparent;
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .left {
    left: -68px;
    /* 精灵图: 紧贴左侧,向上移动360px */
    background-position: 0 -360px;
  }

  .right {
    right: -68px;
    background-position: 0 -508px;
  }
`
