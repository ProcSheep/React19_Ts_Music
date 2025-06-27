import styled from "styled-components"

export const MenuItemWrapper = styled.div`
  width: 140px;
  margin: 15px 0;

  .top {
    position: relative;

    & > img {
      width: 140px;
      height: 140px;
    }

    .cover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: 0 0;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-position: 0 -537px;
        color: #ccc;
        height: 27px;

        .headset {
          margin-right: 5px;
          display: inline-block;
          width: 14px;
          height: 11px;
          background-position: 0 -24px;
        }

        .play {
          display: inline-block;
          width: 16px;
          height: 17px;
          background-position: 0 0;
        }
      }
    }
  }

  .bottom {
    font-size: 14px;
    color: #000;
    margin-top: 5px;
    /* 基础布局属性 */
    overflow: hidden;
    text-overflow: ellipsis;

    /* 关键的多行省略属性 */
    display: -webkit-box; /* 必须结合的属性，将对象作为弹性伸缩盒子模型显示 */
    -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
    -webkit-line-clamp: 2; /* 显示的最大行数 */
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`
