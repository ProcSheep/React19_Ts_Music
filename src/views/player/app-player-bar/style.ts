import PipIcon from "@/assets/img/pip_icon.png"
import ProgressBar from "@/assets/img/progress_bar.png"
import SpriteIcon from "@/assets/img/sprite_icon.png"
import styled from "styled-components"

export const PlayerBarWrapper = styled.div`
  /* 播放器固定在页面的底部 */
  position: fixed;
  z-index: 99;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52px;
  background-position: 0 0;
  background-repeat: repeat;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    height: 47px;
  }
`

// ts的css传递js变量需要规定类型
interface IBarControl {
  $isPlaying: boolean
}
// 下面本质是在进行函数调用,所以可以传递泛型来确定接受的参数的类型
export const BarControl = styled.div<IBarControl>`
  display: flex;
  align-items: center;
  .btn {
    cursor: pointer;
  }

  .prev,
  .next {
    width: 28px;
    height: 28px;
    cursor: pointer;
  }

  .prev {
    background-position: 0 -130px;
  }

  .play {
    width: 36px;
    height: 36px;
    margin: 0 8px;
    /* 按钮定位改变显示"播放"与"暂停"的图标 */
    background-position: 0
      ${(props) => (props.$isPlaying ? "-165px" : "-204px")};
  }

  .next {
    background-position: -80px -130px;
  }
`
export const BarPlayerInfo = styled.div`
  display: flex;
  width: 642px;
  align-items: center;

  .image {
    width: 34px;
    height: 34px;
    border-radius: 5px;
  }

  .info {
    flex: 1;
    color: #a1a1a1;
    margin-left: 10px;

    .song {
      color: #e1e1e1;
      position: relative;
      top: 8px;
      left: 8px;

      .singer-name {
        color: #a1a1a1;
        margin-left: 10px;
      }
    }

    .progress {
      display: flex;
      align-items: center;

      /* 对进度条组件内部的样式进行修改,利用精灵图覆盖初始样式 */
      .ant-slider {
        position: relative;
        top: -3px;
        width: 493px;
        margin-right: 10px;

        /* 网易进度条的精灵图,有2中颜色,红代表已经经过,黑代表还未经过 */
        .ant-slider-rail {
          height: 9px;
          background: url(${ProgressBar}) right 0;
        }

        .ant-slider-track {
          height: 9px;
          background: url(${ProgressBar}) left -66px;
        }

        /* 网易精灵图自己的进度条控制器 */
        .ant-slider-handle {
          width: 22px;
          height: 24px;
          border: none;
          margin-top: -7px;
          background: url(${SpriteIcon}) 0 -250px;
        }

        /* 删除原有的进度条控制器,它是伪元素 */
        .ant-slider-handle::after {
          content: "" !important; /* 必须为空，否则伪元素仍会显示 */
          display: none !important; /* 彻底隐藏伪元素 */
        }
      }

      .time {
        .current {
          color: #e1e1e1;
        }
        .divider {
          margin: 0 3px;
        }
      }
    }
  }
`
interface IBarOperator {
  $playMode: number
}
export const BarOperator = styled.div<IBarOperator>`
  display: flex;
  align-items: center;
  position: relative;
  top: 3px;

  .btn {
    width: 25px;
    height: 25px;
  }

  .left {
    display: flex;
    align-items: center;
  }

  .pip {
    background: url(${PipIcon});
  }

  .favor {
    background-position: -88px -163px;
  }

  .share {
    background-position: -114px -163px;
  }

  .right {
    display: flex;
    align-items: center;
    width: 126px;
    padding-left: 13px;
    background-position: -147px -248px;

    .volume {
      background-position: -2px -248px;
    }

    .loop {
      background-position: ${(props) => {
        switch (props.$playMode) {
          case 1:
            return "-3px -344px"
          case 2:
            return "-66px -248px"
          case 3:
            return "-66px -344px"
        }
      }};
    }

    .playlist {
      padding-left: 18px;
      text-align: center;
      color: #ccc;
      width: 59px;
      background-position: -42px -68px;
    }
  }
`
